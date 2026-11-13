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

    void deleteAccount() {
        FirebaseUser u = auth.getCurrentUser(); if (u == null) { a.js("del", "0", "nouser"); return; }
        FirebaseFirestore.getInstance().collection("fk_users").document(u.getUid()).delete().addOnCompleteListener(t1 ->
            u.delete().addOnCompleteListener(t2 -> {
                if (t2.isSuccessful()) { signOut(); a.js("del", "1", ""); }
                else a.js("del", "0", "relogin");
            }));
    }
}
