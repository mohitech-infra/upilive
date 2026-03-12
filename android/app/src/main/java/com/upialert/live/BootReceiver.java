package com.upialert.live;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Restarts the UPI notification listener service when the device reboots.
 * Registered in AndroidManifest.xml with RECEIVE_BOOT_COMPLETED permission.
 */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action) ||
            "android.intent.action.QUICKBOOT_POWERON".equals(action)) {
            // The NotificationListenerService is auto-bound by Android
            // if the user has granted notification access — no manual start needed.
            // We just log to SharedPreferences that the boot restart happened.
            context.getSharedPreferences("upialert", Context.MODE_PRIVATE)
                   .edit().putLong("last_boot", System.currentTimeMillis()).apply();
        }
    }
}
