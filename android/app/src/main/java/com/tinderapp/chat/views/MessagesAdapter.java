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
  private final String meUid;
  private final List<Message> data = new ArrayList<>();

  public MessagesAdapter(String meUid) { this.meUid = meUid; }

  public static class VH extends RecyclerView.ViewHolder {
    public final TextView txt;
    public VH(@NonNull View v) { super(v); this.txt = v.findViewById(R.id.txt); }
  }

  @NonNull @Override
  public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    int layout = (viewType == 1) ? R.layout.item_message_out : R.layout.item_message_in;
    View v = LayoutInflater.from(parent.getContext()).inflate(layout, parent, false);
    return new VH(v);
  }

  @Override
  public void onBindViewHolder(@NonNull VH holder, int position) {
    holder.txt.setText(data.get(position).text);
  }

  @Override public int getItemViewType(int position) {
    return meUid.equals(data.get(position).from) ? 1 : 0;
  }

  @Override public int getItemCount() { return data.size(); }

  public void submit(List<Message> messages) {
    data.clear(); data.addAll(messages); notifyDataSetChanged();
  }

  public void add(Message m) {
    data.add(m); notifyItemInserted(data.size()-1);
  }
}

