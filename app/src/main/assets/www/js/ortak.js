/* ==========================================================
   v1.5 — ORTAK FUTBOLCU (Kulüp Zinciri'nin yerine)
   İki kulüp gösterilir; ikisinde de forma giymiş bir futbolcu yazılır. Birden fazla doğru cevap olabilir.
   Bölümlü (levels) · Online (fk_live odası, önce doğru yazan turu alır, 7 tur) · Kafa Bot
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, N=()=>window.FKAndroid;
Object.assign(FK_I18N.tr,{
  m_ortak:"Ortak Futbolcu", m_ortakS:"İki kulüpte de oynamış futbolcuyu bul", or_title:"ORTAK FUTBOLCU",
  or_ask:"İki kulüpte de forma giymiş bir futbolcu yaz", or_cnt:"Bu iki kulübün {n} ortak oyuncusu var · hepsi doğru sayılır", or_cnt1:"Bu iki kulübün tek bir ortak oyuncusu var",
  or_ph:"Futbolcu adı…", or_pass:"Pas", or_ok:"Doğru! {p}", or_wrong:"{p} bu iki kulübün ikisinde birden oynamadı", or_also:"Diğer doğru cevaplar: {l}", or_ans:"Cevaplar: {l}",
  or_time:"Süre doldu!", or_online:"Online maç", or_onlineS:"Önce doğru yazan turu alır · 7 tur", or_bot:"Kafa Bot'a karşı", or_botS:"Tek başına antrenman", or_levels:"Bölümler", or_levelsS:"Kolaydan zora 200 bölüm",
  or_round:"Tur {i}/{n}", or_youGot:"Turu sen aldın!", or_oppGot:"Turu {n} aldı", or_noOne:"Kimse bilemedi", or_rules:"Ortak Futbolcu: Ekranda iki kulüp var. İkisinde de forma giymiş (kiralık dahil) bir futbolcu yaz. Birden fazla doğru cevap olabilir, hangisini yazarsan yaz doğru sayılır. Bölümlerde 3 canın var: yanlış cevap, pas ve süre bitimi 1 can götürür. Online maçta 7 tur oynanır; turu önce doğru yazan alır. Galibiyet +25 kupa ve 30 💎, mağlubiyet −15 kupa. Kafa Bot'a karşı kupa yoktur.",
  or_lives:"Can", or_next:"Devam", or_cntS:"{n} ortak oyuncu", or_cnt1S:"Tek ortak oyuncu", or_noOpp:"Şu an online rakip yok, Kafa Bot'a karşı oynuyorsun."
});
Object.assign(FK_I18N.en,{
  m_ortak:"Common Player", m_ortakS:"Find a player who played for both clubs", or_title:"COMMON PLAYER",
  or_ask:"Name a player who played for both clubs", or_cnt:"These clubs share {n} players · any of them counts", or_cnt1:"These clubs share just one player",
  or_ph:"Player name…", or_pass:"Pass", or_ok:"Correct! {p}", or_wrong:"{p} didn't play for both clubs", or_also:"Other correct answers: {l}", or_ans:"Answers: {l}",
  or_time:"Time's up!", or_online:"Online match", or_onlineS:"First correct answer takes the round · 7 rounds", or_bot:"Vs Kafa Bot", or_botS:"Solo practice", or_levels:"Levels", or_levelsS:"200 levels from easy to hard",
  or_round:"Round {i}/{n}", or_youGot:"You took the round!", or_oppGot:"{n} took the round", or_noOne:"Nobody got it", or_rules:"Common Player: two clubs are on screen. Name a player who played for both (loans count). There can be several correct answers; any of them counts. In levels you have 3 lives: a wrong answer, a pass or running out of time costs 1 life. Online matches have 7 rounds; whoever answers correctly first takes the round. Win +25 cups and 30 💎, loss −15 cups. No cups against Kafa Bot.",
  or_lives:"Lives", or_next:"Next", or_cntS:"{n} common players", or_cnt1S:"Just one common player", or_noOpp:"No one is online right now, you're playing Kafa Bot."
});
FK.MODES.ortak={ icon:"user", g:["#0EA5E9","#1E3A8A"], fg:"#fff", diff:false, total:10 };
if(FK.LV) FK.LV.ortak={ N:200, per:40, open:200, pass:[5,7,9] };

const chs=()=>{ const s=FK.state; s.ch=s.ch||{cup:0,w:0,l:0}; return s.ch; };   // zincir kupaları bu moda taşındı
const cn=c=>FK_GCLUBS[c]?FK_GCLUBS[c][0]:c;
let DB=null;
FK.orDB = () => { if(DB) return DB; const P=[], byClub={}, LO=window.FK_LOANS||{};
  FK_GPLAYERS.concat(window.FK_XPLAYERS||[]).forEach(x=>{ const cl=[...new Set((String(x[7])+","+(x[8]||"")+","+(LO[x[0]]||"")).split(",").filter(c=>c&&FK_GCLUBS[c]))]; if(!cl.length) return;
    const p={name:x[0],fame:x[6],clubs:cl,n:FK.norm(x[0])}; P.push(p); cl.forEach(c=>(byClub[c]=byClub[c]||[]).push(p)); });
  const sc={}; (FK.clubPool?FK.clubPool():[]).forEach(c=>sc[c.code]=c.sc);
  DB={P,byClub,sc,byName:Object.fromEntries(P.map(p=>[p.name,p]))}; return DB; };
FK.orCommon = (a,b) => { const D=FK.orDB(); return (D.byClub[a]||[]).filter(p=>p.clubs.indexOf(b)>=0); };

/* x: 0 kolay … 1 zor. Kolayda büyük kulüpler ve çok sayıda ortak oyuncu */
FK.orPairs = (x,count,seed) => { const D=FK.orDB(), r=FK.rng(seed), used={}, out=[];
  const clubs=Object.keys(D.byClub).filter(c=>D.sc[c]!=null&&D.byClub[c].length>=6);
  const near=clubs.sort((a,b)=>Math.abs(D.sc[a]-x*.8)-Math.abs(D.sc[b]-x*.8)).slice(0,x<.25?36:70);
  const need=x<.2?5:x<.4?3:x<.7?2:1;
  let guard=0;
  while(out.length<count&&guard++<600){
    const a=near[Math.floor(r()*near.length)]; const pc={};
    D.byClub[a].forEach(p=>p.clubs.forEach(c=>{ if(c!==a&&D.sc[c]!=null) pc[c]=(pc[c]||0)+1; }));
    const cand=Object.keys(pc).filter(c=>pc[c]>=need&&(x>=.4||pc[c]<=40)&&Math.abs(D.sc[c]-x*.8)<(x<.3?.25:.45));
    if(!cand.length) continue;
    const b=cand[Math.floor(r()*cand.length)], k=[a,b].sort().join("|");
    if(used[k]) continue; used[k]=1;
    out.push({a,b,ans:FK.orCommon(a,b).map(p=>p.name)});
  }
  return out; };

