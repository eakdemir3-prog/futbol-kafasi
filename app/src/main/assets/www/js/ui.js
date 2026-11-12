/* ==========================================================
   ARAYÜZ: ikonlar, logo, ortak bileşenler, yönlendirici, modal, toast
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t;
FK.screens = FK.screens || {};

/* ---------- ikonlar (özgün çizgi ikonlar) ---------- */
const P={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
 trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
 ball:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5l3.8 2.8-1.5 4.4H9.7l-1.5-4.4z"/><path d="M12 3v4.5M15.8 10.3l4.4-1.4M14.3 14.7l2.6 3.8M9.7 14.7l-2.6 3.8M8.2 10.3L3.8 8.9"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
 flame:'<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7z"/>',
 boot:'<path d="M5 4h6l1 6 7 3c1.5.6 2 1.6 2 3v2H3V6a2 2 0 0 1 2-2z"/><path d="M3 18h18M8 10h4"/>',
 whistle:'<circle cx="9" cy="14" r="5"/><path d="M12 10l8-4v4l-6 2M3 6l2 2M7 3l1 3"/>',
 crown:'<path d="M3 18L2 7l5 4 5-7 5 7 5-4-1 11z"/><path d="M3 21h18"/>',
 rocket:'<path d="M12 2c4 3 5 8 4 13H8C7 10 8 5 12 2z"/><circle cx="12" cy="9" r="2"/><path d="M8 15l-3 4h4M16 15l3 4h-4M10 19l2 3 2-3"/>',
 brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z"/>',
 gem:'<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21L8 9l4-6 4 6z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8"/>',
 grid:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 swords:'<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/><path d="M14.5 6.5L18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3M3 19l2 2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 check:'<path d="M5 12l5 5L20 7"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
 right:'<path d="M9 6l6 6-6 6"/>', left:'<path d="M15 6l-6 6 6 6"/>', up:'<path d="M6 15l6-6 6 6"/>', down:'<path d="M6 9l6 6 6-6"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
 replay:'<path d="M4 12a8 8 0 1 0 2.5-5.8L4 8.5"/><path d="M4 4v4.5h4.5"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 sound:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 8a5 5 0 0 1 0 8M20 5a9 9 0 0 1 0 14"/>',
 vib:'<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4 8v8M20 8v8"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.5"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 wifiOff:'<path d="M2 8a16 16 0 0 1 6-3M22 8a16 16 0 0 0-9-3.6M5 12a11 11 0 0 1 4-2.4M19 12a11 11 0 0 0-2-1.5M8.5 15.5a5 5 0 0 1 7 0M12 19h.01M3 3l18 18"/>',
 shirt:'<path d="M8 3l-5 3 2 5 3-1v11h8V10l3 1 2-5-5-3a4 4 0 0 1-8 0z"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>'
};
FK.ic = (n,size=22,sw=2,extra="") => '<svg aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round" '+extra+'>'+(P[n]||P.ball)+'</svg>';
FK.gemIc = (s=14) => '<svg aria-hidden="true" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="#38BDF8" stroke="#7DD3FC" stroke-width="1.5" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/></svg>';
FK.fireIc = (s=14) => '<svg aria-hidden="true" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="#FF8A1F" stroke="#FDBA74" stroke-width="1.5" stroke-linejoin="round"><path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7z"/></svg>';

