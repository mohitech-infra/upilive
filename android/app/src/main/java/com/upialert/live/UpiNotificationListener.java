package com.upialert.live;

import android.app.Notification;
import android.content.Context;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

/**
 * Runs as a background Android service.
 * Registered in AndroidManifest.xml with BIND_NOTIFICATION_LISTENER_SERVICE permission.
 * User must grant notification access via Settings > Apps > Special app access > Notification access.
 */
public class UpiNotificationListener extends NotificationListenerService {

    // Known UPI & bank app package names to listen from
    private static final String[] UPI_PACKAGES = {
        "com.phonepe.app",
        "com.phonepe.app.preprod",
        "com.google.android.apps.nbu.paisa.user",   // GPay
        "net.one97.paytm",
        "in.org.npci.upiapp",                        // BHIM
        "com.amazon.mShop.android.shopping",         // Amazon Pay
        "com.mobikwik_new",
        "com.fampay.in",
        "com.sbi.lotusintouch",
        "com.sbi.SBIFreedomPlus",
        "com.axis.mobile",
        "com.csam.icici.bank.imobile",
        "com.rbl.rblmobileBanking",
        "com.hdfcbank.hdfcMobileBanking",
        "com.dreamplug.androidapp",                  // CRED
        "com.whatsapp",                              // WhatsApp Pay
        "com.slice.app",
    };

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String pkg = sbn.getPackageName();
        if (!isUpiApp(pkg)) return;

        Notification notif = sbn.getNotification();
        if (notif == null || notif.extras == null) return;

        Bundle extras = notif.extras;
        String title = extras.getString(Notification.EXTRA_TITLE, "");
        String text = extras.getString(Notification.EXTRA_TEXT, "");
        String bigText = extras.getString(Notification.EXTRA_BIG_TEXT, "");

        // Prefer big text (more complete), fall back to text
        String body = bigText.isEmpty() ? text : bigText;
        String fullText = (title + " " + body).trim();

        android.util.Log.d("UpiAlert", "Notification from " + pkg + ": " + fullText.substring(0, Math.min(120, fullText.length())));

        if (fullText.isEmpty()) return;

        // Delegate parsing to the plugin
        UpiListenerPlugin plugin = UpiListenerPlugin.getInstance();
        if (plugin != null) {
            plugin.onNotificationText(fullText, pkg);
        } else {
            android.util.Log.w("UpiAlert", "UpiListenerPlugin instance is null — app may not be in foreground");
        }
    }

    private boolean isUpiApp(String pkg) {
        if (pkg == null) return false;
        for (String p : UPI_PACKAGES) {
            if (p.equalsIgnoreCase(pkg)) return true;
        }
        // Also catch any other bank or pay apps by keyword
        return pkg.contains("bank") || pkg.contains(".upi") || pkg.contains("paisa")
            || pkg.contains("fampay") || pkg.contains("bhim");
    }
}
