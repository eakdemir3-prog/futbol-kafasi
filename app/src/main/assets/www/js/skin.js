/* ==========================================================
   v1.6 — Gece Stadyumu (çizgi roman) görünümü: ana sayfa mod kartları,
   sade kulüp etiketleri (arma yok), metinle transfer rotası, logosuz formalar.
   Oyun kuralları, veriler ve puanlama değişmez.
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, IL=FK.IL;
Object.assign(FK_I18N.tr,{ hm_play:"HEMEN\nOYNA", hm_duel:"ONLINE\nDÜELLO", hm_modes:"Oyun Modları", hm_all:"Tüm Modlar", rt_from:"Kariyer sırası" });
Object.assign(FK_I18N.en,{ hm_play:"PLAY\nNOW", hm_duel:"ONLINE\nDUEL", hm_modes:"Game Modes", hm_all:"All Modes", rt_from:"Career order" });
const K='#130A2E';
/* ek çizimler: saha (kadro), harf kutuları (kelime), sade kalkan (kulüp) */
IL.field=()=>'<svg class="il" width="120" height="96" viewBox="0 0 110 90" fill="none" stroke="'+K+'" stroke-width="4"><rect x="6" y="6" width="98" height="80" rx="6" fill="#4ADE80"/><path d="M6 46 L104 46"/><circle cx="55" cy="46" r="12"/>'+[[30,24],[55,18],[80,24],[40,62],[70,62]].map(([x,y])=>'<path d="M'+(x-8)+' '+(y-5)+' l-6 4 l3 6 l3 -2 l0 10 l16 0 l0 -10 l3 2 l3 -6 l-6 -4 q-8 4 -16 0z" fill="#fff" stroke-width="2.5"/>').join("")+'<circle cx="55" cy="72" r="9" fill="#C6FF3D"/><text x="55" y="77" text-anchor="middle" font-family="Barlow Condensed" font-weight="900" font-size="15" fill="'+K+'" stroke="none">?</text></svg>';
IL.tiles=()=>'<svg class="il" width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="'+K+'" stroke-width="4">'+[["G","#C6FF3D",4,8],["O","#FFD23F",42,8],["L","#FFF1D6",80,8],["?","#FFF1D6",23,48],["!","#C6FF3D",61,48]].map(([c,f,x,y])=>'<rect x="'+x+'" y="'+y+'" width="34" height="34" rx="6" fill="'+f+'"/><text x="'+(x+17)+'" y="'+(y+27)+'" text-anchor="middle" font-family="Barlow Condensed" font-weight="900" font-size="26" fill="'+K+'" stroke="none">'+c+'</text>').join("")+'</svg>';
IL.shield=()=>IL.shieldQ();
const MC={guess:["#5CD0F5",IL.silhouette],career:["#B79DFF",IL.shirtArrow],ortak:["#FF8F3F",IL.shields],kadro:["#5FE3CF",IL.field],
  player:["#5CD0F5",IL.player10],club:["#B79DFF",IL.shield],flag:["#FF8F3F",IL.flagBlank],more:["#5FE3CF",IL.stopwatch],tf:["#5CD0F5",IL.ballQ],daily:["#FF8F3F",IL.calendar],word:["#B79DFF",IL.tiles]};
FK.modeColor=m=>(MC[m]||["#B79DFF"])[0];
FK.homeModes=()=>Object.keys(MC).filter(m=>m==="guess"||FK.MODES[m]).map(m=>'<button class="hm-mode" data-mode="'+m+'" style="background:'+MC[m][0]+'"><b>'+FK.esc(FK.modeName(m))+'</b>'+MC[m][1]()+'</button>').join("");
FK.modeArt=m=>MC[m]?MC[m][1]():"";

/* kulüp etiketi: arma yerine sade isim plakası (kulüp kısaltması). Gerçek armayı taklit etmez */
FK.clubBadge=(code,size=40)=>{ const c=FK_GCLUBS[code]; if(!c) return '';
  const fs=Math.max(9,Math.round(size*(c[1].length>3?.28:.34)));
  return '<span class="cbadge ctag" title="'+FK.esc(c[0])+'" style="width:'+size+'px;height:'+size+'px;font-size:'+fs+'px">'+FK.esc(c[1])+'</span>'; };