/* ---------- logo (taçlı top) ---------- */
let uid=0;
FK.logoBall = (size=120, anim=false) => { const u="lb"+(uid++);
 return '<svg aria-hidden="true" width="'+size+'" height="'+Math.round(size*1.25)+'" viewBox="-110 -190 220 290"><defs><radialGradient id="'+u+'t" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#E2E8F0"/><stop offset="1" stop-color="#94A3B8"/></radialGradient><linearGradient id="'+u+'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FEF9C3"/><stop offset=".45" stop-color="#FACC15"/><stop offset="1" stop-color="#B45309"/></linearGradient><clipPath id="'+u+'k"><circle r="88"/></clipPath></defs>'+
 '<g transform="rotate(-12)"><g class="'+(anim?'logo-ball':'')+'"><circle r="96" fill="#0B1426"/><circle r="88" fill="url(#'+u+'t)"/><g clip-path="url(#'+u+'k)" fill="#0B1426"><circle cx="0" cy="-88.5" r="25"/><circle cx="84.2" cy="-27.3" r="25"/><circle cx="52" cy="71.6" r="25"/><circle cx="-52" cy="71.6" r="25"/><circle cx="-84.2" cy="-27.3" r="25"/></g><path d="M0 -30 L28.5 -9.3 L17.6 24.3 L-17.6 24.3 L-28.5 -9.3 Z" fill="#0B1426"/><path d="M0 -30 L0 -63 M28.5 -9.3 L59.9 -19.5 M17.6 24.3 L37 51 M-17.6 24.3 L-37 51 M-28.5 -9.3 L-59.9 -19.5" stroke="#0B1426" stroke-width="5" stroke-linecap="round"/><ellipse cx="-34" cy="-48" rx="26" ry="13" fill="#fff" fill-opacity=".75" transform="rotate(-30 -34 -48)"/></g>'+
 '<g transform="translate(14 0)"><path d="M-66 -78 L-80 -150 L-36 -114 L0 -170 L36 -114 L80 -150 L66 -78 Z" fill="url(#'+u+'c)" stroke="#0B1426" stroke-width="8" stroke-linejoin="round"/><rect x="-70" y="-92" width="140" height="24" rx="7" fill="#EAB308" stroke="#0B1426" stroke-width="7"/><circle cx="-80" cy="-150" r="8" fill="#FEF08A" stroke="#0B1426" stroke-width="5"/><circle cx="0" cy="-170" r="9" fill="#FEF08A" stroke="#0B1426" stroke-width="5"/><circle cx="80" cy="-150" r="8" fill="#FEF08A" stroke="#0B1426" stroke-width="5"/><circle cx="0" cy="-80" r="8" fill="#DC2626" stroke="#0B1426" stroke-width="4"/><circle cx="-38" cy="-80" r="6" fill="#22C55E" stroke="#0B1426" stroke-width="4"/><circle cx="38" cy="-80" r="6" fill="#38BDF8" stroke="#0B1426" stroke-width="4"/></g></g></svg>';
};
FK.logoText = (w=300) => { const u="lt"+(uid++);
 return '<svg role="img" aria-label="Futbol Kafası" width="'+w+'" height="'+Math.round(w*0.62)+'" viewBox="0 0 400 248"><defs><linearGradient id="'+u+'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#F1F5F9"/><stop offset="1" stop-color="#CBD5E1"/></linearGradient><linearGradient id="'+u+'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ECFCCB"/><stop offset=".4" stop-color="#A3E635"/><stop offset="1" stop-color="#16A34A"/></linearGradient><linearGradient id="'+u+'r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDE047"/><stop offset="1" stop-color="#CA8A04"/></linearGradient></defs>'+
 '<g transform="rotate(-4 200 120)" font-family="Barlow Condensed, sans-serif" font-style="italic" font-weight="900" text-anchor="middle"><text x="200" y="88" font-size="96" fill="#334155" stroke="#0B1426" stroke-width="18" stroke-linejoin="round" paint-order="stroke">FUTBOL</text><text x="200" y="80" font-size="96" fill="url(#'+u+'w)" stroke="#0B1426" stroke-width="11" stroke-linejoin="round" paint-order="stroke">FUTBOL</text><text x="200" y="196" font-size="130" fill="#14532D" stroke="#0B1426" stroke-width="20" stroke-linejoin="round" paint-order="stroke">KAFASI</text><text x="200" y="186" font-size="130" fill="url(#'+u+'g)" stroke="#0B1426" stroke-width="12" stroke-linejoin="round" paint-order="stroke">KAFASI</text></g>'+
 '<g transform="rotate(-4 200 228)"><path d="M40 208h320l-16 20 16 20H40l16-20z" fill="#0B1426"/><path d="M50 214h300l-11 14 11 14H50l11-14z" fill="url(#'+u+'r)"/><text x="200" y="237" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="22" letter-spacing="3" fill="#422006">'+FK.esc(t("quiz"))+'</text></g></svg>';
};
FK.bgBall = (s=170) => '<svg class="bg-ball" aria-hidden="true" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.2">'+P.ball+'</svg>';

/* ---------- avatar ---------- */
FK.avatar = (idx,size=44,ring=null) => {
  const a=FK.AVATARS[idx]||FK.AVATARS[0];
  const inner='<div class="av" style="width:'+size+'px;height:'+size+'px;background:linear-gradient(145deg,'+a.g[0]+','+a.g[1]+');color:#fff">'+FK.ic(a.i,Math.round(size*.55),2.2)+'</div>';
  if(ring===null) return inner;
  return '<div class="av-ring" style="background:conic-gradient(var(--green) 0 '+ring+'%, #233556 '+ring+'% 100%)">'+inner+'</div>';
};
FK.leagueBadge = (lv,s=34) => { const L=FK.LEAGUES[lv];
  const inner = lv===3 ? '<path d="M11 14h12l3 4-9 10-9-10z" fill="#E0F2FE"/>' : lv===4 ? '<path d="M9 25l1.5-11 4 4L17 11l2.5 7 4-4L25 25z" fill="#FACC15"/>' : '<path d="M17 12l2.2 4.5 5 .7-3.6 3.5.8 5L17 23.3l-4.4 2.4.8-5-3.6-3.5 5-.7z" fill="#FEF9C3"/>';
  return '<svg aria-hidden="true" width="'+s+'" height="'+Math.round(s*1.12)+'" viewBox="0 0 34 38"><path d="M17 1l15 6v11c0 9-6.5 15-15 19C8.5 33 2 27 2 18V7z" fill="'+L.c1+'" stroke="'+L.c2+'" stroke-width="2"/>'+inner+'</svg>';
};

