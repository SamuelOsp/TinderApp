package com.tinderapp.matching.views;

import android.content.Context;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.tinderapp.models.Profile;

import java.util.ArrayList;
import java.util.List;

public class ProfilesAdapter extends RecyclerView.Adapter<ProfilesAdapter.VH> {

  private final List<Profile> items = new ArrayList<>();
  private final Context ctx;

  public ProfilesAdapter(@NonNull Context ctx, List<Profile> initial) {
    this.ctx = ctx;
    if (initial != null) items.addAll(initial);
  }

  @NonNull
  @Override
  public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    ProfileCardView v = new ProfileCardView(parent.getContext());
    int m = (int) (8 * parent.getResources().getDisplayMetrics().density);
    v.setPadding(m, m, m, m);
    return new VH(v);
  }

  @Override
  public void onBindViewHolder(@NonNull VH holder, int position) {
    holder.bind(items.get(position));
  }

  @Override
  public int getItemCount() {
    return items.size();
  }

  public Profile getItem(int pos) {
    return items.get(pos);
  }

  public void removeAt(int pos) {
    if (pos < 0 || pos >= items.size()) return;
    items.remove(pos);
    notifyItemRemoved(pos);
  }

  public static class VH extends RecyclerView.ViewHolder {
    private final ProfileCardView card;

    public VH(@NonNull ProfileCardView itemView) {
      super(itemView);
      this.card = itemView;
    }

    void bind(Profile p) {
      card.bind(p);
    }
  }
}
