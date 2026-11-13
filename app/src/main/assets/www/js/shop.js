/* ==========================================================
   v0.6 — Mağaza: güçlendiriciler, animasyonlu avatarlar, çerçeveler,
   elmas paketleri (Google girişiyle açılacak) + yeni profil düzenleme
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, N=()=>window.FKAndroid;

Object.assign(FK_I18N.tr,{
  shop:"Mağaza", shopS:"Güçlendirici, avatar, çerçeve ve elmas", tabBoost:"Güçlendirici", tabStyle:"Görünüm", tabGems:"Elmas",
  freeSec:"Bedava", freeGemAd:"Reklam izle · +20 elmas", boostAd:"Reklam izle · rastgele güçlendirici", leftToday:"Bugün {n} hak kaldı", noneToday:"Bugünlük bitti",
  b_time:"Süre +10", b_fifty:"50/50+", b_pass:"Pas", b_hint:"İpucu Aç", b_second:"İkinci Şans", b_xp2:"2x XP", b_freeze:"Seri dondurma",
  bd_time:"Soruya 10 saniye ekler", bd_fifty:"2 yanlış şıkkı siler", bd_pass:"Soruyu atlar, seri bozulmaz", bd_hint:"Gizli oyuncunun bir özelliğini açar", bd_second:"Yanlıştan sonra devam et", bd_xp2:"15 dakika XP iki kat", bd_freeze:"Kaçırdığın günde serini korur",
  have:"Elinde: {n}", buy1:"1 al", buy5:"5'li al", pack5:"%20 ucuz",
  notEnough:"Yeterli elmasın yok", getGems:"Elmas kazan", bought:"Satın alındı!", owned:"Sahipsin", equip:"Kullan", equipped:"Kullanılıyor",
  boostFor:"{p} elmasa al", boostAdUse:"🎬 Reklam izle, bedava kullan", boostNone:"{b} kalmadı",
  xp2On:"2x XP aktif · {m} dk", xp2Started:"2x XP başladı! 15 dakika", xp2Already:"2x XP zaten aktif",
  avatars:"Avatarlar", frames:"Çerçeveler", animated:"Hareketli", noFrame:"Çerçevesiz", proOnly:"PRO'ya özel",
  gemPacks:"Elmas paketleri", soon:"Yakında", gemSoon:"Elmas satın alma, Google ile giriş ve bulut kayıtla birlikte açılacak. Böylece aldığın elmaslar hiç kaybolmaz.",
  firstX2:"İlk alımda 2 kat elmas", proBonus:"PRO: her pakette +%20", bonus:"bonus", needLogin:"Giriş gerekli", thanksBuy:"Teşekkürler!", gemNote:"Elmaslar Google hesabına bağlı buluta yedeklenir; telefon değişse de kaybolmaz.", popular:"En popüler", gp_200:"Avuç", gp_550:"Kese", gp_1200:"Sandık",
  starter:"Hoş geldin hediyesi: her güçlendiriciden 1 tane + 100 elmas!", proBoost:"PRO hediyesi: {b} 🎁",
  peTitle:"Profili düzenle", peName:"Kullanıcı adı", tabAv:"Avatar", tabFr:"Çerçeve", tabCountry:"Ülke", tabClub:"Takım",
  discard:"Değişiklikler kaydedilmedi. Çıkılsın mı?", leave:"Çık", saved:"Profil kaydedildi", unlockLv:"Seviye {n}'de açılır", buyFor:"{p} elmasa al",
  shopCard:"Mağaza", shopCardS:"Güçlendiriciler · avatarlar · çerçeveler"
});
Object.assign(FK_I18N.en,{
  shop:"Shop", shopS:"Boosters, avatars, frames and gems", tabBoost:"Boosters", tabStyle:"Style", tabGems:"Gems",
  freeSec:"Free", freeGemAd:"Watch ad · +20 gems", boostAd:"Watch ad · random booster", leftToday:"{n} left today", noneToday:"Done for today",
  b_time:"Time +10", b_fifty:"50/50+", b_pass:"Skip", b_hint:"Reveal", b_second:"Second Chance", b_xp2:"2x XP", b_freeze:"Streak freeze",
  bd_time:"Adds 10 seconds", bd_fifty:"Removes 2 wrong answers", bd_pass:"Skips the question, keeps streak", bd_hint:"Reveals a hidden player attribute", bd_second:"Continue after a mistake", bd_xp2:"Double XP for 15 minutes", bd_freeze:"Protects your streak on a missed day",
  have:"You have: {n}", buy1:"Buy 1", buy5:"Buy 5", pack5:"20% off",
  notEnough:"Not enough gems", getGems:"Earn gems", bought:"Purchased!", owned:"Owned", equip:"Use", equipped:"In use",
  boostFor:"Buy for {p} gems", boostAdUse:"🎬 Watch ad, use free", boostNone:"No {b} left",
  xp2On:"2x XP active · {m} min", xp2Started:"2x XP started! 15 minutes", xp2Already:"2x XP already active",
  avatars:"Avatars", frames:"Frames", animated:"Animated", noFrame:"No frame", proOnly:"PRO only",
  gemPacks:"Gem packs", soon:"Soon", gemSoon:"Gem purchases open with Google sign-in and cloud save, so purchased gems are never lost.",
  firstX2:"Double gems on first purchase", proBonus:"PRO: +20% on every pack", bonus:"bonus", needLogin:"Sign-in needed", thanksBuy:"Thank you!", gemNote:"Gems are backed up to the cloud with your Google account, safe even if you change phones.", popular:"Most popular", gp_200:"Handful", gp_550:"Pouch", gp_1200:"Chest",
  starter:"Welcome gift: 1 of every booster + 100 gems!", proBoost:"PRO gift: {b} 🎁",
  peTitle:"Edit profile", peName:"Username", tabAv:"Avatar", tabFr:"Frame", tabCountry:"Country", tabClub:"Club",
  discard:"Changes not saved. Leave?", leave:"Leave", saved:"Profile saved", unlockLv:"Unlocks at level {n}", buyFor:"Buy for {p} gems",
  shopCard:"Shop", shopCardS:"Boosters · avatars · frames"
});

/* ---------------- güçlendiriciler ---------------- */
FK.BOOSTS = [
  {id:"time",  e:"⏱️", p:30, p5:120},
  {id:"fifty", e:"✂️", p:40, p5:160},
  {id:"pass",  e:"⏭️", p:40, p5:160},
  {id:"hint",  e:"🔍", p:50, p5:200},
  {id:"second",e:"❤️", p:60, p5:240},
  {id:"xp2",   e:"⚡", p:80, p5:0}
];
const B = id => FK.BOOSTS.find(b=>b.id===id);
const inv = () => { const s=FK.state; s.inv=s.inv||{}; FK.BOOSTS.forEach(b=>{ if(s.inv[b.id]==null) s.inv[b.id]=0; }); return s.inv; };
FK.inv = id => inv()[id]||0;
FK.addBoost = (id,n=1) => { inv()[id]=(inv()[id]||0)+n; FK.save(); };

