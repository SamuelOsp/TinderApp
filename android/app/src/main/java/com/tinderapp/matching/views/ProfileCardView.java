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
    String displayName = ((p.name != null ? p.name : "").trim() + " " +
      (p.lastName != null ? p.lastName : "").trim()).trim();
    title.setText(displayName.isEmpty() ? "—" : displayName);
    meta.setText(p.city != null ? p.city : "");

    String url = (p.photos != null && !p.photos.isEmpty()) ? p.photos.get(0) : null;
    if (url == null || url.trim().isEmpty()) {
      img.setImageResource(R.mipmap.ic_launcher);
      return;
    }

    if (url.startsWith("gs://")) {
      // Resolver gs:// con Firebase Storage
      com.google.firebase.storage.FirebaseStorage.getInstance()
        .getReferenceFromUrl(url)
        .getDownloadUrl()
        .addOnSuccessListener(u ->
          com.bumptech.glide.Glide.with(getContext())
            .load(u)
            .centerCrop()
            .placeholder(R.mipmap.ic_launcher)
            .error(R.mipmap.ic_launcher)
            .into(img)
        )
        .addOnFailureListener(e -> img.setImageResource(R.mipmap.ic_launcher));
    } else {
      com.bumptech.glide.Glide.with(getContext())
        .load(url) // http(s), file://, content://
        .centerCrop()
        .placeholder(R.mipmap.ic_launcher)
        .error(R.mipmap.ic_launcher)
        .into(img);
    }
  }

}