/* Transfer Rotası: kulüp adları düz metin, sıra oklarla; üstte logosuz sade forma */
FK.routeStage=(q,timer)=>'<div class="stage rt2">'+timer+'<div class="rt2-ill">'+IL.shirtArrow()+'</div><div class="rt2-list">'+q.clubs.map((c,i)=>{ const C=FK_GCLUBS[c]||[c];
  return (i?'<span class="rt2-ar">➜</span>':'')+'<span class="rt2-c'+(q.hide&&q.hide[i]?' q':'')+'">'+(q.hide&&q.hide[i]?'?':FK.esc(C[0]))+(q.years&&q.years[i]&&!(q.hide&&q.hide[i])?'<i>'+q.years[i]+'</i>':'')+'</span>'; }).join("")+'</div><div class="rt-ask">'+t("rt_ask")+'</div></div>';
})();
(function(){
const FK=window.FK, t=FK.t, IL=FK.IL, K='#130A2E';
Object.assign(FK_I18N.tr,{ hm_play:"Hemen Oyna", hm_duel:"Online Düello", hm_quick:"Hızlı Oyunlar", nv_play:"Oyna", rs_score:"SKOR", rs_pts:"puan" });
Object.assign(FK_I18N.en,{ hm_play:"Play Now", hm_duel:"Online Duel", hm_quick:"Quick Games", nv_play:"Play", rs_score:"SCORE", rs_pts:"points" });
IL.gear=()=>'<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff" stroke="'+K+'" stroke-width="1.6"><path d="M10.3 2h3.4l.5 2.6 1.7.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.7 2.6.5v3.4l-2.6.5-.8 1.7 1.5 2.2-2.4 2.4-2.2-1.5-1.7.8-.5 2.6h-3.4l-.5-2.6-1.7-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.7L2 13.7v-3.4l2.6-.5.8-1.7-1.5-2.2 2.4-2.4 2.2 1.5 1.7-.8z"/><circle cx="12" cy="12" r="3.4" fill="'+K+'"/></svg>';
FK.quickModes=()=>[["more","#FF7D72",IL.stopwatch],["tf","#5FE3CF",IL.ballQ]].map(([m,c,f])=>'<button class="hm-mode q" data-mode="'+m+'" style="background:'+c+'"><b>'+FK.esc(FK.modeName(m))+'</b>'+f()+'</button>').join("");
FK.homeModes=()=>["guess","career","ortak","kadro","player","club","flag","daily","word"].filter(m=>m==="guess"||FK.MODES[m]).map(m=>'<button class="hm-mode" data-mode="'+m+'" style="background:'+FK.modeColor(m)+'"><b>'+FK.esc(FK.modeName(m))+'</b>'+FK.modeArt(m)+'</button>').join("");

/* alt menü: 3 sekme (Ana Sayfa · Oyna · Profil). Sıralama ve görevler ana sayfadan açılır */
const PAD='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.4 1.8L15 15H9l-1.6 1.8A3 3 0 0 1 2 15v-3a4 4 0 0 1 4-4z"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".6" fill="currentColor"/><circle cx="18" cy="13.5" r=".6" fill="currentColor"/></svg>';
FK.nav=active=>{ const dot=FK.unclaimedCount()>0, map={rank:"home",missions:"home"};
  const a=map[active]||active;
  return '<nav class="nav nav3">'+[["home",FK.ic("home",26,2.2),t("navHome")],["games",PAD,t("nv_play")],["profile",FK.ic("user",26,2.2),t("navProfile")]].map(([k,ic,l])=>'<button class="nav-item'+(a===k?" active":"")+'" data-nav="'+k+'">'+ic+'<span>'+l+'</span>'+(k==="home"&&dot?'<i class="dot"></i>':'')+'</button>').join("")+'</nav>'; };

/* oyun ekranı başlığı: ← · küçük logo · sayaç (noktalı). Mod adı kartın üstünde lime şerit */
const skinHead=scr=>{ const gh=scr.querySelector(".game-head:not([data-sk])"); if(!gh) return; gh.dataset.sk=1;
  const tt=gh.querySelector(".h-display"), title=tt?tt.textContent:"";
  const q=gh.querySelector("[data-quit],[data-back]"); if(q){ const sv=q.querySelector("svg"); if(sv) sv.outerHTML=FK.ic("left",22,2.8); }
  const grow=gh.querySelector(".grow"); if(grow) grow.innerHTML=IL.logo("mf-logo2");
  const qb=gh.nextElementSibling&&gh.nextElementSibling.classList.contains("qbar")?gh.nextElementSibling:null;
  if(qb){ const sp=[...qb.children], n=sp.length; let cur=sp.findIndex(x=>x.classList.contains("cur")); if(cur<0) cur=sp.filter(x=>x.classList.contains("ok")||x.classList.contains("no")).length-1;
    const cnt='<div class="mf-cnt"><b>'+Math.max(1,cur+1)+'/'+n+'</b><i>'+sp.map(x=>'<u class="'+(x.className||"")+'"></u>').join("")+'</i></div>';
    const pills=gh.querySelectorAll(".pill"); if(pills.length) pills[pills.length-1].outerHTML=cnt; else gh.insertAdjacentHTML("beforeend",cnt);
    qb.style.display="none"; }
  if(title) (qb||gh).insertAdjacentHTML("afterend",'<div class="mf-rib"><span>'+FK.esc(title)+'</span></div>'); };
const run=()=>{ document.querySelectorAll("#app .screen.mframe").forEach(skinHead); };
const start=()=>{ const a=document.getElementById("app"); if(!a||!window.MutationObserver) return; let q=false; new MutationObserver(()=>{ if(!q){ q=true; requestAnimationFrame(()=>{ q=false; run(); }); } }).observe(a,{childList:true,subtree:true}); run(); };
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
})();
/* v1.6: dalgalı bayrak — gerçek bayrak çizimi (flag-icons, MIT) şeritlere bölünüp dalgalandırılır, kumaşı tamamen doldurur */
(function(){ const FK=window.FK, K='#130A2E'; let uid=0;
FK.waveFlag=(code,W)=>{ W=W||230; const H=Math.round(W*.66), A=W*.045, id="wf"+(++uid), PX=26, PY=18, SC=A*4;
  const src="img/flags/"+String(code||"").toLowerCase()+".svg";
  const dy=x=>A*Math.sin((x/W)*Math.PI*2.1-0.6)*(0.35+0.65*x/W);
  /* yer değiştirme haritası: yeşil kanal = dalga (yumuşak, şerit yok) */
  let ms=""; for(let i=0;i<=40;i++){ const x=W*i/40, g=Math.round(255*(0.5-dy(x)/SC)); ms+='<stop offset="'+(i/40)+'" stop-color="rgb(128,'+g+',128)"/>'; }
  const map='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'"><defs><linearGradient id="g">'+ms+'</linearGradient></defs><rect width="'+W+'" height="'+H+'" fill="url(#g)"/></svg>');
  let top="",bot=""; for(let i=0;i<=40;i++){ const x=W*i/40; top+=(i?' L':'M')+(PX+x).toFixed(1)+' '+(PY+dy(x)).toFixed(1); bot=' L'+(PX+x).toFixed(1)+' '+(PY+H+dy(x)).toFixed(1)+bot; }
  const outline=top+bot+' Z';
  let st=""; for(let i=0;i<=30;i++){ const x=W*i/30, sl=(dy(x+1)-dy(x-1))/2, o=Math.max(-0.2,Math.min(0.16,sl*1.6)); st+='<stop offset="'+(i/30)+'" stop-color="'+(o>0?'#000':'#fff')+'" stop-opacity="'+Math.abs(o).toFixed(3)+'"/>'; }
  return '<svg class="wflag" viewBox="0 0 '+(W+PX+14)+' '+(H+PY+30)+'" aria-hidden="true"><defs>'+
    '<filter id="'+id+'f" x="'+PX+'" y="'+(PY-A*2)+'" width="'+W+'" height="'+(H+A*4)+'" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feImage href="'+map+'" x="'+PX+'" y="'+(PY-A*2)+'" width="'+W+'" height="'+(H+A*4)+'" preserveAspectRatio="none" result="m"/><feDisplacementMap in="SourceGraphic" in2="m" scale="'+SC+'" xChannelSelector="R" yChannelSelector="G"/></filter>'+
    '<clipPath id="'+id+'c"><path d="'+outline+'"/></clipPath><linearGradient id="'+id+'g" x1="'+PX+'" x2="'+(PX+W)+'" y1="0" y2="0" gradientUnits="userSpaceOnUse">'+st+'</linearGradient></defs>'+
    '<g clip-path="url(#'+id+'c)"><g filter="url(#'+id+'f)"><rect x="'+PX+'" y="'+(PY-A*2)+'" width="'+W+'" height="'+(H+A*4)+'" fill="none"/><image href="'+src+'" x="'+PX+'" y="'+PY+'" width="'+W+'" height="'+H+'" preserveAspectRatio="none"/></g></g>'+
    '<path d="'+outline+'" fill="url(#'+id+'g)"/>'+
    '<path d="'+outline+'" fill="none" stroke="#130A2E" stroke-width="5" stroke-linejoin="round"/>'+
    '<rect x="'+(PX-12)+'" y="'+(PY-6)+'" width="10" height="'+(H+34)+'" rx="5" fill="#FFF1D6" stroke="#130A2E" stroke-width="4"/>'+
    '<circle cx="'+(PX-7)+'" cy="'+(PY-10)+'" r="9" fill="#FFF1D6" stroke="#130A2E" stroke-width="4"/></svg>'; };
})();
