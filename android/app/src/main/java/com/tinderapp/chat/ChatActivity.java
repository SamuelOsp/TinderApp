package com.tinderapp.chat;

import android.os.Bundle;
import android.text.TextUtils;
import android.widget.EditText;
import android.widget.ImageButton;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import com.tinderapp.chat.views.MessagesAdapter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.ionic.starter.R;

public class ChatActivity extends AppCompatActivity {

  private String meUid;
  private String withUid;
  private String withName;
  private String threadId;

  private FirebaseFirestore db;
  private MessagesAdapter adapter;

  private static final String STATE_AUTO_SENT = "state_auto_sent";
  private boolean autoSentOnce = false;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (FirebaseApp.getApps(this).isEmpty()) FirebaseApp.initializeApp(this);

    setContentView(R.layout.activity_chat);

    if (savedInstanceState != null) {
      autoSentOnce = savedInstanceState.getBoolean(STATE_AUTO_SENT, false);
    }

    String extraMe   = getIntent().getStringExtra("meUid");
    String extraWith = getIntent().getStringExtra("withUid");
    String peerName  = getIntent().getStringExtra("peerName");
    String autoMsg   = getIntent().getStringExtra("autoMessage");

    meUid   = !TextUtils.isEmpty(extraMe)   ? extraMe   : "me";
    withUid = !TextUtils.isEmpty(extraWith) ? extraWith : "peer";
    withName = peerName;

    if (!TextUtils.isEmpty(withName)) setTitle(withName);

    List<String> pair = new ArrayList<>();
    pair.add(meUid); pair.add(withUid);
    Collections.sort(pair);
    threadId = pair.get(0) + "_" + pair.get(1);

    db = FirebaseFirestore.getInstance();

    ensureThreadDocument(null, null);

    RecyclerView rv = findViewById(R.id.rvMessages);
    LinearLayoutManager lm = new LinearLayoutManager(this);
    lm.setStackFromEnd(true);
    rv.setLayoutManager(lm);

    adapter = new MessagesAdapter(meUid);
    rv.setAdapter(adapter);

    EditText et = findViewById(R.id.etMessage);
    ImageButton btnSend = findViewById(R.id.btnSend);

    btnSend.setOnClickListener(v -> {
      String text = et.getText().toString().trim();
      if (TextUtils.isEmpty(text)) return;
      long now = System.currentTimeMillis();

      Message m = new Message(meUid, withUid, text, now);
      db.collection("chats").document(threadId).collection("messages")
        .add(m)
        .addOnSuccessListener(r -> {
          et.setText("");
          // actualiza resumen del hilo
          ensureThreadDocument(text, meUid);
        });
    });

    db.collection("chats").document(threadId).collection("messages")
      .orderBy("createdAt", Query.Direction.ASCENDING)
      .addSnapshotListener((snap, err) -> {
        if (err != null || snap == null) return;
        List<Message> list = new ArrayList<>();
        for (DocumentSnapshot d : snap.getDocuments()) {
          Message m = d.toObject(Message.class);
          if (m != null) list.add(m);
        }
        adapter.submit(list);
        rv.scrollToPosition(Math.max(0, list.size() - 1));
      });

    // Auto-mensaje sólo una vez
    if (!autoSentOnce && !TextUtils.isEmpty(autoMsg) && !TextUtils.isEmpty(withUid)) {
      autoSentOnce = true;
      long now = System.currentTimeMillis();
      Message auto = new Message(meUid, withUid, autoMsg, now);
      db.collection("chats").document(threadId).collection("messages")
        .add(auto)
        .addOnSuccessListener(r -> ensureThreadDocument(autoMsg, meUid));
    }
  }

  private void ensureThreadDocument(@Nullable String lastText, @Nullable String lastFrom) {
    DocumentReference ref = db.collection("chats").document(threadId);

    Map<String, Object> data = new HashMap<>();
    data.put("participants", Arrays.asList(meUid, withUid));
    if (!TextUtils.isEmpty(lastText)) data.put("lastText", lastText);
    if (!TextUtils.isEmpty(lastFrom)) data.put("lastFrom", lastFrom);
    data.put("lastAt", FieldValue.serverTimestamp());

    ref.set(data, com.google.firebase.firestore.SetOptions.merge());
  }

  @Override
  protected void onSaveInstanceState(@NonNull Bundle outState) {
    super.onSaveInstanceState(outState);
    outState.putBoolean(STATE_AUTO_SENT, autoSentOnce);
  }
}
