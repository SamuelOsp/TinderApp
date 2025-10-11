package io.ionic.starter;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import io.ionic.starter.widget.ChatsWidgetProvider;

@CapacitorPlugin(name = "WidgetUpdater")
public class WidgetUpdaterPlugin extends Plugin {

  @PluginMethod
  public void update(PluginCall call) {
    Context ctx = getContext();
    Intent intent = new Intent(ctx, ChatsWidgetProvider.class);
    intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
    int[] ids = AppWidgetManager.getInstance(ctx)
      .getAppWidgetIds(new ComponentName(ctx, ChatsWidgetProvider.class));
    intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
    ctx.sendBroadcast(intent);
    call.resolve();
  }
}