const badge=(c,s)=>FK.clubBadge(c,s);
const stage=(q,timerHtml)=>'<div class="stage stadium or-stage">'+(q.ans?'<div class="or-kbcnt">'+(q.ans.length>1?t("or_cntS",{n:q.ans.length}):t("or_cnt1S"))+'</div>':'')+'<div class="spot l"></div><div class="spot r"></div><div class="lamps"><i></i><i></i><i></i><i></i><i></i><i></i></div>'+
  '<div class="or-venn"><div class="or-c a"></div><div class="or-c b"></div><span class="or-ba">'+badge(q.a,52)+'</span><span class="or-bb">'+badge(q.b,52)+'</span>'+
  '<span class="or-na">'+FK.esc(cn(q.a))+'</span><span class="or-nb">'+FK.esc(cn(q.b))+'</span><div class="or-q">?</div></div>'+(timerHtml||'')+'</div>';
const timerUI=s=>'<div class="timer or-timer" data-timer><svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="rgba(5,20,15,.6)" stroke="rgba(255,255,255,.15)" stroke-width="5"/><circle data-ring cx="28" cy="28" r="24" fill="none" stroke="#FACC15" stroke-width="5" stroke-linecap="round" stroke-dasharray="150.8" stroke-dashoffset="0"/></svg><b data-sec>'+s+'</b></div>';
/* cevap kutusunun altındaki dolan çubuk + Devam */
FK.orNext=(ms,noBtn)=>'<div class="or-next"><i style="animation-duration:'+ms+'ms"></i>'+(noBtn?'':'<button class="btn btn-sm or-nextb" data-next>'+t("or_next")+' ›</button>')+'</div>';
const listN=(arr,n)=>arr.slice(0,n).join(", ")+(arr.length>n?" …":"");
/* otomatik tamamlama */
function bindAC(el,onPick){ const D=FK.orDB(), inp=el.querySelector("[data-in]"), ac=el.querySelector("[data-ac]"); if(!inp) return;
  inp.oninput=()=>{ const q=FK.norm(inp.value); if(q.length<2){ ac.classList.add("hide"); return; }
    const mm=D.P.filter(x=>x.n.indexOf(q)>=0).sort((x,y)=>{ const w=z=>(" "+z.n).indexOf(" "+q)>=0?0:1; return w(x)-w(y)||x.fame-y.fame; }).slice(0,6);
    ac.innerHTML=mm.map(x=>'<button data-nm="'+FK.esc(x.name)+'">'+FK.esc(x.name)+'</button>').join(""); ac.classList.toggle("hide",!mm.length);
    ac.querySelectorAll("[data-nm]").forEach(b=>b.onclick=()=>{ ac.classList.add("hide"); inp.value=""; onPick(b.dataset.nm); }); };
  inp.onkeydown=e=>{ if(e.key==="Enter"){ const b=ac.querySelector("[data-nm]"); if(b) b.click(); } };
  /* klavye açıkken saha küçülür, açıklama kartı gizlenir, giriş kutusu sahanın altında kalır */
  const scr=inp.closest(".screen"), sc=inp.closest(".scroll");
  inp.addEventListener("focus",()=>{ if(scr) scr.classList.add("kb"); if(sc) setTimeout(()=>{ sc.scrollTop=0; },50); });
  inp.addEventListener("blur",()=>{ setTimeout(()=>{ if(scr&&document.activeElement!==inp) scr.classList.remove("kb"); },180); });
  setTimeout(()=>{ try{ inp.focus(); }catch(e){} },60); }
