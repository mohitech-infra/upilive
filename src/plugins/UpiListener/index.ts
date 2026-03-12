import { registerPlugin } from '@capacitor/core';
import type { UpiListenerPlugin } from './definitions';
import { UpiListenerWeb } from './web';

const UpiListener = registerPlugin<UpiListenerPlugin>('UpiListener', {
    web: () => new UpiListenerWeb(),
});

export * from './definitions';
export { UpiListener };