/* başlangıç hediyesi + PRO günlük güçlendirici */
FK.starterCheck = () => { const s=FK.state; if(s.starterGiven || !s.onboarded) return;
  s.starterGiven=true; FK.BOOSTS.forEach(b=>inv()[b.id]=(inv()[b.id]||0)+1); s.gems+=100; FK.save();
  setTimeout(()=>FK.toast(t("starter"),"gem",4200),1200); };
const _roll=FK.rollover; FK.rollover=()=>{ _roll(); const s=FK.state, d=FK.dayKey();
  if(FK.isPro() && s.proBoostDay!==d){ s.proBoostDay=d; const b=FK.BOOSTS[Math.floor(Math.random()*FK.BOOSTS.length)]; inv()[b.id]=(inv()[b.id]||0)+1; FK.save();
    setTimeout(()=>FK.toast(t("proBoost",{b:b.e+" "+t("b_"+b.id)}),"gem",3600),2200); } };

/* 2x XP */
FK.xp2Left = () => Math.max(0,(FK.state.xp2Until||0)-Date.now());
const _fin=FK.finishGame; FK.finishGame=g=>{ const r=_fin(g);
  if(r && FK.xp2Left()>0 && r.xp>0){ FK.state.xp+=r.xp; r.xp*=2; r.xp2=true; FK.save(); } return r; };
FK.startXp2 = () => { if(FK.xp2Left()>0){ FK.toast(t("xp2Already"),"bolt"); return false; } FK.state.xp2Until=Date.now()+15*60000; FK.save(); FK.toast(t("xp2Started"),"bolt",3000); FK.sfx("win"); return true; };

