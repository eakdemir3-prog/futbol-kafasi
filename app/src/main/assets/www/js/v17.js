/* v1.6: Oyun Modları sayfası, Hemen Oyna, Ortak görseli, başarım metinleri */
(function(){ const FK=window.FK, t=FK.t, S=FK.screens;
Object.assign(FK_I18N.tr,{ achOpened:"başarım açıldı", achDone:"Bu başarımı kazandın!", achTodo:"Henüz açılmadı. Görevi tamamla, elmasları kap!",
  gm_title:"OYUN MODLARI", gm_main:"Ana Modlar", gm_quick:"Hızlı Oyunlar", gm_daily:"Günlük", gm_duel:"Düello", gm_last:"Kaldığın yer", gm_lv:"Bölüm {a}/{b}", gm_done:"Bugün tamam ✓", gm_new:"Yeni",
  lvLockedN:"Bu bölüm kilitli · Önce Bölüm {n}'i oyna", lvLockedP:"{a} kilitli · Önce Bölüm {n}'e ulaş" });
Object.assign(FK_I18N.en,{ achOpened:"achievements unlocked", achDone:"You earned this achievement!", achTodo:"Not unlocked yet. Complete it to grab the gems!",
  gm_title:"GAME MODES", gm_main:"Main Modes", gm_quick:"Quick Games", gm_daily:"Daily", gm_duel:"Duels", gm_last:"Continue", gm_lv:"Level {a}/{b}", gm_done:"Done today ✓", gm_new:"New",
  lvLockedN:"Level locked · Play Level {n} first", lvLockedP:"{a} locked · Reach Level {n} first" });

/* son oynanan bölüm modu */
const _pl=FK.playLevel; FK.playLevel=(mode,n)=>{ const s=FK.state; if(n<=FK.lvState(mode).cur){ s.lastLv=mode; FK.save(); } return _pl(mode,n); };
FK.quickPlay=()=>{ const s=FK.state; let m=s.lastLv; if(!m||!FK.LV[m]) m="guess"; const S=FK.lvState(m), n=Math.min(FK.LV[m].N,S.cur);
  FK.go("intro",{mode:m}); setTimeout(()=>FK.playLevel(m,n),60); };
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-quickplay]"); if(b){ e.stopPropagation(); FK.sfx("tap"); FK.quickPlay(); } },true);

/* oyun modları sayfası */
const ART={guess:"card_player",career:null,ortak:"o_venn",kadro:null,player:null,club:null,flag:null,more:null,tf:null,daily:null,word:null};
const art=m=>ART[m]?'<img class="gm-art" src="img/'+ART[m]+'.webp" alt="">':'<div class="gm-art">'+(FK.modeArt?FK.modeArt(m):"")+'</div>';
S.games = el => { const s=FK.state; FK.rollover&&FK.rollover();
  const d10=s.daily10&&s.daily10.date===FK.dayKey()&&s.daily10.done, wd=s.word&&s.word.date===FK.dayKey()&&s.word.done;
  const best=m=>(s.stats.byMode[m]||{}).best||0, last=s.lastLv;
  const prog=m=>{ if(FK.LV[m]){ const L=FK.lvState(m), st=Object.values(L.st).reduce((a,b)=>a+b,0); return t("gm_lv",{a:Math.min(L.cur,FK.LV[m].N),b:FK.LV[m].N})+' · ★ '+st; }
    if(m==="daily") return d10?t("gm_done"):t("today"); if(m==="word") return wd?t("gm_done"):t("today");
    return best(m)?t("best",{s:FK.fmtNum(best(m))}):t("gm_new"); };
  const card=(m,big)=>'<button class="gm-c'+(big?" big":"")+'" data-mode="'+m+'" style="background:'+(FK.modeColor?FK.modeColor(m):"#B79DFF")+'">'+(m===last?'<span class="gm-last">▶ '+t("gm_last")+'</span>':'')+'<b>'+FK.esc(FK.modeName(m))+'</b>'+art(m)+'<span class="gm-p">'+prog(m)+'</span></button>';
  const has=m=>m==="guess"||FK.MODES[m];
  const sec=(k,list)=>{ list=list.filter(has); return list.length?'<div class="gm-sec">'+t(k)+'</div><div class="gm-grid">'+list.map(m=>card(m)).join("")+'</div>':''; };
  el.classList.add("has-nav");
  el.innerHTML='<div class="scroll"><div class="stack" style="gap:12px">'+
   '<div class="row" style="justify-content:space-between;align-items:center"><div style="flex:1"></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
   FK.v6rib(t("gm_title"),"#C6FF3D",36)+
   card("guess",true)+
   sec("gm_main",["career","ortak","kadro","player","club","flag"])+
   sec("gm_quick",["more","tf"])+
   sec("gm_daily",["daily","word"])+
   '<div class="gm-sec">'+t("gm_duel")+'</div>'+
   '<button class="gm-duel" data-duel><img src="img/o_pen.webp" alt=""><div class="grow"><b>'+t("duel")+'</b><span>'+t("duelS")+'</span></div><i>›</i></button>'+
  '</div></div>'+FK.nav("games");
  FK.bindNav(el);
  el.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); const m=b.dataset.mode; if(m==="word") FK.go("word"); else if(m==="ortak") FK.go("ortak"); else FK.go("intro",{mode:m}); });
  el.querySelectorAll("[data-duel]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); FK.go("duel"); });
};

})();
/* tek ekran: taşan oyun ekranlarını kademeli sıkıştır (fit1..fit3), jokeri güçlendirici satırına al */
(function(){ const FK=window.FK;
const fitOne=(host,sc)=>{ if(!sc||!sc.clientHeight) return; let lv=+host.dataset.fit||0;
  while(sc.scrollHeight>sc.clientHeight+2 && lv<3){ lv++; host.classList.add("fit"+lv); host.dataset.fit=lv; } };
const jk=scr=>{ const jr=scr.querySelector(".joker-row"), bb=scr.querySelector(".boost-bar"); if(!jr||!bb) return; const b=jr.querySelector("button"); if(!b) return;
  b.classList.add("boost","jk"); bb.insertBefore(b,bb.firstChild); jr.remove(); };
const run=()=>{ document.querySelectorAll("#app .screen.mframe").forEach(scr=>{ jk(scr); fitOne(scr,scr.querySelector(":scope>.scroll")); });
  const w=document.querySelector(".v6-enw .modal"); if(w) fitOne(w,w); };
const start=()=>{ const a=document.getElementById("app"); if(!a||!window.MutationObserver) return; let q=false;
  new MutationObserver(()=>{ if(!q){ q=true; requestAnimationFrame(()=>{ q=false; run(); }); } }).observe(document.body,{childList:true,subtree:true}); };
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
})();
/* Cevapları İncele */
(function(){ const FK=window.FK, t=FK.t, S=FK.screens;
Object.assign(FK_I18N.tr,{ rv_btn:"📋 Cevapları İncele", rv_title:"CEVAPLARI İNCELE", rv_sub:"Sorularını ve doğru cevapları gözden geçir", rv_ok:"DOĞRU", rv_no:"YANLIŞ", rv_skip:"BOŞ", rv_right:"Doğru", rv_mine:"Senin", rv_none:"Cevap yok", rv_flag:"Bu hangi ülkenin bayrağı?", rv_route:"Bu futbolcu kim?" });
Object.assign(FK_I18N.en,{ rv_btn:"📋 Review Answers", rv_title:"REVIEW ANSWERS", rv_sub:"Go over your questions and the right answers", rv_ok:"RIGHT", rv_no:"WRONG", rv_skip:"SKIPPED", rv_right:"Answer", rv_mine:"Yours", rv_none:"No answer", rv_flag:"Which country's flag is this?", rv_route:"Who is this player?" });
FK._rv={mode:null,items:[]};
FK.rvReset=m=>{ FK._rv={mode:m,items:[]}; };
FK.rvPush=(m,it)=>{ if(FK._rv.mode!==m) FK.rvReset(m); FK._rv.items.push(it); };
FK.rvBtn=m=>FK._rv.mode===m&&FK._rv.items.length?'<button class="btn btn-ghost rv-btn" data-review>'+t("rv_btn")+'</button>':'';
const cn=c=>FK_GCLUBS[c]?FK_GCLUBS[c][0]:c;
FK.rvFromGame=g=>{ if(!g||!g.qs||!g.qs.length||g.mode==="duel"||g.mode==="live") return '';
  const items=g.qs.slice(0,Math.max(g.res.length,0)).map((q,k)=>{ const r=g.res[k]; let txt="", vis="";
    if(q.text) txt=FK.esc(q.text);
    else if(q.code){ txt=t("rv_flag"); vis='<img class="rv-flag" src="img/flags/'+String(q.code).toLowerCase()+'.svg" alt="">'; }
    else if(q.clubs){ txt=t("rv_route"); vis='<div class="rv-route">'+q.clubs.map(c=>FK.esc(cn(c))).join(" → ")+'</div>'; }
    else if(q.slots&&q.club){ txt=t("kd_ask",{c:FK.esc(q.clubName||cn(q.club)),p:t("kdp_"+q.pos)}); vis=FK.clubBadge(q.club,34); }
    else if(q.clues){ txt=FK.esc(q.clues[0]); if(g.mode==="club"&&FK_GCLUBS) { const code=Object.keys(FK_GCLUBS).find(c=>FK_GCLUBS[c][0]===q.answer); if(code) vis=FK.clubBadge(code,34); } }
    const mine = q._pick || (r===true ? q.answer : null);
    return {q:txt,vis,mine:mine?FK.esc(mine):null,right:FK.esc(q.answer||""),ok:r===true?true:r===false?false:null,raw:1}; });
  if(!items.length) return '';
  FK._rv={mode:g.mode,items}; return '<button class="btn btn-ghost rv-btn" data-review>'+t("rv_btn")+'</button>'; };
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-review]"); if(!b) return; e.stopPropagation(); FK.sfx("tap"); FK.go("review",{mode:FK._rv.mode,items:FK._rv.items}); },true);
S.review=(el,{mode,items})=>{ items=items||[];
  el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"></div></div>'+
   '<div class="scroll"><div class="stack" style="gap:10px">'+FK.v6rib(t("rv_title"),"#B79DFF",30)+'<p class="rv-sub">'+FK.esc(FK.modeName(mode))+' · '+t("rv_sub")+'</p>'+
   items.map((it,i)=>{ const st=it.ok===true?"ok":it.ok===false?"no":"skip", e=x=>it.raw?x:FK.esc(x);
     return '<div class="rv-it '+st+'"><span class="rv-n">'+(i+1)+'</span><div class="rv-m">'+(it.vis||"")+'<b>'+e(it.q)+'</b>'+
       (it.ok!==true?'<span class="rv-mine">'+t("rv_mine")+': '+(it.mine?e(it.mine):t("rv_none"))+'</span>':'')+
       '<span class="rv-r">'+t("rv_right")+': <b>'+e(it.right)+'</b></span></div>'+
       '<div class="rv-st"><img src="img/'+(st==="ok"?"o_ok":"o_no")+'.webp" alt=""'+(st==="skip"?' style="opacity:.5"':'')+'><i>'+t(st==="ok"?"rv_ok":st==="no"?"rv_no":"rv_skip")+'</i></div></div>'; }).join("")+
   '</div></div>';
  el.querySelector("[data-back]").onclick=()=>FK.back(); };
})();
