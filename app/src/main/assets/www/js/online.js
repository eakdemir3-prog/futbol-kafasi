/* ==========================================================
   v1.3 — Online Hızlı Maç (canlı düello)
   Eşleşme: fk_queue/{uid} · Maç odası: fk_live/{room} · Maç kayıtları: fk_ghosts
   Rakip 20 sn'de bulunamazsa: başka bir oyuncunun gerçek maç kaydına karşı oynanır ("Rakip kaydı" diye yazar).
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, N=()=>window.FKAndroid;
const L=x=>Array.isArray(x)?x[FK.lang()==="en"?1:0]:x;
Object.assign(FK_I18N.tr,{
  m_live:"Hızlı Maç", ol_friend:"Arkadaşınla düello", ol_leave:"Çık", ol_quick:"Hızlı Maç", ol_quickS:"Online rakiple canlı · 10 soru", ol_live:"CANLI", ol_search:"Rakip aranıyor…", ol_searchS:"Aynı anda oynayan biriyle eşleşiyorsun",
  ol_cancel:"Vazgeç", ol_found:"Rakip bulundu!", ol_ghost:"Rakip kaydı", ol_ghostS:"Şu an online rakip yok. Başka bir oyuncunun gerçek maç kaydına karşı oynuyorsun.",
  ol_bot:"Kafa Bot", ol_botS:"Şu an online rakip yok. Antrenman botuna karşı oynuyorsun.", ol_thinking:"Rakip düşünüyor…", ol_oppAns:"Rakip cevapladı",
  ol_left:"Rakip maçtan çıktı", ol_noConn:"Rakip bağlanamadı, rakip kaydına geçiliyor", ol_quit:"Maçtan çıkarsan yenik sayılırsın (−15 kupa). Çıkılsın mı?",
  ol_cup:"{n} kupa", ol_cups:"Kupa", ol_lg0:"Bronz", ol_lg1:"Gümüş", ol_lg2:"Altın", ol_lg3:"Elmas", ol_lg4:"Efsane",
  ol_res:"+{g} 💎 · {c} kupa", ol_again:"Yeni maç", ol_rules:"Hızlı Maç: 10 soru, her soru 10 saniye. Doğru ve hızlı cevap daha çok puan getirir. Galibiyet +25 kupa ve 30 💎, beraberlik 10 💎, mağlubiyet −15 kupa ve 5 💎. Maç 1 enerji harcar. Rakip 20 saniyede bulunamazsa başka bir oyuncunun gerçek maç kaydına karşı oynarsın; bu ekranda açıkça yazar.",
  ol_stats:"{w} galibiyet · {l} mağlubiyet", ol_vsReal:"Online rakip", ol_q:"Soru {i}/10", ol_get:"Hazır ol!", ol_login:"Online maç için Google ile giriş yapmalısın.", ol_err:"Bağlantı sorunu. Tekrar dene."
});
Object.assign(FK_I18N.en,{
  m_live:"Quick Match", ol_friend:"Duel a friend", ol_leave:"Leave", ol_quick:"Quick Match", ol_quickS:"Live vs an online player · 10 questions", ol_live:"LIVE", ol_search:"Finding an opponent…", ol_searchS:"You'll be matched with someone playing right now",
  ol_cancel:"Cancel", ol_found:"Opponent found!", ol_ghost:"Recorded opponent", ol_ghostS:"No one is online right now. You're playing against another player's real recorded match.",
  ol_bot:"Kafa Bot", ol_botS:"No one is online right now. You're playing against the practice bot.", ol_thinking:"Opponent is thinking…", ol_oppAns:"Opponent answered",
  ol_left:"Your opponent left the match", ol_noConn:"Opponent couldn't connect, switching to a recorded match", ol_quit:"If you leave you lose the match (−15 cups). Leave?",
  ol_cup:"{n} cups", ol_cups:"Cups", ol_lg0:"Bronze", ol_lg1:"Silver", ol_lg2:"Gold", ol_lg3:"Diamond", ol_lg4:"Legend",
  ol_res:"+{g} 💎 · {c} cups", ol_again:"New match", ol_rules:"Quick Match: 10 questions, 10 seconds each. Fast correct answers score more. Win +25 cups and 30 💎, draw 10 💎, loss −15 cups and 5 💎. A match costs 1 energy. If no opponent is found within 20 seconds you play against another player's real recorded match; the screen says so clearly.",
  ol_stats:"{w} wins · {l} losses", ol_vsReal:"Online opponent", ol_q:"Question {i}/10", ol_get:"Get ready!", ol_login:"Sign in with Google to play online.", ol_err:"Connection problem. Try again."
});
FK.MODES.live={ icon:"swords", g:["#EF4444","#7C3AED"], fg:"#fff", diff:false, total:10 };

const QSEC=10, WAIT=20000, LG=[0,200,500,1000,1800], EMO=["👏","😮","😂","🔥"];
const ol=()=>{ const s=FK.state; s.ol=s.ol||{cup:0,w:0,l:0,d:0}; return s.ol; };
FK.olLeague = c => { let i=0; LG.forEach((v,k)=>{ if(c>=v) i=k; }); return i; };
const me=()=>{ const u=FK.user()||{}, P=FK.state.profile; return {uid:u.uid||"", name:(P.name||"?").slice(0,18), av:P.avatar||0, cup:ol().cup}; };
const rid=()=>{ const A="abcdefghijkmnpqrstuvwxyz23456789"; let s=""; for(let i=0;i<12;i++) s+=A[Math.floor(Math.random()*A.length)]; return s; };
const buildQs=seed=>{ const r=FK.rng("live-"+seed), q=FK_QUESTIONS;
  const pick=[].concat(FK.shuffle(q.filter(x=>x.d===1),r).slice(0,4),FK.shuffle(q.filter(x=>x.d===2),r).slice(0,4),FK.shuffle(q.filter(x=>x.d===3),r).slice(0,2));
  return pick.map(x=>({ k:x.k, text:L(x.q), answer:L(x.a[0]), opts:FK.shuffle(x.a.map(L),r) })); };

/* ---- yerel olay yönlendirme ---- */
let H={};   // aktif dinleyiciler: lq, lr, gh
const _nat=window.fkNative;
window.fkNative=(ev,a,b)=>{
  if(ev==="lq"){ if(H.lq) H.lq(a,b); return; }
  if(ev==="lr"){ if(FK.chainH) FK.chainH(a,b); if(H.lr) H.lr(a,b); return; }
  if(ev==="gh"){ if(H.gh) H.gh(a,b); return; }
  if(_nat) _nat(ev,a,b);
};
const call=(fn,...a)=>{ try{ const n=N(); if(n&&n[fn]){ n[fn](...a); return true; } }catch(e){} return false; };

