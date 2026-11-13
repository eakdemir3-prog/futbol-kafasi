/* ==========================================================
   v0.5 — Reklamlar (geçiş + ödüllü), PRO (ömür boyu), açık tema
   Android tarafı: window.FKAndroid köprüsü. Tarayıcıda test reklamı simüle edilir.
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, N=()=>window.FKAndroid;

Object.assign(FK_I18N.tr,{
  pro:"PRO", proT:"FUTBOL KAFASI PRO", proS:"Tek seferlik ödeme · Ömür boyu",
  proB1:"Reklamsız oyun", proB2:"Ödüller reklamsız 2 kat", proB3:"Her gün +50 elmas", proB4:"5 seri dondurma taşı", proB5:"Altın PRO rozeti",
  proBuy:"PRO'ya geç · {p}", proSale:"İNDİRİM", proSaleS:"Sınırlı süre · tek seferlik, ömür boyu", proOwned:"PRO aktif — teşekkürler! 👑", proRestore:"Satın alımı geri yükle", proThanks:"PRO aktif! Reklamlar kapandı 👑",
  proCard:"Reklamları kaldır · Ödülleri 2 kat al", proUnavailable:"Satın alma şu an kullanılamıyor. İnternet bağlantını ve Google Play'i kontrol et.",
  dbl:"Reklam izle · Ödülü 2 kat al", dblPro:"PRO: Ödülü 2 kat al", dblDone:"2 kat ödül alındı ✓", adNotReady:"Reklam hazır değil, biraz sonra tekrar dene",
  adTest:"TEST REKLAMI", adTestS:"Gerçek reklamlar yayında gösterilecek",
  freeGem:"Reklam izle · +20 elmas", freeGemLeft:"Bugün {n} hak kaldı", freeGemNone:"Bugünlük hakkın bitti",
  freezeAd:"Reklam izle · +1 dondurma", secondChance:"Reklam izle · Devam et", proDaily:"PRO günlük ödülü: +50 elmas 👑",
  theme:"Tema", thDark:"Koyu", thLight:"Açık", thSys:"Sistem", privacyOpt:"Reklam gizlilik seçenekleri"
});
Object.assign(FK_I18N.en,{
  pro:"PRO", proT:"FUTBOL KAFASI PRO", proS:"One-time payment · Lifetime",
  proB1:"No ads", proB2:"2× rewards without ads", proB3:"+50 gems every day", proB4:"Hold 5 streak freezes", proB5:"Gold PRO badge",
  proBuy:"Go PRO · {p}", proSale:"OFF", proSaleS:"Limited time · one-time, lifetime", proOwned:"PRO active — thank you! 👑", proRestore:"Restore purchase", proThanks:"PRO active! Ads removed 👑",
  proCard:"Remove ads · Double your rewards", proUnavailable:"Purchases are unavailable right now. Check your connection and Google Play.",
  dbl:"Watch an ad · Double reward", dblPro:"PRO: Double reward", dblDone:"Double reward claimed ✓", adNotReady:"Ad not ready yet, try again shortly",
  adTest:"TEST AD", adTestS:"Real ads will be shown in the live app",
  freeGem:"Watch an ad · +20 gems", freeGemLeft:"{n} left today", freeGemNone:"No more today",
  freezeAd:"Watch an ad · +1 freeze", secondChance:"Watch an ad · Continue", proDaily:"PRO daily reward: +50 gems 👑",
  theme:"Theme", thDark:"Dark", thLight:"Light", thSys:"System", privacyOpt:"Ad privacy options"
});

/* ---------------- PRO ---------------- */
FK.isPro = () => { const s=FK.state; try{ if(N() && N().isPro && N().isPro()) s.pro=true; }catch(e){} return !!s.pro; };
FK.freezeCap = () => FK.isPro()?5:2;
const _roll=FK.rollover; FK.rollover=()=>{ _roll(); const s=FK.state, d=FK.dayKey();
  if(FK.isPro() && s.proDay!==d){ s.proDay=d; s.gems+=50; FK.save(); setTimeout(()=>FK.toast(t("proDaily"),"gem",3200),900); } };