/* reklamla rastgele güçlendirici (günde 3) */
FK.boostAdLeft = () => { const s=FK.state, d=FK.dayKey(); if(s.baDay!==d){ s.baDay=d; s.baN=0; } return 3-(s.baN||0); };
FK.boostAd = after => { if(FK.boostAdLeft()<=0){ FK.toast(t("noneToday"),"info"); return; }
  FK.rewarded("boost",ok=>{ if(!ok) return; const s=FK.state; s.baN=(s.baN||0)+1; const b=FK.BOOSTS[Math.floor(Math.random()*FK.BOOSTS.length)]; FK.addBoost(b.id); FK.sfx("win"); FK.toast("+1 "+b.e+" "+t("b_"+b.id),"gem",2600); after&&after(); }); };

FK.spend = (cost,onOk) => { const s=FK.state; if(s.gems<cost){ FK.notEnough(cost); return false; } s.gems-=cost; FK.save(); FK.sfx("coin"); onOk&&onOk(); return true; };
FK.notEnough = cost => FK.modal('<div class="center stack" style="gap:12px"><div style="font-size:44px">💎</div><div class="h-display h2">'+t("notEnough")+'</div><div class="muted">'+FK.gemIc(16)+' '+FK.fmtNum(FK.state.gems)+' / '+cost+'</div>'+
  (FK.freeGemsLeft()>0?'<button class="btn btn-reward" data-fg>🎬 '+t("freeGemAd")+'</button>':'')+'<button class="btn btn-primary" data-shop>'+t("getGems")+'</button><button class="btn btn-ghost btn-sm" data-c>'+t("close")+'</button></div>',
  w=>{ const f=w.querySelector("[data-fg]"); if(f) f.onclick=()=>{ FK.closeModal(); FK.freeGems(()=>FK.render()); };
       w.querySelector("[data-shop]").onclick=()=>{ FK.closeModal(); FK.go("shop",{tab:"boost"}); }; w.querySelector("[data-c]").onclick=FK.closeModal; });

/* Oyun içinde kullan: elde varsa düş, yoksa satın al / reklam seçeneği */
FK.useBoost = (id,onUse,onCancel) => {
  if(FK.inv(id)>0){ inv()[id]--; FK.save(); FK.sfx("tap"); onUse(); return; }
  const b=B(id);
  FK.modal('<div class="center stack" style="gap:12px"><div style="display:flex;justify-content:center;align-items:flex-end;gap:6px">'+FK.kafa("kaleci",84,"bob")+'<span style="font-size:40px">'+b.e+'</span></div><div class="h-display h2">'+t("b_"+id)+'</div><div class="muted small">'+t("bd_"+id)+'</div>'+
    '<button class="btn btn-primary" data-buy>'+FK.gemIc(18)+' '+t("boostFor",{p:b.p})+'</button>'+
    (FK.boostAdLeft()>0?'<button class="btn btn-reward" data-ad>'+t("boostAdUse")+'</button>':'')+
    '<button class="btn btn-ghost btn-sm" data-c>'+t("cancel")+'</button></div>', w=>{ if(onCancel) w.dataset.lock=1;
    w.querySelector("[data-buy]").onclick=()=>{ FK.closeModal(); if(!FK.spend(b.p,onUse) && onCancel) onCancel(); };
    const a=w.querySelector("[data-ad]"); if(a) a.onclick=()=>{ FK.closeModal(); FK.rewarded("boost",ok=>{ if(ok){ const s=FK.state; s.baN=(s.baN||0)+1; FK.save(); onUse(); } else if(onCancel) onCancel(); }); };
    w.querySelector("[data-c]").onclick=()=>{ FK.closeModal(); if(onCancel) onCancel(); }; });
};
/* oyun içi çubuk */
FK.boostBar = ids => '<div class="boost-bar">'+ids.map(id=>{ const b=B(id), n=FK.inv(id); return '<button class="boost" data-boost="'+id+'"><span class="be">'+b.e+'</span><span class="bn">'+t("b_"+id)+'</span><span class="bc'+(n?'':' z')+'">'+(n||'+')+'</span></button>'; }).join("")+'</div>';
FK.bindBoosts = (el,handlers) => el.querySelectorAll("[data-boost]").forEach(btn=>btn.onclick=()=>{ const id=btn.dataset.boost; if(handlers[id]) FK.useBoost(id,handlers[id]); });