/* ---------- yönlendirici ---------- */
const app=()=>document.getElementById("app");
FK.stack=[];
FK.go = (name,params={},opts={}) => {
  if(FK.onLeave){ try{FK.onLeave();}catch(e){} FK.onLeave=null; }
  if(opts.replace) FK.stack.pop();
  if(opts.root) FK.stack=[];
  FK.stack.push({name,params});
  FK.render();
};
FK.back = () => {
  if(document.querySelector(".modal-wrap")){ FK.closeModal(); return; }
  if(FK.backHandler && FK.backHandler()) return;
  if(FK.stack.length>1){ if(FK.onLeave){ try{FK.onLeave();}catch(e){} FK.onLeave=null; } FK.stack.pop(); FK.render(); return; }
  const cur=FK.stack[0]&&FK.stack[0].name;
  if(cur && cur!=="home" && FK.state.onboarded && ["rank","missions","profile","games"].indexOf(cur)>=0){ FK.go("home",{},{root:true}); return; }
  if(window.FKAndroid && FKAndroid.exit) FKAndroid.exit();
};
window.fkBack = FK.back;
FK.render = () => {
  const top=FK.stack[FK.stack.length-1]; if(!top) return;
  document.documentElement.lang=FK.lang();
  FK.backHandler=null;
  const fn=FK.screens[top.name];
  const el=document.createElement("div"); el.className="screen";
  app().querySelectorAll(".screen").forEach(s=>s.remove());
  app().appendChild(el);
  fn(el,top.params);
};

/* ---------- alt navigasyon ---------- */
FK.nav = active => {
  const items=[["home","home","navHome"],["rank","trophy","navRank"],["play"],["missions","list","navMissions"],["profile","user","navProfile"]];
  const dot=FK.unclaimedCount()>0;
  return '<nav class="nav">'+items.map(it=>{
    if(it[0]==="play") return '<button class="nav-play'+(active==="games"?" active":"")+'" data-nav="games" aria-label="'+t("navPlay")+'">'+FK.ic("ball",26,2.2)+t("navPlay")+'</button>';
    return '<button class="nav-item'+(active===it[0]?" active":"")+'" data-nav="'+it[0]+'">'+FK.ic(it[1],24)+'<span>'+t(it[2])+'</span>'+(it[0]==="missions"&&dot?'<i class="dot"></i>':'')+'</button>';
  }).join("")+'</nav>';
};
FK.bindNav = el => el.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); FK.go(b.dataset.nav,{}, {root:true}); });

/* ---------- toast & modal ---------- */
FK.toast = (msg,icon="info",ms=2600) => {
  const d=document.createElement("div"); d.className="toast"; d.innerHTML='<span style="color:var(--green-l)">'+FK.ic(icon,20)+'</span><span>'+msg+'</span>';
  app().appendChild(d); setTimeout(()=>{ d.classList.add("out"); setTimeout(()=>d.remove(),300); },ms);
};
FK.modal = (html,onBind) => {
  FK.closeModal();
  const w=document.createElement("div"); w.className="modal-wrap"; w.innerHTML='<div class="modal" role="dialog" aria-modal="true">'+html+'</div>';
  w.addEventListener("click",e=>{ if(e.target===w && !w.dataset.lock) FK.closeModal(); });
  app().appendChild(w); if(onBind) onBind(w); return w;
};
FK.closeModal = () => document.querySelectorAll(".modal-wrap").forEach(m=>m.remove());
FK.confirm = (msg,okText,onOk,danger) => FK.modal('<p style="margin:0 0 18px;font-size:16px;line-height:1.5;font-weight:600">'+msg+'</p><div class="grid2"><button class="btn btn-ghost btn-sm" style="width:100%" data-c>'+t("cancel")+'</button><button class="btn btn-sm '+(danger?'':'btn-orange')+'" style="width:100%;'+(danger?'background:#B91C1C;color:#fff':'')+'" data-o>'+okText+'</button></div>',w=>{ w.querySelector("[data-c]").onclick=FK.closeModal; w.querySelector("[data-o]").onclick=()=>{FK.closeModal(); onOk();}; });

FK.confetti = el => { const c=document.createElement("div"); c.className="confetti"; const cols=["#22C55E","#FACC15","#FF8A1F","#8B5CF6","#38BDF8","#F472B6"];
  let h=""; for(let i=0;i<40;i++){ h+='<i style="left:'+(Math.random()*100)+'%;background:'+cols[i%cols.length]+';animation-duration:'+(1.6+Math.random()*1.6)+'s;animation-delay:'+(Math.random()*.6)+'s;transform:rotate('+(Math.random()*360)+'deg)"></i>'; }
  c.innerHTML=h; el.appendChild(c); setTimeout(()=>c.remove(),4000); };

/* ---------- paylaş ---------- */
FK.share = text => {
  if(window.FKAndroid && FKAndroid.share){ FKAndroid.share(text); return; }
  if(navigator.share){ navigator.share({text}).catch(()=>{}); return; }
  try{ navigator.clipboard.writeText(text); FK.toast(t("shared"),"check"); }catch(e){}
};
})();
