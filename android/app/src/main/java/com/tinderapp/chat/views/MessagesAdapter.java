package com.tinderapp.chat.views;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.tinderapp.chat.Message;
import java.util.ArrayList;
import java.util.List;

import io.ionic.starter.R;

public class MessagesAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
  private static final int ME = 1, OTHER = 2;
  private final String meUid;
  private final List<Message> data = new ArrayList<>();

  public MessagesAdapter(String meUid) { this.meUid = meUid; }

  public void submit(List<Message> list) {
    data.clear(); if (list != null) data.addAll(list);
    notifyDataSetChanged();
  }

  @Override public int getItemViewType(int i) {
    return meUid.equals(data.get(i).from) ? ME : OTHER;
  }

  @NonNull @Override
  public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    LayoutInflater inf = LayoutInflater.from(parent.getContext());
    View v = inf.inflate(viewType == ME ? R.layout.item_message_in : R.layout.item_message_out, parent, false);
    return new VH(v);
  }

  @Override public void onBindViewHolder(@NonNull RecyclerView.ViewHolder h, int i) {
    ((VH) h).tv.setText(data.get(i).text);
  }

  @Override public int getItemCount() { return data.size(); }

  static class VH extends RecyclerView.ViewHolder {
    TextView tv;
    VH(@NonNull View itemView) { super(itemView); tv = itemView.findViewById(R.id.tvText); }
  }
}


