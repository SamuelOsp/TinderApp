package io.ionic.starter.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import io.ionic.starter.R;

public class ChatsWidgetProvider extends AppWidgetProvider {

  private static final String PREF_FILE = "CapacitorStorage"; 
  private static final String KEY = "widget_convos";
  private static final String ACTION_REFRESH = "io.ionic.starter.widget.ACTION_REFRESH";

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    for (int appWidgetId : appWidgetIds) {
      updateAppWidget(context, appWidgetManager, appWidgetId);
    }
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    super.onReceive(context, intent);
    String action = intent.getAction();
    if (ACTION_REFRESH.equals(action) || AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(action)) {
      AppWidgetManager mgr = AppWidgetManager.getInstance(context);
      ComponentName cn = new ComponentName(context, ChatsWidgetProvider.class);
      int[] ids = mgr.getAppWidgetIds(cn);
      for (int id : ids) updateAppWidget(context, mgr, id);
    }
  }

  private void updateAppWidget(Context context, AppWidgetManager mgr, int appWidgetId) {
    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_chats);

    SharedPreferences prefs = context.getSharedPreferences(PREF_FILE, Context.MODE_PRIVATE);
    String json = prefs.getString(KEY, "[]");

    String l1 = "—", l2 = "", l3 = "";
    try {
      JSONArray arr = new JSONArray(json);
      if (arr.length() > 0) {
        JSONObject a = arr.getJSONObject(0);
        l1 = a.optString("name","") + " — " + a.optString("last","");
      }
      if (arr.length() > 1) {
        JSONObject b = arr.getJSONObject(1);
        l2 = b.optString("name","") + " — " + b.optString("last","");
      }
      if (arr.length() > 2) {
        JSONObject c = arr.getJSONObject(2);
        l3 = c.optString("name","") + " — " + c.optString("last","");
      }
    } catch (Exception ignore) {}

    views.setTextViewText(R.id.line1, l1);
    views.setTextViewText(R.id.line2, l2);
    views.setTextViewText(R.id.line3, l3);

    Intent open = new Intent(Intent.ACTION_VIEW, Uri.parse("tinderapp://open/chats"));
    PendingIntent pOpen = PendingIntent.getActivity(
      context, 100, open,
      PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
    );
    views.setOnClickPendingIntent(R.id.title, pOpen);
    views.setOnClickPendingIntent(R.id.line1, pOpen);
    views.setOnClickPendingIntent(R.id.line2, pOpen);
    views.setOnClickPendingIntent(R.id.line3, pOpen);

    Intent refresh = new Intent(context, ChatsWidgetProvider.class);
    refresh.setAction(ACTION_REFRESH);
    PendingIntent pRefresh = PendingIntent.getBroadcast(
      context, 200, refresh, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
    );
    views.setOnClickPendingIntent(R.id.refresh, pRefresh);

    mgr.updateAppWidget(appWidgetId, views);
  }
}
