package com.tinderapp.matching;

import android.os.Bundle;
import android.widget.ImageButton;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.getcapacitor.JSObject;
import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.tinderapp.matching.views.ProfilesAdapter;
import com.tinderapp.models.Profile;

import java.util.ArrayList;
import java.util.List;

import io.ionic.starter.R;

public class MatchingActivity extends AppCompatActivity {

  private RecyclerView list;
  private ProfilesAdapter adapter;
  private String currentUid = "";
  private FirebaseFirestore db;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_matching);

    currentUid = getIntent().getStringExtra("uid");

    FirebaseApp.initializeApp(this);
    db = FirebaseFirestore.getInstance();

    list = findViewById(R.id.rvCards);
    list.setLayoutManager(new LinearLayoutManager(this));
    adapter = new ProfilesAdapter();
    list.setAdapter(adapter);

    ImageButton btnBack = findViewById(R.id.btnBack);
    ImageButton btnLike = findViewById(R.id.btnLike);
    ImageButton btnNope = findViewById(R.id.btnNope);
    ImageButton btnChat = findViewById(R.id.btnChat);

    btnBack.setOnClickListener(v -> finish());

    btnLike.setOnClickListener(v -> {
      Profile p = adapter.peek();
      if (p == null) return;
      adapter.removeTop();
      emit("like", p.uid);
    });

    btnNope.setOnClickListener(v -> {
      Profile p = adapter.peek();
      if (p == null) return;
      adapter.removeTop();
      emit("nope", p.uid);
    });

    btnChat.setOnClickListener(v -> {
      Profile p = adapter.peek();
      if (p == null) return;
      emitChat(p.uid);
    });

    loadProfiles();
  }

  private void emit(String event, String targetUid) {
    MatchingPlugin plugin = MatchingPlugin.instanceRef.get();
    if (plugin != null) {
      JSObject data = new JSObject().put("to", targetUid);
      plugin.emit(event, data);
    }
  }

  private void emitChat(String withUid) {
    MatchingPlugin plugin = MatchingPlugin.instanceRef.get();
    if (plugin != null) {
      JSObject data = new JSObject().put("with", withUid);
      plugin.emit("openChat", data);
    }
  }

  private void loadProfiles() {
    db.collection("users")
      .whereNotEqualTo("uid", currentUid)
      .limit(25)
      .get()
      .addOnSuccessListener(sn -> {
        List<Profile> items = new ArrayList<>();
        for (QueryDocumentSnapshot d : sn) {
          Profile p = new Profile();
          p.uid = d.getString("uid");
          p.name = d.getString("name");
          p.lastName = d.getString("lastName");
          p.city = d.getString("city");
          List<String> photos = (List<String>) d.get("photos");
          if (photos != null) p.photos.addAll(photos);
          items.add(p);
        }
        adapter.submit(items);
      });
  }
}
