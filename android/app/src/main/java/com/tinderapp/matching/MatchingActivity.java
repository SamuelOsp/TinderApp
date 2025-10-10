package com.tinderapp.matching;

import android.content.Intent;
import android.graphics.Canvas;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.ArrayList;
import java.util.List;

import io.ionic.starter.R;
import com.tinderapp.chat.ChatActivity;
import com.tinderapp.models.Profile;
import com.tinderapp.matching.views.ProfilesAdapter;
import com.tinderapp.matching.views.StackLayoutManager;

public class MatchingActivity extends AppCompatActivity {

  private RecyclerView rv;
  private ProfilesAdapter adapter;
  private final List<Profile> data = new ArrayList<>();
  private ItemTouchHelper touchHelper;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (FirebaseApp.getApps(this).isEmpty()) {
      FirebaseApp.initializeApp(this);
    }
    setContentView(R.layout.activity_matching);

    rv = findViewById(R.id.rvCards);


    rv.setLayoutManager(new StackLayoutManager());

    adapter = new ProfilesAdapter(this, data);
    rv.setAdapter(adapter);

    attachSwipe();
    loadUsersFromFirestore();

    ImageButton btnLike = findViewById(R.id.btnLike);
    ImageButton btnNope = findViewById(R.id.btnNope);
    ImageButton btnBack = findViewById(R.id.btnBack);
    ImageButton btnChat = findViewById(R.id.btnChat);

    btnLike.setOnClickListener(v -> swipeTopCard());
    btnNope.setOnClickListener(v -> swipeTopCard());
    btnBack.setOnClickListener(v -> finish());
    btnChat.setOnClickListener(v -> {
      if (!data.isEmpty()) {
        Profile p = data.get(0);
        openChatWithAutoMessage(p, "Hola 👋");
      }
    });
  }


  private void loadUsersFromFirestore() {
    FirebaseApp.initializeApp(this);
    String me = FirebaseAuth.getInstance().getCurrentUser() != null
      ? FirebaseAuth.getInstance().getCurrentUser().getUid() : null;

    FirebaseFirestore db = FirebaseFirestore.getInstance();
    db.collection("users")
      .addSnapshotListener((snap, err) -> {
        if (err != null || snap == null) return;
        data.clear();

        for (DocumentSnapshot d : snap.getDocuments()) {
          Profile p = new Profile();
          p.uid = d.getId(); // fallback

          // Nombres posibles
          p.name     = firstNonEmpty(d, "name", "firstName", "displayName");
          p.lastName = firstNonEmpty(d, "lastName", "surname");
          p.city     = firstNonEmpty(d, "city", "location", "country");

          // Fotos: array o string suelto
          List<String> photos = firstStringList(d, "photos", "images", "photosUrl");
          if (photos == null || photos.isEmpty()) {
            String single = firstNonEmpty(d, "photoUrl", "image", "avatar", "picture");
            if (single != null) photos = new ArrayList<>(java.util.Arrays.asList(single));
          }
          if (photos != null) p.photos = photos;

          // Filtra mi propio user
          String docUid = valueAsString(d, "uid");
          if (docUid != null) p.uid = docUid;
          if (me != null && me.equals(p.uid)) continue;

          data.add(p);
        }
        adapter.notifyDataSetChanged();
      });
  }

  private String firstNonEmpty(DocumentSnapshot d, String... keys) {
    for (String k : keys) {
      Object v = d.get(k);
      if (v instanceof String) {
        String s = ((String) v).trim();
        if (!s.isEmpty()) return s;
      }
    }
    return null;
  }

  @SuppressWarnings("unchecked")
  private List<String> firstStringList(DocumentSnapshot d, String... keys) {
    for (String k : keys) {
      Object v = d.get(k);
      if (v instanceof List) {
        List<?> raw = (List<?>) v;
        List<String> out = new ArrayList<>();
        for (Object o : raw) if (o instanceof String && !((String)o).trim().isEmpty()) out.add((String)o);
        if (!out.isEmpty()) return out;
      }
    }
    return null;
  }

  private String valueAsString(DocumentSnapshot d, String key) {
    Object v = d.get(key);
    return (v instanceof String) ? (String) v : null;
  }

  private void swipeTopCard() {
    RecyclerView.ViewHolder vh = rv.findViewHolderForAdapterPosition(0);
    if (vh != null && touchHelper != null) {
      touchHelper.startSwipe(vh);
    }
  }

  private void attachSwipe() {
    ItemTouchHelper.SimpleCallback cb = new ItemTouchHelper.SimpleCallback(
      0, ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT) {

      @Override public boolean onMove(@NonNull RecyclerView rv,
                                      @NonNull RecyclerView.ViewHolder vh,
                                      @NonNull RecyclerView.ViewHolder tgt) { return false; }

      @Override
      public void onChildDraw(@NonNull Canvas c, @NonNull RecyclerView rv,
                              @NonNull RecyclerView.ViewHolder vh,
                              float dX, float dY, int actionState, boolean isActive) {
        View v = vh.itemView;
        float ratio = Math.max(-1f, Math.min(1f, dX / (rv.getWidth() * 0.65f)));
        v.setRotation(12f * ratio);
        v.setTranslationX(dX);
        v.setAlpha(1f - Math.min(0.35f, Math.abs(ratio) * 0.35f));
        super.onChildDraw(c, rv, vh, dX, dY, actionState, isActive);
      }

      @Override
      public void clearView(@NonNull RecyclerView rv, @NonNull RecyclerView.ViewHolder vh) {
        vh.itemView.setRotation(0f);
        vh.itemView.setAlpha(1f);
        super.clearView(rv, vh);
      }

      @Override
      public void onSwiped(@NonNull RecyclerView.ViewHolder vh, int direction) {
        int pos = vh.getBindingAdapterPosition();
        if (pos == RecyclerView.NO_POSITION || pos >= data.size()) return;

        Profile p = data.get(pos);
        if (direction == ItemTouchHelper.RIGHT) onMatch(p);
        else if (direction == ItemTouchHelper.LEFT) onReject(p);

        data.remove(pos);
        adapter.notifyItemRemoved(pos);
      }
    };

    touchHelper = new ItemTouchHelper(cb);
    touchHelper.attachToRecyclerView(rv);
  }

  private void onMatch(Profile p) {
    openChatWithAutoMessage(p, "¡Es un match, " + (p.name != null ? p.name : "") + "! 😊");
  }

  private void onReject(Profile p) {

  }

  private void openChatWithAutoMessage(Profile p, String msg) {
    String me = FirebaseAuth.getInstance().getCurrentUser() != null
      ? FirebaseAuth.getInstance().getCurrentUser().getUid() : "me";

    Intent i = new Intent(this, ChatActivity.class);
    i.putExtra("meUid",  me);
    i.putExtra("withUid", p.uid);
    i.putExtra("peerName",
      (p.name != null ? p.name : "") + " " + (p.lastName != null ? p.lastName : ""));
    i.putExtra("autoMessage", msg);
    startActivity(i);
  }
}