/* ---------------- avatarlar ve çerçeveler ---------------- */
// premium (hareketli) avatarlar elmasla açılır
[
  {i:"ball",   g:["#22C55E","#064E3B"], cost:150, anim:"spin"},
  {i:"flame",  g:["#F97316","#7F1D1D"], cost:200, anim:"flicker"},
  {i:"bolt",   g:["#FDE047","#7C3AED"], cost:200, anim:"flash"},
  {i:"star",   g:["#F472B6","#4C1D95"], cost:250, anim:"twinkle"},
  {i:"rocket", g:["#38BDF8","#1E1B4B"], cost:300, anim:"shake"},
  {i:"crown",  g:["#FACC15","#92400E"], cost:350, anim:"float"},
  {i:"trophy", g:["#FDE68A","#B45309"], cost:400, anim:"shine"},
  {i:"brain",  g:["#2DD4BF","#312E81"], cost:400, anim:"pulse"}
].forEach(a=>FK.AVATARS.push(a));
FK.FRAMES = [
  {id:"none", cost:0},
  {id:"neon", cost:200}, {id:"gold", cost:250}, {id:"fire", cost:300}, {id:"ice", cost:300},
  {id:"rainbow", cost:400}, {id:"galaxy", cost:500}, {id:"pro", pro:true}
];
const own = () => { const s=FK.state; s.own=s.own||{av:[],fr:["none"]}; return s.own; };
FK.ownsAv = i => { const a=FK.AVATARS[i]; if(!a) return false; if(!a.cost) return a.lv<=FK.levelInfo().level; return own().av.indexOf(i)>=0; };
FK.ownsFr = id => { const f=FK.FRAMES.find(x=>x.id===id); if(!f) return false; if(f.pro) return FK.isPro(); return !f.cost || own().fr.indexOf(id)>=0; };
FK.frameOf = () => { const f=FK.state.profile.frame||"none"; return FK.ownsFr(f)?f:"none"; };

// avatar çizimine animasyon sınıfı + (benim avatarım için) çerçeve
const _av=FK.avatar;
FK.avatar = (idx,size=44,ring=null,frame) => {
  const a=FK.AVATARS[idx]||FK.AVATARS[0];
  let h=_av(idx,size,ring);
  if(a.anim) h=h.replace('class="av"','class="av anim-'+a.anim+'"');
  const fr = frame!==undefined ? frame : (ring!==null ? FK.frameOf() : "none");
  if(fr && fr!=="none") h='<div class="fr fr-'+fr+'" style="--fs:'+size+'px">'+h+'</div>';
  return h;
};

