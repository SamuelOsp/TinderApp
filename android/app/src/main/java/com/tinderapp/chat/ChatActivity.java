package com.tinderapp.chat;

import android.os.Bundle;
import android.text.TextUtils;
import android.widget.EditText;
import android.widget.ImageButton;

import androidx.activity.ComponentActivity;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import com.tinderapp.chat.views.MessagesAdapter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import io.ionic.starter.R;


public class ChatActivity extends ComponentActivity {

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
    setContentView(R.layout.activity_chat);

    if (savedInstanceState != null) {
      autoSentOnce = savedInstanceState.getBoolean(STATE_AUTO_SENT, false);
    }

    String extraMe   = getIntent().getStringExtra("meUid");
    String extraWith = getIntent().getStringExtra("withUid");


    String peerId    = getIntent().getStringExtra("peerId");
    String peerName  = getIntent().getStringExtra("peerName");
    String autoMsg   = getIntent().getStringExtra("autoMessage");


    meUid   = !TextUtils.isEmpty(extraMe)   ? extraMe   : "me";
    withUid = !TextUtils.isEmpty(extraWith) ? extraWith : peerId;
    withName = peerName;

    if (!TextUtils.isEmpty(withName)) {
      setTitle(withName);
    }


    List<String> pair = new ArrayList<>();
    pair.add(meUid);
    pair.add(withUid);
    Collections.sort(pair);
    threadId = pair.get(0) + "_" + pair.get(1);


    FirebaseApp.initializeApp(this);
    db = FirebaseFirestore.getInstance();


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
        .addOnSuccessListener(r -> et.setText(""));
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


    if (!autoSentOnce && !TextUtils.isEmpty(autoMsg) && !TextUtils.isEmpty(withUid)) {
      autoSentOnce = true;
      long now = System.currentTimeMillis();
      Message auto = new Message(meUid, withUid, autoMsg, now);
      db.collection("chats").document(threadId).collection("messages").add(auto);
    }
  }

  @Override
  protected void onSaveInstanceState(@NonNull Bundle outState) {
    super.onSaveInstanceState(outState);
    outState.putBoolean(STATE_AUTO_SENT, autoSentOnce);
  }
}
