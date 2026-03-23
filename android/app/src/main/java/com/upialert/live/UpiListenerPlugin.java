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
        ),
        @Permission(
            alias = "push",
            strings = {
                Manifest.permission.POST_NOTIFICATIONS
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
        android.util.Log.d("UpiAlert", "onNotificationText pkg=" + packageName + " text=" + text);
        JSObject parsed = tryParseUpi(text);
        if (parsed != null) {
            // Override source with the detected app package
            if (packageName != null) {
                if (packageName.contains("phonepe")) parsed.put("source", "phonePe");
                else if (packageName.contains("nbu.paisa")) parsed.put("source", "gPay");
                else if (packageName.contains("paytm")) parsed.put("source", "paytm");
                else if (packageName.contains("fampay")) parsed.put("source", "famPay");
            }
            notifyListeners("upiPaymentDetected", parsed);
        }
    }

    private BroadcastReceiver smsReceiver;
    private boolean listening = false;

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
                for (SmsMessage m : msgs) full.append(m.getMessageBody()).append(" ");
                String text = full.toString().trim();
                android.util.Log.d("UpiAlert", "SMS received: " + text);
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
        android.util.Log.d("UpiAlert", "startListening: SMS receiver registered");
        call.resolve();
    }

    @PluginMethod
    public void stopListening(PluginCall call) {
        if (smsReceiver != null) {
            try { getContext().unregisterReceiver(smsReceiver); } catch (Exception ignored) {}
            smsReceiver = null;
        }
        listening = false;
        if (call != null) call.resolve();
    }

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        boolean sms = ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.RECEIVE_SMS)
                == PackageManager.PERMISSION_GRANTED;

        boolean push = true;
        if (android.os.Build.VERSION.SDK_INT >= 33) {
            push = ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS)
                    == PackageManager.PERMISSION_GRANTED;
        }

        // Notification listener check via NotificationListenerService
        String enabledListeners = android.provider.Settings.Secure.getString(
                getContext().getContentResolver(), "enabled_notification_listeners");
        boolean notif = enabledListeners != null && enabledListeners.contains(getContext().getPackageName());

        JSObject result = new JSObject();
        result.put("sms", sms);
        result.put("push", push);
        result.put("notifications", notif);
        call.resolve(result);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        if (android.os.Build.VERSION.SDK_INT >= 33) {
            requestPermissionForAliases(new String[]{"sms", "push"}, call, "permissionsCallback");
        } else {
            requestPermissionForAliases(new String[]{"sms"}, call, "permissionsCallback");
        }
    }

    @PermissionCallback
    private void permissionsCallback(PluginCall call) {
        checkPermissions(call);
    }

    @PluginMethod
    public void getDeviceToken(PluginCall call) {
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
        if (text == null || text.trim().isEmpty()) return null;

        // ── Step 1: Check if this looks like a payment message at all ──
        String lower = text.toLowerCase();
        boolean looksLikePayment =
            lower.contains("received") || lower.contains("credited") ||
            lower.contains("paid you") || lower.contains("deposited") ||
            lower.contains("cr:") || lower.contains("cr :");
        if (!looksLikePayment) {
            android.util.Log.d("UpiAlert", "Skipping (no payment keywords): " + text.substring(0, Math.min(80, text.length())));
            return null;
        }

        // ── Step 2: Extract amount ──
        // Try currency prefix first: Rs., INR, ₹
        double amount = 0;
        Pattern amtWithPrefix = Pattern.compile("(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?)", Pattern.CASE_INSENSITIVE);
        Matcher amtMatcher = amtWithPrefix.matcher(text);

        // Then try bank style "Amount:100" or "Cr:100"
        Pattern amtBankStyle = Pattern.compile("(?:Amount[:\\s]+|Cr[:\\s]+|amount[:\\s]+)([\\d,]+(?:\\.\\d{1,2})?)", Pattern.CASE_INSENSITIVE);

        if (amtMatcher.find()) {
            try { amount = Double.parseDouble(amtMatcher.group(1).replace(",", "")); } catch (NumberFormatException ignored) {}
        } else {
            Matcher bankMatcher = amtBankStyle.matcher(text);
            if (bankMatcher.find()) {
                try { amount = Double.parseDouble(bankMatcher.group(1).replace(",", "")); } catch (NumberFormatException ignored) {}
            }
        }

        if (amount <= 0) {
            android.util.Log.d("UpiAlert", "No valid amount found in: " + text.substring(0, Math.min(100, text.length())));
            return null;
        }

        // ── Step 3: Extract donor name ──
        String donorName = "Anonymous";
        // Try "from NAME via/on" or "by NAME"
        Pattern namePattern = Pattern.compile("(?:from|by)\\s+([\\w\\s.]{2,50})(?:\\s+via|\\s+on|\\s+through|\\.|,|\\n|$)", Pattern.CASE_INSENSITIVE);
        Matcher nameMatcher = namePattern.matcher(text);
        if (nameMatcher.find()) {
            donorName = nameMatcher.group(1).trim();
        } else {
            // Try "NAME paid you"
            Pattern paidPattern = Pattern.compile("^([\\w\\s.]{2,40})\\s+paid\\s+you", Pattern.CASE_INSENSITIVE);
            Matcher paidMatcher = paidPattern.matcher(text.trim());
            if (paidMatcher.find()) {
                donorName = paidMatcher.group(1).trim();
            }
        }

        // ── Step 4: Extract UTR / Ref ──
        String upiRef = "";
        Pattern refPattern = Pattern.compile(
            "(?:UTR|UPI\\s*Ref\\s*(?:No\\.?)?|Ref(?:erence)?(?:\\s+No\\.?)?|Txn\\s*(?:ID|No\\.?)?)[:\\s]*([A-Z0-9]{8,22})",
            Pattern.CASE_INSENSITIVE
        );
        Matcher refMatcher = refPattern.matcher(text);
        if (refMatcher.find()) upiRef = refMatcher.group(1);

        // ── Step 5: Detect source app ──
        String source = "bank";
        if (lower.contains("phonepe")) source = "phonePe";
        else if (lower.contains("google pay") || lower.contains("gpay")) source = "gPay";
        else if (lower.contains("paytm")) source = "paytm";
        else if (lower.contains("bhim")) source = "bhim";
        else if (lower.contains("fampay") || lower.contains("famapp")) source = "famPay";
        else if (lower.contains("amazon pay") || lower.contains("amazonpay")) source = "amazonPay";

        JSObject obj = new JSObject();
        obj.put("amount", amount);
        obj.put("donor_name", donorName.length() > 60 ? donorName.substring(0, 60) : donorName);
        obj.put("upi_ref", upiRef);
        obj.put("source", source);
        obj.put("raw_text", text.length() > 300 ? text.substring(0, 300) : text);
        android.util.Log.d("UpiAlert", "✅ Parsed UPI payment: amount=" + amount + " from=" + donorName + " src=" + source);
        return obj;
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        if (smsReceiver != null) {
            try { getContext().unregisterReceiver(smsReceiver); } catch (Exception ignored) {}
        }
    }
}
