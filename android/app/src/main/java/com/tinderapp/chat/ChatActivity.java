package com.tinderapp.chat;

import android.os.Bundle;
import android.text.TextUtils;
import android.widget.EditText;
import android.widget.ImageButton;

import androidx.activity.ComponentActivity;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.*;

import com.tinderapp.chat.views.MessagesAdapter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import io.ionic.starter.R;

public class ChatActivity extends ComponentActivity {
  private String meUid, withUid, threadId;
  private FirebaseFirestore db;
  private MessagesAdapter adapter;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_chat);

    meUid = getIntent().getStringExtra("meUid");
    withUid = getIntent().getStringExtra("withUid");

    // threadId determinístico
    List<String> pair = new ArrayList<>();
    pair.add(meUid); pair.add(withUid);
    Collections.sort(pair);
    threadId = pair.get(0) + "_" + pair.get(1);

    FirebaseApp.initializeApp(this);
    db = FirebaseFirestore.getInstance();

    RecyclerView rv = findViewById(R.id.rvMessages);
    rv.setLayoutManager(new LinearLayoutManager(this));
    adapter = new MessagesAdapter(meUid);
    rv.setAdapter(adapter);

    EditText et = findViewById(R.id.etMessage);
    ImageButton send = findViewById(R.id.btnSend);

    send.setOnClickListener(v -> {
      String text = et.getText().toString().trim();
      if (TextUtils.isEmpty(text)) return;
      long now = System.currentTimeMillis();

      Message m = new Message(meUid, withUid, text, now);
      db.collection("chats").document(threadId).collection("messages")
        .add(m)
        .addOnSuccessListener(r -> et.setText(""));
    });

    // Escucha en tiempo real
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
        rv.scrollToPosition(Math.max(0, list.size()-1));
      });
  }
}

