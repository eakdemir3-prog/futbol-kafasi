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
  document.querySelectorAll("#app .screen.rframe").forEach(scr=>fitOne(scr,scr.querySelector(":scope>.scroll")));
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
/* v1.6 başarımlar: 12 → 36 */
(function(){ const FK=window.FK, t=FK.t;
const tr={ achSecret:"Gizli başarım", gm_acat_p:"İlerleme", gm_acat_m:"Mod Ustalığı", gm_acat_l:"Harita", gm_acat_d:"Düello", gm_acat_s:"Gizli",
 ach_allModesD:"Bütün modları en az bir kez oyna",
 ach_g100:"Maç Bağımlısı", ach_g100D:"100 oyun tamamla", ach_c2000:"Futbol Ansiklopedisi", ach_c2000D:"Toplam 2.000 doğru cevap",
 ach_days30:"Alev Alev", ach_days30D:"30 gün üst üste giriş", ach_lv25:"Kürsüde", ach_lv25D:"25. seviyeye ulaş",
 ach_guess25:"Baş Dedektif", ach_guess25D:"Oyuncuyu Tahmin Et'te 25 oyuncu bul", ach_route50:"Transfer Uzmanı", ach_route50D:"Transfer Rotası'nda 50 futbolcu bul",
 ach_flag100:"Bayrak Atlası", ach_flag100D:"Bayrak modunda 100 doğru", ach_clubP:"Arma Kâşifi", ach_clubPD:"Kulübü Tanı'da 10/10",
 ach_kadro25:"Teknik Direktör", ach_kadro25D:"Kadroyu Tamamla'da 25 eksik oyuncu bul", ach_ortak50:"Bağlantı Ustası", ach_ortak50D:"Ortak Futbolcu'da 50 doğru",
 ach_tf20:"Yalan Dedektörü", ach_tf20D:"Doğru mu Yanlış mı'da 20 kombo", ach_more15:"Terazi", ach_more15D:"Hangisi Daha Fazla'da 15 seri",
 ach_word2:"Kelime Avcısı", ach_word2D:"Günün Kelimesi'ni 2 denemede bil", ach_daily10:"Günün Yıldızı", ach_daily10D:"Günün 10'unda 10/10",
 ach_league1:"Lig Fatihi", ach_league1D:"Herhangi bir modda bir ligi bitir", ach_league3:"Yıldızlar Ligi", ach_league3D:"Bir ligin tüm bölümlerini 3 yıldızla bitir",
 ach_win1:"İlk Galibiyet", ach_win1D:"İlk düello galibiyetini al", ach_win10:"Düello Kurdu", ach_win10D:"10 düello kazan", ach_win50:"Düello Kralı", ach_win50D:"50 düello kazan",
 ach_pk3:"Penaltı Ustası", ach_pk3D:"Penaltı Düellosu'nda 3 galibiyet", ach_bot:"Robot Avcısı", ach_botD:"Kafa Bot'u yen", ach_friend:"Dostluk Maçı", ach_friendD:"Bir arkadaşını kodlu düelloda yen",
 ach_night:"Gece Kuşu", ach_nightD:"Gece 00:00–05:00 arası bir oyun bitir", ach_fast:"Şimşek", ach_fastD:"Bir soruyu 2 saniyeden kısa sürede doğru bil" };
const en={ achSecret:"Secret achievement", gm_acat_p:"Progress", gm_acat_m:"Mode Mastery", gm_acat_l:"Map", gm_acat_d:"Duels", gm_acat_s:"Secret", ach_allModesD:"Play every mode at least once",
 ach_g100:"Match Addict", ach_g100D:"Finish 100 games", ach_c2000:"Football Encyclopedia", ach_c2000D:"2,000 correct answers in total",
 ach_days30:"On Fire", ach_days30D:"Log in 30 days in a row", ach_lv25:"On the Podium", ach_lv25D:"Reach level 25",
 ach_guess25:"Chief Detective", ach_guess25D:"Find 25 players in Guess the Player", ach_route50:"Transfer Guru", ach_route50D:"Find 50 players in Transfer Route",
 ach_flag100:"Flag Atlas", ach_flag100D:"100 correct in Flags", ach_clubP:"Crest Explorer", ach_clubPD:"10/10 in Name the Club",
 ach_kadro25:"Head Coach", ach_kadro25D:"Find 25 missing players in Complete the XI", ach_ortak50:"Link Master", ach_ortak50D:"50 correct in Common Player",
 ach_tf20:"Lie Detector", ach_tf20D:"20 combo in True or False", ach_more15:"Balance", ach_more15D:"15 streak in Higher or Lower",
 ach_word2:"Word Hunter", ach_word2D:"Solve the Word of the Day in 2 tries", ach_daily10:"Star of the Day", ach_daily10D:"10/10 in the Daily 10",
 ach_league1:"League Conqueror", ach_league1D:"Finish a league in any mode", ach_league3:"League of Stars", ach_league3D:"Finish every level of a league with 3 stars",
 ach_win1:"First Win", ach_win1D:"Win your first duel", ach_win10:"Duel Wolf", ach_win10D:"Win 10 duels", ach_win50:"Duel King", ach_win50D:"Win 50 duels",
 ach_pk3:"Penalty Master", ach_pk3D:"Win 3 Penalty Duels", ach_bot:"Bot Hunter", ach_botD:"Beat Kafa Bot", ach_friend:"Friendly Match", ach_friendD:"Beat a friend in a code duel",
 ach_night:"Night Owl", ach_nightD:"Finish a game between 00:00 and 05:00", ach_fast:"Lightning", ach_fastD:"Answer correctly in under 2 seconds" };
Object.assign(FK_I18N.tr,tr); Object.assign(FK_I18N.en,en);
const ac=s=>(s.ac=s.ac||{});
FK.acHit=(k,n)=>{ const s=FK.state, a=ac(s); a[k]=(a[k]||0)+(n||1); const got=FK.checkAch(); FK.save(); got.forEach(x=>setTimeout(()=>FK.toast("🏆 "+t("ach_"+x.id)+" · +"+x.gem+" 💎","trophy",3000),900)); };
const bm=(s,m)=>s.stats.byMode[m]||{plays:0,best:0,correct:0};
const lg=s=>{ let one=false,three=false; Object.keys(FK.LV||{}).forEach(m=>{ const L=FK.LV[m], st=FK.lvState(m), per=L.per||Math.floor(L.N/5); for(let k=0;k*per<L.N;k++){ const a=k*per+1,b=(k+1)*per; if(st.cur>b){ one=true; let all=true; for(let i=a;i<=b;i++) if((st.st[i]||0)<3){ all=false; break; } if(all) three=true; } } }); return {one,three}; };
const old={first:1,c100:2,c500:7,streak10:12,perfect:4,legend:5,flag:3,career:15,days7:6,lv10:8,wordle:14,allModes:9};
FK.ACH.forEach(a=>{ a.img=old[a.id]; a.cat= ["first","c100","c500","days7","lv10","streak10","perfect","legend"].indexOf(a.id)>=0?"p":"m"; });
const am=FK.ACH.find(a=>a.id==="allModes"); if(am) am.test=s=>["player","club","flag","daily","career","guess","word","kadro","ortak","more","tf"].every(m=>s.stats.byMode[m]&&s.stats.byMode[m].plays>0);
const c500=FK.ACH.find(a=>a.id==="c500"); if(c500) c500.prog=s=>[s.stats.correct,500];
const c100=FK.ACH.find(a=>a.id==="c100"); if(c100) c100.prog=s=>[s.stats.correct,100];
const car=FK.ACH.find(a=>a.id==="career"); if(car) car.prog=s=>[s.careerFirst||0,5];
const d7=FK.ACH.find(a=>a.id==="days7"); if(d7) d7.prog=s=>[s.login.streak||0,7];
[
 {id:"g100",img:10,cat:"p",gem:20,prog:s=>[s.stats.games,100],test:s=>s.stats.games>=100},
 {id:"c2000",img:11,cat:"p",gem:50,prog:s=>[s.stats.correct,2000],test:s=>s.stats.correct>=2000},
 {id:"days30",img:12,cat:"p",gem:50,prog:s=>[s.login.streak||0,30],test:s=>(s.login.streak||0)>=30},
 {id:"lv25",img:13,cat:"p",gem:40,prog:s=>[FK.levelInfo(s.xp).level,25],test:s=>FK.levelInfo(s.xp).level>=25},
 {id:"guess25",img:14,cat:"m",gem:30,prog:s=>[bm(s,"guess").correct,25],test:s=>bm(s,"guess").correct>=25},
 {id:"route50",img:15,cat:"m",gem:30,prog:s=>[s.careerFirst||0,50],test:s=>(s.careerFirst||0)>=50},
 {id:"flag100",img:16,cat:"m",gem:20,prog:s=>[bm(s,"flag").correct,100],test:s=>bm(s,"flag").correct>=100},
 {id:"clubP",img:17,cat:"m",gem:25,test:(s,g)=>g&&g.mode==="club"&&g.total>=10&&g.correct===g.total},
 {id:"kadro25",img:18,cat:"m",gem:25,prog:s=>[bm(s,"kadro").correct,25],test:s=>bm(s,"kadro").correct>=25},
 {id:"ortak50",img:19,cat:"m",gem:30,prog:s=>[bm(s,"ortak").correct,50],test:s=>bm(s,"ortak").correct>=50},
 {id:"tf20",img:20,cat:"m",gem:25,test:(s,g)=>g&&g.mode==="tf"&&(g.bestStreak||0)>=20},
 {id:"more15",img:21,cat:"m",gem:25,test:(s,g)=>g&&g.mode==="more"&&(g.correct||0)>=15},
 {id:"word2",img:22,cat:"m",gem:25,test:(s,g)=>g&&g.mode==="word"&&g.correct===1&&(g.score||0)>=5},
 {id:"daily10",img:23,cat:"m",gem:30,test:(s,g)=>g&&g.mode==="daily"&&g.total>=10&&g.correct===g.total},
 {id:"league1",img:24,cat:"l",gem:30,test:s=>lg(s).one},
 {id:"league3",img:25,cat:"l",gem:50,test:s=>lg(s).three},
 {id:"win1",img:26,cat:"d",gem:15,test:s=>(s.stats.duelWins||0)>=1},
 {id:"win10",img:27,cat:"d",gem:30,prog:s=>[s.stats.duelWins||0,10],test:s=>(s.stats.duelWins||0)>=10},
 {id:"win50",img:28,cat:"d",gem:50,prog:s=>[s.stats.duelWins||0,50],test:s=>(s.stats.duelWins||0)>=50},
 {id:"pk3",img:29,cat:"d",gem:25,prog:s=>[ac(s).pkw||0,3],test:s=>(ac(s).pkw||0)>=3},
 {id:"bot",img:30,cat:"d",gem:15,test:s=>(ac(s).bot||0)>=1},
 {id:"friend",img:31,cat:"d",gem:20,test:s=>(ac(s).friend||0)>=1},
 {id:"night",img:32,cat:"s",gem:15,secret:1,test:(s,g)=>{ if(!g) return false; const h=new Date().getHours(); return h>=0&&h<5; }},
 {id:"fast",img:33,cat:"s",gem:15,secret:1,test:(s,g)=>!!(g&&g.ut&&g.res&&g.ut.some((u,k)=>g.res[k]===true&&u>0&&u<2000))}
].forEach(a=>{ a.ic="star"; a.c="#C6FF3D"; FK.ACH.push(a); });
FK.ACH.forEach(a=>{ if(a.id==="allModes") a.cat="m"; });
})();
/* sonuç ekranı: tek ekran düzeni */
(function(){ const FK=window.FK, S=FK.screens; const _r=S.result;
S.result=(el,p)=>{ _r(el,p);
  const ag=el.querySelector("[data-again].btn-ghost"), rv=el.querySelector(".rv-btn");
  if(ag&&rv){ const row=document.createElement("div"); row.className="rs-pair"; ag.parentNode.insertBefore(row,ag); row.appendChild(ag); row.appendChild(rv); }
  const card=el.querySelector(".scroll .card.stack"); if(card){ card.classList.add("rs-xpc"); const gem=card.querySelector(".chip-gem"), xp=card.querySelector(".chip-xp"); if(gem&&xp){ const r2=gem.parentNode; xp.parentNode.insertBefore(gem,xp.nextSibling); const tx=r2.querySelector(".small"); if(tx&&tx.textContent.trim()) { tx.classList.add("rs-mis"); card.appendChild(tx); } r2.remove(); } }
};
})();
