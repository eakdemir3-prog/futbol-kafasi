/* ==========================================================
   OYUNCUYU TAHMİN ET (sürekli) ve GÜNÜN KELİMESİ (günlük)
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t;

/* ---------- ortak: kulüp rozeti (logo değil: renk + kısaltma) ---------- */
FK.clubBadge = (code,size=40) => {
  const c=FK_GCLUBS[code]; if(!c) return '';
  const light=["#FFFFFF","#FACC15","#7DD3FC","#F9A8D4","#38BDF8"].indexOf(c[3])>=0;
  const fs=c[1].length>=4?Math.round(size*.26):Math.round(size*.32);
  return '<span class="cbadge" style="width:'+size+'px;height:'+size+'px;background:linear-gradient(135deg,'+c[3]+' 0 58%,'+c[4]+' 58% 100%);color:'+(light?'#0B1426':'#fff')+';font-size:'+fs+'px">'+FK.esc(c[1])+'</span>';
};

/* ======================= OYUNCUYU TAHMİN ET ======================= */
const ACT = () => new Set(window.FK_ACTIVE||[]);
FK.guessPool = era => { const a=ACT(); return P().filter(p=> era==="now"?a.has(p.name) : era==="old"?!a.has(p.name) : true); };
const P = () => FK_GPLAYERS.map(r=>({name:r[0],by:r[1],nat:r[2],pos:r[3],no:r[4],wc:r[5],fame:r[6],clubs:r[7].split(",")}));
const leaguesOf = p => [...new Set(p.clubs.map(c=>FK_GCLUBS[c]&&FK_GCLUBS[c][2]).filter(Boolean))];
const COLS=["nat","pos","by","club","lg","no","wc"];

function compare(g,T){
  const out={};
  out.nat = g.nat===T.nat ? "ok" : ((FK_CONTINENT[g.nat]&&FK_CONTINENT[g.nat]===FK_CONTINENT[T.nat])?"near":"no");
  out.pos = g.pos===T.pos?"ok":"no";
  out.by  = g.by===T.by?"ok":(Math.abs(g.by-T.by)<=2?"near":"no");
  out.byDir = T.by>g.by?"up":"down";
  // Kulüp & lig: hücrede HER ZAMAN tahmin edilen oyuncunun şu anki kulübü/ligi görünür.
  // Yeşil = gizli oyuncu da şu an orada · Sarı = gizli oyuncu geçmişte orada oynadı, şu an değil · Kırmızı = hiç oynamadı
  const gC=g.clubs[g.clubs.length-1], tC=T.clubs[T.clubs.length-1];
  out.club = gC===tC ? "ok" : T.clubs.indexOf(gC)>=0 ? "near" : "no"; out.clubShow=gC;
  const gL=FK_GCLUBS[gC][2], tL=FK_GCLUBS[tC][2];
  out.lg = gL===tL ? "ok" : leaguesOf(T).indexOf(gL)>=0 ? "near" : "no"; out.lgShow=gL;
  out.no  = g.no===T.no?"ok":(Math.abs(g.no-T.no)<=2?"near":"no"); out.noDir=T.no>g.no?"up":"down";
  out.wc  = g.wc===T.wc?"ok":"no";
  return out;
}
const mark = (st,dir) => st==="ok" ? '<i class="mk ok">'+FK.ic("check",13,3.2)+'</i>'
  : dir ? '<i class="mk '+(st==="near"?"near":"no")+'">'+FK.ic(dir,13,3.2)+'</i>'
  : st==="near" ? '<i class="mk near">≈</i>' : '<i class="mk no">'+FK.ic("x",12,3.2)+'</i>';
const trophy = on => '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="'+(on?"#FACC15":"none")+'" stroke="'+(on?"#A16207":"currentColor")+'" stroke-width="2" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" fill="none"/></svg>';
function cellContent(col,p,cmp){
  if(col==="nat") return '<span style="font-size:22px;line-height:1">'+FK.flag(p.nat)+'</span>';
  if(col==="pos") return '<b>'+t("posS_"+p.pos)+'</b>';
  if(col==="by") return '<b style="font-size:13px">'+p.by+'</b>';
  if(col==="club") return FK.clubBadge(cmp?cmp.clubShow:p.clubs[p.clubs.length-1],38);
  if(col==="lg"){ const code=cmp?cmp.lgShow:FK_GCLUBS[p.clubs[p.clubs.length-1]][2], L=FK_LEAGUES[code]||[null,code];
    return '<span class="lgc" lang="en">'+(L[0]?'<i>'+FK.flag(L[0])+'</i>':'')+'<b>'+L[1]+'</b></span>'; }
  if(col==="no") return '<span class="shirt">'+FK.ic("shirt",30,1.6)+'<b>'+p.no+'</b></span>';
  if(col==="wc") return trophy(p.wc);
}

