package com.eavisionlabs.futbolkafasi;

import android.content.SharedPreferences;
import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import java.util.Collections;
import java.util.List;

/** Tek ürün: "pro_lifetime" (tek seferlik, ömür boyu). */
class Billing {
    static final String PRO = "pro_lifetime";
    final MainActivity a;
    final SharedPreferences sp;
    final BillingClient client;
    volatile ProductDetails pd;
    volatile boolean ready;

    Billing(MainActivity a) {
        this.a = a;
        sp = a.getSharedPreferences("fk", 0);
        client = BillingClient.newBuilder(a)
            .setListener(this::onPurchases)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .enableAutoServiceReconnection()
            .build();
        connect();
    }

    boolean isPro() { return sp.getBoolean("pro", false); }
    /** Kullanıcının alabileceği en ucuz teklif (indirim varsa indirimli). */
    ProductDetails.OneTimePurchaseOfferDetails best() {
        ProductDetails d = pd; if (d == null) return null;
        ProductDetails.OneTimePurchaseOfferDetails b = null;
        List<ProductDetails.OneTimePurchaseOfferDetails> l = d.getOneTimePurchaseOfferDetailsList();
        if (l != null) for (ProductDetails.OneTimePurchaseOfferDetails o : l)
            if (b == null || o.getPriceAmountMicros() < b.getPriceAmountMicros()) b = o;
        return b != null ? b : d.getOneTimePurchaseOfferDetails();
    }
    String price() { ProductDetails.OneTimePurchaseOfferDetails b = best(); return b != null ? b.getFormattedPrice() : ""; }
    /** İndirimsiz (normal) fiyat: en pahalı satın alma teklifi. */
    String fullPrice() {
        ProductDetails d = pd; if (d == null) return "";
        ProductDetails.OneTimePurchaseOfferDetails m = d.getOneTimePurchaseOfferDetails();
        List<ProductDetails.OneTimePurchaseOfferDetails> l = d.getOneTimePurchaseOfferDetailsList();
        if (l != null) for (ProductDetails.OneTimePurchaseOfferDetails o : l)
            if (m == null || o.getPriceAmountMicros() > m.getPriceAmountMicros()) m = o;
        return m != null ? m.getFormattedPrice() : "";
    }

    void connect() {
        client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult r) {
                if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) { ready = true; loadProduct(); refresh(); }
            }
            @Override public void onBillingServiceDisconnected() { ready = false; }
        });
    }

    void loadProduct() {
        QueryProductDetailsParams p = QueryProductDetailsParams.newBuilder().setProductList(Collections.singletonList(
            QueryProductDetailsParams.Product.newBuilder().setProductId(PRO).setProductType(BillingClient.ProductType.INAPP).build())).build();
        client.queryProductDetailsAsync(p, (r, res) -> {
            List<ProductDetails> l = res.getProductDetailsList();
            if (l != null && !l.isEmpty()) pd = l.get(0);
        });
    }

    void buy() {
        ProductDetails d = pd;
        if (!ready || d == null) { a.js("proErr", null, null); if (ready) loadProduct(); return; }
        BillingFlowParams.ProductDetailsParams.Builder pb = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(d);
        ProductDetails.OneTimePurchaseOfferDetails b = best();
        if (b != null && b.getOfferToken() != null) pb.setOfferToken(b.getOfferToken());
        BillingFlowParams f = BillingFlowParams.newBuilder().setProductDetailsParamsList(Collections.singletonList(pb.build())).build();
        client.launchBillingFlow(a, f);
    }

    void refresh() {
        if (!ready) return;
        client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
            (r, list) -> { if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) handle(list, false); });
    }

    void onPurchases(BillingResult r, List<Purchase> list) {
        if (r.getResponseCode() == BillingClient.BillingResponseCode.OK && list != null) handle(list, true);
        else if (r.getResponseCode() == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) refresh();
    }

    void handle(List<Purchase> list, boolean fresh) {
        boolean owned = false;
        for (Purchase p : list) {
            if (!p.getProducts().contains(PRO)) continue;
            if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                owned = true;
                if (!p.isAcknowledged()) client.acknowledgePurchase(
                    AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build(), x -> {});
            }
        }
        boolean was = isPro();
        if (owned != was && (owned || !fresh)) {
            sp.edit().putBoolean("pro", owned).apply();
            a.js("pro", owned ? "1" : "0", null);
        }
    }

    void end() { try { client.endConnection(); } catch (Exception ignored) {} }
}
