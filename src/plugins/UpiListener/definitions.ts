import type { PluginListenerHandle } from '@capacitor/core';

export interface UpiListenerPlugin {
    /** Start listening for UPI SMS and notifications */
    startListening(): Promise<void>;
    /** Stop the listener */
    stopListening(): Promise<void>;
    /** Check current permission status */
    checkPermissions(): Promise<{ sms: boolean; notifications: boolean; push: boolean }>;
    /** Request SMS + notification permissions */
    requestPermissions(): Promise<void>;
    /** Open Android Notification Settings for the user to grant access */
    openNotificationSettings(): Promise<void>;
    /** Get the unique device token for this user's device */
    getDeviceToken(): Promise<{ token: string }>;
    /** Fired when a UPI payment is detected */
    addListener(
        event: 'upiPaymentDetected',
        listenerFunc: (data: {
            amount: number;
            donor_name: string;
            upi_ref: string;
            source: string;
            raw_text: string;
        }) => void
    ): Promise<PluginListenerHandle>;
}
