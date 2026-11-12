/* ==========================================================
   OYUN MOTORU ve 6 OYUN MODU
   Ortak akış: başlangıç ekranı → zorluk → geri sayım → sorular → sonuç
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, L=FK.L;

FK.MODES = {
  player:{ icon:"search", g:["#22C55E","#15803D"], fg:"#052E16", diff:true, total:10 },
  club:{   icon:"shield", g:["#3B82F6","#1D4ED8"], fg:"#fff", diff:true, total:10 },
  flag:{   icon:"flag",   g:["#FF8A1F","#EA580C"], fg:"#fff", diff:true, total:10 },
  daily:{  icon:"calendar", g:["#FACC15","#CA8A04"], fg:"#422006", diff:false, total:10 },
  career:{ icon:"route",  g:["#A855F7","#7E22CE"], fg:"#fff", diff:true, total:5 },
  guess:{  icon:"user",   g:["#D946EF","#7E22CE"], fg:"#fff", diff:true, total:1 },
  word:{   icon:"grid",   g:["#14B8A6","#0F766E"], fg:"#fff", diff:false, total:1 }
};
FK.modeName = m => t("m_"+m);

/* ---------- soru setleri ---------- */
function byDiff(list,diff,count,getD,mode,keyFn){
  // önce istenen zorluk, eksikse yakın zorluklar; her seviyede daha önce görülmeyenler önce gelir
  let pool=list.filter(x=>getD(x)===diff);
  for(let k=1;pool.length<count*2 && k<4;k++) pool=pool.concat(list.filter(x=>getD(x)===diff-k||getD(x)===diff+k));
  const out=FK.fresh(mode,pool,keyFn,count);
  FK.markSeen(mode,out.map(keyFn));
  return out;
}
const nameOf = c => FK.lang()==="en" ? ({"Bayern Münih":"Bayern Munich","Steaua Bükreş":"Steaua Bucharest","Sparta Prag":"Sparta Prague"}[c]||c) : c;

function buildPlayer(diff){
  return byDiff(FK_PLAYERS,diff,10,p=>p.d,"player",p=>p.id).map(p=>({
    answer:p.name, opts:FK.shuffle([p.name].concat(p.alt)),
    clues:[ t("c_nat",{v:FK.cAdj(p.nat)}), t("c_pos",{v:t("pos_"+p.pos)}), L(p.c[0]), L(p.c[1]) ],
    cc:p.nat, pos:p.pos, no:p.no
  }));
}
function buildClub(diff){
  const clubs=FK_CLUBS.map(c=>({name:c[0],cc:c[1],city:[c[2],c[3]],year:c[4],hint:[c[5],c[6]],d:c[7],colors:c[8]}));
  return byDiff(clubs,diff,10,c=>c.d,"club",c=>c.name).map(c=>{
    let others=FK.shuffle(clubs.filter(x=>x.name!==c.name&&x.cc===c.cc)).map(x=>x.name);
    if(others.length<3) others=others.concat(FK.shuffle(clubs.filter(x=>x.name!==c.name&&x.cc!==c.cc&&x.d<=c.d+1)).map(x=>x.name));
    return { answer:nameOf(c.name), opts:FK.shuffle([c.name].concat(others.slice(0,3))).map(nameOf),
      clues:[ t("c_country",{v:FK.flag(c.cc)+" "+FK.cName(c.cc)}), t("c_year",{v:c.year}), t("c_city",{v:L(c.city)}), L(c.hint) ], cc:c.cc, year:c.year };
  });
}
function buildFlag(diff){
  const all=FK_COUNTRIES.map(c=>c[0]);
  const plan={1:[1,1,1,1,1,1,2,2,2,2],2:[1,1,1,2,2,2,2,3,3,3],3:[2,2,2,2,3,3,3,3,3,3],4:[3,3,3,3,3,3,3,3,3,3]}[diff];
  const byTier={}; [1,2,3].forEach(tr=>{ const need=plan.filter(x=>x===tr).length; byTier[tr]=need?FK.fresh("flag",all.filter(c=>FK.countries[c].tier===tr),c=>c,need):[]; });
  const qs=plan.map(tier=>{
    const c=byTier[tier].shift();
    const near=FK.shuffle(all.filter(x=>x!==c && Math.abs(FK.countries[x].tier-tier)<=1)).slice(0,3);
    return { answer:FK.cName(c), code:c, opts:FK.shuffle([c].concat(near)).map(FK.cName) };
  });
  FK.markSeen("flag",qs.map(q=>q.code));
  return qs;
}
function buildDaily(){
  const r=FK.rng("daily10-"+FK.dayKey());
  const q=FK_QUESTIONS;
  const pick=[].concat(FK.shuffle(q.filter(x=>x.d===1),r).slice(0,4),FK.shuffle(q.filter(x=>x.d===2),r).slice(0,4),FK.shuffle(q.filter(x=>x.d===3),r).slice(0,2));
  return pick.map(x=>({ text:L(x.q), answer:L(x.a[0]), opts:FK.shuffle(x.a.map(L),r) }));
}
function buildCareer(diff){
  return byDiff(FK_CAREERS,diff,5,c=>c.d,"career",c=>c.name).map(c=>({ answer:c.name, order:c.clubs.map(nameOf), pool:FK.shuffle(c.clubs.map(nameOf)) }));
}