FK.screens.guess = (el,{diff,era}) => {
  era=era||"now";
  const s=FK.state, all=FK.guessPool(era);
  const MAX = diff===4?6:8;
  const pool = all.filter(p=> diff===1?p.fame===1 : diff===2?p.fame<=2 : true);
  const T=FK.fresh("guess",pool,p=>p.name,1)[0];
  FK.markSeen("guess",[T.name]); s.guessRecent=[T.name];
  const names=all.map(p=>p.name).sort((a,b)=>a.localeCompare(b,"tr"));
  const guesses=[]; let done=false, win=false, res=null, query="";
  FK.backHandler=()=>{ if(done||!guesses.length){ FK.go("games",{},{root:true}); return true; } FK.confirm(t("exitConfirm"),t("exit"),()=>FK.go("games",{},{root:true})); return true; };

  const CONT={EU:["AVRUPA","EUROPE"],SA:["G.AMERİKA","S.AMERICA"],AF:["AFRİKA","AFRICA"],AS:["ASYA","ASIA"],NA:["K.AMERİKA","N.AMERICA"]};
  const known=()=>{ const k={}; if(diff<=2) k.nat=true; guesses.forEach(g=>{ const c=compare(g,T); COLS.forEach(col=>{ if(c[col]==="ok") k[col]=true; }); if(c.nat==="near") k.cont=true; }); return k; };
  const revealBar=()=>{ const k=known(); return '<div class="rbar">'+COLS.map(col=>{
      if(done||k[col]){ const cmp = col==="club"?{clubShow:T.clubs[T.clubs.length-1]} : col==="lg"?{lgShow:FK_GCLUBS[T.clubs[T.clubs.length-1]][2]} : null;
        return '<span class="rcell on">'+cellContent(col,T,cmp)+'</span>'; }
      if(col==="nat"&&k.cont){ const ct=CONT[FK_CONTINENT[T.nat]]; return '<span class="rcell on cont">'+(ct?(FK.lang()==="en"?ct[1]:ct[0]):"?")+'</span>'; }
      return '<span class="rcell"></span>'; }).join("")+'</div>'+(diff<=2&&!guesses.length?'<div class="rhint">'+t("countryHint")+'</div>':''); };
  const guessCard=(g,isNew)=>{ const c=compare(g,T); const winRow=g.name===T.name;
    return '<div class="gcard'+(winRow?" win":"")+(isNew?" new":"")+'"><div class="gname" lang="en">'+FK.esc(g.name)+'</div><div class="grow7">'+COLS.map((col,k)=>{
      const st=c[col], dir= col==="by"&&st!=="ok"?c.byDir : col==="no"&&st!=="ok"?c.noDir : null;
      return '<div class="gcol" style="animation-delay:'+(isNew?k*90:0)+'ms"><span class="gcell '+st+'" data-ex="'+FK.esc(g.name)+'|'+col+'">'+cellContent(col,g,c)+'</span>'+mark(st,dir)+'</div>'; }).join("")+'</div></div>'; };

  const explain=(g,col)=>{
    const c=compare(g,T), en=FK.lang()==="en", res=st=>t(st==="ok"?"ex_ok":st==="near"?"ex_near":"ex_no");
    let v="";
    if(col==="nat") v=FK.flag(g.nat)+" "+FK.cName(g.nat)+" — "+(c.nat==="ok"?t("ex_ok"):c.nat==="near"?t("ex_cont"):t("ex_no"));
    if(col==="pos") v=t("pos_"+g.pos)+" — "+res(c.pos);
    if(col==="by") v=g.by+" — "+(c.by==="ok"?t("ex_ok"):t(c.byDir==="up"?"ex_younger":"ex_older"));
    const LN=x=>FK_LEAGUES[x]?(en?FK_LEAGUES[x][3]:FK_LEAGUES[x][2]):x;
    if(col==="club") v=FK_GCLUBS[c.clubShow][0]+" — "+t(c.club==="ok"?"ex_clubSame":c.club==="near"?"ex_clubPast":"ex_clubNo");
    if(col==="lg") v=LN(c.lgShow)+" — "+t(c.lg==="ok"?"ex_lgSame":c.lg==="near"?"ex_lgPast":"ex_lgNo");
    if(col==="no") v="#"+g.no+" — "+(c.no==="ok"?t("ex_ok"):t(c.noDir==="up"?"ex_higher":"ex_lower"));
    if(col==="wc") v=(g.wc?t("ex_wcYes"):t("ex_wcNo"))+" — "+res(c.wc);
    FK.toast('<b>'+t("col_"+col)+':</b> '+v,"info",3800);
  };
  const bindExplain=()=>el.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>{ const [n,col]=b.dataset.ex.split("|"); const g=all.find(x=>x.name===n); if(g){ document.querySelectorAll(".toast").forEach(x=>x.remove()); explain(g,col);} });
  const draw=(newIdx)=>{
    el.innerHTML='<div class="game-head"><button class="icon-btn" data-quit aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><div class="h-display" style="font-size:22px">'+t("m_guess")+'</div><div class="small muted" style="margin-top:3px">'+t("era_"+era)+' · '+t("d"+diff)+' · '+t("guessCount",{a:guesses.length,b:MAX})+'</div></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
    '<div class="scroll" style="padding-top:8px" data-sc><div class="stack" style="gap:12px">'+
     '<div class="stage gstage'+(era==="old"?" gold":"")+'"><div class="rays2"></div>'+
      (done&&win?'<div class="gwin-name" lang="en">'+FK.esc(T.name)+'</div>':'')+
      ''+FK.bust({w:160,show:done,rim:era==="old"?"#FEF3C7":"#4ADE80"})+''+
      revealBar()+'</div>'+
     (done
       ? '<div class="card center stack" style="gap:10px"><div class="h-display h2" style="color:'+(win?'var(--green-l)':'#FCA5A5')+'">'+(win?t("guessWin",{n:guesses.length}):t("guessLose",{a:'<span lang="en">'+FK.esc(T.name)+'</span>'}))+'</div>'+
         (res?'<div class="row" style="justify-content:center;gap:8px"><span class="chip chip-xp">+'+res.xp+' XP</span><span class="chip chip-gem">'+FK.gemIc(12)+'+'+res.gems+'</span></div>'+FK.doubleBtn(res):'')+
         '<button class="btn btn-primary" data-new>'+FK.ic("replay",22,2.4)+t("newPlayer")+'</button><button class="btn btn-ghost" data-share>'+FK.ic("share",18)+t("share")+'</button></div>'
       : '<div class="ac"><div class="row"><input class="input" data-in placeholder="'+t("guessPh")+'" autocomplete="off" autocapitalize="words" spellcheck="false" value="'+FK.esc(query)+'"></div><div class="ac-list down hide" data-ac></div></div>')+
     (guesses.length?'<div class="ghead">'+COLS.map(c=>'<span>'+t("col_"+c)+'</span>').join("")+'</div>':'<div class="small muted center" style="line-height:1.5">'+t("rules_guess")+'</div>')+
     guesses.slice().reverse().map((g,i)=>guessCard(g, newIdx!=null && i===0)).join("")+
    '</div></div>';
    el.querySelector("[data-quit]").onclick=()=>FK.backHandler();
    if(done){
      bindExplain();
      el.querySelector("[data-new]").onclick=()=>{ FK.sfx("tap"); FK.go("guess",{diff,era},{replace:true}); };
      el.querySelector("[data-share]").onclick=()=>FK.share("Futbol Kafası · "+t("m_guess")+"\n"+guesses.map(g=>{ const c=compare(g,T); return COLS.map(col=>c[col]==="ok"?"🟩":c[col]==="near"?"🟨":"⬛").join(""); }).join("\n")+"\n"+(win?guesses.length:"X")+"/"+MAX+" #FutbolKafası");
      return;
    }
    const inp=el.querySelector("[data-in]"), ac=el.querySelector("[data-ac]");
    bindExplain();
    const submit=val=>{
      const p=all.find(x=>FK.norm(x.name)===FK.norm(val));
      if(!p){ inp.classList.add("err"); setTimeout(()=>inp.classList.remove("err"),600); FK.toast(t("notInList"),"info",1600); return; }
      if(guesses.some(g=>g.name===p.name)) return;
      guesses.push(p); query="";
      if(p.name===T.name){ done=true; win=true; FK.sfx("win"); FK.vib([30,40,60]); }
      else { FK.sfx("no"); FK.vib(40); if(guesses.length>=MAX) done=true; }
      if(done){
        const score = win ? Math.round((MAX+1-guesses.length)*25*[1,1,1.2,1.4,1.7][diff]) : 0;
        res=FK.finishGame({mode:"guess",diff,correct:win?1:0,total:1,score,bestStreak:win?1:0,timeSum:0,extra:{win,guesses:guesses.length}});
        draw(0); if(win) FK.confetti(el);
        let d=500; res.ach.forEach(a=>{ setTimeout(()=>FK.toast(t("achUnlocked")+" <b>"+t("ach_"+a.id)+"</b>","trophy",3000),d); d+=1200; });
        res.missions.forEach(m=>FK.toast(t("missionDone",{m:FK.missionText(m)}),"check"));
        if(res.levelUp) setTimeout(()=>FK.levelUpModal(res.levelUp),d+300);
        return;
      }
      draw(0); setTimeout(()=>{ const i=el.querySelector("[data-in]"); if(i) i.focus(); },50);
    };
    inp.oninput=()=>{ query=inp.value; const q=FK.norm(query); if(q.length<2){ ac.classList.add("hide"); return; }
      const m=names.filter(n=>FK.norm(n).indexOf(q)>=0 && !guesses.some(g=>g.name===n)).slice(0,6);
      ac.innerHTML=m.map(n=>'<button data-n="'+FK.esc(n)+'">'+FK.esc(n)+'</button>').join(""); ac.classList.toggle("hide",!m.length);
      ac.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>submit(b.dataset.n)); };
    inp.onkeydown=e=>{ if(e.key==="Enter"){ const f=ac.querySelector("[data-n]"); submit(f?f.dataset.n:inp.value); } };
  };
  draw();
};