/* ---- giriş noktası ---- */
FK.quickMatch = () => {
  if(!FK.user()){ FK.toast(t("ol_login"),"info",3000); FK.signIn(()=>FK.render&&FK.render()); return; }
  FK.useEnergy(()=>FK.go("olwait",{}));
};

/* ---- rakip arama ---- */
FK.screens.olwait = (el,pp) => {
  const MODE=(pp&&pp.mode)||"quiz", NEXT=MODE==="chain"?"chplay":"ollive";
  const m=me(); if(MODE==="chain") m.cup=(FK.state.ch||{}).cup||0; let done=false, poll=null, tmo=null, claiming=false; const t0=Date.now();
  el.innerHTML='<div class="scroll"><div class="stack ol-wait" style="gap:18px;align-items:center;text-align:center;padding-top:40px">'+
    '<div class="ol-radar"><i></i><i></i><i></i>'+FK.avatar(m.av,84,null,FK.frameOf?FK.frameOf():"none")+'</div>'+
    '<div class="h-display" style="font-size:28px">'+t("ol_search")+'</div><div class="small muted">'+t("ol_searchS")+'</div>'+
    '<div class="h-display ol-sec" data-sec>20</div>'+
    '<div class="chip" style="background:rgba(250,204,21,.18);color:#EAB308">'+(MODE==="chain"?"⛓️ "+t("m_chain")+" · ":"")+'🏆 '+t("ol_cup",{n:m.cup})+' · '+t("ol_lg"+FK.olLeague(m.cup))+'</div>'+
    '<button class="btn btn-ghost" data-x style="max-width:260px">'+t("ol_cancel")+'</button></div></div>';
  const stop=()=>{ done=true; clearInterval(poll); clearTimeout(tmo); H.lq=null; };
  const go=(room,side)=>{ if(done) return; stop(); call("liveCancel"); FK.sfx("win"); FK.go(NEXT,{room,side,mode:"live"},{replace:true}); };
  const ghost=()=>{ if(done) return; stop(); call("liveCancel"); if(MODE==="chain") FK.go("chplay",{mode:"bot",noOpp:1},{replace:true}); else FK.go("ollive",{ghost:true},{replace:true}); };
  FK.backHandler=()=>{ stop(); call("liveCancel"); FK.backHandler=null; FK.back(); return true; };
  el.querySelector("[data-x]").onclick=()=>FK.backHandler();
  H.lq=(k,v)=>{ if(done) return;
    if(k==="room"&&v){ go(v,"b"); return; }
    if(k==="claim"){ claiming=false; if(v) go(v,"a"); return; }
    if(k==="err"){ ghost(); return; }
    if(k==="list"&&!claiming){ let L2=[]; try{ L2=JSON.parse(v)||[]; }catch(e){}
      const now=Date.now(), c=L2.filter(x=>x.uid&&x.uid!==m.uid&&x.open&&!x.room&&(x.mode||"quiz")===MODE&&Math.abs(now-(x.at||0))<90000)
        .sort((x,y)=>Math.abs((x.cup||0)-m.cup)-Math.abs((y.cup||0)-m.cup));
      const o=c.find(x=>x.uid>m.uid);     // çakışmasın diye: küçük uid'li taraf odayı kurar
      if(o){ claiming=true; const room=rid();
        call("liveClaim",o.uid,room,JSON.stringify({mode:MODE,seed:room,a:{uid:m.uid,name:m.name,av:m.av,cup:m.cup},b:{uid:o.uid,name:o.name||"?",av:o.av||0,cup:o.cup||0},at:now,ra:1})); }
    }
  };
  if(!call("liveQueue",JSON.stringify({mode:MODE,name:m.name,av:m.av,cup:m.cup,at:Date.now()}))){ setTimeout(ghost,1500); }
  poll=setInterval(()=>{ if(done||!el.isConnected){ if(!el.isConnected&&!done){ stop(); call("liveCancel"); } return; }
    const left=Math.max(0,Math.ceil((WAIT-(Date.now()-t0))/1000)); const sc=el.querySelector("[data-sec]"); if(sc) sc.textContent=left;
    if(left<=0){ ghost(); return; }
    if((Date.now()-t0)%3000<1000) call("liveList"); },1000);
  setTimeout(()=>{ if(!done) call("liveList"); },1200);
};

