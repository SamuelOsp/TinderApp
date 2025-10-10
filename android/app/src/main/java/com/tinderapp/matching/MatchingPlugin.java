
package com.tinderapp.matching;

import android.content.Intent;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.lang.ref.WeakReference;

@CapacitorPlugin(name = "Matching")
public class MatchingPlugin extends Plugin {
  public static WeakReference<MatchingPlugin> instanceRef;

  @Override
  public void load() {
    instanceRef = new WeakReference<>(this);
  }

  @PluginMethod
  public void open(PluginCall call) {
    String uid = call.getString("uid");
    if (uid == null || uid.isEmpty()) {
      call.reject("uid is required");
      return;
    }

    try {
      Intent intent = new Intent(getActivity(), MatchingActivity.class);
      intent.putExtra("uid", uid);

      getBridge().saveCall(call);
      startActivityForResult(call, intent, "onMatchingClosed");
    } catch (Throwable t) {
      call.reject("Failed to open MatchingActivity: " + t.getMessage());
    }
  }

  @ActivityCallback
  private void onMatchingClosed(PluginCall call, ActivityResult result) {
    JSObject ret = new JSObject();
    ret.put("resultCode", result != null ? result.getResultCode() : 0);
    call.resolve(ret);
  }

  public void emit(String event, JSObject data) {
    notifyListeners(event, data);
  }
}
