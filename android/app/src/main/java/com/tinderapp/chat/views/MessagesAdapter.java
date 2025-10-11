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

public class MessagesAdapter extends RecyclerView.Adapter<MessagesAdapter.VH> {
  private static final int TYPE_IN = 1;
  private static final int TYPE_OUT = 2;

  private final String meUid;
  private final List<Message> data = new ArrayList<>();

  public MessagesAdapter(String meUid) { this.meUid = meUid; }

  public void submit(List<Message> list) {
    data.clear();
    if (list != null) data.addAll(list);
    notifyDataSetChanged();
  }

  @Override public int getItemCount() { return data.size(); }

  @Override public int getItemViewType(int i) {
    return (meUid != null && meUid.equals(data.get(i).from)) ? TYPE_OUT : TYPE_IN;
  }

  @NonNull @Override
  public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    LayoutInflater inf = LayoutInflater.from(parent.getContext());
    int layout = (viewType == TYPE_OUT) ? R.layout.item_message_out : R.layout.item_message_in;
    return new VH(inf.inflate(layout, parent, false));
  }

  @Override public void onBindViewHolder(@NonNull VH h, int i) {
    h.tv.setText(data.get(i).text);
  }

  static class VH extends RecyclerView.ViewHolder {
    TextView tv;
    VH(@NonNull View itemView) { super(itemView); tv = itemView.findViewById(R.id.tvText); }
  }
}



