package com.tinderapp.matching;

import android.app.Activity;
import android.content.Intent;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.tinderapp.models.Profile;
import com.tinderapp.repositories.MatchingRepository;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.List;

@CapacitorPlugin(name = "Matching")
public class MatchingPlugin extends Plugin {

  public static WeakReference<MatchingPlugin> instanceRef;

  @Override
  public void load() {
    instanceRef = new WeakReference<>(this);
  }

  private static MatchingPlugin getInstance() {
    return instanceRef != null ? instanceRef.get() : null;
  }

  public static void emitLike(String profileId) {
    MatchingPlugin inst = getInstance();
    if (inst == null) return;
    JSObject data = new JSObject().put("profileId", profileId);
    inst.notifyListeners("like", data);
  }

  public static void emitNope(String profileId) {
    MatchingPlugin inst = getInstance();
    if (inst == null) return;
    JSObject data = new JSObject().put("profileId", profileId);
    inst.notifyListeners("nope", data);
  }

  public static void emitMatch(String profileId, String conversationId) {
    MatchingPlugin inst = getInstance();
    if (inst == null) return;
    JSObject data = new JSObject().put("profileId", profileId);
    if (conversationId != null) data.put("conversationId", conversationId);
    inst.notifyListeners("match", data);
  }
  // -------------------------------------------------------------------------------------------


  @PluginMethod
  public void open(PluginCall call) {
    String uid = call.getString("uid");
    if (uid == null || uid.isEmpty()) {
      call.reject("uid is required");
      return;
    }
    try {
      Activity act = getActivity();
      if (act == null) {
        call.reject("No activity available");
        return;
      }
      Intent intent = new Intent(act, MatchingActivity.class);
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

  @PluginMethod
  public void getProfiles(PluginCall call) {
    int limit = call.getInt("limit", 25);

    try {
      List<Profile> profiles = MatchingRepository.getInstance().fetchProfiles(limit);

      JSArray arr = new JSArray();
      for (Profile p : profiles) {
        JSObject json = new JSObject();
        json.put("id", p.getUid());
        json.put("name", (p.getName() != null ? p.getName() : "") + " " + (p.getLastName() != null ? p.getLastName() : ""));
        json.put("age", 22);
        json.put("distanceKm", 3);

        JSArray photos = new JSArray();
        for (String url : p.getPhotos()) {
          photos.put(new JSObject().put("url", url));
        }
        json.put("photos", photos);

        json.put("bio", p.getCity() != null ? "From " + p.getCity() : "");
        arr.put(json);
      }

      JSObject ret = new JSObject().put("profiles", arr);
      call.resolve(ret);

      JSObject evt = new JSObject().put("profiles", arr);
      notifyListeners("profilesUpdated", evt);

    } catch (Throwable t) {
      call.reject("getProfiles failed: " + t.getMessage());
    }
  }

  @PluginMethod
  public void like(PluginCall call) {
    String profileId = call.getString("profileId");
    if (profileId == null || profileId.isEmpty()) {
      call.reject("profileId is required");
      return;
    }
    try {
      boolean matched = MatchingRepository.getInstance().registerLike(profileId);
      String conversationId = matched ? MatchingRepository.getInstance().createConversation(profileId) : null;

      emitLike(profileId);

      if (matched) {
        emitMatch(profileId, conversationId);
      }

      JSObject ret = new JSObject();
      ret.put("match", matched);
      if (matched && conversationId != null) {
        ret.put("conversationId", conversationId);
      }
      call.resolve(ret);
    } catch (Throwable t) {
      call.reject("like failed: " + t.getMessage());
    }
  }

  @PluginMethod
  public void pass(PluginCall call) {
    String profileId = call.getString("profileId");
    if (profileId == null || profileId.isEmpty()) {
      call.reject("profileId is required");
      return;
    }
    try {
      MatchingRepository.getInstance().registerPass(profileId);
      emitNope(profileId);
      call.resolve();
    } catch (Throwable t) {
      call.reject("pass failed: " + t.getMessage());
    }
  }


  public void emit(String event, JSObject data) {
    notifyListeners(event, data);
  }


  public static void emitProfilesUpdated(List<JSONObject> profiles) throws JSONException {
    MatchingPlugin inst = getInstance();
    if (inst == null) return;
    JSArray arr = new JSArray(new JSONArray(profiles));
    JSObject payload = new JSObject().put("profiles", arr);
    inst.notifyListeners("profilesUpdated", payload);
  }
}
