package com.eavisionlabs.futbolkafasi;

import android.os.CancellationSignal;
import androidx.credentials.ClearCredentialStateRequest;
import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.ClearCredentialException;
import androidx.credentials.exceptions.GetCredentialCancellationException;
import androidx.credentials.exceptions.GetCredentialException;
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/** Google ile giriş (Credential Manager) + Firestore bulut kayıt: fk_users/{uid} */
class Cloud {
    static final String WEB_CLIENT = "437362291475-l2plioqbn63plaf8io4o4teu93bbeq3k.apps.googleusercontent.com";
    final MainActivity a;
    final FirebaseAuth auth = FirebaseAuth.getInstance();
    final Executor ex = Executors.newSingleThreadExecutor();
    volatile String loaded;

    Cloud(MainActivity a) { this.a = a; }

    String userJson() {
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) return "";
        try {
            JSONObject o = new JSONObject();
            o.put("uid", u.getUid());
            o.put("name", u.getDisplayName() == null ? "" : u.getDisplayName());
            o.put("email", u.getEmail() == null ? "" : u.getEmail());
            return o.toString();
        } catch (Exception e) { return ""; }
    }

    void signIn() {
        GetSignInWithGoogleOption opt = new GetSignInWithGoogleOption.Builder(WEB_CLIENT).build();
        GetCredentialRequest req = new GetCredentialRequest.Builder().addCredentialOption(opt).build();
        CredentialManager.create(a).getCredentialAsync(a, req, new CancellationSignal(), ex,
            new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                @Override public void onResult(GetCredentialResponse r) {
                    Credential c = r.getCredential();
                    if (c instanceof CustomCredential && GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(c.getType())) {
                        try {
                            String token = GoogleIdTokenCredential.createFrom(((CustomCredential) c).getData()).getIdToken();
                            AuthCredential fc = GoogleAuthProvider.getCredential(token, null);
                            auth.signInWithCredential(fc).addOnCompleteListener(t -> {
                                if (t.isSuccessful()) a.js("auth", "1", userJson());
                                else a.js("auth", "0", "firebase");
                            });
                        } catch (Exception e) { a.js("auth", "0", "token"); }
                    } else a.js("auth", "0", "type");
                }
                @Override public void onError(GetCredentialException e) {
                    a.js("auth", "0", e instanceof GetCredentialCancellationException ? "cancel" : e.getClass().getSimpleName());
                }
            });
    }

    void signOut() {
        auth.signOut();
        CredentialManager.create(a).clearCredentialStateAsync(new ClearCredentialStateRequest(), new CancellationSignal(), ex,
            new CredentialManagerCallback<Void, ClearCredentialException>() {
                @Override public void onResult(Void v) {}
                @Override public void onError(ClearCredentialException e) {}
            });
        a.js("auth", "out", "");
    }

    void save(String data, String meta) {
        FirebaseUser u = auth.getCurrentUser(); if (u == null) return;
        Map<String, Object> m = new HashMap<>();
        m.put("save", data);
        m.put("updated", FieldValue.serverTimestamp());
        try { JSONObject o = new JSONObject(meta); m.put("name", o.optString("name")); m.put("xp", o.optLong("xp")); m.put("level", o.optLong("level")); } catch (Exception ignored) {}
        FirebaseFirestore.getInstance().collection("fk_users").document(u.getUid()).set(m, SetOptions.merge())
            .addOnCompleteListener(t -> a.js("saved", t.isSuccessful() ? "1" : "0", ""));
    }

    void load() {
        FirebaseUser u = auth.getCurrentUser(); if (u == null) { a.js("cloud", "none", ""); return; }
        FirebaseFirestore.getInstance().collection("fk_users").document(u.getUid()).get().addOnCompleteListener(t -> {
            if (!t.isSuccessful()) { a.js("cloud", "err", ""); return; }
            DocumentSnapshot d = t.getResult();
            String s = d != null && d.exists() ? d.getString("save") : null;
            loaded = s;
            a.js("cloud", s == null ? "none" : "ok", "");
        });
    }

    // ---- Düello: fk_duels/{code} ----
    static Object conv(Object v) throws Exception {
        if (v == null || v == JSONObject.NULL) return null;
        if (v instanceof JSONObject) { JSONObject o = (JSONObject) v; Map<String, Object> m = new HashMap<>(); java.util.Iterator<String> it = o.keys(); while (it.hasNext()) { String k = it.next(); m.put(k, conv(o.get(k))); } return m; }
        if (v instanceof Integer) return ((Integer) v).longValue();
        return v;
    }
    static JSONObject toJson(Map<String, Object> m) throws Exception {
        JSONObject o = new JSONObject();
        for (Map.Entry<String, Object> e : m.entrySet()) {
            Object v = e.getValue();
            if (v instanceof Map) { @SuppressWarnings("unchecked") Map<String, Object> mm = (Map<String, Object>) v; o.put(e.getKey(), toJson(mm)); }
            else if (v == null) o.put(e.getKey(), JSONObject.NULL);
            else if (v instanceof String || v instanceof Number || v instanceof Boolean) o.put(e.getKey(), v);
        }
        return o;
    }
    void duelGet(final String code) {
        if (auth.getCurrentUser() == null || code == null || !code.matches("^[A-Z0-9]{6}$")) { a.js("duel", code, "!"); return; }
        FirebaseFirestore.getInstance().collection("fk_duels").document(code).get().addOnCompleteListener(t -> {
            if (!t.isSuccessful()) { a.js("duel", code, "!"); return; }
            DocumentSnapshot d = t.getResult();
            if (d == null || !d.exists() || d.getData() == null) { a.js("duel", code, ""); return; }
            try { a.js("duel", code, toJson(d.getData()).toString()); } catch (Exception e) { a.js("duel", code, "!"); }
        });
    }
    void duelSet(final String code, String json) {
        if (auth.getCurrentUser() == null || code == null || !code.matches("^[A-Z0-9]{6}$")) { a.js("duelSet", code, "0"); return; }
        try {
            @SuppressWarnings("unchecked") Map<String, Object> m = (Map<String, Object>) conv(new JSONObject(json));
            FirebaseFirestore.getInstance().collection("fk_duels").document(code).set(m, SetOptions.merge())
                .addOnCompleteListener(t -> a.js("duelSet", code, t.isSuccessful() ? "1" : "0"));
        } catch (Exception e) { a.js("duelSet", code, "0"); }
    }

    // ---- Online maç: fk_queue/{uid}, fk_live/{room}, fk_ghosts/{id} ----
    ListenerRegistration qReg, rReg;
    FirebaseFirestore db() { return FirebaseFirestore.getInstance(); }
    String uid() { FirebaseUser u = auth.getCurrentUser(); return u == null ? null : u.getUid(); }

    void liveQueue(String json) {
        final String me = uid(); if (me == null) { a.js("lq", "err", "auth"); return; }
        try {
            @SuppressWarnings("unchecked") Map<String, Object> m = (Map<String, Object>) conv(new JSONObject(json));
            m.put("uid", me); m.put("open", true); m.put("room", null);
            liveStopQueue();
            db().collection("fk_queue").document(me).set(m).addOnCompleteListener(t -> {
                if (!t.isSuccessful()) { a.js("lq", "err", "set"); return; }
                a.js("lq", "in", "");
                qReg = db().collection("fk_queue").document(me).addSnapshotListener((d, e) -> {
                    if (d == null || !d.exists()) return;
                    String r = d.getString("room");
                    if (r != null && !r.isEmpty()) a.js("lq", "room", r);
                });
            });
        } catch (Exception e) { a.js("lq", "err", "json"); }
    }
    void liveList() {
        if (uid() == null) return;
        db().collection("fk_queue").whereEqualTo("open", true).limit(20).get().addOnCompleteListener(t -> {
            if (!t.isSuccessful() || t.getResult() == null) { a.js("lq", "list", "[]"); return; }
            JSONArray arr = new JSONArray();
            for (QueryDocumentSnapshot d : t.getResult()) { try { arr.put(toJson(d.getData())); } catch (Exception ignored) {} }
            a.js("lq", "list", arr.toString());
        });
    }
    void liveClaim(final String opp, final String room, String roomJson) {
        final String me = uid(); if (me == null || opp == null || room == null || !room.matches("^[A-Za-z0-9]{6,24}$")) { a.js("lq", "claim", ""); return; }
        try {
            @SuppressWarnings("unchecked") final Map<String, Object> rm = (Map<String, Object>) conv(new JSONObject(roomJson));
            final com.google.firebase.firestore.DocumentReference od = db().collection("fk_queue").document(opp), md = db().collection("fk_queue").document(me), rd = db().collection("fk_live").document(room);
            db().runTransaction(tr -> {
                DocumentSnapshot o = tr.get(od), mm = tr.get(md);
                if (!o.exists() || !Boolean.TRUE.equals(o.getBoolean("open")) || o.getString("room") != null) return false;
                if (!mm.exists() || !Boolean.TRUE.equals(mm.getBoolean("open"))) return false;
                Map<String, Object> up = new HashMap<>(); up.put("open", false); up.put("room", room);
                tr.set(rd, rm);
                tr.update(od, up);
                tr.update(md, up);
                return true;
            }).addOnCompleteListener(t -> a.js("lq", "claim", t.isSuccessful() && Boolean.TRUE.equals(t.getResult()) ? room : ""));
        } catch (Exception e) { a.js("lq", "claim", ""); }
    }
    void liveStopQueue() { if (qReg != null) { qReg.remove(); qReg = null; } }
    void liveCancel() {
        liveStopQueue();
        String me = uid(); if (me != null) db().collection("fk_queue").document(me).delete();
    }
    void liveWatch(final String room) {
        liveStop();
        if (uid() == null || room == null) return;
        rReg = db().collection("fk_live").document(room).addSnapshotListener((d, e) -> {
            if (e != null) { a.js("lr", room, "!"); return; }
            if (d == null || !d.exists() || d.getData() == null) { a.js("lr", room, ""); return; }
            try { a.js("lr", room, toJson(d.getData()).toString()); } catch (Exception ex) { a.js("lr", room, "!"); }
        });
    }
    void liveStop() { if (rReg != null) { rReg.remove(); rReg = null; } }
    void livePut(String room, String json) {
        if (uid() == null || room == null) return;
        try {
            @SuppressWarnings("unchecked") Map<String, Object> m = (Map<String, Object>) conv(new JSONObject(json));
            db().collection("fk_live").document(room).set(m, SetOptions.merge());
        } catch (Exception ignored) {}
    }
    void ghostPut(String json) {
        String me = uid(); if (me == null) return;
        try {
            @SuppressWarnings("unchecked") Map<String, Object> m = (Map<String, Object>) conv(new JSONObject(json));
            m.put("uid", me);
            db().collection("fk_ghosts").add(m);
        } catch (Exception ignored) {}
    }
    void ghostList() {
        if (uid() == null) { a.js("gh", "list", "[]"); return; }
        db().collection("fk_ghosts").orderBy("at", Query.Direction.DESCENDING).limit(40).get().addOnCompleteListener(t -> {
            JSONArray arr = new JSONArray();
            if (t.isSuccessful() && t.getResult() != null) for (QueryDocumentSnapshot d : t.getResult()) { try { arr.put(toJson(d.getData())); } catch (Exception ignored) {} }
            a.js("gh", "list", arr.toString());
        });
    }

    void deleteAccount() {
        FirebaseUser u = auth.getCurrentUser(); if (u == null) { a.js("del", "0", "nouser"); return; }
        FirebaseFirestore.getInstance().collection("fk_users").document(u.getUid()).delete().addOnCompleteListener(t1 ->
            u.delete().addOnCompleteListener(t2 -> {
                if (t2.isSuccessful()) { signOut(); a.js("del", "1", ""); }
                else a.js("del", "0", "relogin");
            }));
    }
}