const inputUI=()=>'<div class="row" style="gap:8px;align-items:flex-start"><div class="ac grow"><input class="input" data-in placeholder="'+t("or_ph")+'" autocomplete="off" autocapitalize="words" spellcheck="false"><div class="ac-list hide" data-ac></div></div><button class="btn btn-ghost or-pass" data-pass>⏭ '+t("or_pass")+'</button></div>';

/* ---------- lobi ---------- */
FK.screens.ortak = el => { const o=chs();
  el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:26px;margin:0">'+t("or_title")+'</h1></div><span class="pill">'+FK.gemIc()+FK.fmtNum(FK.state.gems)+'</span></div>'+
   '<div class="scroll"><div class="stack" style="gap:14px">'+stage({a:"GS",b:"RMA"})+
   '<div class="card center small" style="line-height:1.5;font-weight:700">'+t("or_ask")+'</div>'+
   '<button class="ol-card ch-on" data-on><div class="row" style="gap:12px;position:relative"><span style="font-size:38px">🌐</span><div class="grow" style="text-align:left"><div class="h-display" style="font-size:26px">'+t("or_online")+'</div><div class="small" style="opacity:.9">'+t("or_onlineS")+'</div></div><span class="pill" style="background:rgba(0,0,0,.25);color:#FDE047;border:0">⚡1</span></div><div class="ol-stats" style="position:relative">🏆 '+t("ol_cup",{n:o.cup})+' · '+t("ol_lg"+FK.olLeague(o.cup))+' · '+t("ol_stats",{w:o.w||0,l:o.l||0})+'</div></button>'+
   '<div class="grid2"><button class="mode" data-lv><div class="mode-top" style="background:linear-gradient(135deg,#0EA5E9,#1E3A8A);color:#fff">'+FK.ic("grid",32,2)+'</div><div class="mode-body"><div class="mode-name">'+t("or_levels")+'</div><div class="mode-desc">'+t("or_levelsS")+'</div></div></button>'+
   '<button class="mode" data-bot><div class="mode-top" style="background:linear-gradient(135deg,#F97316,#B45309);color:#fff">'+FK.kafa("bilge",46)+'<span class="mode-best" style="color:#fff">⚡1</span></div><div class="mode-body"><div class="mode-name">'+t("or_bot")+'</div><div class="mode-desc">'+t("or_botS")+'</div></div></button></div>'+
   '<button class="small" data-r style="color:var(--muted);text-decoration:underline;background:none;border:0">'+t("howTo")+'</button></div></div>';
  el.querySelector("[data-back]").onclick=()=>FK.back();
  el.querySelector("[data-on]").onclick=()=>{ FK.sfx("tap"); if(!FK.user()){ FK.toast(t("ol_login"),"info",3000); FK.signIn(); return; } FK.useEnergy(()=>FK.go("olwait",{mode:"ortak"})); };
  el.querySelector("[data-lv]").onclick=()=>{ FK.sfx("tap"); FK.go("intro",{mode:"ortak"}); };
  el.querySelector("[data-bot]").onclick=()=>{ FK.sfx("tap"); FK.useEnergy(()=>FK.go("orvs",{mode:"bot"})); };
  el.querySelector("[data-r]").onclick=()=>FK.modal('<div class="stack" style="gap:12px"><div style="display:flex;justify-content:center">'+FK.kafa("bilge",80,"bob")+'</div><div class="h-display h2 center">'+t("howTo")+'</div><div style="line-height:1.55;font-size:15px">'+t("or_rules")+'</div><button class="btn btn-primary" data-close>'+t("ok")+'</button></div>');
};

