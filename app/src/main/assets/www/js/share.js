/* ==========================================================
   v1.1 — Resimli paylaşım kartı (1080×1080 PNG, canvas)
   Android: FKAndroid.shareImage(base64, metin) · tarayıcı: navigator.share / indirme
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t;
const STORE="https://play.google.com/store/apps/details?id=com.eavisionlabs.futbolkafasi";
Object.assign(FK_I18N.tr,{ sh_beat:"Beni geçebilir misin? ⚽", sh_txt:"Futbol Kafası'nda {m}: {r}! Beni geçebilir misin? ⚽", sh_get:"Google Play'de: Futbol Kafası", sh_duel:"Bana meydan oku!", sh_code:"DÜELLO KODU", sh_pts:"puan", sh_win:"Buldum!", sh_lose:"Bulamadım", sh_streak:"seri" });
Object.assign(FK_I18N.en,{ sh_beat:"Can you beat me? ⚽", sh_txt:"{m} in Futbol Kafası: {r}! Can you beat me? ⚽", sh_get:"On Google Play: Futbol Kafası", sh_duel:"Challenge me!", sh_code:"DUEL CODE", sh_pts:"points", sh_win:"Got it!", sh_lose:"Missed it", sh_streak:"streak" });
const MC={live:["#EF4444","#7C3AED"],player:["#22C55E","#14532D"],club:["#3B82F6","#1E3A8A"],flag:["#F97316","#9A3412"],daily:["#FACC15","#A16207"],career:["#A855F7","#581C87"],guess:["#D946EF","#6B21A8"],word:["#14B8A6","#115E59"],more:["#F43F5E","#881337"],tf:["#0EA5E9","#0C4A6E"],duel:["#8B5CF6","#312E81"]};
const loadImg = src => new Promise((ok,no)=>{ const i=new Image(); i.onload=()=>ok(i); i.onerror=no; i.src=src; });
const rr = (c,x,y,w,h,r) => { c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); };
const D = "'Barlow Condensed','Inter',sans-serif", I="'Inter',sans-serif";

FK.renderShare = async o => {
  try{ await document.fonts.load("italic 900 80px 'Barlow Condensed'"); await document.fonts.load("800 40px Inter"); }catch(e){}
  const W=1080, cv=document.createElement("canvas"); cv.width=W; cv.height=W; const c=cv.getContext("2d");
  const col=MC[o.mode]||MC.player;
  // zemin
  let g=c.createLinearGradient(0,0,W,W); g.addColorStop(0,"#0F1B3D"); g.addColorStop(1,"#060B16"); c.fillStyle=g; c.fillRect(0,0,W,W);
  g=c.createRadialGradient(W*.5,W*.38,40,W*.5,W*.38,620); g.addColorStop(0,col[0]+"AA"); g.addColorStop(1,col[0]+"00"); c.fillStyle=g; c.fillRect(0,0,W,W);
  c.save(); c.globalAlpha=.08; c.strokeStyle="#fff"; c.lineWidth=2; for(let i=0;i<=W;i+=90){ c.beginPath(); c.moveTo(i,0); c.lineTo(i,W); c.stroke(); c.beginPath(); c.moveTo(0,i); c.lineTo(W,i); c.stroke(); } c.restore();
  // üst başlık
  c.textAlign="center"; c.fillStyle="#fff"; c.font="italic 900 64px "+D; c.fillText("FUTBOL KAFASI",W/2,100);
  rr(c,W/2-260,128,520,62,31); c.fillStyle=col[0]; c.fill(); c.fillStyle="#fff"; c.font="italic 900 38px "+D;
  c.fillText((FK.modeName(o.mode)+(o.level?" · "+t("lvN",{n:o.level}):"")).toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US"),W/2,172);
  // maskot
  try{ const img=await loadImg("data:image/svg+xml;charset=utf-8,"+encodeURIComponent(FK.kafaSVG(o.pose||"kaptan"))); c.drawImage(img,70,250,300,337); }catch(e){}
  // sağ blok: skor
  c.textAlign="left"; const X=410;
  if(o.mode==="duel"){
    c.fillStyle="#C4B5FD"; c.font="800 34px "+I; c.fillText(t("sh_code"),X,320);
    const code=o.code||""; for(let i=0;i<code.length;i++){ rr(c,X+i*102,345,88,118,20); g=c.createLinearGradient(0,345,0,463); g.addColorStop(0,"#8B5CF6"); g.addColorStop(1,"#4338CA"); c.fillStyle=g; c.fill(); c.fillStyle="#fff"; c.font="italic 900 88px "+D; c.textAlign="center"; c.fillText(code[i],X+i*102+44,436); c.textAlign="left"; }
    c.fillStyle="#fff"; c.font="italic 900 64px "+D; c.fillText(t("sh_duel").toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US"),X,560);
  } else if(o.grid || o.wgrid){
    const rows=(o.grid||o.wgrid).slice(-6), cols=rows[0]?rows[0].length:5, sz=Math.min(78,Math.floor(560/cols)-8);
    rows.forEach((r,ri)=>r.forEach((v,ci)=>{ rr(c,X+ci*(sz+8),280+ri*(sz+8),sz,sz,14); c.fillStyle=v==="ok"?"#22C55E":v==="near"?"#EAB308":"#334155"; c.fill(); }));
    c.fillStyle=o.win?"#4ADE80":"#FCA5A5"; c.font="italic 900 70px "+D; c.fillText((o.win?t("sh_win"):t("sh_lose")).toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US")+"  "+(o.win?o.tries:"X")+"/"+o.max,X,300+rows.length*(sz+8)+70);
  } else {
    const big = o.big!=null ? String(o.big) : FK.fmtNum(o.score||0);
    c.fillStyle="#4ADE80"; c.font="italic 900 210px "+D; c.fillText(big,X,450);
    c.fillStyle="#E2E8F0"; c.font="800 44px "+I; c.fillText(o.mode==="more"?t("sh_streak").toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US"):t("sh_pts").toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US"),X+6,510);
    if(o.total){ c.fillStyle="#fff"; c.font="800 52px "+I; c.fillText(t("nCorrect",{a:o.correct,b:o.total}),X+6,585); }
    else if(o.sub){ c.fillStyle="#fff"; c.font="700 40px "+I; c.fillText(o.sub,X+6,585); }
    if(o.stars!=null){ c.font="90px sans-serif"; for(let i=0;i<3;i++){ c.fillStyle=i<o.stars?"#FACC15":"#334155"; c.fillText("★",X+i*96,690); } }
  }
  // oyuncu
  const P=FK.state.profile, y=780;
  rr(c,90,y,W-180,110,55); c.fillStyle="rgba(255,255,255,.08)"; c.fill();
  const av=FK.AVATARS[P.avatar]||FK.AVATARS[0]; g=c.createLinearGradient(110,y+10,200,y+100); g.addColorStop(0,av.g[0]); g.addColorStop(1,av.g[1]); c.fillStyle=g; c.beginPath(); c.arc(155,y+55,45,0,Math.PI*2); c.fill();
  c.fillStyle="#fff"; c.textAlign="center"; c.font="italic 900 52px "+D; c.fillText((P.name||"?")[0].toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US"),155,y+73);
  c.textAlign="left"; c.font="italic 900 56px "+D; c.fillText((P.name||"").toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US"),225,y+60); c.fillStyle="#94A3B8"; c.font="700 28px "+I; c.fillText(t("level")+" "+FK.levelInfo().level+(P.country?"  "+FK.cName(P.country):""),227,y+96);
  // alt
  c.textAlign="center"; c.fillStyle="#FDE047"; c.font="italic 900 58px "+D; c.fillText(o.mode==="duel"?t("sh_get").toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US"):t("sh_beat").replace(" ⚽","").toLocaleUpperCase(FK.lang()==="tr"?"tr-TR":"en-US"),W/2,975);
  c.fillStyle="#94A3B8"; c.font="700 30px "+I; c.fillText(o.mode==="duel"?"#FutbolKafası":t("sh_get"),W/2,1030);
  return cv.toDataURL("image/png");
};

FK.shareCard = async o => {
  FK.sfx("tap");
  const r = o.mode==="duel"||o.mode==="word" ? null : o.total ? t("nCorrect",{a:o.correct,b:o.total})+" · "+FK.fmtNum(o.score)+" "+t("sh_pts") : o.mode==="guess" ? (o.win?o.tries+"/"+o.max:"X/"+o.max) : FK.fmtNum(o.score||o.big||0)+(o.mode==="more"?" "+t("sh_streak"):" "+t("sh_pts"));
  const text=(o.text || t("sh_txt",{m:FK.modeName(o.mode),r}))+"\n"+STORE;
  let url=null; try{ url=await FK.renderShare(o); }catch(e){}
  const n=window.FKAndroid;
  if(url && n && n.shareImage){ n.shareImage(url.split(",")[1], text); return; }
  if(url && navigator.canShare){ try{ const b=await (await fetch(url)).blob(); const f=new File([b],"futbol-kafasi.png",{type:"image/png"}); if(navigator.canShare({files:[f]})){ await navigator.share({files:[f],text}); return; } }catch(e){} }
  FK.share(text);
};
})();
