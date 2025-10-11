package com.tinderapp.chat;

import android.os.Bundle;
import android.text.TextUtils;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.imageview.ShapeableImageView;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.SetOptions;

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
    if (FirebaseAuth.getInstance().getCurrentUser() == null) {
      FirebaseAuth.getInstance().signInAnonymously();
    }

    setContentView(R.layout.activity_chat);

    if (savedInstanceState != null) {
      autoSentOnce = savedInstanceState.getBoolean(STATE_AUTO_SENT, false);
    }

    String extraMe   = getIntent().getStringExtra("meUid");
    String extraWith = getIntent().getStringExtra("withUid");
    String peerName  = getIntent().getStringExtra("peerName");
    String peerPhoto = getIntent().getStringExtra("peerPhotoUrl");
    String autoMsg   = getIntent().getStringExtra("autoMessage");

    meUid    = !TextUtils.isEmpty(extraMe)   ? extraMe   : "";
    withUid  = !TextUtils.isEmpty(extraWith) ? extraWith : "";
    withName = peerName;

    if (TextUtils.isEmpty(meUid) || TextUtils.isEmpty(withUid)) {
      finish();
      return;
    }


    TextView tvName = findViewById(R.id.tvPeerName);
    ShapeableImageView ivAvatar = findViewById(R.id.ivAvatar);
    if (!TextUtils.isEmpty(withName) && tvName != null) tvName.setText(withName);



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
    MaterialButton btnSend = findViewById(R.id.btnSend);
    ImageButton btnBack = findViewById(R.id.btnBack);
    if (btnBack != null) btnBack.setOnClickListener(v -> finish());

    btnSend.setOnClickListener(v -> {
      final String text = et.getText().toString().trim();
      if (TextUtils.isEmpty(text)) return;

      et.setText(""); // feedback inmediato

      long now = System.currentTimeMillis();
      Message m = new Message(meUid, withUid, text, now);


      ensureThreadDocument(text, meUid);

      db.collection("chats").document(threadId).collection("messages")
        .add(m)
        .addOnSuccessListener(r -> rv.scrollToPosition(Math.max(0, adapter.getItemCount() - 1)))
        .addOnFailureListener(e -> {
          et.setText(text); // devuelve el texto si falló
          Toast.makeText(this, "No se pudo enviar: " + e.getMessage(), Toast.LENGTH_SHORT).show();
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


    db.collection("users").document(withUid).addSnapshotListener((doc, e) -> {
      if (doc != null && doc.exists() && tvName != null) {
        String n = doc.getString("name");
        String ln = doc.getString("lastName");
        if (!TextUtils.isEmpty(n)) tvName.setText(ln != null ? n + " " + ln : n);
      }
    });


    if (!autoSentOnce && !TextUtils.isEmpty(autoMsg)) {
      autoSentOnce = true;
      long now = System.currentTimeMillis();
      Message auto = new Message(meUid, withUid, autoMsg, now);
      db.collection("chats").document(threadId).collection("messages")
        .add(auto)
        .addOnSuccessListener(r -> ensureThreadDocument(autoMsg, meUid));
    }
  }

  private void ensureThreadDocument(@Nullable String lastText, @Nullable String lastFrom) {

    List<String> users = new ArrayList<>(Arrays.asList(meUid, withUid));
    List<String> clean = new ArrayList<>();
    for (String s : users) if (s != null && !s.isEmpty() && !clean.contains(s)) clean.add(s);
    Collections.sort(clean);


    Map<String, Object> conv = new HashMap<>();
    conv.put("users", clean);
    conv.put("me", meUid);
    conv.put("other", withUid);
    if (!TextUtils.isEmpty(lastText)) conv.put("lastText", lastText);
    if (!TextUtils.isEmpty(lastFrom)) conv.put("lastFrom", lastFrom);
    conv.put("updatedAt", FieldValue.serverTimestamp());
    db.collection("conversations").document(threadId)
      .set(conv, SetOptions.merge());


    Map<String, Object> chat = new HashMap<>();
    chat.put("participants", clean);
    if (!TextUtils.isEmpty(lastText)) chat.put("lastText", lastText);
    if (!TextUtils.isEmpty(lastFrom)) chat.put("lastFrom", lastFrom);
    chat.put("lastAt", FieldValue.serverTimestamp());
    db.collection("chats").document(threadId)
      .set(chat, SetOptions.merge());
  }

  @Override
  protected void onSaveInstanceState(@NonNull Bundle outState) {
    super.onSaveInstanceState(outState);
    outState.putBoolean(STATE_AUTO_SENT, autoSentOnce);
  }
}



