package com.upialert.live;

import android.app.Notification;
import android.content.Context;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

import com.getcapacitor.JSObject;

/**
 * Runs as a background Android service.
 * Registered in AndroidManifest.xml with BIND_NOTIFICATION_LISTENER_SERVICE permission.
 * User must grant notification access via Settings > Apps > Special app access > Notification access.
 */
public class UpiNotificationListener extends NotificationListenerService {

    // Known UPI & bank app package names
    private static final String[] UPI_PACKAGES = {
        "com.phonepe.app",
        "com.google.android.apps.nbu.paisa.user",  // GPay
        "net.one97.paytm",
        "in.org.npci.upiapp",                       // BHIM
        "com.amazon.mShop.android.shopping",        // Amazon Pay
        "com.mobikwik_new",
        "com.sbi.lotusintouch",
        "com.axis.mobile",
        "com.csam.icici.bank.imobile",
        "com.rbl.rblmobileBanking",
        "com.hdfcbank.hdfcMobileBanking",
    };

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (!isUpiApp(sbn.getPackageName())) return;

        Notification notif = sbn.getNotification();
        if (notif == null || notif.extras == null) return;

        Bundle extras = notif.extras;
        String title = extras.getString(Notification.EXTRA_TITLE, "");
        String text = extras.getString(Notification.EXTRA_TEXT, "");
        String bigText = extras.getString(Notification.EXTRA_BIG_TEXT, "");

        String fullText = (title + " " + (bigText.isEmpty() ? text : bigText)).trim();
        if (fullText.isEmpty()) return;

        // Delegate parsing to the plugin
        UpiListenerPlugin plugin = UpiListenerPlugin.getInstance();
        if (plugin != null) {
            plugin.onNotificationText(fullText, sbn.getPackageName());
        }
    }

    private boolean isUpiApp(String pkg) {
        if (pkg == null) return false;
        for (String p : UPI_PACKAGES) {
            if (p.equalsIgnoreCase(pkg)) return true;
        }
        // Also catch generic bank SMS apps
        return pkg.contains("bank") || pkg.contains("upi") || pkg.contains("pay");
    }
}
