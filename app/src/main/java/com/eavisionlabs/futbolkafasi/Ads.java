package com.eavisionlabs.futbolkafasi;

import android.os.Handler;
import android.os.Looper;
import androidx.annotation.NonNull;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.atomic.AtomicBoolean;

/** UMP onayı -> AdMob başlat -> geçiş + ödüllü reklamları önceden yükle. Reklam ID'leri uzaktaki config.json'dan gelir. */
class Ads {
    // Google'ın resmi TEST reklam birimleri (gerçek ID'ler config.json ile verilir)
    static final String TEST_INT = "ca-app-pub-3940256099942544/1033173712";
    static final String TEST_REW = "ca-app-pub-3940256099942544/5224354917";
    static final String CONFIG = "https://eakdemir3-prog.github.io/fitnex-legal/futbol-kafasi/config.json";

    final MainActivity a;
    final Handler h = new Handler(Looper.getMainLooper());
    ConsentInformation consent;
    final AtomicBoolean inited = new AtomicBoolean(false);
    volatile boolean enabled = true;
    String intId = TEST_INT, rewId = TEST_REW;
    InterstitialAd inter; RewardedAd rew;
    boolean loadingInt, loadingRew;

    Ads(MainActivity a) { this.a = a; }

    void start() {
        new Thread(this::fetchConfig).start();
        consent = UserMessagingPlatform.getConsentInformation(a);
        ConsentRequestParameters p = new ConsentRequestParameters.Builder().build();
        consent.requestConsentInfoUpdate(a, p,
            () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(a, err -> initIfAllowed()),
            err -> initIfAllowed());
        initIfAllowed(); // önceki oturumdan izin varsa hemen başla
    }

    void fetchConfig() {
        try {
            HttpURLConnection c = (HttpURLConnection) new URL(CONFIG + "?t=" + System.currentTimeMillis()).openConnection();
            c.setConnectTimeout(6000); c.setReadTimeout(6000);
            BufferedReader r = new BufferedReader(new InputStreamReader(c.getInputStream()));
            StringBuilder sb = new StringBuilder(); String l; while ((l = r.readLine()) != null) sb.append(l); r.close();
            JSONObject o = new JSONObject(sb.toString());
            enabled = o.optBoolean("ads", true);
            if (!o.optBoolean("test", true)) {
                String i = o.optString("int", ""), w = o.optString("rew", "");
                if (i.startsWith("ca-app-pub-")) intId = i;
                if (w.startsWith("ca-app-pub-")) rewId = w;
            }
        } catch (Exception ignored) {}
        h.post(() -> { if (inited.get()) { inter = null; rew = null; loadInter(); loadRewarded(); } });
    }

    void initIfAllowed() {
        if (consent == null || !consent.canRequestAds()) return;
        if (inited.getAndSet(true)) return;
        new Thread(() -> MobileAds.initialize(a, st -> h.post(() -> { loadInter(); loadRewarded(); }))).start();
    }

    boolean interReady() { return enabled && inter != null; }
    boolean rewardedReady() { return rew != null; }

    void loadInter() {
        if (!inited.get() || loadingInt || inter != null || !enabled) return;
        loadingInt = true;
        InterstitialAd.load(a, intId, new AdRequest.Builder().build(), new InterstitialAdLoadCallback() {
            @Override public void onAdLoaded(@NonNull InterstitialAd ad) { inter = ad; loadingInt = false; }
            @Override public void onAdFailedToLoad(@NonNull LoadAdError e) { loadingInt = false; h.postDelayed(Ads.this::loadInter, 30000); }
        });
    }

    void loadRewarded() {
        if (!inited.get() || loadingRew || rew != null) return;
        loadingRew = true;
        RewardedAd.load(a, rewId, new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
            @Override public void onAdLoaded(@NonNull RewardedAd ad) { rew = ad; loadingRew = false; }
            @Override public void onAdFailedToLoad(@NonNull LoadAdError e) { loadingRew = false; h.postDelayed(Ads.this::loadRewarded, 30000); }
        });
    }

    void showInter() {
        InterstitialAd ad = inter; if (ad == null) return; inter = null;
        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override public void onAdDismissedFullScreenContent() { loadInter(); }
            @Override public void onAdFailedToShowFullScreenContent(@NonNull AdError e) { loadInter(); }
        });
        ad.show(a);
    }

    void showRewarded(final String tag) {
        RewardedAd ad = rew; if (ad == null) { a.js("rewarded", "0", tag); return; } rew = null;
        final boolean[] earned = {false};
        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override public void onAdDismissedFullScreenContent() { a.js("rewarded", earned[0] ? "1" : "0", tag); loadRewarded(); }
            @Override public void onAdFailedToShowFullScreenContent(@NonNull AdError e) { a.js("rewarded", "0", tag); loadRewarded(); }
        });
        ad.show(a, item -> earned[0] = true);
    }

    boolean privacyRequired() {
        return consent != null && consent.getPrivacyOptionsRequirementStatus() == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED;
    }
    void privacyOptions() { UserMessagingPlatform.showPrivacyOptionsForm(a, err -> {}); }
}
