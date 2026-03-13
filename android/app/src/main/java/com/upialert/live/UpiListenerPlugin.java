package com.upialert.live;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.provider.Telephony;
import android.telephony.SmsMessage;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(
    name = "UpiListener",
    permissions = {
        @Permission(
            alias = "sms",
            strings = {
                Manifest.permission.RECEIVE_SMS,
                Manifest.permission.READ_SMS
            }
        )
    }
)
public class UpiListenerPlugin extends Plugin {

    // Singleton so UpiNotificationListener can call back into this plugin
    private static UpiListenerPlugin instance;
    public static UpiListenerPlugin getInstance() { return instance; }

    @Override
    public void load() {
        super.load();
        instance = this;
    }

    /** Called by UpiNotificationListener when a notification arrives from a UPI app */
    public void onNotificationText(String text, String packageName) {
        JSObject parsed = tryParseUpi(text);
        if (parsed != null) {
            // Tag the source app
            if (packageName != null) {
                if (packageName.contains("phonepe")) parsed.put("source", "phonePe");
                else if (packageName.contains("nbu.paisa")) parsed.put("source", "gPay");
                else if (packageName.contains("paytm")) parsed.put("source", "paytm");
            }
            notifyListeners("upiPaymentDetected", parsed);
        }
    }

    private BroadcastReceiver smsReceiver;
    private boolean listening = false;

    // ───── UPI amount regex patterns ─────
    private static final Pattern[] UPI_PATTERNS = {
        // PhonePe / Paytm: received Rs.100 from Name
        Pattern.compile("(?:received|credited)[\\s\\S]*?(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?).*?(?:from|by)\\s+([\\w\\s.]{2,40})", Pattern.CASE_INSENSITIVE),
        // GPay: Name paid you Rs.100
        Pattern.compile("([\\w\\s.]{2,40})\\s+paid\\s+you\\s+(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?)", Pattern.CASE_INSENSITIVE),
        // Bank SMS: credited with INR 100
        Pattern.compile("(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?)\\s+(?:received|credited)", Pattern.CASE_INSENSITIVE),
    };

    // ───── Start listening ─────
    @PluginMethod
    public void startListening(PluginCall call) {
        if (listening) { call.resolve(); return; }

        smsReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (!Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) return;
                SmsMessage[] msgs = Telephony.Sms.Intents.getMessagesFromIntent(intent);
                if (msgs == null) return;
                StringBuilder full = new StringBuilder();
                for (SmsMessage m : msgs) full.append(m.getMessageBody());
                String text = full.toString();
                JSObject parsed = tryParseUpi(text);
                if (parsed != null) {
                    notifyListeners("upiPaymentDetected", parsed);
                }
            }
        };

        IntentFilter filter = new IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION);
        filter.setPriority(IntentFilter.SYSTEM_HIGH_PRIORITY);
        getContext().registerReceiver(smsReceiver, filter);
        listening = true;
        call.resolve();
    }

    @PluginMethod
    public void stopListening(PluginCall call) {
        if (smsReceiver != null) {
            try { getContext().unregisterReceiver(smsReceiver); } catch (Exception ignored) {}
            smsReceiver = null;
        }
        listening = false;
        call.resolve();
    }

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        boolean sms = ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.RECEIVE_SMS)
                == PackageManager.PERMISSION_GRANTED;
        // Notification listener check via NotificationListenerService
        String enabledListeners = android.provider.Settings.Secure.getString(
                getContext().getContentResolver(), "enabled_notification_listeners");
        boolean notif = enabledListeners != null && enabledListeners.contains(getContext().getPackageName());
        JSObject result = new JSObject();
        result.put("sms", sms);
        result.put("notifications", notif);
        call.resolve(result);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        requestPermissionForAlias("sms", call, "smsPermissionCallback");
    }

    @PluginMethod
    public void getDeviceToken(PluginCall call) {
        // Device token stored in SharedPreferences — generated on first run
        android.content.SharedPreferences prefs = getContext().getSharedPreferences("upialert", Context.MODE_PRIVATE);
        String token = prefs.getString("device_token", null);
        if (token == null) {
            token = java.util.UUID.randomUUID().toString();
            prefs.edit().putString("device_token", token).apply();
        }
        JSObject result = new JSObject();
        result.put("token", token);
        call.resolve(result);
    }

    // ───── UPI parsing helper ─────
    private JSObject tryParseUpi(String text) {
        // Simple amount extractor
        Pattern amtPattern = Pattern.compile("(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?)", Pattern.CASE_INSENSITIVE);
        Matcher amtMatcher = amtPattern.matcher(text);
        if (!amtMatcher.find()) return null;

        String amountStr = amtMatcher.group(1).replace(",", "");
        double amount;
        try { amount = Double.parseDouble(amountStr); } catch (NumberFormatException e) { return null; }
        if (amount <= 0) return null;

        // Donor name
        String donorName = "Anonymous";
        Pattern namePattern = Pattern.compile("(?:from|by)\\s+([\\w\\s.]{2,40})(?:\\s+via|\\s+on|\\n|$)", Pattern.CASE_INSENSITIVE);
        Matcher nameMatcher = namePattern.matcher(text);
        if (nameMatcher.find()) donorName = nameMatcher.group(1).trim();

        // UPI ref / UTR
        String upiRef = "";
        Pattern refPattern = Pattern.compile("(?:UTR|Ref(?:erence)?(?:\\s+No\\.?)?|Txn\\s+ID)[:\\s]*([A-Z0-9]{10,22})", Pattern.CASE_INSENSITIVE);
        Matcher refMatcher = refPattern.matcher(text);
        if (refMatcher.find()) upiRef = refMatcher.group(1);

        // Source app detection
        String source = "bank";
        if (text.toLowerCase().contains("phonepe")) source = "phonePe";
        else if (text.toLowerCase().contains("google pay") || text.toLowerCase().contains("gpay")) source = "gPay";
        else if (text.toLowerCase().contains("paytm")) source = "paytm";
        else if (text.toLowerCase().contains("bhim")) source = "bhim";

        JSObject obj = new JSObject();
        obj.put("amount", amount);
        obj.put("donor_name", donorName);
        obj.put("upi_ref", upiRef);
        obj.put("source", source);
        obj.put("raw_text", text.length() > 200 ? text.substring(0, 200) : text);
        return obj;
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
        call.resolve();
    }

    @PermissionCallback
    private void smsPermissionCallback(PluginCall call) {
        checkPermissions(call);
    }

    @Override
    protected void handleOnDestroy() {
        if (smsReceiver != null) {
            try { getContext().unregisterReceiver(smsReceiver); } catch (Exception ignored) {}
        }
    }
}