/* ---------- başlangıç ekranı ---------- */
FK.screens.intro = (el,{mode}) => {
  const M=FK.MODES[mode], s=FK.state; FK.rollover();
  let diff = (s.lastDiff&&s.lastDiff[mode])||1;
  let era = s.guessEra||"now";
  const eraPicker=()=>{ const cnt=FK.guessPool(era).length;
    const card=(k,ic,c1,c2,fg)=>'<button class="era'+(era===k?" on":"")+'" data-era="'+k+'" style="background:linear-gradient(150deg,'+c1+','+c2+');color:'+fg+'">'+(era===k?'<span class="era-ck">'+FK.ic("check",14,3)+'</span>':'')+'<span class="era-ic">'+ic+'</span><b>'+t("era_"+k)+'</b><span>'+t("era_"+k+"S")+'</span></button>';
    return '<div><div class="label muted" style="margin-bottom:8px">'+t("eraTitle")+'</div><div class="era-row">'+
      card("now",FK.ic("bolt",26,2.2),"#22C55E","#0F766E","#fff")+
      card("old",'<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 18L2 7l5 4 5-7 5 7 5-4-1 11z"/><path d="M3 21h18"/></svg>',"#FDE68A","#B45309","#422006")+
      card("mix",FK.ic("grid",24,2.2),"#8B5CF6","#4C1D95","#fff")+
     '</div><div class="small muted center" style="margin-top:8px">'+t("eraCount",{n:cnt})+'</div></div>'; };
  const best=(s.stats.byMode[mode]||{}).best||0;
  const dailyDone = mode==="daily" && s.daily10.date===FK.dayKey() && s.daily10.done;
  const wordleDone = false;
  const draw=()=>{
  el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
  '<div class="scroll"><div class="stack">'+
   '<div class="card-hero" style="background:linear-gradient(135deg,'+M.g[0]+','+M.g[1]+');color:'+M.fg+';min-height:170px;display:flex;flex-direction:column;justify-content:flex-end">'+FK.bgBall(190)+
    '<div style="width:64px;height:64px;border-radius:20px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;margin-bottom:auto">'+FK.ic(M.icon,36,2)+'</div>'+
    '<h1 class="h-display h1" style="margin-top:14px">'+FK.modeName(mode)+'</h1><div style="margin-top:4px;font-size:14px;font-weight:600;opacity:.9">'+t("m_"+mode+"S")+'</div></div>'+
   '<div class="card"><div class="row" style="margin-bottom:8px;color:var(--yellow-l)">'+FK.ic("info",18)+'<b style="font-size:14px">'+t("howTo")+'</b></div><div style="font-size:14px;line-height:1.55;color:#CBD5E1">'+t("rules_"+mode)+'</div></div>'+
   (mode==="guess"?eraPicker():'')+
   (M.diff?'<div><div class="label muted" style="margin-bottom:8px">'+t("diff")+'</div><div class="seg" style="grid-template-columns:repeat(4,1fr)">'+[1,2,3,4].map(d=>'<button data-d="'+d+'" class="'+(d===diff?"on":"")+'">'+t("d"+d)+'</button>').join("")+'</div></div>':'')+
   (best?'<div class="row" style="justify-content:center;color:var(--muted);font-size:13px">'+FK.ic("trophy",16)+t("best",{s:FK.fmtNum(best)})+'</div>':'')+
   (dailyDone?'<div class="offline-note">'+FK.ic("info",18)+'<span>'+t("dailyOnce")+'</span></div>':'')+
   (wordleDone?'<div class="offline-note">'+FK.ic("info",18)+'<span>'+t("alreadyPlayed")+'</span></div>':'')+
  '</div></div>'+
  '<div style="padding:12px 16px calc(18px + var(--safe-b))"><button class="btn btn-primary" data-start '+(wordleDone?'':'')+'>'+FK.ic(wordleDone?"share":"ball",24,2.4)+(wordleDone?t("share"):t("start"))+'</button></div>';
  el.querySelector("[data-back]").onclick=FK.back;
  el.querySelectorAll("[data-era]").forEach(b=>b.onclick=()=>{ era=b.dataset.era; s.guessEra=era; FK.save(); FK.sfx("tap"); draw(); });
  el.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{ diff=+b.dataset.d; FK.sfx("tap"); s.lastDiff=s.lastDiff||{}; s.lastDiff[mode]=diff; FK.save(); draw(); });
  el.querySelector("[data-start]").onclick=()=>{
    FK.sfx("tap"); FK.startGame(mode,diff,dailyDone);
  };
  };
  draw();
};

