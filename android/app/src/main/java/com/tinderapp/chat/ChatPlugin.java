package com.tinderapp.chat;

import android.content.Intent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

@CapacitorPlugin(name = "Chat")
public class ChatPlugin extends Plugin {

  @PluginMethod
  public void open(PluginCall call) {
    String me = call.getString("meUid");
    String with = call.getString("withUid");
    if (me == null || with == null) {
      call.reject("meUid and withUid are required");
      return;
    }
    Intent i = new Intent(getContext(), ChatActivity.class);
    i.putExtra("meUid", me);
    i.putExtra("withUid", with);
    i.putExtra("peerName", call.getString("peerName"));
    i.putExtra("autoMessage", call.getString("autoMessage"));
    i.putExtra("peerPhotoUrl", call.getString("peerPhotoUrl"));
    getActivity().startActivity(i);
    call.resolve(new JSObject().put("ok", true));
  }

}

