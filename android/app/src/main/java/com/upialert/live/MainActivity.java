package com.upialert.live;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register our custom UPI listener plugin before the bridge initializes
        registerPlugin(UpiListenerPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