FK.startGame = (mode,diff,practice) => {
  let qs;
  if(mode==="player") qs=buildPlayer(diff);
  else if(mode==="club") qs=buildClub(diff);
  else if(mode==="flag") qs=buildFlag(diff);
  else if(mode==="daily") qs=buildDaily();
  else if(mode==="career") qs=buildCareer(diff);
  if(mode==="guess"){ FK.go("guess",{diff,era:FK.state.guessEra||"now"},{replace:true}); return; }
  const g={ mode, diff:FK.MODES[mode].diff?diff:0, qs, i:0, score:0, correct:0, streak:0, bestStreak:0, timeSum:0, res:[], jokers:2, practice:!!practice, extra:{careersOk:0,firstTry:0} };
  FK.go("play",{g},{replace:true});
};

/* ---------- oyun ekranı ---------- */
FK.screens.play = (el,{g}) => {
  let timer=null, ended=false;
  const stopTimer=()=>{ if(timer){ cancelAnimationFrame(timer); timer=null; } };
  FK.onLeave=stopTimer;
  FK.backHandler=()=>{ FK.confirm(t("exitConfirm"),t("exit"),()=>{ stopTimer(); ended=true; FK.go("games",{},{root:true}); }); return true; };

  const M=FK.MODES[g.mode];
  const head=()=>'<div class="game-head"><button class="icon-btn" data-quit aria-label="'+t("exit")+'">'+FK.ic("x",20,2.4)+'</button><div class="grow"><div class="h-display" style="font-size:22px">'+FK.modeName(g.mode)+'</div><div class="small muted" style="margin-top:3px">'+(g.diff?t("d"+g.diff)+' · ':'')+t("questionN",{a:g.i+1,b:g.qs.length})+(g.practice?' · '+t("practice"):'')+'</div></div><span class="pill fire">'+FK.fireIc()+g.streak+'</span></div>'+
    '<div class="qbar" style="grid-template-columns:repeat('+g.qs.length+',1fr)">'+g.qs.map((q,k)=>'<span class="'+(g.res[k]===true?"ok":g.res[k]===false?"no":k===g.i?"cur":"")+'"></span>').join("")+'</div>';
  const fb=(ok,txt)=>{ const d=document.createElement("div"); d.className="fb "+(ok?"ok":"no"); d.textContent=txt; el.appendChild(d); setTimeout(()=>d.remove(),900); };

  function timerUI(sec){ return '<div class="timer" data-timer><svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="rgba(5,20,15,.6)" stroke="rgba(255,255,255,.15)" stroke-width="5"/><circle data-ring cx="28" cy="28" r="24" fill="none" stroke="#FACC15" stroke-width="5" stroke-linecap="round" stroke-dasharray="150.8" stroke-dashoffset="0"/></svg><b data-sec>'+sec+'</b></div>'; }
  function runTimer(sec,onTick,onEnd,startAt){
    stopTimer(); const t0=startAt||performance.now(); let lastS=-1;
    const ring=el.querySelector("[data-ring]"), lbl=el.querySelector("[data-sec]"), box=el.querySelector("[data-timer]");
    const step=now=>{ if(ended) return;
      const left=Math.max(0,sec-(now-t0)/1000);
      if(ring) ring.style.strokeDashoffset=String(150.8*(1-left/sec));
      const s=Math.ceil(left); if(s!==lastS){ lastS=s; if(lbl) lbl.textContent=s; if(s<=3&&s>0){ FK.sfx("tick"); box&&box.classList.add("warn"); } if(onTick) onTick(left); }
      if(left<=0){ timer=null; onEnd(); return; }
      timer=requestAnimationFrame(step);
    };
    timer=requestAnimationFrame(step);
    return ()=> (performance.now()-t0)/1000;
  }

  function finishQ(ok,pts,used){
    stopTimer();
    g.res[g.i]=ok; g.timeSum+=used||0;
    if(ok){ g.correct++; g.streak++; g.bestStreak=Math.max(g.bestStreak,g.streak); g.score+=pts; FK.sfx("ok"); FK.vib(30); fb(true,t("correct")); }
    else { g.streak=0; FK.sfx("no"); FK.vib([60,40,60]); }
    setTimeout(next, ok?1100:1700);
  }
  function next(){ if(ended) return; g.i++; if(g.i>=g.qs.length) return endGame(); draw(); }
  function endGame(){
    ended=true; stopTimer();
    if(g.mode==="daily" && !g.practice){ FK.state.daily10={date:FK.dayKey(),score:g.score,correct:g.correct,done:true}; }
    const res=FK.finishGame({mode:g.mode,diff:g.diff,correct:g.correct,total:g.qs.length,score:g.score,bestStreak:g.bestStreak,timeSum:g.timeSum,practice:g.practice,extra:g.extra});
    FK.go("result",{g,res},{replace:true});
  }

  /* ---- ipuçlu modlar: futbolcu & kulüp ----
     Soru başına 40 sn. Her 10 sn'de bir ipucu kendiliğinden açılır; erken bilen çok puan alır. */
  const CT=40;
  function mystStage(q,pts,remain,isP){
    const tier=q.rev; const fresh=q.lastRev!==q.rev; q.lastRev=q.rev;
    const flagSlot = q.rev>=1 ? '<div class="myst-flag">'+FK.flag(q.cc)+'</div>' : '<div class="myst-flag q">?</div>';
    const posSlot = isP ? (q.rev>=2 ? '<div class="myst-pos'+(fresh&&q.rev===2?' reveal-in':'')+'">'+t("posS_"+q.pos)+'</div>' : '<div class="myst-pos">???</div>')
                        : (q.rev>=2 ? '<div class="myst-pos'+(fresh&&q.rev===2?' reveal-in':'')+'">'+q.year+'</div>' : '<div class="myst-pos">????</div>');
    const bust = isP
      ? FK.bust({cls:"myst-bust",w:118,no:q.rev>=4?q.no:0})
      : '<svg class="myst-bust" aria-hidden="true" width="80" height="90" viewBox="0 0 24 26"><path d="M12 1l10 3.6v7.2c0 6.4-4.4 10.4-10 12.2C6.4 22.2 2 18.2 2 11.8V4.6z" fill="currentColor" fill-opacity=".72"/><text x="12" y="16" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="900" font-size="10" fill="#fff" fill-opacity=".85">?</text></svg>';
    return '<div class="stage stadium"><div class="spot l"></div><div class="spot r"></div><div class="lamps"><i></i><i></i><i></i><i></i><i></i><i></i></div>'+
      '<svg aria-hidden="true" width="100%" height="90" viewBox="0 0 390 90" preserveAspectRatio="none" style="position:absolute;left:0;bottom:0"><g fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2"><path d="M40 90 L120 20 L270 20 L350 90"/><path d="M0 60 H390"/><ellipse cx="195" cy="60" rx="70" ry="16"/></g></svg>'+
      '<div class="side-pts"><b>'+pts+'</b><span>'+t("points")+'</span><div class="steps">'+[1,2,3,4].map(i=>'<i class="'+(i>=q.rev?"on":"")+'"></i>').join("")+'</div></div>'+
      '<div class="myst tier-'+tier+(fresh?' pop':'')+'"><div class="myst-in"><div class="myst-top"><div class="myst-rt">?</div>'+posSlot+flagSlot+'</div>'+bust+'<div class="myst-name">? ? ?</div></div></div>'+
      timerUI(Math.ceil(remain))+'</div>';
  }
  function drawClues(){
    const q=g.qs[g.i]; if(q.rev==null){ q.rev=1; q.tries=2; q.gone={}; q.t0=performance.now(); }
    const pts=[100,80,60,40][q.rev-1];
    const isP=g.mode==="player";
    const remain=Math.max(0,CT-(performance.now()-q.t0)/1000);
    el.innerHTML=head()+'<div class="scroll" style="padding-top:12px"><div class="stack" style="gap:12px">'+
     mystStage(q,pts,remain,isP)+
     '<div class="stack" style="gap:8px">'+q.clues.map((c,k)=> k<q.rev
        ? '<div class="clue'+(k===q.rev-1&&k>0?" new":"")+'"><span class="n">'+(k+1)+'</span><span class="grow" style="font-weight:600;font-size:14px">'+FK.esc(c)+'</span><span class="small muted">'+[100,80,60,40][k]+'</span></div>'
        : (k===q.rev ? '<button class="clue locked" data-reveal><span class="n">'+FK.ic("lock",14,2.4)+'</span><span class="grow">'+t("openClue",{n:k+1})+'</span><span class="small">'+[100,80,60,40][k]+'</span></button>' : '')).join("")+'</div>'+
     (q.tries===1?'<div class="center small" style="color:#FCA5A5;font-weight:700">'+t("lastTry")+'</div>':'')+
     '<div class="opts">'+q.opts.map((o,k)=>'<button class="opt'+(q.gone[k]?" gone":"")+'" data-o="'+k+'">'+FK.esc(o)+'</button>').join("")+'</div>'+
     '<div class="joker-row"><button class="joker" data-j '+(g.jokers<=0||Object.keys(q.gone).length>=2?"disabled":"")+'>'+FK.ic("bulb",18)+t("joker50",{n:g.jokers})+'</button></div>'+
    '</div></div>';
    bindCommon();
    const used=runTimer(CT,left=>{ const e=CT-left; if(q.rev<4 && e>=q.rev*10){ q.rev++; drawClues(); } },()=>{
      fb(false,t("timeUp")); el.querySelectorAll("[data-o]").forEach(x=>x.disabled=true); markAnswer(); finishQ(false,0,CT); },q.t0);
    const rv=el.querySelector("[data-reveal]"); if(rv) rv.onclick=()=>{ FK.sfx("tap"); if(q.rev<4){ q.rev++; drawClues(); } };
    el.querySelector("[data-j]").onclick=()=>{ if(g.jokers<=0) return; g.jokers--; FK.sfx("tap");
      const wrong=q.opts.map((o,k)=>k).filter(k=>q.opts[k]!==q.answer && !q.gone[k]); FK.shuffle(wrong).slice(0,2-Object.keys(q.gone).length).forEach(k=>q.gone[k]=1); drawClues(); };
    el.querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>{
      const k=+b.dataset.o; const ok=q.opts[k]===q.answer;
      el.querySelectorAll("[data-o]").forEach(x=>x.disabled=true);
      if(ok){ b.classList.add("ok"); finishQ(true,pts,used()); return; }
      b.classList.add("no"); q.tries--;
      if(q.tries<=0){ fb(false,t("wrong")); markAnswer(); finishQ(false,0,used()); return; }
      FK.sfx("no"); FK.vib(60); q.gone[k]=1;
      setTimeout(()=>{ if(ended||g.qs[g.i]!==q) return; if(q.rev<4) q.rev++; drawClues(); },650);
    });
  }
  function markAnswer(){ const q=g.qs[g.i]; el.querySelectorAll("[data-o]").forEach(x=>{ if(x.textContent===q.answer) x.classList.add("ok"); }); }

  /* ---- hızlı seçmeli modlar: bayrak & günün 10'u ---- */
  function drawQuick(){
    const q=g.qs[g.i], isFlag=g.mode==="flag", SEC=isFlag?10:15;
    el.innerHTML=head()+'<div class="scroll" style="padding-top:12px"><div class="stack" style="gap:14px">'+
     (isFlag
      ? '<div class="stage" style="height:230px;background:radial-gradient(circle at 50% 45%,#1E3A8A,#0F1B33)"><div class="flag-big">'+FK.flag(q.code)+'</div>'+timerUI(SEC)+'</div><div class="center" style="font-weight:700;font-size:16px">'+t("whichCountry")+'</div>'
      : '<div class="stage" style="min-height:200px;padding:70px 18px 22px;background:linear-gradient(160deg,#1A2A4A,#0F1B33);border:1px solid var(--line)"><div class="qtext">'+FK.esc(q.text)+'</div>'+timerUI(SEC)+'<div class="pts-badge" style="background:rgba(250,204,21,.15);color:#FDE047">+100 · '+FK.ic("bolt",12,2.4,'style="display:inline;vertical-align:-1px"')+' +50</div></div>')+
     '<div class="opts '+(isFlag?'':'one')+'">'+q.opts.map((o,k)=>'<button class="opt" data-o="'+k+'">'+FK.esc(o)+'</button>').join("")+'</div>'+
    '</div></div>';
    bindCommon();
    const used=runTimer(SEC,null,()=>{ fb(false,t("timeUp")); el.querySelectorAll("[data-o]").forEach(x=>{x.disabled=true; if(x.textContent===q.answer) x.classList.add("ok");}); finishQ(false,0,SEC); });
    el.querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>{
      const u=used(); const ok=q.opts[+b.dataset.o]===q.answer;
      el.querySelectorAll("[data-o]").forEach(x=>{ x.disabled=true; if(!ok && x.textContent===q.answer) x.classList.add("ok"); });
      b.classList.add(ok?"ok":"no");
      if(!ok) fb(false,t("wrong"));
      const speed=Math.max(0,1-u/SEC);
      finishQ(ok, ok? (isFlag?50+Math.round(50*speed):100+Math.round(50*speed)) : 0, u);
    });
  }

  /* ---- kariyer yolu ---- */
  function drawCareer(){
    const q=g.qs[g.i]; if(!q.picked){ q.picked=[]; q.tries=3; q.marks=null; }
    const left=q.pool.filter((c,k)=>q.picked.indexOf(k)<0);
    el.innerHTML=head()+'<div class="scroll" style="padding-top:12px"><div class="stack" style="gap:12px">'+
     '<div class="card-hero" style="background:linear-gradient(135deg,#A855F7,#6D28D9);padding:16px">'+FK.bgBall(140)+'<div class="label" style="opacity:.85">'+t("m_career")+'</div><div class="h-display" lang="en" style="font-size:30px;margin-top:4px">'+FK.esc(q.answer)+'</div><div class="row small" style="margin-top:8px;opacity:.9">'+FK.ic("info",14)+t("orderHint")+'</div></div>'+
     '<div class="row" style="justify-content:space-between"><span class="small muted">'+t("tries",{n:q.tries})+'</span>'+(q.picked.length?'<button class="small" data-reset style="color:var(--muted);font-weight:700">'+FK.ic("replay",14,2.2,'style="display:inline;vertical-align:-2px"')+' '+t("reset")+'</button>':'')+'</div>'+
     '<div class="order-list">'+q.picked.map((k,pos)=>'<div class="order-item'+(q.marks?(q.marks[pos]?" ok":" no"):"")+'"><span class="num">'+(pos+1)+'</span><span class="grow">'+FK.esc(q.pool[k])+'</span><button class="mv" data-up="'+pos+'" aria-label="up" '+(pos===0?"disabled":"")+'>'+FK.ic("up",18,2.4)+'</button><button class="mv" data-del="'+pos+'" aria-label="remove">'+FK.ic("x",16,2.4)+'</button></div>').join("")+
      (left.length?'<div class="order-item" style="border-style:dashed;background:transparent;color:var(--muted);justify-content:center;font-weight:600;font-size:13px">'+t("pickFrom")+'</div>':'')+'</div>'+
     '<div class="pool">'+q.pool.map((c,k)=> q.picked.indexOf(k)<0 ? '<button data-pick="'+k+'">'+FK.esc(c)+'</button>' : '').join("")+'</div>'+
     '<button class="btn btn-primary" data-check '+(left.length?"disabled":"")+'>'+FK.ic("check",22,2.6)+t("check")+'</button>'+
    '</div></div>';
    bindCommon();
    el.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); q.picked.push(+b.dataset.pick); q.marks=null; drawCareer(); });
    el.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{ q.picked.splice(+b.dataset.del,1); q.marks=null; drawCareer(); });
    el.querySelectorAll("[data-up]").forEach(b=>b.onclick=()=>{ const p=+b.dataset.up; [q.picked[p-1],q.picked[p]]=[q.picked[p],q.picked[p-1]]; q.marks=null; drawCareer(); });
    const rs=el.querySelector("[data-reset]"); if(rs) rs.onclick=()=>{ q.picked=[]; q.marks=null; drawCareer(); };
    el.querySelector("[data-check]").onclick=()=>{
      const marks=q.picked.map((k,pos)=>q.pool[k]===q.order[pos]); q.marks=marks;
      const wrongN=marks.filter(m=>!m).length;
      if(!wrongN){ const pts=[200,120,60][3-q.tries]; if(q.tries===3) g.extra.firstTry++; g.extra.careersOk++; drawCareer(); finishQ(true,pts,0); return; }
      q.tries--; FK.sfx("no"); FK.vib(60);
      if(q.tries<=0){ fb(false,t("wrong")); q.picked=q.order.map(c=>q.pool.indexOf(c)); q.marks=q.order.map(()=>true); drawCareer(); el.querySelectorAll("button").forEach(b=>{ if(!b.hasAttribute("data-quit")) b.disabled=true; }); finishQ(false,0,0); return; }
      drawCareer(); FK.toast(t("orderWrong",{n:wrongN}),"info",2000);
    };
  }

  function bindCommon(){ el.querySelector("[data-quit]").onclick=()=>FK.backHandler(); }
  function draw(){ if(g.mode==="player"||g.mode==="club") drawClues(); else if(g.mode==="career") drawCareer(); else drawQuick(); }

  // geri sayım
  el.innerHTML=head();
  const cd=document.createElement("div"); cd.className="countdown"; el.appendChild(cd);
  let n=3; const tick=()=>{ if(ended) return; if(n===0){ cd.remove(); draw(); return; } cd.innerHTML='<b>'+n+'</b>'; FK.sfx("tick"); n--; setTimeout(tick,750); };
  tick();
};

