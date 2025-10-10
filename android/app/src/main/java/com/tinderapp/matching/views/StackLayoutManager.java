package com.tinderapp.matching.views;

import android.view.View;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class StackLayoutManager extends RecyclerView.LayoutManager {
  private static final int MAX_SHOW = 4;
  private static final int OFFSET_Y = 24;
  private static final float SCALE_STEP = 0.05f;

  @Override public RecyclerView.LayoutParams generateDefaultLayoutParams() {
    return new RecyclerView.LayoutParams(
      RecyclerView.LayoutParams.MATCH_PARENT,
      RecyclerView.LayoutParams.WRAP_CONTENT
    );
  }

  @Override public boolean canScrollVertically() { return false; }

  @Override
  public void onLayoutChildren(@NonNull RecyclerView.Recycler recycler,
                               @NonNull RecyclerView.State state) {
    detachAndScrapAttachedViews(recycler);
    int count = Math.min(getItemCount(), MAX_SHOW);
    int start = Math.max(0, getItemCount() - count);

    for (int i = start; i < getItemCount(); i++) {
      View v = recycler.getViewForPosition(i);
      addView(v);
      measureChildWithMargins(v, 0, 0);

      int w = getWidth();
      int h = getHeight();
      int vw = getDecoratedMeasuredWidth(v);
      int vh = getDecoratedMeasuredHeight(v);

      int left = (w - vw) / 2;
      int top  = (h - vh) / 2 + (i - start) * OFFSET_Y;

      layoutDecorated(v, left, top, left + vw, top + vh);

      float scale = 1f - (i - start) * SCALE_STEP;
      v.setScaleX(scale);
      v.setScaleY(scale);
      v.setTranslationY((i - start) * OFFSET_Y);
      v.setTranslationZ(i - start);
    }
  }
}