/* ---------- bölümlü oyun ---------- */
FK.screens.orplay = (el,p) => {
  const n=p.level, x=p.x, SEC=p.sec||20, pairs=p.pairs; let i=0, lives=3, correct=0, score=0, streak=0, best=0, tsum=0, raf=null, t0=0, ended=false, locked=false; const res=[];
  const g={mode:"ortak",level:n,diff:p.diff||1,qs:pairs,res,correct:0,score:0,bestStreak:0,timeSum:0,i:0,streak:0,extra:{}};
  FK.backHandler=()=>{ const go=()=>{ ended=true; cancelAnimationFrame(raf); FK.modeHome("ortak"); }; if(ended) go(); else FK.confirm(t("quitMid"),t("exit"),go); return true; };
  function draw(){ const q=pairs[i]; locked=false;
    el.innerHTML='<div class="game-head"><button class="icon-btn" data-quit aria-label="'+t("exit")+'">'+FK.ic("x",20,2.4)+'</button><div class="grow"><div class="h-display" style="font-size:22px">'+t("m_ortak")+'</div><div class="small muted" style="margin-top:3px">'+t("lvN",{n})+' · '+t("questionN",{a:i+1,b:pairs.length})+'</div></div><span class="pill">'+"❤️".repeat(lives)+'<span style="opacity:.3">'+"❤️".repeat(3-lives)+'</span></span></div>'+
     '<div class="qbar" style="grid-template-columns:repeat('+pairs.length+',1fr)">'+pairs.map((_,k)=>'<span class="'+(res[k]===true?"ok":res[k]===false?"no":k===i?"cur":"")+'"></span>').join("")+'</div>'+
     '<div class="scroll" style="padding-top:12px"><div class="stack" style="gap:12px">'+stage(q,timerUI(SEC))+
     '<div class="card center or-askc" style="font-weight:800;font-size:15px;padding:12px">'+t("or_ask")+'<div class="small muted" style="margin-top:4px;font-weight:600">'+(q.ans.length>1?t("or_cnt",{n:q.ans.length}):t("or_cnt1"))+'</div></div>'+
     inputUI()+'<div data-fb></div></div></div>';
    el.querySelector("[data-quit]").onclick=()=>FK.backHandler();
    el.querySelector("[data-pass]").onclick=()=>{ if(!locked){ FK.sfx("tap"); done(false,"pass"); } };
    bindAC(el,name=>{ if(locked) return; const pp=FK.orDB().byName[name]; if(pp&&pp.clubs.indexOf(q.a)>=0&&pp.clubs.indexOf(q.b)>=0) done(true,name); else done(false,"wrong",name); });
    t0=performance.now(); loop(); }
  function loop(){ cancelAnimationFrame(raf); const ring=el.querySelector("[data-ring]"), lbl=el.querySelector("[data-sec]"); let lastS=-1;
    const step=now=>{ if(ended||locked) return; const left=Math.max(0,SEC-(now-t0)/1000); if(ring) ring.style.strokeDashoffset=String(150.8*(1-left/SEC));
      const s=Math.ceil(left); if(s!==lastS){ lastS=s; if(lbl) lbl.textContent=s; if(s<=3&&s>0) FK.sfx("tick"); }
      if(left<=0){ done(false,"time"); return; } raf=requestAnimationFrame(step); };
    raf=requestAnimationFrame(step); }
  function done(ok,why,name){ locked=true; cancelAnimationFrame(raf); const q=pairs[i], used=(performance.now()-t0)/1000; tsum+=used; res[i]=ok;
    if(ok){ correct++; streak++; best=Math.max(best,streak); score+=100+Math.round(100*Math.max(0,1-used/SEC)); FK.sfx("ok"); FK.vib(30); }
    else { lives--; streak=0; FK.sfx("no"); FK.vib([60,40,60]); }
    const others=q.ans.filter(a=>a!==name);
    const fb=el.querySelector("[data-fb]"); if(fb) fb.innerHTML='<div class="card or-fb '+(ok?"ok":"no")+'"><b>'+(ok?t("or_ok",{p:FK.esc(name)}):why==="wrong"?t("or_wrong",{p:FK.esc(name)}):why==="time"?t("or_time"):"⏭ "+t("or_pass"))+'</b>'+
      '<div class="small or-list" style="margin-top:4px">'+(ok?(others.length?t("or_also",{l:FK.esc(listN(others,12))}):''):t("or_ans",{l:FK.esc(listN(q.ans,12))}))+'</div>'+FK.orNext(ok?3000:6000)+'</div>';
    el.querySelectorAll("[data-in],[data-pass]").forEach(x=>x.disabled=true); try{ document.activeElement.blur(); }catch(e){} el.classList.remove("kb"); el.querySelectorAll("[data-ac]").forEach(x=>x.classList.add("hide"));
    const go=()=>{ clearTimeout(nt); if(ended||gone) return; gone=true; i++; if(lives<=0||i>=pairs.length) finish(); else draw(); };
    let gone=false; const nt=setTimeout(go,ok?3000:6000); const nb=el.querySelector("[data-next]"); if(nb) nb.onclick=()=>{ FK.sfx("tap"); go(); };
    const f2=el.querySelector("[data-fb]"); if(f2) setTimeout(()=>f2.scrollIntoView({block:"nearest",behavior:"smooth"}),60); }
  function finish(){ ended=true; FK.backHandler=null;
    Object.assign(g,{correct,score,bestStreak:best,timeSum:tsum,res,i:pairs.length});
    const r=FK.finishGame({mode:"ortak",diff:g.diff,level:n,correct,total:pairs.length,score,bestStreak:best,timeSum:tsum,extra:{}});
    FK.go("result",{g,res:r},{replace:true}); }
  draw();
};