/* ---------------- Android'den gelen olaylar ---------------- */
let rwCb=null;
window.fkNative = (ev,a,b) => {
  if(ev==="rewarded"){ const cb=rwCb; rwCb=null; if(cb) cb(a==="1"||a===true); }
  if(ev==="pro"){ FK.state.pro=(a==="1"||a===true); FK.save(); if(FK.state.pro){ FK.toast(t("proThanks"),"star",3500); FK.confetti&&FK.confetti(document.body); } FK.render&&FK.render(); }
  if(ev==="proErr"){ FK.toast(t("proUnavailable"),"info",3600); }
};

/* ---------------- ödüllü reklam ---------------- */
FK.rewarded = (tag,cb) => {
  if(FK.isPro() && tag==="double"){ cb(true); return; }
  const n=N();
  if(n && n.showRewarded){ rwCb=cb; let ok=false; try{ ok=n.showRewarded(tag); }catch(e){} if(!ok){ rwCb=null; FK.toast(t("adNotReady"),"info"); } return; }
  // tarayıcı/test: sahte reklam
  FK.modal('<div class="center stack" style="gap:10px"><div class="chip" style="align-self:center;background:#FACC15;color:#422006">'+t("adTest")+'</div><div class="h-display h2">🎬</div><div class="small muted">'+t("adTestS")+'</div><div class="tbar"><i data-ap style="width:0%"></i></div></div>',w=>{ w.dataset.lock=1; const bar=w.querySelector("[data-ap]"); let p=0; const iv=setInterval(()=>{ p+=10; bar.style.width=p+"%"; if(p>=100){ clearInterval(iv); FK.closeModal(); cb(true); } },120); });
};

/* ---------------- 2 kat ödül butonu ---------------- */
let lastRes=null;
FK.doubleBtn = res => { if(!res || (!res.xp && !res.gems)) return ''; lastRes=res; res._dbl=false;
  return '<button class="btn btn-reward" data-double>'+(FK.isPro()?'👑 '+t("dblPro"):'🎬 '+t("dbl"))+' <span class="small" style="opacity:.85">(+'+res.xp+' XP · +'+res.gems+'💎)</span></button>'; };
document.addEventListener("click",e=>{
  const b=e.target.closest&&e.target.closest("[data-double]"); if(!b || !lastRes || lastRes._dbl) return;
  const res=lastRes;
  FK.rewarded("double",ok=>{ if(!ok) return; res._dbl=true; const s=FK.state; s.xp+=res.xp; s.gems+=res.gems; s.weekly.xp+=res.xp; FK.save(); FK.sfx("win");
    FK.toast('+'+res.xp+' XP · +'+res.gems+' '+t("gems"),"gem"); b.outerHTML='<div class="chip chip-xp" style="align-self:center">'+t("dblDone")+'</div>'; });
});

/* ---------------- geçiş reklamı: 2 oyunda bir, yeni oyuna başlarken ---------------- */
const INTER_EVERY=2, INTER_GAP=50000; let adDue=false;
const _fin=FK.finishGame; FK.finishGame=g=>{ const r=_fin(g); const s=FK.state;
  if(!g.practice){ s.adGames=(s.adGames||0)+1; if(s.adGames>=INTER_EVERY) adDue=true; FK.save(); } return r; };
const GAME=["play","guess","more","tf","word","intro"];
const _go=FK.go; FK.go=(name,params,opts)=>{
  if(adDue && GAME.indexOf(name)>=0 && !FK.isPro()){ const s=FK.state, now=Date.now();
    if(now-(s.lastInter||0)>=INTER_GAP){ const n=N(); let shown=false; try{ shown=n&&n.showInter&&n.showInter(); }catch(e){}
      if(shown){ s.lastInter=now; s.adGames=0; adDue=false; FK.save(); } } }
  return _go(name,params,opts);
};

/* ---------------- ücretsiz elmas (günde 5) ---------------- */
FK.freeGemsLeft = () => { const s=FK.state, d=FK.dayKey(); if(s.fgDay!==d){ s.fgDay=d; s.fgN=0; } return 5-(s.fgN||0); };
FK.freeGems = after => { if(FK.freeGemsLeft()<=0){ FK.toast(t("freeGemNone"),"info"); return; }
  FK.rewarded("gems",ok=>{ if(!ok) return; const s=FK.state; s.fgN=(s.fgN||0)+1; s.gems+=20; FK.save(); FK.sfx("gem"); FK.toast("+20 "+t("gems"),"gem"); after&&after(); }); };

