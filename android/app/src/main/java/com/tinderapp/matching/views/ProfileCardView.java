package com.tinderapp.matching.views;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import com.bumptech.glide.Glide;
import com.tinderapp.models.Profile;
import io.ionic.starter.R;

public class ProfileCardView extends FrameLayout {
  private ImageView img;
  private TextView title, meta;

  public ProfileCardView(Context c) { super(c); init(); }
  public ProfileCardView(Context c, AttributeSet a) { super(c, a); init(); }

  private void init() {
    inflate(getContext(), R.layout.item_profile_card, this);
    img = findViewById(R.id.cardImage);
    title = findViewById(R.id.cardTitle);
    meta = findViewById(R.id.cardMeta);
  }

  public void bind(Profile p) {
    String url = (p.photos != null && !p.photos.isEmpty()) ? p.photos.get(0) : "";
    Glide.with(getContext()).load(url).into(img);
    title.setText((p.name != null ? p.name : "") + " " + (p.lastName != null ? p.lastName : ""));
    meta.setText(p.city != null ? p.city : "");
  }
}