/* ---- canlı maç ---- */
FK.screens.ollive = (el,p) => {
  const m=me(); let side=p.side||"a", os=side==="a"?"b":"a", room=p.room, mode=p.ghost?"ghost":"live";
  let doc=null, opp=null, qs=null, i=0, qStart=0, my={}, op={}, sMy=0, sOp=0, cMy=0, cOp=0, phase="wait", ended=false, tick=null, ghostRec=null, emoN=0, lastEmo=0, lastSeen=Date.now(), readyT=null;
  const set=o=>{ if(mode==="live") call("livePut",room,JSON.stringify(o)); };
  const cleanup=()=>{ ended=true; cancelAnimationFrame(tick); clearTimeout(readyT); H.lr=null; H.gh=null; call("liveStop"); };
  FK.backHandler=()=>{ if(ended||phase==="wait"&&mode!=="live"){ cleanup(); FK.backHandler=null; FK.go("duel",{},{root:true}); return true; }
    FK.confirm(t("ol_quit"),t("ol_leave"),()=>{ set({["l"+side]:1}); finish(true); },true); return true; };

  const startGhost=()=>{ mode="ghost"; H.gh=(k,v)=>{ if(k!=="list") return; let arr=[]; try{ arr=JSON.parse(v)||[]; }catch(e){}
      const mine=m.uid, ok=arr.filter(g=>g.uid!==mine&&g.seed&&g.ans&&String(g.ans).split(",").length===10);
      const near=ok.sort((x,y)=>Math.abs((x.cup||0)-m.cup)-Math.abs((y.cup||0)-m.cup)).slice(0,8);
      const g=near.length?near[Math.floor(Math.random()*near.length)]:null; H.gh=null;
      if(g){ ghostRec=g; opp={name:g.name||"?",av:g.av||0,cup:g.cup||0,ghost:1}; qs=buildQs(g.seed); }
      else { mode="bot"; opp={name:t("ol_bot"),av:0,cup:m.cup,bot:1}; qs=buildQs("bot"+Date.now()); }
      intro(); };
    if(!call("ghostList")) H.gh("list","[]"); };

  H.lr=(r,v)=>{ if(ended||mode!=="live"||r!==room) return; if(v==="!"||!v) return; let d=null; try{ d=JSON.parse(v); }catch(e){ return; } doc=d; lastSeen=Date.now();
    if(!opp){ opp=d[os]; qs=buildQs(d.seed); }
    if(phase==="wait"){ if(d.db&&p.invite){ FK.toast(t("fr_invNo",{n:p.invite.name}),"info",2600); cleanup(); FK.backHandler=null; FK.back(); return; }
      if(d.la&&side==="b"){ FK.toast(t("ol_left"),"info",2200); cleanup(); FK.backHandler=null; FK.go("home",{},{root:true}); return; }
      if(side==="b"&&!d.rb) set({rb:1}); if(d.ra&&(d.rb||side==="b")){ clearTimeout(readyT); intro(); } return; }
    const pa=d["p"+os]||{}; Object.keys(pa).forEach(k=>{ if(!op[k]){ op[k]=pa[k]; onOpp(+k); } });
    if(d["e"+os]&&d["e"+os].n>lastEmo){ lastEmo=d["e"+os].n; bubble(d["e"+os].e); }
    if(d["l"+os]&&!ended){ FK.toast(t("ol_left"),"info",2600); finish(false,true); }
  };

  /* ekranlar */
  const chip=(p,isMe,s)=>'<div class="ol-pl'+(isMe?" me":"")+'">'+(p.bot?FK.kafa("bilge",40):FK.avatar(p.av||0,40,null,"none"))+'<div class="grow" style="min-width:0"><b class="ol-nm">'+FK.esc(p.name||"?")+'</b><span class="ol-sc" data-s="'+(isMe?"m":"o")+'">'+FK.fmtNum(s)+'</span></div><span class="ol-bub" data-b="'+(isMe?"m":"o")+'"></span></div>';
  function invUI(f){ el.innerHTML='<div class="scroll"><div class="stack" style="gap:16px;align-items:center;text-align:center;padding-top:60px"><div class="ol-radar"><i></i><i></i><i></i>'+FK.avatar(f.av||0,84,null,"none")+'</div><div class="h-display" style="font-size:24px">'+t("fr_invited",{n:FK.esc(f.name)})+'</div><button class="btn btn-ghost" data-x style="max-width:240px">'+t("ol_cancel")+'</button></div></div>';
    el.querySelector("[data-x]").onclick=()=>{ set({la:1}); cleanup(); FK.backHandler=null; FK.back(); }; }
  function waitUI(){ el.innerHTML='<div class="scroll"><div class="stack" style="gap:16px;align-items:center;text-align:center;padding-top:80px">'+FK.kafa("kaptan",110,"bob")+'<div class="h-display" style="font-size:28px">'+t("ol_found")+'</div><div class="small muted">'+t("ol_get")+'</div></div></div>'; }
  function intro(){ if(ended) return; phase="intro"; FK.sfx("whistle");
    const tag=mode==="live"?'<span class="chip ol-live">● '+t("ol_live")+'</span>':mode==="ghost"?'<span class="chip ol-rec">⏺ '+t("ol_ghost")+'</span>':'<span class="chip ol-rec">🤖 '+t("ol_bot")+'</span>';
    el.innerHTML='<div class="scroll"><div class="stack" style="gap:18px;align-items:center;text-align:center;padding-top:36px">'+tag+
      '<div class="ol-vs"><div class="du-p me">'+FK.avatar(m.av,72,null,"none")+'<b>'+FK.esc(m.name)+'</b><span class="small muted">🏆 '+m.cup+'</span></div><span class="du-mid">VS</span><div class="du-p">'+(opp.bot?FK.kafa("bilge",72):FK.avatar(opp.av||0,72,null,"none"))+'<b>'+FK.esc(opp.name)+'</b><span class="small muted">🏆 '+(opp.cup||0)+'</span></div></div>'+
      (mode!=="live"?'<div class="card small" style="line-height:1.5">'+t(mode==="ghost"?"ol_ghostS":"ol_botS")+'</div>':'')+
      '<div class="h-display ol-count" data-c>3</div></div></div>';
    let n=3; const iv=setInterval(()=>{ if(ended){ clearInterval(iv); return; } n--; const c=el.querySelector("[data-c]"); if(n>0){ if(c) c.textContent=n; FK.sfx("tick"); } else { clearInterval(iv); phase="play"; ask(); } },900); }
  function ask(){ if(ended) return; if(i>=10){ finish(false); return; }
    const q=qs[i]; qStart=performance.now(); phase="play";
    el.innerHTML='<div class="ol-top">'+chip(m,true,sMy)+'<div class="ol-mid"><div class="small" style="font-weight:800">'+t("ol_q",{i:i+1})+'</div><div class="ol-ring"><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="24" class="bg"/><circle cx="27" cy="27" r="24" class="fg" data-ring/></svg><b data-sec>'+QSEC+'</b></div></div>'+chip(opp,false,sOp)+'</div>'+
      '<div class="scroll qx" style="padding-top:8px"><div class="stage qstage"><div class="qpitch"></div><div class="qtext">'+FK.esc(q.text)+'</div><div class="small ol-st" data-st></div></div>'+
      '<div class="opts qopts one">'+q.opts.map((o,k)=>'<button class="opt qopt" data-o="'+k+'"><i class="ol l'+k+'">'+"ABCD"[k]+'</i><span class="grow">'+FK.esc(o)+'</span><span class="ol-mk" data-mk="'+k+'"></span></button>').join("")+'</div>'+
      '<div class="ol-emo">'+EMO.map(e=>'<button data-e="'+e+'">'+e+'</button>').join("")+'</div></div>';
    el.querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>answer(+b.dataset.o));
    el.querySelectorAll("[data-e]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); bubble(b.dataset.e,true); emoN++; set({["e"+side]:{e:b.dataset.e,n:emoN}}); });
    if(op[i]) onOpp(i);
    if(mode!=="live") simOpp();
    const ring=el.querySelector("[data-ring]"), lbl=el.querySelector("[data-sec]"); let lastS=-1;
    const step=now=>{ if(ended||phase!=="play"&&phase!=="answered") return; const left=Math.max(0,QSEC-(now-qStart)/1000);
      if(ring) ring.style.strokeDashoffset=String(150.8*(1-left/QSEC)); const s=Math.ceil(left); if(s!==lastS){ lastS=s; if(lbl) lbl.textContent=s; if(s<=3&&s>0) FK.sfx("tick"); }
      if(mode==="live"&&Date.now()-lastSeen>30000&&!ended){ FK.toast(t("ol_left"),"info",2600); finish(false,true); return; }
      const el2=(now-qStart)/1000;
      if(el2>=QSEC&&!my[i]) answer(-1);
      if(my[i]&&(op[i]||el2>=QSEC+(mode==="live"?1.8:0.3))){ if(!op[i]){ op[i]=[0,QSEC*1000,-1,0]; } reveal(); return; }
      tick=requestAnimationFrame(step); };
    tick=requestAnimationFrame(step); }
  function answer(k){ if(my[i]) return; const q=qs[i], ms=Math.min(QSEC*1000,Math.round(performance.now()-qStart)), ok=k>=0&&q.opts[k]===q.answer;
    const pts=ok?100+Math.round(100*(1-ms/(QSEC*1000))):0; my[i]=[ok?1:0,ms,k,pts]; sMy+=pts; if(ok) cMy++;
    phase="answered"; el.querySelectorAll("[data-o]").forEach(x=>x.disabled=true);
    const b=el.querySelector('[data-o="'+k+'"]'); if(b) b.classList.add("sel");
    FK.sfx(ok?"ok":"no"); if(!ok&&k>=0) FK.vib(50);
    const sc=el.querySelector('[data-s="m"]'); if(sc) sc.textContent=FK.fmtNum(sMy);
    const st=el.querySelector("[data-st]"); if(st&&!op[i]) st.textContent=t("ol_thinking");
    set({["p"+side]:{[i]:my[i]},["s"+side]:sMy}); }
  function onOpp(k,silent){ if(k!==i||!op[k]) return; const st=el.querySelector("[data-st]"); if(st&&!silent) st.textContent=t("ol_oppAns"); }
  function simOpp(){ const idx=i; let c,ms;
    if(mode==="ghost"){ const a=String(ghostRec.ans).split(",")[idx].split(":"); c=+a[0]; ms=Math.min(QSEC*1000,+a[1]||QSEC*1000); }
    else { const r=FK.rng("bot"+idx+qs[idx].text); c=r()<0.62?1:0; ms=2500+Math.round(r()*6000); }
    setTimeout(()=>{ if(ended||i!==idx) return; const q=qs[idx]; let k=-1; if(ms<QSEC*1000){ if(c) k=q.opts.indexOf(q.answer); else { const w=q.opts.map((o,j)=>j).filter(j=>q.opts[j]!==q.answer); k=w[idx%w.length]; } }
      const pts=c&&ms<QSEC*1000?100+Math.round(100*(1-ms/(QSEC*1000))):0; op[idx]=[c&&ms<QSEC*1000?1:0,ms,k,pts]; onOpp(idx); },ms<QSEC*1000?ms:QSEC*1000+50); }
  function reveal(){ if(phase==="reveal"||ended) return; phase="reveal"; cancelAnimationFrame(tick);
    const q=qs[i], o=op[i]||[0,QSEC*1000,-1,0]; const opts=el.querySelectorAll("[data-o]");
    opts.forEach(x=>{ x.disabled=true; const k=+x.dataset.o; if(q.opts[k]===q.answer) x.classList.add("ok"); else if(my[i]&&my[i][2]===k) x.classList.add("no"); });
    if(o[2]>=0){ const mk=el.querySelector('[data-mk="'+o[2]+'"]'); if(mk) mk.innerHTML=opp.bot?FK.kafa("bilge",26):FK.avatar(opp.av||0,26,null,"none"); }
    const pts=o[3]!=null?o[3]:(o[0]?100+Math.round(100*(1-o[1]/(QSEC*1000))):0); sOp+=pts; if(o[0]) cOp++;
    const so=el.querySelector('[data-s="o"]'); if(so) so.textContent=FK.fmtNum(sOp);
    const st=el.querySelector("[data-st]"); if(st) st.textContent=(my[i]&&my[i][0]?"✅ +"+my[i][3]:"❌")+"   ·   "+FK.esc(opp.name)+": "+(o[0]?"✅ +"+pts:"❌");
    setTimeout(()=>{ if(ended) return; i++; ask(); },1700); }
  function bubble(e,mine){ const b=el.querySelector('[data-b="'+(mine?"m":"o")+'"]'); if(!b) return; b.textContent=e; b.classList.remove("on"); void b.offsetWidth; b.classList.add("on"); }

  function finish(quit,oppLeft){ if(ended) return; cleanup(); FK.backHandler=null;
    const o=ol(); let res=quit?"l":oppLeft?"w":sMy>sOp?"w":sMy<sOp?"l":"d";
    const dc=res==="w"?25:res==="l"?-15:0, g=res==="w"?30:res==="d"?10:5;
    o.cup=Math.max(0,o.cup+dc); o[res]=(o[res]||0)+1; const s=FK.state; s.gems+=g; if(res==="w") s.stats.duelWins=(s.stats.duelWins||0)+1;
    try{ FK.finishGame({mode:"duel",diff:0,correct:cMy,total:10,score:sMy,bestStreak:0,timeSum:0,extra:{}}); }catch(e){}
    FK.save();
    if(mode==="live"&&!quit&&Object.keys(my).length===10){ call("ghostPut",JSON.stringify({name:m.name,av:m.av,cup:m.cup,seed:doc&&doc.seed||room,score:sMy,at:Date.now(),
      ans:[...Array(10)].map((_,k)=>(my[k]?my[k][0]:0)+":"+(my[k]?my[k][1]:QSEC*1000)).join(",")})); }
    if(mode==="live"&&!quit) set({["f"+side]:1});
    if(quit){ FK.go("duel",{},{root:true}); FK.toast(t("ol_res",{g,c:dc}),"gem",2600); return; }
    el.innerHTML='<div class="scroll"><div class="stack" style="gap:16px">'+
      '<div class="du-banner '+res+'">'+FK.kafa(res==="w"?"sampiyon":res==="d"?"taraftar":"uzgun",110,"bob")+'<div class="h-display" style="font-size:34px">'+t(res==="w"?"du_win":res==="d"?"du_draw":"du_lose")+'</div></div>'+
      '<div class="du-arena"><div class="du-p me">'+FK.avatar(m.av,64,null,"none")+'<b>'+FK.esc(m.name)+'</b><div class="h-display du-score">'+FK.fmtNum(sMy)+'</div><span class="small muted">'+cMy+'/10</span></div><span class="du-mid">VS</span>'+
      '<div class="du-p">'+(opp.bot?FK.kafa("bilge",64):FK.avatar(opp.av||0,64,null,"none"))+'<b>'+FK.esc(opp.name)+'</b><div class="h-display du-score">'+FK.fmtNum(sOp)+'</div><span class="small muted">'+cOp+'/10</span></div></div>'+
      '<div class="card center"><b style="font-size:18px">'+t("ol_res",{g,c:(dc>0?"+":"")+dc})+'</b><div class="small muted" style="margin-top:4px">🏆 '+t("ol_cup",{n:o.cup})+' · '+t("ol_lg"+FK.olLeague(o.cup))+'</div></div>'+
      (mode==="live"&&opp&&opp.uid?FK.friendBtn(opp):'')+
      '<button class="btn btn-purple" data-again style="height:58px">'+FK.ic("swords",20,2.2)+t("ol_again")+'</button>'+
      '<button class="btn btn-ghost" data-share>'+FK.ic("share",16)+t("share")+'</button>'+
      '<button class="btn btn-ghost" data-home>'+t("du_title")+'</button></div></div>';
    if(res==="w"){ FK.sfx("win"); FK.confetti(el); } else FK.sfx("gem");
    el.querySelector("[data-again]").onclick=()=>{ FK.stack=[{name:"home",params:{}},{name:"duel",params:{}}]; FK.quickMatch(); };
    if(mode==="live"&&opp&&opp.uid) FK.bindFriendBtn(el,opp);
    el.querySelector("[data-home]").onclick=()=>FK.go("duel",{},{root:true});
    el.querySelector("[data-share]").onclick=()=>FK.shareCard&&FK.shareCard({mode:"live",score:sMy,correct:cMy,total:10,pose:res==="w"?"sampiyon":"atesli"});
  }

  if(mode==="live"){ if(p.invite) invUI(p.invite); else waitUI(); call("liveWatch",room); if(side==="b") set({rb:1});
    readyT=setTimeout(()=>{ if(phase==="wait"&&!ended){ if(p.invite){ FK.toast(t("fr_invNo",{n:p.invite.name}),"info",2600); cleanup(); FK.backHandler=null; FK.back(); return; } FK.toast(t("ol_noConn"),"info",2600); H.lr=null; call("liveStop"); startGhost(); } },p.invite?60000:9000); }
  else startGhost();
};
})();