/* elmas satın alma: ilk alım 2x, PRO +%20; aynı satın alma iki kez verilmez */
FK.gemGive = base => { const s=FK.state; let g=base; if(!s.gemFirst) g*=2; if(FK.isPro()) g+=Math.round(base*.2); return g; };
const _nat2=window.fkNative;
window.fkNative=(ev,a,b)=>{
  if(ev==="gems"){ const s=FK.state; s.gemTok=s.gemTok||[]; if(b && s.gemTok.indexOf(b)>=0) return;
    const base={gems_200:200,gems_550:550,gems_1200:1200}[a]; if(!base) return;
    const give=FK.gemGive(base); s.gems+=give; s.gemFirst=true; if(b){ s.gemTok.push(b); if(s.gemTok.length>50) s.gemTok.shift(); }
    FK.save(); FK.cloudPush&&FK.cloudPush(false); FK.sfx("gem"); FK.confetti&&FK.confetti(document.body);
    FK.toast("+"+FK.fmtNum(give)+" 💎 "+t("thanksBuy"),"gem",3600); FK.render&&FK.render(); return; }
  if(_nat2) _nat2(ev,a,b);
};
/* ana sayfa kartı */
FK.shopCard = () => '<button class="shop-card" data-go="shop"><span class="sc-ic">🛒</span><div class="grow" style="text-align:left"><div class="h-display" style="font-size:22px">'+t("shopCard")+'</div><div class="small" style="opacity:.9;font-weight:600">'+t("shopCardS")+'</div></div><span class="sc-free">🎬 +20 '+FK.gemIc(13)+'</span></button>';
/* ---------------- MAĞAZA ---------------- */
const PACKS=[{id:"200",g:200,p:"39,99 ₺",d:"31,99 ₺",ic:"🤏"},{id:"550",g:550,p:"89,99 ₺",d:"71,99 ₺",ic:"👝"},{id:"1200",g:1200,p:"179,99 ₺",d:"143,99 ₺",ic:"🧰",pop:true}];
FK.screens.shop = (el,params) => {
  const s=FK.state; let tab=(params&&params.tab)||"boost";
  const draw=()=>{
    const xl=FK.xp2Left();
    el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:26px;margin:0">'+t("shop")+'</h1></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
    '<div class="seg shop-tabs">'+["boost","style","gems"].map(k=>'<button class="'+(tab===k?"on":"")+'" data-tab="'+k+'">'+t(k==="boost"?"tabBoost":k==="style"?"tabStyle":"tabGems")+'</button>').join("")+'</div>'+
    '<div class="scroll"><div class="stack" style="gap:14px">'+FK.kafaSay("satici",t("k_shop"),80)+
    (tab==="boost" ? boostTab(xl) : tab==="style" ? styleTab() : gemsTab())+
    '</div></div>';
    el.querySelector("[data-back]").onclick=FK.back;
    el.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{ tab=b.dataset.tab; FK.sfx("tap"); draw(); });
    el.querySelectorAll("[data-b1]").forEach(b=>b.onclick=()=>{ const x=B(b.dataset.b1); FK.spend(x.p,()=>{ if(x.id==="xp2"&&false){} FK.addBoost(x.id,1); FK.toast(t("bought")+" "+x.e,"check"); draw(); }); });
    el.querySelectorAll("[data-b5]").forEach(b=>b.onclick=()=>{ const x=B(b.dataset.b5); FK.spend(x.p5,()=>{ FK.addBoost(x.id,5); FK.toast(t("bought")+" 5× "+x.e,"check"); draw(); }); });
    el.querySelectorAll("[data-fz]").forEach(b=>b.onclick=()=>{ const p=FK.state.play||{}; if((p.freezes||0)>=FK.freezeCap()){ FK.toast(t("st_full").replace("2",FK.freezeCap()),"info"); return; } FK.spend(40,()=>{ p.freezes=(p.freezes||0)+1; FK.save(); FK.toast(t("bought")+" 🧊","check"); draw(); }); });
    el.querySelectorAll("[data-xp2go]").forEach(b=>b.onclick=()=>{ if(FK.inv("xp2")>0 && FK.xp2Left()<=0){ inv().xp2--; FK.save(); FK.startXp2(); draw(); } });
    const fg=el.querySelector("[data-fg]"); if(fg) fg.onclick=()=>FK.freeGems(draw);
    const ba=el.querySelector("[data-ba]"); if(ba) ba.onclick=()=>FK.boostAd(draw);
    el.querySelectorAll("[data-av]").forEach(b=>b.onclick=()=>buyAv(+b.dataset.av));
    el.querySelectorAll("[data-fr]").forEach(b=>b.onclick=()=>buyFr(b.dataset.fr));
    const pr=el.querySelector("[data-gopro]"); if(pr) pr.onclick=()=>FK.go("pro");
    el.querySelectorAll("[data-gp]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); try{ N().buyGems("gems_"+b.dataset.gp); }catch(e){ FK.toast(t("proUnavailable"),"info"); } });
    const gs=el.querySelector("[data-gsign]"); if(gs) gs.onclick=()=>FK.signIn(()=>draw());
  };
  const boostTab=xl=>
    '<div class="sec-title">'+t("freeSec")+'</div>'+
    '<div class="grid2">'+
      '<button class="shop-free" data-fg '+(FK.freeGemsLeft()>0?'':'disabled')+'><span style="font-size:28px">🎬</span><b>+20 💎</b><span class="small muted">'+(FK.freeGemsLeft()>0?t("leftToday",{n:FK.freeGemsLeft()}):t("noneToday"))+'</span></button>'+
      '<button class="shop-free" data-ba '+(FK.boostAdLeft()>0?'':'disabled')+'><span style="font-size:28px">🎁</span><b>+1 '+t("tabBoost")+'</b><span class="small muted">'+(FK.boostAdLeft()>0?t("leftToday",{n:FK.boostAdLeft()}):t("noneToday"))+'</span></button>'+
    '</div>'+
    (xl>0?'<div class="xp2-live">⚡ '+t("xp2On",{m:Math.ceil(xl/60000)})+'</div>':'')+
    '<div class="sec-title">'+t("tabBoost")+'</div>'+
    FK.BOOSTS.map(b=>'<div class="bitem"><span class="bico">'+b.e+'</span><div class="grow"><b>'+t("b_"+b.id)+'</b><div class="small muted">'+t("bd_"+b.id)+'</div><div class="small" style="color:var(--green-l);font-weight:700;margin-top:2px">'+t("have",{n:FK.inv(b.id)})+'</div>'+
      (b.id==="xp2"&&FK.inv("xp2")>0&&xl<=0?'<button class="btn btn-sm btn-orange" data-xp2go style="margin-top:6px;width:auto;padding:6px 12px">⚡ '+t("equip")+'</button>':'')+'</div>'+
      '<div class="bbuy"><button class="pbtn" data-b1="'+b.id+'">'+FK.gemIc(13)+b.p+'</button>'+(b.p5?'<button class="pbtn p5" data-b5="'+b.id+'"><span>5×</span>'+FK.gemIc(13)+b.p5+'<i>'+t("pack5")+'</i></button>':'')+'</div></div>').join("")+
    '<div class="bitem"><span class="bico">🧊</span><div class="grow"><b>'+t("b_freeze")+'</b><div class="small muted">'+t("bd_freeze")+'</div><div class="small" style="color:var(--green-l);font-weight:700;margin-top:2px">'+t("have",{n:((s.play||{}).freezes||0)+"/"+FK.freezeCap()})+'</div></div><div class="bbuy"><button class="pbtn" data-fz>'+FK.gemIc(13)+'40</button></div></div>';
  const styleTab=()=>{
    const P=s.profile, lv=FK.levelInfo().level;
    return '<div class="shop-prev">'+FK.avatar(P.avatar,96,null,FK.frameOf())+'<b>'+FK.esc(P.name)+'</b></div>'+
    '<div class="sec-title">'+t("avatars")+' · <span style="color:var(--yellow-l)">'+t("animated")+'</span></div>'+
    '<div class="cos-grid">'+FK.AVATARS.map((a,i)=>!a.cost?'':'<button class="cos'+(P.avatar===i?" on":"")+'" data-av="'+i+'">'+FK.avatar(i,60,null,"none")+'<span class="cp">'+(FK.ownsAv(i)?(P.avatar===i?t("equipped"):t("equip")):FK.gemIc(12)+a.cost)+'</span></button>').join("")+'</div>'+
    '<div class="sec-title">'+t("frames")+'</div>'+
    '<div class="cos-grid">'+FK.FRAMES.map(f=>'<button class="cos'+(FK.frameOf()===f.id?" on":"")+'" data-fr="'+f.id+'">'+FK.avatar(P.avatar,52,null,f.id)+'<span class="cp">'+(f.id==="none"?t("noFrame"):FK.ownsFr(f.id)?(FK.frameOf()===f.id?t("equipped"):t("equip")):f.pro?"👑 PRO":FK.gemIc(12)+f.cost)+'</span></button>').join("")+'</div>';
  };
  const gemsTab=()=>{
    const n=N(), live=!!(n&&n.gemPrice), signed=!!(FK.user&&FK.user()), first=!s.gemFirst;
    return '<div class="gem-hero"><div style="font-size:40px">💎</div><div class="h-display" style="font-size:26px">'+t("gemPacks")+'</div><div class="small" style="opacity:.9">'+(first?t("firstX2"):'')+(FK.isPro()?(first?' · ':'')+t("proBonus"):'')+'</div></div>'+
    PACKS.map(p=>{ let pr=null; if(live){ try{ pr=JSON.parse(n.gemPrice("gems_"+p.id)||"null"); }catch(e){} }
      const now=pr&&pr.p?pr.p:p.d, was=pr&&pr.f&&pr.f!==pr.p?pr.f:(pr?'':p.p), give=FK.gemGive(p.g);
      return '<div class="gpack'+(p.pop?" pop":"")+'">'+(p.pop?'<span class="gtag">'+t("popular")+'</span>':'')+'<span class="gic">'+p.ic+'</span><div class="grow"><b>'+t("gp_"+p.id)+'</b><div class="h-display" style="font-size:24px;color:#7DD3FC">'+FK.gemIc(18)+' '+FK.fmtNum(give)+'</div>'+(give>p.g?'<div class="small" style="color:var(--green-l);font-weight:800">'+FK.fmtNum(p.g)+' + '+FK.fmtNum(give-p.g)+' '+t("bonus")+'</div>':'')+'</div>'+
        '<div class="gprice">'+(was?'<s>'+was+'</s>':'')+(live&&signed&&pr&&pr.p?'<button class="pbtn" data-gp="'+p.id+'" style="min-width:96px">'+now+'</button>':'<b>'+now+'</b><span class="chip soon">'+(live&&!signed?t("needLogin"):t("soon"))+'</span>')+'</div></div>'; }).join("")+
    (live&&!signed?'<button class="btn btn-white" data-gsign style="color:#1E3A8A">'+t("acc_signin")+'</button>':'')+
    '<div class="card small muted" style="line-height:1.5">'+FK.ic("info",16,2,'style="display:inline;vertical-align:-3px"')+' '+t(live?"gemNote":"gemSoon")+'</div>'; };
  const buyAv=i=>{ const a=FK.AVATARS[i]; if(FK.ownsAv(i)){ s.profile.avatar=i; FK.save(); FK.sfx("tap"); draw(); return; }
    FK.confirm(FK.avatar(i,72,null,"none").replace('class="av','style="margin:0 auto 12px" class="av')+t("buyFor",{p:a.cost}),"💎 "+a.cost,()=>FK.spend(a.cost,()=>{ own().av.push(i); s.profile.avatar=i; FK.save(); FK.confetti(el); FK.toast(t("bought"),"check"); draw(); })); };
  const buyFr=id=>{ const f=FK.FRAMES.find(x=>x.id===id); if(FK.ownsFr(id)){ s.profile.frame=id; FK.save(); FK.sfx("tap"); draw(); return; }
    if(f.pro){ FK.go("pro"); return; }
    FK.confirm('<div style="display:flex;justify-content:center;margin-bottom:14px">'+FK.avatar(s.profile.avatar,72,null,id)+'</div>'+t("buyFor",{p:f.cost}),"💎 "+f.cost,()=>FK.spend(f.cost,()=>{ own().fr.push(id); s.profile.frame=id; FK.save(); FK.confetti(el); FK.toast(t("bought"),"check"); draw(); })); };
  draw();
};