/* ======================= GÜNÜN KELİMESİ ======================= */
const ROWS=["QWERTYUIOP","ASDFGHJKL","⏎ZXCVBNM⌫"];
function scoreWord(g,a){ const res=Array(5).fill("no"), left={};
  for(let i=0;i<5;i++){ if(g[i]===a[i]) res[i]="ok"; else left[a[i]]=(left[a[i]]||0)+1; }
  for(let i=0;i<5;i++){ if(res[i]!=="ok" && left[g[i]]){ res[i]="near"; left[g[i]]--; } }
  return res; }
FK.dailyWord = () => { const L=FK_WORDS; const start=new Date(2026,10,1); const d=Math.floor((new Date(FK.dayKey()+"T12:00:00")-start)/864e5);
  const r=FK.rng("wordorder"); const order=FK.shuffle(L.map((x,i)=>i),r); return L[order[((d%L.length)+L.length)%L.length]]; };

FK.screens.word = el => {
  const s=FK.state, today=FK.dayKey(), W=FK.dailyWord(), A=W[0];
  if(!s.word||s.word.date!==today) s.word={date:today,guesses:[],done:false,win:false};
  const st=s.word; let cur=""; let res=null;
  const keyState=()=>{ const k={}; st.guesses.forEach(g=>{ const sc=scoreWord(g,A); for(let i=0;i<5;i++){ const p=k[g[i]]; const v=sc[i]; if(p==="ok") continue; if(p==="near"&&v==="no") continue; k[g[i]]=v; } }); return k; };
  const share=()=>"Futbol Kafası · "+t("m_word")+" "+today+"\n"+st.guesses.map(g=>scoreWord(g,A).map(x=>x==="ok"?"🟩":x==="near"?"🟨":"⬛").join("")).join("\n")+"\n"+(st.win?st.guesses.length:"X")+"/6 #FutbolKafası";
  const draw=(anim)=>{
    const ks=keyState();
    let grid=""; for(let r=0;r<6;r++){ const g=st.guesses[r]; const sc=g?scoreWord(g,A):null; const w=g||(r===st.guesses.length&&!st.done?cur:"");
      grid+='<div class="wrow'+(anim==="shake"&&r===st.guesses.length?" shake":"")+'">'; for(let i=0;i<5;i++){ const ch=w[i]||""; grid+='<span class="wtile'+(sc?" "+sc[i]+" flip":ch?" filled":"")+'" style="'+(sc&&anim==="flip"&&r===st.guesses.length-1?'animation-delay:'+(i*120)+'ms':'animation-delay:0ms;animation-duration:0s')+'">'+ch+'</span>'; } grid+='</div>'; }
    el.innerHTML='<div class="game-head"><button class="icon-btn" data-quit aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><div class="h-display" style="font-size:22px">'+t("m_word")+'</div><div class="small muted" style="margin-top:3px">'+today+'</div></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
    '<div class="scroll" style="padding-top:6px;display:flex;flex-direction:column"><div class="stack" style="gap:12px;flex:1">'+
     '<div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap"><span class="chip" style="background:rgba(20,184,166,.18);color:#5EEAD4">'+FK.ic(W[1]==="p"?"user":"shield",14,2.4)+t("wordCat_"+W[1])+'</span></div>'+
     '<div class="wgrid">'+grid+'</div>'+
     (st.done
       ? '<div class="card center stack" style="gap:10px"><div class="h-display h2" style="color:'+(st.win?'var(--green-l)':'#FCA5A5')+'">'+(st.win?t("wordWin",{n:st.guesses.length}):t("wordLose",{a:A}))+'</div>'+(res?'<div class="row" style="justify-content:center;gap:8px"><span class="chip chip-xp">+'+res.xp+' XP</span><span class="chip chip-gem">'+FK.gemIc(12)+'+'+res.gems+'</span></div>'+FK.doubleBtn(res):'')+'<div class="small muted">'+t("wordDone")+'</div><button class="btn btn-primary" data-share>'+FK.ic("share",22,2.4)+t("share")+'</button></div>'
       : '<div class="small muted center">'+t("wordNote")+'</div><div class="kb">'+ROWS.map(r=>'<div class="kbrow">'+[...r].map(ch=> ch==="⏎"?'<button class="key wide" data-k="ENTER" aria-label="'+t("check")+'">'+FK.ic("check",22,3)+'</button>' : ch==="⌫"?'<button class="key wide" data-k="BACK" aria-label="sil">'+FK.ic("left",20,2.4)+'</button>' : '<button class="key '+(ks[ch]||"")+'" data-k="'+ch+'">'+ch+'</button>').join("")+'</div>').join("")+'</div>')+
    '</div></div>';
    el.querySelector("[data-quit]").onclick=FK.back;
    if(st.done){ el.querySelector("[data-share]").onclick=()=>FK.share(share()); return; }
    el.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>press(b.dataset.k));
  };
  const press=k=>{
    if(st.done) return;
    if(k==="BACK"){ cur=cur.slice(0,-1); draw(); return; }
    if(k==="ENTER"){
      if(cur.length<5){ FK.toast(t("tooShort"),"info",1400); draw("shake"); return; }
      st.guesses.push(cur); cur="";
      const win=st.guesses[st.guesses.length-1]===A;
      if(win){ st.done=true; st.win=true; } else if(st.guesses.length>=6){ st.done=true; }
      FK.save();
      if(st.done){ res=FK.finishGame({mode:"word",diff:0,correct:st.win?1:0,total:1,score:st.win?(7-st.guesses.length)*50:0,bestStreak:st.win?1:0,timeSum:0,extra:{win:st.win,guesses:st.guesses.length}});
        draw("flip"); setTimeout(()=>{ FK.sfx(st.win?"win":"no"); if(st.win) FK.confetti(el); res.missions.forEach(m=>FK.toast(t("missionDone",{m:FK.missionText(m)}),"check")); res.ach.forEach(a=>FK.toast(t("achUnlocked")+" <b>"+t("ach_"+a.id)+"</b>","trophy",3000)); if(res.levelUp) setTimeout(()=>FK.levelUpModal(res.levelUp),900); },700);
      } else { draw("flip"); FK.sfx("tap"); }
      return;
    }
    if(/^[A-Z]$/.test(k) && cur.length<5){ cur+=k; FK.sfx("tap"); draw(); }
  };
  const onKey=e=>{ if(e.key==="Enter") press("ENTER"); else if(e.key==="Backspace") press("BACK"); else { const c=e.key.toLocaleUpperCase("en"); if(/^[A-Z]$/.test(c)) press(c); } };
  document.addEventListener("keydown",onKey); FK.onLeave=()=>document.removeEventListener("keydown",onKey);
  draw();
};
})();
