package com.eavisionlabs.futbolkafasi;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.widget.FrameLayout;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.window.OnBackInvokedDispatcher;

public class MainActivity extends Activity {
    WebView web;
    FrameLayout root;
    Ads ads;
    Billing billing;
    Cloud cloud;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#0B1426"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                String u = r.getUrl().toString();
                if (u.startsWith("file:")) return false;
                openExternal(u); return true;
            }
        });
        web.addJavascriptInterface(new Bridge(), "FKAndroid");
        // Android 15+ uygulamayı kenardan kenara çizer: durum ve gezinme çubuğu kadar boşluk bırak
        root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#0B1426"));
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        root.setOnApplyWindowInsetsListener((v, in) -> {
            int top, bottom, left, right;
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets sb = in.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                android.graphics.Insets ime = in.getInsets(WindowInsets.Type.ime());
                top = sb.top; left = sb.left; right = sb.right; bottom = Math.max(sb.bottom, ime.bottom);
            } else {
                top = in.getSystemWindowInsetTop(); bottom = in.getSystemWindowInsetBottom();
                left = in.getSystemWindowInsetLeft(); right = in.getSystemWindowInsetRight();
            }
            v.setPadding(left, top, right, bottom);
            return in;
        });
        setContentView(root);
        web.loadUrl("file:///android_asset/www/index.html");

        billing = new Billing(this);
        cloud = new Cloud(this);
        ads = new Ads(this);
        ads.start();

        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
    }

    void handleBack() {
        web.evaluateJavascript("(function(){if(window.fkBack){window.fkBack();}else if(window.FKAndroid){FKAndroid.exit();}})()", null);
    }

    @SuppressWarnings("deprecation")
    @Override public void onBackPressed() { handleBack(); }

    @Override protected void onResume() { super.onResume(); web.onResume(); if (billing != null) billing.refresh(); }
    @Override protected void onPause() { web.onPause(); super.onPause(); }
    @Override protected void onDestroy() { if (billing != null) billing.end(); web.destroy(); super.onDestroy(); }

    /** JS'e olay gönder: fkNative(ev,a,b) */
    void js(final String ev, final String a, final String b) {
        runOnUiThread(() -> web.evaluateJavascript(
            "window.fkNative&&window.fkNative(" + org.json.JSONObject.quote(ev) + "," + org.json.JSONObject.quote(a == null ? "" : a) + "," + org.json.JSONObject.quote(b == null ? "" : b) + ")", null));
    }

    void openExternal(String u) {
        try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(u))); } catch (Exception ignored) {}
    }

    @SuppressWarnings("deprecation")
    void applyBars(boolean dark) {
        Window w = getWindow();
        int c = Color.parseColor(dark ? "#0B1426" : "#F1F5F9");
        w.setStatusBarColor(c); w.setNavigationBarColor(c);
        web.setBackgroundColor(c);
        if (root != null) root.setBackgroundColor(c);
        View d = w.getDecorView();
        int f = d.getSystemUiVisibility();
        if (dark) f &= ~(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        else f |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        d.setSystemUiVisibility(f);
    }

    class Bridge {
        @JavascriptInterface public void exit() { runOnUiThread(() -> finish()); }
        @JavascriptInterface public void share(String text) {
            runOnUiThread(() -> {
                Intent i = new Intent(Intent.ACTION_SEND); i.setType("text/plain"); i.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(i, "Futbol Kafası"));
            });
        }
        @JavascriptInterface public boolean isPro() { return billing.isPro(); }
        @JavascriptInterface public String proPrice() { return billing.price(); }
        @JavascriptInterface public String proFull() { return billing.fullPrice(); }
        @JavascriptInterface public void buyPro() { runOnUiThread(() -> billing.buy()); }
        @JavascriptInterface public void restore() { billing.refresh(); }
        @JavascriptInterface public boolean showInter() {
            if (billing.isPro() || !ads.interReady()) return false;
            runOnUiThread(() -> ads.showInter()); return true;
        }
        @JavascriptInterface public boolean showRewarded(final String tag) {
            if (!ads.rewardedReady()) { ads.loadRewarded(); return false; }
            runOnUiThread(() -> ads.showRewarded(tag)); return true;
        }
        @JavascriptInterface public boolean privacyRequired() { return ads.privacyRequired(); }
        @JavascriptInterface public void privacyOptions() { runOnUiThread(() -> ads.privacyOptions()); }
        @JavascriptInterface public void setDark(final boolean dark) { runOnUiThread(() -> applyBars(dark)); }
        @JavascriptInterface public void openUrl(final String u) { runOnUiThread(() -> openExternal(u)); }
        // ---- Google girişi + bulut kayıt ----
        @JavascriptInterface public void signIn() { runOnUiThread(() -> cloud.signIn()); }
        @JavascriptInterface public void signOut() { runOnUiThread(() -> cloud.signOut()); }
        @JavascriptInterface public String authUser() { return cloud.userJson(); }
        @JavascriptInterface public void cloudSave(String data, String meta) { cloud.save(data, meta); }
        @JavascriptInterface public void cloudLoad() { cloud.load(); }
        @JavascriptInterface public String cloudData() { return cloud.loaded == null ? "" : cloud.loaded; }
        @JavascriptInterface public void deleteAccount() { runOnUiThread(() -> cloud.deleteAccount()); }
    }
}
