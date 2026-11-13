/* ==========================================================
   v0.7 — Google ile giriş + bulut kayıt (Firebase, fk_users/{uid})
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, N=()=>window.FKAndroid, KEY="fk_state_v1";
Object.assign(FK_I18N.tr,{
  acc_signed:"Google hesabı", acc_guest:"Misafir · ilerleme sadece bu cihazda", acc_signin:"Google ile giriş yap", acc_signinS:"İlerlemen buluta yedeklensin, telefon değişse de kaybolmasın",
  acc_out:"Çıkış yap", acc_outQ:"Çıkış yapılsın mı? Bu cihazdaki ilerleme kalır.", acc_del:"Hesabı ve bulut verilerini sil", acc_delQ:"Google hesabınla ilişkili Futbol Kafası verilerin kalıcı olarak silinecek. Emin misin?",
  acc_deleted:"Hesap silindi", acc_relogin:"Güvenlik için tekrar giriş yapıp yeniden dene", acc_hi:"Hoş geldin {n}! İlerlemen artık bulutta ☁️", acc_err:"Giriş yapılamadı. İnternetini kontrol edip tekrar dene.",
  acc_synced:"Buluta kaydedildi ☁️", acc_syncNow:"Şimdi yedekle", acc_pick:"Hangi kayıt kalsın?", acc_cloudRec:"Buluttaki kayıt", acc_localRec:"Bu cihazdaki kayıt", acc_lvl:"Seviye {l} · {g} elmas",
  acc_restored:"Bulut kaydın yüklendi ☁️", acc_noapp:"Google girişi uygulamanın Play sürümünde çalışır", delete:"Sil"
});
Object.assign(FK_I18N.en,{
  acc_signed:"Google account", acc_guest:"Guest · progress only on this device", acc_signin:"Sign in with Google", acc_signinS:"Back up your progress to the cloud, keep it on any phone",
  acc_out:"Sign out", acc_outQ:"Sign out? Progress on this device stays.", acc_del:"Delete account and cloud data", acc_delQ:"Your Futbol Kafası data linked to this Google account will be permanently deleted. Are you sure?",
  acc_deleted:"Account deleted", acc_relogin:"For security, sign in again and retry", acc_hi:"Welcome {n}! Your progress is now in the cloud ☁️", acc_err:"Sign-in failed. Check your connection and try again.",
  acc_synced:"Saved to cloud ☁️", acc_syncNow:"Back up now", acc_pick:"Which save should we keep?", acc_cloudRec:"Cloud save", acc_localRec:"This device", acc_lvl:"Level {l} · {g} gems",
  acc_restored:"Cloud save restored ☁️", acc_noapp:"Google sign-in works in the Play app", delete:"Delete"
});
FK.user = () => { try{ const j=N()&&N().authUser&&N().authUser(); return j?JSON.parse(j):null; }catch(e){ return null; } };
let after=null, manual=false;
const meta = () => JSON.stringify({name:FK.state.profile.name||"", xp:FK.state.xp||0, level:FK.levelInfo().level});
FK.cloudPush = (show) => { const n=N(); if(!n||!n.cloudSave||!FK.user()) return; manual=!!show; try{ n.cloudSave(JSON.stringify(FK.state), meta()); }catch(e){} };

// otomatik yedek: kayıttan 20 sn sonra (toplu), uygulama arka plana geçince hemen
let tmr=null; const _save=FK.save;
FK.save = () => { _save(); if(!FK.user()) return; clearTimeout(tmr); tmr=setTimeout(()=>FK.cloudPush(false),20000); };
document.addEventListener("visibilitychange",()=>{ if(document.hidden && FK.user()){ clearTimeout(tmr); FK.cloudPush(false); } });

FK.signIn = cb => { const n=N(); if(!n||!n.signIn){ FK.toast(t("acc_noapp"),"info",3200); return; } after=cb||null; n.signIn(); };
const adopt = data => { try{ localStorage.setItem(KEY,data); }catch(e){} FK.toast(t("acc_restored"),"check"); setTimeout(()=>location.reload(),700); };
const mergeAfterLogin = () => { const n=N(); n.cloudLoad(); };

const _nat=window.fkNative;
window.fkNative = (ev,a,b) => {
  if(ev==="auth"){
    if(a==="1"){ let u={}; try{ u=JSON.parse(b); }catch(e){} FK.sfx("win");
      if(!FK.state.profile.name && u.name) FK.state.profile.name=(u.name.split(" ")[0]||"").replace(/[^A-Za-zÇĞİÖŞÜçğıöşü0-9_]/g,"").slice(0,16);
      FK.toast(t("acc_hi",{n:FK.esc((u.name||"").split(" ")[0]||"")}),"check",3000); mergeAfterLogin(); }
    else if(a==="0"){ if(b!=="cancel") FK.toast(t("acc_err"),"info",3500); }
    FK.render&&FK.render(); return;
  }
  if(ev==="cloud"){
    const n=N(), s=FK.state;
    if(a==="ok"){ let r=null; try{ r=JSON.parse(n.cloudData()); }catch(e){}
      if(!r){ FK.cloudPush(false); return; }
      const rl=FK.levelInfo(r.xp||0).level, ll=FK.levelInfo(s.xp||0).level;
      if(!s.onboarded || (s.xp||0)===0 || (r.xp||0)===(s.xp||0) && (r.gems||0)>=(s.gems||0)){ adopt(JSON.stringify(r)); return; }
      if((r.xp||0)===0){ FK.cloudPush(false); return; }
      FK.modal('<div class="center stack" style="gap:12px">'+(FK.kafa?'<div style="display:flex;justify-content:center">'+FK.kafa("bilge",90,"bob")+'</div>':'')+'<div class="h-display h2">'+t("acc_pick")+'</div>'+
        '<button class="btn btn-primary" data-r style="flex-direction:column;height:auto;padding:10px;gap:2px">☁️ '+t("acc_cloudRec")+'<span class="small" style="display:block;opacity:.85">'+t("acc_lvl",{l:rl,g:FK.fmtNum(r.gems||0)})+'</span></button>'+
        '<button class="btn btn-ghost" data-l style="flex-direction:column;height:auto;padding:10px;gap:2px">📱 '+t("acc_localRec")+'<span class="small muted" style="display:block">'+t("acc_lvl",{l:ll,g:FK.fmtNum(s.gems||0)})+'</span></button></div>', w=>{ w.dataset.lock=1;
        w.querySelector("[data-r]").onclick=()=>{ FK.closeModal(); adopt(JSON.stringify(r)); };
        w.querySelector("[data-l]").onclick=()=>{ FK.closeModal(); FK.cloudPush(true); }; });
      return; }
    if(a==="none"){ if(s.onboarded){ FK.cloudPush(false); if(after){ const f=after; after=null; f(); } } else { FK.go("setup",{step:0}); } return; }
    return;
  }
  if(ev==="saved"){ if(a==="1"&&manual){ manual=false; FK.toast(t("acc_synced"),"check"); } return; }
  if(ev==="del"){ if(a==="1"){ FK.toast(t("acc_deleted"),"check"); FK.render&&FK.render(); } else FK.toast(t("acc_relogin"),"info",4000); return; }
  if(_nat) _nat(ev,a,b);
};

/* profil ayarlarında hesap bölümü */
FK.accountRows = () => { const u=FK.user();
  if(!u) return '<button class="setting" data-signin>'+'<span style="width:20px;height:20px;border-radius:10px;border:2px solid #60A5FA;color:#60A5FA;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px">G</span>'+'<span class="grow">'+t("acc_signin")+'<span class="small muted" style="display:block;font-weight:500">'+t("acc_signinS")+'</span></span>'+FK.ic("right",18)+'</button>';
  return '<div class="setting">'+FK.ic("user",20)+'<span class="grow">'+t("acc_signed")+'<span class="small muted" style="display:block;font-weight:500">'+FK.esc(u.email||u.name||"")+'</span></span><span class="chip" style="background:rgba(34,197,94,.16);color:#86EFAC">☁️</span></div>'+
    '<button class="setting" data-sync>'+FK.ic("replay",20)+'<span class="grow">'+t("acc_syncNow")+'</span>'+FK.ic("right",18)+'</button>'+
    '<button class="setting" data-signout>'+FK.ic("left",20)+'<span class="grow">'+t("acc_out")+'</span></button>'+
    '<button class="setting" data-delacc style="color:#FCA5A5">'+FK.ic("trash",20)+'<span class="grow">'+t("acc_del")+'</span></button>'; };
FK.bindAccount = el => {
  const si=el.querySelector("[data-signin]"); if(si) si.onclick=()=>{ FK.sfx("tap"); FK.signIn(); };
  const sy=el.querySelector("[data-sync]"); if(sy) sy.onclick=()=>FK.cloudPush(true);
  const so=el.querySelector("[data-signout]"); if(so) so.onclick=()=>FK.confirm(t("acc_outQ"),t("acc_out"),()=>{ FK.cloudPush(false); setTimeout(()=>N().signOut(),600); });
  const dl=el.querySelector("[data-delacc]"); if(dl) dl.onclick=()=>FK.confirm(t("acc_delQ"),t("delete"),()=>N().deleteAccount(),true);
};
})();