/* ---------- online / bot: 7 tur, turu önce doğru yazan alır ---------- */
const RN=7, RSEC=20;
FK.screens.orvs = (el,p) => {
  const mode=p.mode, side=p.side||"a", os=side==="a"?"b":"a", room=p.room;
  const u=FK.user()||{}, P0=FK.state.profile, m={uid:u.uid||"",name:(P0.name||"?").slice(0,18),av:P0.avatar||0,cup:chs().cup};
  const call=(fn,...a)=>{ try{ const n=N(); if(n&&n[fn]){ n[fn](...a); return true; } }catch(e){} return false; };
  let opp=mode==="bot"?{name:t("ol_bot"),av:0,cup:m.cup,bot:1}:null, pairs=null, i=0, sMy=0, sOp=0, my={}, op={}, raf=null, ended=false, phase="wait", t0=0, readyT=null, botT=null, lastSeen=Date.now(), decided={};
  const set=o=>{ if(mode==="live") call("livePut",room,JSON.stringify(o)); };
  const cleanup=()=>{ ended=true; cancelAnimationFrame(raf); clearTimeout(readyT); clearTimeout(botT); FK.ortakH=null; if(mode==="live") call("liveStop"); };
  FK.backHandler=()=>{ if(ended||phase==="wait"&&mode!=="live"){ cleanup(); FK.backHandler=null; FK.modeHome("ortak"); return true; }
    FK.confirm(t("ol_quit"),t("ol_leave"),()=>{ set({["l"+side]:1}); finish(true); },true); return true; };
  const pl=(pp,isMe,s)=>'<div class="ol-pl'+(isMe?" me":"")+'">'+(pp.bot?FK.kafa("bilge",40):FK.avatar(pp.av||0,40,null,"none"))+'<div class="grow" style="min-width:0"><b class="ol-nm">'+FK.esc(pp.name||"?")+'</b><span class="ol-sc">'+s+'</span></div></div>';
  function start(seed){ pairs=FK.orPairs(.22,RN,"ortak-live-"+seed); FK.sfx("whistle"); ask(); }
  function ask(){ if(ended) return; if(i>=pairs.length){ finish(false); return; } phase="play"; const q=pairs[i];
    el.innerHTML='<div class="ol-top">'+pl(m,true,sMy)+'<div class="ol-mid"><div class="small" style="font-weight:800">'+t("or_round",{i:i+1,n:RN})+'</div><div class="ol-ring"><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="24" class="bg"/><circle cx="27" cy="27" r="24" class="fg" data-ring/></svg><b data-sec>'+RSEC+'</b></div></div>'+pl(opp,false,sOp)+'</div>'+
     '<div class="scroll" style="padding-top:8px"><div class="stack" style="gap:12px">'+stage(q)+'<div class="card center or-askc" style="font-weight:800;font-size:15px;padding:12px">'+t("or_ask")+'</div>'+inputUI()+'<div data-fb></div></div></div>';
    el.querySelector("[data-pass]").remove();
    bindAC(el,name=>{ if(my[i]!=null||phase!=="play") return; const pp=FK.orDB().byName[name];
      if(pp&&pp.clubs.indexOf(q.a)>=0&&pp.clubs.indexOf(q.b)>=0){ my[i]=Math.round(performance.now()-t0); FK.sfx("ok"); set({["r"+side]:{[i]:my[i]}}); const fb=el.querySelector("[data-fb]"); if(fb) fb.innerHTML='<div class="card or-fb ok"><b>'+t("or_ok",{p:FK.esc(name)})+'</b></div>'; el.querySelectorAll("[data-in]").forEach(x=>x.disabled=true); }
      else { FK.sfx("no"); FK.vib(50); FK.toast(t("or_wrong",{p:name}),"info",1400); } });
    t0=performance.now(); if(mode==="bot") botPlay(); if(op[i]!=null) seen();
    const ring=el.querySelector("[data-ring]"), lbl=el.querySelector("[data-sec]"); let lastS=-1, firstAt=0;
    const step=now=>{ if(ended||phase!=="play") return; const el2=(now-t0)/1000, left=Math.max(0,RSEC-el2);
      if(ring) ring.style.strokeDashoffset=String(150.8*(1-left/RSEC)); const s=Math.ceil(left); if(s!==lastS){ lastS=s; if(lbl) lbl.textContent=s; if(s<=3&&s>0) FK.sfx("tick"); }
      if(mode==="live"&&Date.now()-lastSeen>35000){ FK.toast(t("ol_left"),"info",2600); finish(false,true); return; }
      if((my[i]!=null||op[i]!=null)&&!firstAt) firstAt=now;
      if((my[i]!=null&&op[i]!=null)||(firstAt&&now-firstAt>1500)||el2>=RSEC+(mode==="live"?1.5:0)){ decide(); return; }
      raf=requestAnimationFrame(step); };
    raf=requestAnimationFrame(step); }
  function seen(){ const st=el.querySelector("[data-fb]"); if(st&&my[i]==null) st.innerHTML='<div class="card or-fb no"><b>⚡ '+FK.esc(opp.name)+' cevapladı!</b></div>'; }
  function botPlay(){ const q=pairs[i], idx=i, pOk=.55, ms=4500+Math.random()*11000; clearTimeout(botT);
    botT=setTimeout(()=>{ if(ended||i!==idx) return; if(Math.random()<pOk){ op[idx]=Math.round(ms); seen(); } },ms); }
  function decide(){ if(decided[i]) return; decided[i]=1; phase="reveal"; cancelAnimationFrame(raf); const q=pairs[i], a=my[i], b=op[i];
    let w=null; if(a!=null&&(b==null||a<b||(a===b&&side==="a"))) w="me"; else if(b!=null) w="op";
    if(w==="me") sMy++; else if(w==="op") sOp++;
    FK.sfx(w==="me"?"ok":w==="op"?"no":"tap");
    const fb=el.querySelector("[data-fb]"); if(fb) fb.innerHTML='<div class="card or-fb '+(w==="me"?"ok":"no")+'"><b>'+(w==="me"?t("or_youGot"):w==="op"?t("or_oppGot",{n:FK.esc(opp.name)}):t("or_noOne"))+'</b><div class="small" style="margin-top:4px">'+t("or_ans",{l:FK.esc(listN(q.ans,12))})+'</div>'+FK.orNext(4000,true)+'</div>';
    el.querySelectorAll("[data-in]").forEach(x=>x.disabled=true); try{ document.activeElement.blur(); }catch(e){} el.classList.remove("kb"); el.querySelectorAll("[data-ac]").forEach(x=>x.classList.add("hide"));
    const sc=el.querySelectorAll(".ol-sc"); if(sc[0]) sc[0].textContent=sMy; if(sc[1]) sc[1].textContent=sOp;
    setTimeout(()=>{ if(ended) return; i++; ask(); },4000); }
  function finish(quit,oppLeft){ if(ended) return; cleanup(); FK.backHandler=null;
    const o=chs(); const res=quit?"l":oppLeft?"w":sMy>sOp?"w":sMy<sOp?"l":"d"; let dc=0,g=0;
    if(mode==="live"){ dc=quit?-15:res==="w"?25:res==="l"?-15:0; g=quit?0:res==="w"?30:res==="d"?10:5; o.cup=Math.max(0,o.cup+dc); o[res]=(o[res]||0)+1; }
    else g=res==="w"?10:res==="d"?5:0;
    FK.state.gems+=g; if(res==="w"&&mode==="live") FK.state.stats.duelWins=(FK.state.stats.duelWins||0)+1; o.best=Math.max(o.best||0,sMy); FK.save();
    if(mode==="live"&&!quit) set({["f"+side]:1});
    if(quit){ FK.modeHome("ortak"); FK.toast(t("ol_res",{g,c:dc}),"gem",2600); return; }
    el.innerHTML='<div class="scroll"><div class="stack" style="gap:16px">'+
     '<div class="du-banner '+res+'">'+FK.kafa(res==="w"?"sampiyon":res==="d"?"taraftar":"uzgun",104,"bob")+'<div class="h-display" style="font-size:32px">'+t(res==="w"?"du_win":res==="d"?"du_draw":"du_lose")+'</div></div>'+
     '<div class="du-arena"><div class="du-p me">'+FK.avatar(m.av,64,null,"none")+'<b>'+FK.esc(m.name)+'</b><div class="h-display du-score">'+sMy+'</div></div><span class="du-mid">VS</span><div class="du-p">'+(opp.bot?FK.kafa("bilge",64):FK.avatar(opp.av||0,64,null,"none"))+'<b>'+FK.esc(opp.name)+'</b><div class="h-display du-score">'+sOp+'</div></div></div>'+
     '<div class="card center"><b style="font-size:18px">+'+g+' 💎'+(mode==="live"?' · '+(dc>0?"+":"")+dc+' '+t("ol_cups").toLowerCase():'')+'</b>'+(mode==="live"?'<div class="small muted" style="margin-top:4px">🏆 '+t("ol_cup",{n:o.cup})+' · '+t("ol_lg"+FK.olLeague(o.cup))+'</div>':'')+'</div>'+
     (mode==="live"&&opp&&opp.uid?FK.friendBtn(opp):'')+
     '<button class="btn btn-primary" data-again style="height:56px">'+FK.ic("replay",18,2.2)+t("ch_again")+'</button>'+FK.endRow("ortak","data-sh")+'</div></div>';
    if(res==="w"){ FK.sfx("win"); FK.confetti(el); }
    if(mode==="live"&&opp&&opp.uid) FK.bindFriendBtn(el,opp);
    FK.bindEndRow(el,"ortak");
    el.querySelector("[data-again]").onclick=()=>{ if(mode==="bot") FK.useEnergy(()=>FK.go("orvs",{mode:"bot"},{replace:true})); else FK.useEnergy(()=>FK.go("olwait",{mode:"ortak"},{replace:true})); };
    el.querySelector("[data-sh]").onclick=()=>FK.share(t("m_ortak")+" 👥 "+sMy+" - "+sOp+" · #FutbolKafası");
  }
  if(mode==="live"){
    el.innerHTML='<div class="scroll"><div class="stack" style="gap:16px;align-items:center;text-align:center;padding-top:80px">'+(p.invite?'<div class="ol-radar"><i></i><i></i><i></i>'+FK.avatar(p.invite.av||0,84,null,"none")+'</div><div class="h-display" style="font-size:24px">'+t("fr_invited",{n:FK.esc(p.invite.name)})+'</div><button class="btn btn-ghost" data-x style="max-width:240px">'+t("ol_cancel")+'</button>':FK.kafa("kaptan",110,"bob")+'<div class="h-display" style="font-size:28px">'+t("ol_found")+'</div><div class="small muted">'+t("ol_get")+'</div>')+'</div></div>';
    const x=el.querySelector("[data-x]"); if(x) x.onclick=()=>{ set({la:1}); cleanup(); FK.backHandler=null; FK.back(); };
    FK.ortakH=(r,v)=>{ if(ended||r!==room||!v||v==="!") return; let d; try{ d=JSON.parse(v); }catch(e){ return; } lastSeen=Date.now();
      if(!opp){ opp=d[os]; }
      if(phase==="wait"){ if(d.db&&p.invite){ FK.toast(t("fr_invNo",{n:p.invite.name}),"info",2600); cleanup(); FK.backHandler=null; FK.back(); return; }
        if(d.la&&side==="b"){ FK.toast(t("ol_left"),"info",2200); cleanup(); FK.backHandler=null; FK.go("home",{},{root:true}); return; }
        if(side==="b"&&!d.rb) set({rb:1}); if(d.ra&&(d.rb||side==="b")){ clearTimeout(readyT); start(d.seed); } return; }
      const ro=d["r"+os]||{}; Object.keys(ro).forEach(k=>{ if(op[k]==null){ op[k]=ro[k]; if(+k===i) seen(); } });
      if(d["l"+os]&&!ended){ FK.toast(t("ol_left"),"info",2600); finish(false,true); } };
    call("liveWatch",room); if(side==="b") set({rb:1});
    readyT=setTimeout(()=>{ if(phase==="wait"&&!ended){ if(p.invite){ FK.toast(t("fr_invNo",{n:p.invite.name}),"info",2600); cleanup(); FK.backHandler=null; FK.back(); return; } FK.toast(t("ol_noConn"),"info",2600); cleanup(); FK.go("orvs",{mode:"bot"},{replace:true}); } },p.invite?60000:9000);
  } else { if(p.noOpp) FK.toast(t("or_noOpp"),"info",2800); start("bot"+Date.now()+Math.random()); }
};
})();
/* düello sayfasındaki tanıtım kartı (eski Kulüp Zinciri kartının yerine) + eski "chain" ekranı yönlendirmesi */
(function(){ const FK=window.FK, t=FK.t;
FK.ortakCard = () => { const c=(FK.state.ch||{}), en=FK.lang()==="en";
  return '<button class="ch-card chB orB" data-ortak><div class="rays2" style="opacity:.25"></div><div class="chB-l"><span class="chB-new">'+(en?"NEW MODE":"YENİ MOD")+'</span><div class="chB-t">'+t("m_ortak").replace(" ","<br>")+'</div><div class="chB-s">'+t("m_ortakS")+'</div><div class="chB-r">🏆 '+(c.cup||0)+' '+(en?"cups":"kupa")+' · '+t("ol_stats",{w:c.w||0,l:c.l||0})+'</div><span class="chB-play">⚡1 · '+(en?"PLAY":"OYNA")+' ›</span></div>'+
   '<div class="chB-z orB-z"><i class="orB-c a"></i><i class="orB-c b"></i><span class="chB-b" style="left:4px;top:30px">'+FK.clubBadge("GS",46)+'</span><span class="chB-b" style="left:58px;top:104px;animation-delay:.3s">'+FK.clubBadge("RMA",46)+'</span><b class="orB-q">?</b></div></button>'; };
FK.screens.chain = (el,p) => FK.screens.ortak(el,p);
})();
