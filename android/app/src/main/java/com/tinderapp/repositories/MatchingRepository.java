package com.tinderapp.repositories;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.tinderapp.models.Profile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class MatchingRepository {

  private static final String TAG = "MatchingRepository";
  private static MatchingRepository instance;
  private final FirebaseFirestore db;

  private MatchingRepository() {
    db = FirebaseFirestore.getInstance();
  }

  public static MatchingRepository getInstance() {
    if (instance == null) instance = new MatchingRepository();
    return instance;
  }


  public List<Profile> fetchProfiles(int limit) {
    List<Profile> profiles = new ArrayList<>();

    try {
      CollectionReference usersRef = db.collection("users");

      Query q = usersRef.limit(limit);

      Task<List<DocumentSnapshot>> task = q.get().continueWith(t -> t.getResult().getDocuments());
      List<DocumentSnapshot> docs = Tasks.await(task);

      for (DocumentSnapshot doc : docs) {
        if (!doc.exists()) continue;

        Map<String, Object> data = doc.getData();
        if (data == null) continue;

        String uid = doc.getId();
        String name = safeString(data.get("name"));
        String lastName = safeString(data.get("lastName"));
        String city = safeString(data.get("city"));
        List<String> photos = new ArrayList<>();

        Object rawPhotos = data.get("photos");
        if (rawPhotos instanceof List<?>) {
          for (Object p : (List<?>) rawPhotos) {
            if (p != null) photos.add(p.toString());
          }
        }

        Profile p = new Profile(uid, name, lastName, city, photos);
        profiles.add(p);
      }

    } catch (ExecutionException | InterruptedException e) {
      Log.e(TAG, "Error fetching profiles from Firestore", e);
    }

    return profiles;
  }

  public boolean registerLike(@NonNull String profileId) {
    try {
      String currentUserId = "me";
      db.collection("likes").document(currentUserId)
        .collection("liked").document(profileId)
        .set(Map.of("timestamp", System.currentTimeMillis()));


      Task<DocumentSnapshot> task = db.collection("likes")
        .document(profileId)
        .collection("liked")
        .document(currentUserId)
        .get();

      DocumentSnapshot snapshot = Tasks.await(task);
      boolean matched = snapshot.exists();

      if (matched) {
        createConversation(profileId);
      }

      return matched;
    } catch (Exception e) {
      Log.e(TAG, "registerLike error: ", e);
      return false;
    }
  }


  public void registerPass(@NonNull String profileId) {
    try {
      String currentUserId = "me";
      db.collection("passes").document(currentUserId)
        .collection("passed").document(profileId)
        .set(Map.of("timestamp", System.currentTimeMillis()));
    } catch (Exception e) {
      Log.e(TAG, "registerPass error: ", e);
    }
  }


  public String createConversation(@NonNull String profileId) {
    try {
      String currentUserId = "me";
      String convoId = currentUserId.compareTo(profileId) < 0
        ? currentUserId + "_" + profileId
        : profileId + "_" + currentUserId;

      db.collection("conversations").document(convoId)
        .set(Map.of(
          "participants", List.of(currentUserId, profileId),
          "lastAt", System.currentTimeMillis()
        ));

      return convoId;
    } catch (Exception e) {
      Log.e(TAG, "createConversation error: ", e);
      return null;
    }
  }

  // Helper
  private String safeString(Object o) {
    return o != null ? o.toString() : "";
  }
}