/* ---------- sonuç ekranı ---------- */
FK.screens.result = (el,{g,res}) => {
  const total=g.qs.length, pct=total?g.correct/total:0;
  const title= pct>=.8?t("great"):pct>=.6?t("good"):pct>=.4?t("ok"):t("tryAgain");
  const li=FK.levelInfo();
  el.classList.add("result-bg");
  el.innerHTML='<div class="scroll" style="padding-top:28px"><div class="stack" style="gap:16px;align-items:stretch">'+
   '<div class="center label" style="color:#FDE68A">'+FK.modeName(g.mode)+(g.diff?' · '+t("d"+g.diff):'')+'</div>'+
   '<h1 class="h-display center" style="font-size:46px">'+title+'</h1>'+
   (res.record?'<div class="center"><span class="chip" style="background:#FACC15;color:#422006">'+FK.ic("trophy",14,2.4)+t("newRecord")+'</span></div>':'')+
   '<div class="score-ring" style="background:conic-gradient(var(--green) 0 '+Math.round(pct*100)+'%, var(--card2) '+Math.round(pct*100)+'% 100%)"><div><span class="big-num">'+FK.fmtNum(g.score)+'</span><span class="small muted" style="font-weight:600">'+t("points")+' · '+t("nCorrect",{a:g.correct,b:total})+'</span></div></div>'+
   '<div class="stat3"><div class="stat"><b style="color:var(--green-l)">'+g.correct+'</b><span>'+t("statCorrect")+'</span></div><div class="stat"><b style="color:#FDBA74">'+g.bestStreak+'</b><span>'+t("statStreak")+'</span></div><div class="stat"><b style="color:#7DD3FC">'+(g.timeSum&&g.correct?(g.timeSum/total).toFixed(1).replace(".",FK.lang()==="tr"?",":"."):"–")+'</b><span>'+t("statAvg")+'</span></div></div>'+
   '<div class="card stack" style="gap:12px">'+
    '<div class="row"><span class="chip chip-xp" style="font-size:14px">+'+res.xp+' XP</span><div class="grow"><div class="row small muted" style="justify-content:space-between"><span>'+t("level")+' '+li.level+'</span><span>'+FK.fmtNum(li.cur)+' / '+FK.fmtNum(li.need)+'</span></div><div class="bar lg" style="margin-top:6px"><i style="width:0" data-xpbar></i></div></div></div>'+
    '<div class="row"><span class="chip chip-gem" style="font-size:14px">'+FK.gemIc()+'+'+res.gems+'</span><span class="grow small muted">'+(res.missions.length?t("missionDone",{m:'<b style="color:var(--text)">'+FK.missionText(res.missions[0])+'</b>'}):(g.practice?t("practice"):''))+'</span></div>'+
    (res.tired?'<div class="small" style="color:#FDBA74">'+t("xpTired")+'</div>':'')+
   '</div>'+(g.practice?'':FK.doubleBtn(res))+
  '</div></div>'+
  '<div style="padding:12px 16px calc(18px + var(--safe-b));display:flex;flex-direction:column;gap:10px">'+
   '<button class="btn btn-primary" data-again>'+FK.ic("replay",22,2.4)+t("playAgain")+'</button>'+
   '<div class="grid2"><button class="btn btn-ghost" data-share>'+FK.ic("share",18)+t("share")+'</button><button class="btn btn-ghost" data-home>'+t("home")+'</button></div></div>';
  setTimeout(()=>{ const b=el.querySelector("[data-xpbar]"); if(b) b.style.width=li.pct+"%"; },200);
  if(pct>=.6){ FK.sfx("win"); FK.confetti(el); }
  el.querySelector("[data-again]").onclick=()=>FK.go("intro",{mode:g.mode},{replace:true});
  el.querySelector("[data-home]").onclick=()=>FK.go("home",{},{root:true});
  el.querySelector("[data-share]").onclick=()=>FK.share("Futbol Kafası · "+FK.modeName(g.mode)+": "+g.correct+"/"+total+" · "+g.score+" "+t("points").toLowerCase()+"\n#FutbolKafası");
  FK.backHandler=()=>{ FK.go("games",{},{root:true}); return true; };
  let delay=600;
  res.ach.forEach(a=>{ setTimeout(()=>FK.toast(t("achUnlocked")+" <b>"+t("ach_"+a.id)+"</b>","trophy",3000),delay); delay+=1200; });
  if(res.levelUp) setTimeout(()=>FK.levelUpModal(res.levelUp),delay+300);
};

FK.levelUpModal = lv => {
  const newAv=FK.AVATARS.filter(a=>a.lv===lv);
  FK.sfx("lvl"); FK.vib([40,40,80]);
  FK.modal('<div style="position:relative;overflow:hidden;text-align:center;padding:10px 0"><div class="rays"></div><div style="position:relative"><div class="label" style="color:var(--yellow-l)">'+t("levelUp")+'</div><div class="levelup-num">'+lv+'</div><div style="font-weight:600;margin-top:4px">'+t("levelUpS",{n:lv})+'</div>'+
   (newAv.length?'<div style="margin-top:16px;display:flex;flex-direction:column;align-items:center;gap:8px">'+FK.avatar(FK.AVATARS.indexOf(newAv[0]),64)+'<span class="small" style="color:var(--green-xl);font-weight:700">'+t("unlocked")+'</span></div>':'')+
   '<button class="btn btn-primary" style="margin-top:20px" data-ok>'+t("done")+'</button></div></div>', w=>{ w.querySelector("[data-ok]").onclick=FK.closeModal; FK.confetti(w); });
};
})();