/* ---------------- PRO ekranı ---------------- */
FK.proPrice = () => { try{ const p=N()&&N().proPrice&&N().proPrice(); if(p) return p; }catch(e){} return ""; };
FK.proFull = () => { try{ const p=N()&&N().proFull&&N().proFull(); if(p) return p; }catch(e){} return ""; };
const disc = () => { const p=FK.proPrice(), f=FK.proFull(); if(!p||!f||p===f) return '';
  const n=x=>parseFloat(x.replace(/[^0-9,\.]/g,"").replace(/\.(?=\d{3})/g,"").replace(",",".")), pc=Math.round((1-n(p)/n(f))*100);
  return '<div class="card center pro-disc"><span class="chip" style="background:#EF4444;color:#fff">'+(pc>0&&pc<100?(FK.lang()==="en"?pc+"% ":"%"+pc+" "):"")+t("proSale")+'</span>'+
    '<div style="margin-top:8px"><s class="muted" style="font-size:18px">'+f+'</s> <b style="font-size:26px;color:#FACC15;margin-left:8px">'+p+'</b></div><div class="small muted">'+t("proSaleS")+'</div></div>'; };
FK.screens.pro = el => {
  const s=FK.state, own=FK.isPro();
  el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
  '<div class="scroll"><div class="stack">'+
   '<div class="pro-hero"><div class="rays2" style="opacity:.6"></div><div class="pro-crown">👑</div><div class="h-display" style="font-size:34px;position:relative">'+t("proT")+'</div><div style="position:relative;font-weight:700;color:#422006;margin-top:6px">'+t("proS")+'</div></div>'+
   '<div class="card stack" style="gap:12px">'+["proB1","proB2","proB3","proB4","proB5"].map(k=>'<div class="row" style="gap:12px"><span class="pro-tick">'+FK.ic("check",16,3)+'</span><b style="font-size:15px">'+t(k)+'</b></div>').join("")+'</div>'+
   (own?'':disc())+(own?'<div class="card center"><b style="font-size:16px;color:#FACC15">'+t("proOwned")+'</b></div>'
       :'<button class="btn btn-pro" data-buy>👑 '+(FK.proPrice()?t("proBuy",{p:FK.proPrice()}):t("proBuy",{p:""}).replace(/ · $/,""))+'</button>')+
   '<button class="btn btn-ghost btn-sm" data-restore>'+t("proRestore")+'</button>'+
  '</div></div>';
  el.querySelector("[data-back]").onclick=FK.back;
  const b=el.querySelector("[data-buy]"); if(b) b.onclick=()=>{ FK.sfx("tap"); const n=N(); if(n&&n.buyPro){ try{ n.buyPro(); }catch(e){ FK.toast(t("proUnavailable"),"info"); } } else FK.toast(t("proUnavailable"),"info",3600); };
  el.querySelector("[data-restore]").onclick=()=>{ const n=N(); if(n&&n.restore){ try{ n.restore(); }catch(e){} } FK.toast(FK.isPro()?t("proOwned"):t("proUnavailable"),"info"); };
};

/* ---------------- tema ---------------- */
FK.applyTheme = () => { const s=FK.state, m=(s.settings&&s.settings.theme)||"dark";
  const light = m==="light" || (m==="system" && window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches);
  document.documentElement.dataset.theme = light?"light":"dark";
  try{ N()&&N().setDark&&N().setDark(!light); }catch(e){} };
try{ matchMedia("(prefers-color-scheme: light)").addEventListener("change",()=>FK.applyTheme()); }catch(e){}

/* ---------------- dış bağlantılar ---------------- */
FK.openUrl = u => { const n=N(); if(n&&n.openUrl){ try{ n.openUrl(u); return; }catch(e){} } window.open(u,"_blank"); };
FK.LEGAL = "https://eakdemir3-prog.github.io/fitnex-legal/futbol-kafasi/";
})();
