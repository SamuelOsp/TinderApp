package com.tinderapp.matching.views;

import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.tinderapp.models.Profile;
import java.util.ArrayList;
import java.util.List;

public class ProfilesAdapter extends RecyclerView.Adapter<ProfilesAdapter.VH> {
  private final List<Profile> data = new ArrayList<>();

  public static class VH extends RecyclerView.ViewHolder {
    public final ProfileCardView card;
    public VH(@NonNull ProfileCardView v) { super(v); card = v; }
  }

  @NonNull @Override
  public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    ProfileCardView v = new ProfileCardView(parent.getContext());
    v.setLayoutParams(new ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.WRAP_CONTENT
    ));
    return new VH(v);
  }

  @Override
  public void onBindViewHolder(@NonNull VH holder, int position) {
    holder.card.bind(data.get(position));
  }

  @Override public int getItemCount() { return data.size(); }

  public Profile getItem(int pos) { return data.get(pos); }
  public Profile peek() { return data.isEmpty() ? null : data.get(0); }

  public void removeTop() {
    if (!data.isEmpty()) { data.remove(0); notifyItemRemoved(0); }
  }

  public void submit(List<Profile> items) {
    data.clear(); data.addAll(items); notifyDataSetChanged();
  }
}
