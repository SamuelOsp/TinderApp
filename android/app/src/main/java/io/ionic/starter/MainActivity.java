package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.tinderapp.chat.ChatPlugin;
import com.tinderapp.matching.MatchingPlugin;

public class  MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(MatchingPlugin.class);
    registerPlugin(ChatPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
