import { WebPlugin } from '@capacitor/core';
import type { UpiListenerPlugin } from './definitions';

export class UpiListenerWeb extends WebPlugin implements UpiListenerPlugin {
    async startListening(): Promise<void> {
        console.warn('UpiListener: Native plugin not available in browser. Use Android app.');
    }
    async stopListening(): Promise<void> {
        console.warn('UpiListener: Native plugin not available in browser.');
    }
    async checkPermissions(): Promise<{ sms: boolean; notifications: boolean }> {
        return { sms: false, notifications: false };
    }
    async requestPermissions(): Promise<void> {
        console.warn('UpiListener: Cannot request native permissions from browser.');
    }
    async openNotificationSettings(): Promise<void> {
        console.warn('UpiListener: Cannot open notification settings from browser.');
    }
    async getDeviceToken(): Promise<{ token: string }> {
        return { token: '' };
    }
}
