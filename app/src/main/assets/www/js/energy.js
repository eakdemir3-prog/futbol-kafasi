/* ==========================================================
   v1.1 — ENERJİ: en fazla 10 ⚡, her oyun 1, 30 dakikada 1 dolar.
   Bedava: Günün 10 Sorusu, Günün Kelimesi, Düello. PRO: sınırsız.
   Doldurma: reklam +2 (günde 5), 40 💎 +1, 250 💎 tamamı. Seviye atlayınca dolar.
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t;
const MAX=10, REGEN=30*60*1000, AD_MAX=5, AD_N=2, P1=40, PFULL=250;
FK.EN={MAX,P1,PFULL,AD_N};
Object.assign(FK_I18N.tr,{
  en_title:"Enerjin bitti!", en_sub:"Her oyun 1 enerji harcar. 30 dakikada 1 enerji dolar.", en_next:"Sonraki enerji: {t}", en_full:"Enerjin dolu ⚡",
  en_ad:"Reklam izle · +2 ⚡", en_adLeft:"Bugün {n} hak", en_buy1:"+1 ⚡", en_fill:"Hepsini doldur", en_pro:"PRO ile sınırsız enerji",
  en_got:"+{n} enerji ⚡", en_lvl:"Seviye atladın, enerjin doldu! ⚡", en_inf:"Sınırsız", en_shopT:"Enerji", proB6:"Sınırsız enerji ⚡", en_wait:"Bekle"
});
Object.assign(FK_I18N.en,{
  en_title:"Out of energy!", en_sub:"Each game costs 1 energy. 1 energy refills every 30 minutes.", en_next:"Next energy: {t}", en_full:"Energy full ⚡",
  en_ad:"Watch ad · +2 ⚡", en_adLeft:"{n} left today", en_buy1:"+1 ⚡", en_fill:"Refill all", en_pro:"Unlimited energy with PRO",
  en_got:"+{n} energy ⚡", en_lvl:"Level up, energy refilled! ⚡", en_inf:"Unlimited", en_shopT:"Energy", proB6:"Unlimited energy ⚡", en_wait:"Wait"
});
const st = () => { const s=FK.state; if(!s.en) s.en={n:MAX,t:Date.now()}; return s.en; };
FK.energy = () => { const e=st(), now=Date.now();
  if(e.n>=MAX){ e.t=now; return e.n; }
  const k=Math.floor((now-e.t)/REGEN); if(k>0){ e.n=Math.min(MAX,e.n+k); e.t = e.n>=MAX ? now : e.t+k*REGEN; FK.save(); }
  return e.n; };
FK.energyNextMs = () => { const e=st(); FK.energy(); return e.n>=MAX?0:Math.max(0,REGEN-(Date.now()-e.t)); };
FK.addEnergy = n => { const e=st(); FK.energy(); e.n=Math.min(MAX,e.n+n); if(e.n>=MAX) e.t=Date.now(); FK.save(); FK.render&&FK.render(); };
const adLeft = () => { const s=FK.state, d=FK.dayKey(); if(s.enAdDay!==d){ s.enAdDay=d; s.enAdN=0; } return AD_MAX-(s.enAdN||0); };
const fmt = ms => { const m=Math.floor(ms/60000), s=Math.floor(ms%60000/1000); return m+":"+(s<10?"0":"")+s; };
const FREE = ["daily","word","duel"];

FK.useEnergy = cb => {
  if(FK.isPro()){ cb(); return; }
  if(FK.energy()>0){ const e=st(); if(e.n>=MAX) e.t=Date.now(); e.n--; FK.save(); cb(); return; }
  FK.energyModal(cb);
};
FK.energyPill = () => FK.isPro()
  ? '<span class="pill en-pill pro">⚡ ∞</span>'
  : '<button class="pill en-pill'+(FK.energy()===0?" empty":"")+'" data-en>⚡ '+FK.energy()+'/'+MAX+'<small data-en-t>'+(FK.energy()<MAX?fmt(FK.energyNextMs()):"")+'</small></button>';
let tick=null;
FK.energyTick = el => {
  el.querySelectorAll("[data-en]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); FK.energyModal(); });
  clearInterval(tick); tick=setInterval(()=>{ const n=document.querySelectorAll("[data-en-t]"); if(!n.length){ clearInterval(tick); return; }
    const before=st().n, ms=FK.energyNextMs(); if(st().n!==before){ FK.render(); return; } n.forEach(x=>x.textContent=st().n<MAX?fmt(ms):""); },1000);
};

FK.energyModal = cb => {
  const draw=w=>{
    const n=FK.energy(), full=n>=MAX, left=adLeft(), gems=FK.state.gems;
    w.querySelector(".en-body").innerHTML=
      '<div style="display:flex;justify-content:center">'+FK.kafa(n?"kaptan":"uykucu",96,"bob")+'</div>'+
      '<div class="h-display h2 center">'+(n?t("en_shopT"):t("en_title"))+'</div>'+
      '<div class="en-bar">'+Array.from({length:MAX},(_,i)=>'<i class="'+(i<n?"on":"")+'">⚡</i>').join("")+'</div>'+
      '<div class="small muted center">'+(full?t("en_full"):t("en_next",{t:'<b data-en-m>'+fmt(FK.energyNextMs())+'</b>'}))+'</div>'+
      '<div class="small muted center" style="line-height:1.4">'+t("en_sub")+'</div>'+
      '<button class="btn btn-reward" data-ad '+(full||left<=0?"disabled":"")+'>🎬 '+t("en_ad")+' <small style="opacity:.8;margin-left:4px">'+t("en_adLeft",{n:left})+'</small></button>'+
      '<div class="grid2"><button class="btn btn-ghost" data-b1 '+(full?"disabled":"")+'>'+'<span>'+t("en_buy1")+'</span><span class="en-pr">'+FK.gemIc(15)+P1+'</span></button><button class="btn btn-purple" data-bf '+(full?"disabled":"")+'>'+'<span>'+t("en_fill")+'</span><span class="en-pr">'+FK.gemIc(15)+PFULL+'</span></button></div>'+
      '<button class="btn btn-pro btn-sm" data-pro>👑 '+t("en_pro")+'</button>'+
      '<button class="btn btn-ghost btn-sm" data-c>'+t(cb&&!n?"en_wait":"close")+'</button>';
    const done=k=>{ FK.toast(t("en_got",{n:k}),"bolt",1800); if(cb && FK.energy()>0){ FK.closeModal(); FK.useEnergy(cb); } else draw(w); };
    w.querySelector("[data-ad]").onclick=()=>FK.rewarded("energy",ok=>{ if(!ok) return; FK.state.enAdN=(FK.state.enAdN||0)+1; FK.addEnergy(AD_N); FK.sfx("gem"); done(AD_N); });
    w.querySelector("[data-b1]").onclick=()=>{ if(gems<P1){ FK.closeModal(); FK.notEnough(P1); return; } FK.spend(P1,()=>{ FK.addEnergy(1); done(1); }); };
    w.querySelector("[data-bf]").onclick=()=>{ if(gems<PFULL){ FK.closeModal(); FK.notEnough(PFULL); return; } const k=MAX-FK.energy(); FK.spend(PFULL,()=>{ FK.addEnergy(MAX); done(k); }); };
    w.querySelector("[data-pro]").onclick=()=>{ FK.closeModal(); FK.go("pro"); };
    w.querySelector("[data-c]").onclick=FK.closeModal;
  };
  FK.modal('<div class="stack en-body" style="gap:12px"></div>', w=>{ draw(w);
    const iv=setInterval(()=>{ if(!document.body.contains(w)){ clearInterval(iv); return; } const m=w.querySelector("[data-en-m]"); const before=st().n; const ms=FK.energyNextMs(); if(st().n!==before) draw(w); else if(m) m.textContent=fmt(ms); },1000); });
};

/* oyun başlarken enerji harca (bedava modlar hariç) */
const _start=FK.startGame;
FK.startGame = (mode,diff,practice) => { if(FREE.indexOf(mode)>=0) return _start(mode,diff,practice); FK.useEnergy(()=>_start(mode,diff,practice)); };
/* seviye atlayınca doldur */
const _fin=FK.finishGame;
FK.finishGame = g => { const r=_fin(g); if(r && r.levelUp){ const e=st(); if(e.n<MAX){ e.n=MAX; e.t=Date.now(); FK.save(); setTimeout(()=>FK.toast(t("en_lvl"),"bolt",3000),2600); } } return r; };
})();