/* ---------------- YENİ PROFİL DÜZENLEME ---------------- */
FK.screens.pedit = el => {
  const s=FK.state, P=s.profile; const d={name:P.name,avatar:P.avatar,country:P.country,club:P.club,frame:FK.frameOf()};
  let tab="av", filter="";
  const changed=()=>d.name!==P.name||d.avatar!==P.avatar||d.country!==P.country||d.club!==P.club||d.frame!==FK.frameOf();
  FK.backHandler=()=>{ if(changed()){ FK.confirm(t("discard"),t("leave"),()=>{ FK.backHandler=null; FK.stack.pop(); FK.render(); }); return true; } return false; };
  const lv=FK.levelInfo().level;
  const body=()=>{
    if(tab==="av") return '<div class="pick-grid">'+FK.AVATARS.map((a,i)=>{ const ok=FK.ownsAv(i);
      return '<button class="pick'+(i===d.avatar?" on":"")+'" data-a="'+i+'" style="position:relative'+(ok?'':';opacity:.55')+'">'+FK.avatar(i,52,null,"none")+(ok?'':'<span class="plock">'+(a.cost?FK.gemIc(10)+a.cost:t("lv")+a.lv)+'</span>')+'</button>'; }).join("")+'</div>';
    if(tab==="fr") return '<div class="pick-grid">'+FK.FRAMES.map(f=>{ const ok=FK.ownsFr(f.id);
      return '<button class="pick'+(f.id===d.frame?" on":"")+'" data-f="'+f.id+'" style="position:relative'+(ok?'':';opacity:.55')+'">'+FK.avatar(d.avatar,46,null,f.id)+(ok?'':'<span class="plock">'+(f.pro?"PRO":FK.gemIc(10)+f.cost)+'</span>')+'</button>'; }).join("")+'</div>';
    if(tab==="cc"){ const list=FK_COUNTRIES.map(c=>c[0]).sort((a,b)=>FK.cName(a).localeCompare(FK.cName(b),FK.lang()));
      return '<div class="search"><input class="input" data-q placeholder="'+t("searchPh")+'" value="'+FK.esc(filter)+'"></div><div class="list-pick">'+list.filter(c=>!filter||FK.norm(FK.cName(c)).indexOf(FK.norm(filter))>=0).map(c=>'<button class="lp'+(c===d.country?" on":"")+'" data-c="'+c+'"><span class="flag">'+FK.flag(c)+'</span><span class="grow">'+FK.esc(FK.cName(c))+'</span>'+(c===d.country?FK.ic("check",20,2.6):'')+'</button>').join("")+'</div>'; }
    return '<div class="list-pick"><button class="lp'+(!d.club?" on":"")+'" data-k=""><span class="av" style="width:30px;height:30px;background:var(--card2)">'+FK.ic("ball",18)+'</span><span class="grow">'+t("noClub")+'</span></button>'+
      FK_FAV_CLUBS.map(c=>'<button class="lp'+(c[0]===d.club?" on":"")+'" data-k="'+FK.esc(c[0])+'"><span style="width:30px;height:30px;border-radius:15px;background:linear-gradient(90deg,'+c[1]+' 50%,'+c[2]+' 50%);border:2px solid #0B1426;flex-shrink:0"></span><span class="grow">'+FK.esc(c[0])+'</span>'+(c[0]===d.club?FK.ic("check",20,2.6):'')+'</button>').join("")+'</div>';
  };
  const draw=()=>{
    const sc=el.querySelector(".scroll"), y=sc?sc.scrollTop:0;
    const err=FK.checkName(d.name);
    el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:24px;margin:0">'+t("peTitle")+'</h1></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
    '<div class="scroll"><div class="stack" style="gap:14px">'+
     '<div class="pe-head"><div class="rays2" style="opacity:.35"></div>'+FK.avatar(d.avatar,104,null,d.frame)+'<div class="row" style="gap:8px;position:relative"><b style="font-size:22px">'+FK.esc(d.name||"?")+'</b><span style="font-size:22px">'+FK.flag(d.country)+'</span></div>'+(d.club?'<span class="chip" style="position:relative">'+FK.esc(d.club)+'</span>':'')+'</div>'+
     '<div class="field"><label class="small muted" style="font-weight:700">'+t("peName")+'</label><input class="input'+(err&&d.name?" err":"")+'" data-in maxlength="16" value="'+FK.esc(d.name)+'" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="hint'+(err?" err":" ok")+'" data-h>'+(err?(d.name?t(err):""):"")+'</div></div>'+
     '<div class="seg" style="grid-template-columns:repeat(4,1fr)">'+[["av","tabAv"],["fr","tabFr"],["cc","tabCountry"],["club","tabClub"]].map(x=>'<button class="'+(tab===x[0]?"on":"")+'" data-tab="'+x[0]+'">'+t(x[1])+'</button>').join("")+'</div>'+
     body()+
    '</div></div>'+
    '<div style="padding:10px 16px calc(14px + var(--safe-b))"><button class="btn btn-primary" data-save '+(err?"disabled":"")+'>'+t("save")+'</button></div>';
    const nsc=el.querySelector(".scroll"); if(nsc&&tab!=="cc") nsc.scrollTop=y;
    el.querySelector("[data-back]").onclick=FK.back;
    const inp=el.querySelector("[data-in]"); inp.oninput=()=>{ d.name=inp.value.trim(); const e=FK.checkName(inp.value); inp.classList.toggle("err",!!e); const h=el.querySelector("[data-h]"); h.className="hint"+(e?" err":" ok"); h.textContent=e?t(e):""; el.querySelector("[data-save]").disabled=!!e; const nm=el.querySelector(".pe-head b"); if(nm) nm.textContent=inp.value||"?"; };
    el.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{ tab=b.dataset.tab; FK.sfx("tap"); draw(); });
    el.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{ const i=+b.dataset.a, a=FK.AVATARS[i];
      if(FK.ownsAv(i)){ d.avatar=i; FK.sfx("tap"); draw(); return; }
      if(a.cost){ FK.confirm(t("buyFor",{p:a.cost}),"💎 "+a.cost,()=>FK.spend(a.cost,()=>{ own().av.push(i); d.avatar=i; FK.save(); FK.toast(t("bought"),"check"); draw(); })); }
      else FK.toast(t("unlockLv",{n:a.lv}),"lock"); });
    el.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{ const id=b.dataset.f, f=FK.FRAMES.find(x=>x.id===id);
      if(FK.ownsFr(id)){ d.frame=id; FK.sfx("tap"); draw(); return; }
      if(f.pro){ FK.go("pro"); return; }
      FK.confirm(t("buyFor",{p:f.cost}),"💎 "+f.cost,()=>FK.spend(f.cost,()=>{ own().fr.push(id); d.frame=id; FK.save(); FK.toast(t("bought"),"check"); draw(); })); });
    el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ d.country=b.dataset.c; FK.sfx("tap"); draw(); });
    el.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{ d.club=b.dataset.k; FK.sfx("tap"); draw(); });
    const q=el.querySelector("[data-q]"); if(q) q.oninput=()=>{ filter=q.value; draw(); const nq=el.querySelector("[data-q]"); nq.focus(); nq.setSelectionRange(filter.length,filter.length); };
    el.querySelector("[data-save]").onclick=()=>{ if(FK.checkName(d.name)) return; P.name=d.name; P.avatar=d.avatar; P.country=d.country; P.club=d.club; P.frame=d.frame; FK.save(); FK.sfx("win"); FK.toast(t("saved"),"check"); FK.backHandler=null; FK.stack.pop(); FK.render(); };
  };
  draw();
};
})();
