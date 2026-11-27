/* ==========================================================
   OYUNCUYU TAHMİN ET (sürekli) ve GÜNÜN KELİMESİ (günlük)
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t;

/* ---------- ortak: kulüp rozeti (logo değil: renk + kısaltma) ---------- */
/* v1.5: kalkan rozet (gerçek logo değil: kulüp renkleri + kısaltma) */
let _shN=0;
FK.clubBadge = (code,size=40) => {
  const c=FK_GCLUBS[code]; if(!c) return '';
  const c1=c[3], c2=c[4], tx=c[1], id="sg"+(++_shN);
  const light=["#FFFFFF","#FACC15","#7DD3FC","#F9A8D4","#38BDF8","#FDE047"].indexOf(String(c1).toUpperCase())>=0;
  return '<span class="cbadge sh" style="width:'+size+'px;height:'+size+'px"><svg viewBox="0 0 100 116" preserveAspectRatio="xMidYMid meet" aria-label="'+FK.esc(c[0])+'"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+c1+'"/><stop offset=".5" stop-color="'+c1+'"/><stop offset=".5" stop-color="'+c2+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs>'+
   '<path d="M50 5 L92 17 V58 C92 84 72 102 50 111 C28 102 8 84 8 58 V17 Z" fill="#FDF1D6" stroke="#130A2E" stroke-width="6" stroke-linejoin="round"/>'+
   '<path d="M50 14 L83 23 V58 C83 79 67 94 50 102 C33 94 17 79 17 58 V23 Z" fill="url(#'+id+')" stroke="#130A2E" stroke-width="3" stroke-linejoin="round"/>'+
   '<path d="M50 14 L83 23 V38 C62 33 38 33 17 38 V23 Z" fill="rgba(255,255,255,.22)"/>'+
   '<rect x="4" y="42" width="92" height="36" rx="7" fill="#FDF1D6" stroke="#130A2E" stroke-width="3.5"/>'+
   '<text x="50" y="'+(tx.length>3?69:71)+'" text-anchor="middle" font-family="Barlow Condensed,Inter,sans-serif" font-style="italic" font-weight="900" font-size="'+(tx.length>3?27:34)+'" fill="#130A2E">'+FK.esc(tx)+'</text></svg></span>';
};

/* ======================= OYUNCUYU TAHMİN ET ======================= */
const ACT = () => new Set(window.FK_ACTIVE||[]);
const FREE = () => window.FK_FREE||{};
FK.guessPool = era => { const a=ACT(), f=FREE(); return P().filter(p=> era==="now"?a.has(p.name) : era==="old"?(!a.has(p.name)&&!f[p.name]) : true); };
const P = () => { const a=ACT(), f=FREE(); return FK_GPLAYERS.map(r=>({name:r[0],by:r[1],nat:r[2],pos:r[3],no:r[4],wc:r[5],fame:r[6],clubs:r[7].split(","),free:!!f[r[0]],ret:!a.has(r[0])&&!f[r[0]]})); };
Object.assign(FK_I18N.tr,{ex_noNum:"numara yok",ex_tNoNum:"gizli oyuncunun bilinen bir forma numarası yok",ex_noNumX:"bu oyuncunun forma numarası yok"});
Object.assign(FK_I18N.en,{ex_noNum:"no number",ex_tNoNum:"the hidden player has no known shirt number",ex_noNumX:"this player has no shirt number"});
const stTag = p => p.free?'<i class="retf free" title="'+t("ex_freeTag")+'">🆓</i>':p.ret?'<i class="retf" title="'+t("ex_retTag")+'">🏁</i>':'';
const leaguesOf = p => [...new Set(p.clubs.map(c=>FK_GCLUBS[c]&&FK_GCLUBS[c][2]).filter(Boolean))];
const COLS=["nat","pos","by","club","lg","no","wc"];
const GXI={nat:"g_flag",pos:"g_pitch",by:"g_cake",club:"g_shield",lg:"g_medal",no:"g_shirt",wc:"g_cup"};
Object.assign(FK_I18N.tr,{gx_cnt:"Tahmin {a}/{b}",gx_go:"TAHMİN ET",gx_how:"Nasıl oynanır?",gx_nat:"Ülke",gx_pos:"Mevki",gx_by:"Doğum Yılı",gx_club:"Kulüp",gx_lg:"Lig",gx_no:"Forma No",gx_wc:"Dünya Kupası"});
Object.assign(FK_I18N.en,{gx_cnt:"Guess {a}/{b}",gx_go:"GUESS",gx_how:"How to play?",gx_nat:"Nation",gx_pos:"Pos",gx_by:"Born",gx_club:"Club",gx_lg:"League",gx_no:"Shirt No",gx_wc:"World Cup"});

function compare(g,T){
  const out={};
  out.nat = g.nat===T.nat ? "ok" : ((FK_CONTINENT[g.nat]&&FK_CONTINENT[g.nat]===FK_CONTINENT[T.nat])?"near":"no");
  out.pos = g.pos===T.pos?"ok":"no";
  out.by  = g.by===T.by?"ok":(Math.abs(g.by-T.by)<=2?"near":"no");
  out.byDir = T.by>g.by?"up":"down";
  // Kulüp & lig: hücrede HER ZAMAN tahmin edilen oyuncunun şu anki kulübü/ligi görünür.
  // Yeşil = gizli oyuncu da şu an orada · Sarı = gizli oyuncu geçmişte orada oynadı, şu an değil · Kırmızı = hiç oynamadı
  const gC=g.clubs[g.clubs.length-1], tC=T.clubs[T.clubs.length-1];
  out.clubLast = gC===tC; out.club = gC===tC ? (T.free?"near":"ok") : T.clubs.indexOf(gC)>=0 ? "near" : "no"; out.clubShow=gC;
  const gL=FK_GCLUBS[gC][2], tL=FK_GCLUBS[tC][2];
  out.lg = gL===tL ? "ok" : leaguesOf(T).indexOf(gL)>=0 ? "near" : "no"; out.lgShow=gL;
  out.no  = g.no===T.no?"ok":(!g.no||!T.no)?"no":(Math.abs(g.no-T.no)<=2?"near":"no"); out.noDir=!T.no||!g.no?null:T.no>g.no?"up":"down";
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
  if(col==="club") return FK.clubBadge(cmp?cmp.clubShow:p.clubs[p.clubs.length-1],38)+stTag(p);
  if(col==="lg"){ const code=cmp?cmp.lgShow:FK_GCLUBS[p.clubs[p.clubs.length-1]][2], L=FK_LEAGUES[code]||[null,code];
    return '<span class="lgc" lang="en">'+(L[0]?'<i>'+FK.flag(L[0])+'</i>':'')+'<b>'+L[1]+'</b></span>'; }
  if(col==="no") return '<span class="shirt">'+FK.ic("shirt",30,1.6)+'<b>'+(p.no?p.no:'–')+'</b></span>'+stTag(p);
  if(col==="wc") return trophy(p.wc);
}

FK.screens.guess = (el,{diff,era,level,target,max}) => {
  el.classList.add("mframe","gx"); el.style.setProperty("--mc","#5CD0F5");
  era=era||"now";
  const s=FK.state, all=FK.guessPool("mix");
  const MAX = max || (diff===4?6:8);
  const pool = FK.guessPool(era).filter(p=> diff===1?p.fame===1 : diff===2?p.fame<=2 : true);
  const T=(target&&all.find(p=>p.name===target)) || FK.fresh("guess",pool,p=>p.name,1)[0];
  if(!target) FK.markSeen("guess",[T.name]); s.guessRecent=[T.name];
  const names=all.map(p=>p.name).sort((a,b)=>a.localeCompare(b,"tr"));
  const guesses=[]; let done=false, win=false, res=null, query="";
  const exitTo=()=>FK.modeHome("guess");
  FK.backHandler=()=>{ if(done||!guesses.length){ exitTo(); return true; } FK.confirm(t("quitMid"),t("exit"),exitTo); return true; };

  const CONT={EU:["AVRUPA","EUROPE"],SA:["G.AMERİKA","S.AMERICA"],AF:["AFRİKA","AFRICA"],AS:["ASYA","ASIA"],NA:["K.AMERİKA","N.AMERICA"],OC:["OKYANUSYA","OCEANIA"]};
  const hinted={};
  const known=()=>{ const k=Object.assign({},hinted); if(diff<=2) k.nat=true; guesses.forEach(g=>{ const c=compare(g,T); COLS.forEach(col=>{ if(c[col]==="ok") k[col]=true; }); if(c.nat==="near") k.cont=true; }); return k; };
  const revealBar=()=>{ const k=known(); return '<div class="rbar">'+COLS.map(col=>{
      if(done||k[col]){ const cmp = col==="club"?{clubShow:T.clubs[T.clubs.length-1]} : col==="lg"?{lgShow:FK_GCLUBS[T.clubs[T.clubs.length-1]][2]} : null;
        return '<span class="rcell on">'+cellContent(col,T,cmp)+'</span>'; }
      if(col==="nat"&&k.cont){ const ct=CONT[FK_CONTINENT[T.nat]]; return '<span class="rcell on cont">'+(ct?(FK.lang()==="en"?ct[1]:ct[0]):"?")+'</span>'; }
      return '<span class="rcell"></span>'; }).join("")+'</div>'+(diff<=2&&!guesses.length?'<div class="rhint">'+t("countryHint")+'</div>':''); };
  const guessCard=(g,isNew)=>{ const c=compare(g,T); const winRow=g.name===T.name;
    return '<div class="gcard'+(winRow?" win":"")+(isNew?" new":"")+'"><div class="gname" lang="en">'+FK.esc(g.name)+'</div><div class="grow7">'+COLS.map((col,k)=>{
      const st=c[col], dir= col==="by"&&st!=="ok"?c.byDir : col==="no"&&st!=="ok"?c.noDir : null;
      return '<div class="gcol" style="animation-delay:'+(isNew?k*90:0)+'ms"><span class="gcell '+st+'" data-ex="'+FK.esc(g.name)+'|'+col+'">'+cellContent(col,g,c)+'</span>'+(col==="nat"&&st==="near"?'<i class="mk near">'+FK.ic("globe",13,2.6)+'</i>':mark(st,dir))+'</div>'; }).join("")+'</div></div>'; };

  const explain=(g,col)=>{
    const c=compare(g,T), en=FK.lang()==="en", res=st=>t(st==="ok"?"ex_ok":st==="near"?"ex_near":"ex_no");
    let v="";
    if(col==="nat") v=FK.flag(g.nat)+" "+FK.cName(g.nat)+" — "+(c.nat==="ok"?t("ex_ok"):c.nat==="near"?t("ex_cont"):t("ex_no"));
    if(col==="pos") v=t("pos_"+g.pos)+" — "+res(c.pos);
    if(col==="by") v=g.by+" — "+(c.by==="ok"?t("ex_ok"):t(c.byDir==="up"?"ex_younger":"ex_older"));
    const LN=x=>FK_LEAGUES[x]?(en?FK_LEAGUES[x][3]:FK_LEAGUES[x][2]):x;
    const R=T.free?"F":T.ret?"R":"", gt=g.free?" 🆓":g.ret?" 🏁":"";
    if(col==="club") v=FK_GCLUBS[c.clubShow][0]+gt+" — "+t(c.club==="ok"||c.clubLast?"ex_clubSame"+R:c.club==="near"?"ex_clubPast"+R:"ex_clubNo");
    if(col==="lg") v=LN(c.lgShow)+gt+" — "+t(c.lg==="ok"?"ex_lgSame"+R:c.lg==="near"?"ex_lgPast"+R:"ex_lgNo");
    if(col==="no") v=(g.no?"#"+g.no:t("ex_noNum"))+" — "+(c.no==="ok"?t("ex_ok"):!T.no?t("ex_tNoNum"):!g.no?t("ex_noNumX"):t(c.noDir==="up"?"ex_higher":"ex_lower"));
    if(col==="wc") v=(g.wc?t("ex_wcYes"):t("ex_wcNo"))+" — "+res(c.wc);
    FK.toast('<b>'+t("col_"+col)+':</b> '+v,"info",3800);
  };
  const bindExplain=()=>el.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>{ const [n,col]=b.dataset.ex.split("|"); const g=all.find(x=>x.name===n); if(g){ document.querySelectorAll(".toast").forEach(x=>x.remove()); explain(g,col);} });
  const draw=(newIdx)=>{
    const k=known(), hb=FK.BOOSTS.find(x=>x.id==="hint"), hn=FK.inv("hint");
    const revCell=col=>{ if(done||k[col]){ const cmp = col==="club"?{clubShow:T.clubs[T.clubs.length-1]} : col==="lg"?{lgShow:FK_GCLUBS[T.clubs[T.clubs.length-1]][2]} : null; return '<span class="gx-c on">'+cellContent(col,T,cmp)+'</span>'; }
      if(col==="nat"&&k.cont){ const ct=CONT[FK_CONTINENT[T.nat]]; return '<span class="gx-c on cont">'+(ct?(FK.lang()==="en"?ct[1]:ct[0]):"?")+'</span>'; }
      return '<span class="gx-c lk"><img src="img/'+GXI[col]+'.webp" alt=""><img class="gx-l" src="img/g_lock.webp" alt=""></span>'; };
    const row=(g,isNew)=>{ const c=compare(g,T), w=g.name===T.name;
      return '<div class="gx-r'+(w?" win":"")+(isNew?" new":"")+'"><b class="gx-n" lang="en">'+FK.esc(g.name)+'</b>'+COLS.map((col,j)=>{ const st=c[col], dir= col==="by"&&st!=="ok"?c.byDir : col==="no"&&st!=="ok"?c.noDir : null;
        return '<span class="gx-c '+st+'" data-ex="'+FK.esc(g.name)+'|'+col+'" style="animation-delay:'+(isNew?j*80:0)+'ms">'+cellContent(col,g,c)+(dir?'<i class="gx-a">'+FK.ic(dir,11,3.4)+'</i>':col==="nat"&&st==="near"?'<i class="gx-a">'+FK.ic("globe",11,2.8)+'</i>':'')+'</span>'; }).join("")+'</div>'; };
    el.innerHTML='<div class="game-head"><button class="icon-btn" data-quit aria-label="'+t("exit")+'">'+FK.ic("x",20,2.4)+'</button><div class="grow"><div class="h-display" style="font-size:22px">'+t("m_guess")+'</div></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
    '<div class="scroll" data-sc><div class="stack" style="gap:10px">'+
     '<div class="gx-cnt"><span>'+t("gx_cnt",{a:guesses.length,b:MAX})+'</span></div>'+
     '<div class="gx-card'+(guesses.length&&!done?" sm":"")+(era==="old"?" old":"")+'"><img src="img/card_player.webp" alt="">'+(done?'<div class="gx-name'+(win?"":" lose")+'" lang="en">'+FK.esc(T.name)+'</div>':'')+'</div>'+
     '<div class="gx-tbl"><div class="gx-r gx-h"><b class="gx-n"></b>'+COLS.map(c=>'<span>'+t("gx_"+c)+'</span>').join("")+'</div>'+
      '<div class="gx-r gx-rev"><b class="gx-n">'+(done?FK.ic("check",16,3):'?')+'</b>'+COLS.map(revCell).join("")+'</div>'+
      guesses.slice().reverse().map((g,i)=>row(g, newIdx!=null && i===0)).join("")+'</div>'+
     (done
       ? '<div class="card center stack" style="gap:10px"><div class="h-display h2" style="color:'+(win?'#15803D':'#B91C1C')+'">'+(win?t("guessWin",{n:guesses.length}):t("guessLose",{a:'<span lang="en">'+FK.esc(T.name)+'</span>'}))+'</div>'+
         (res&&res.lvl?'<div>'+FK.starsHtml(res.lvl.stars,34)+'</div>':'')+
         (res?'<div class="row" style="justify-content:center;gap:8px"><span class="chip chip-xp">+'+res.xp+' XP</span><span class="chip chip-gem">'+FK.gemIc(12)+'+'+res.gems+'</span></div>'+FK.doubleBtn(res):'')+
         (res&&res.lvl&&res.lvl.next?'<button class="btn btn-primary" data-nextlv>'+t("lvNext")+' · '+res.lvl.nextN+' <span class="en-cost">⚡1</span></button><button class="btn btn-ghost" data-new>'+FK.ic("replay",20,2.4)+t("lvRetry")+'</button>'
           :'<button class="btn btn-primary" data-new>'+FK.ic("replay",22,2.4)+(level?t("lvRetry"):t("newPlayer"))+'</button>')+
         FK.endRow("guess","data-share")+'</div>'
       : '<button class="gx-hint" data-boost="hint"><img src="img/g_mag.webp" alt=""><b>'+t("b_hint")+'</b><i></i><span>'+(hn?'×'+hn:FK.gemIc(18)+(hb?hb.p:""))+'</span></button>'+
         '<div class="ac gx-in"><div class="gx-inr"><input class="input" data-in placeholder="'+t("guessPh")+'" autocomplete="off" autocapitalize="words" spellcheck="false" value="'+FK.esc(query)+'"><button class="gx-go" data-go>'+t("gx_go")+'</button></div><div class="ac-list down hide" data-ac></div></div>')+
     '<button class="gx-how" data-how>'+FK.ic("info",18,2.4)+'<u>'+t("gx_how")+'</u></button>'+
    '</div></div>';
    if(done){ const rc=el.querySelector(".gx-tbl+.card"); if(rc) requestAnimationFrame(()=>{ const sc=el.querySelector("[data-sc]"); if(sc) sc.scrollTop=Math.max(0,rc.offsetTop+rc.offsetHeight-sc.clientHeight+60); }); }
    el.querySelector("[data-how]").onclick=()=>FK.modal('<div class="stack" style="gap:12px"><div class="h-display h2 center">'+t("howTo")+'</div><div style="font-size:14px;line-height:1.55">'+t("rules_guess")+'</div><button class="btn btn-primary" data-ok>'+t("done")+'</button></div>',w=>w.querySelector("[data-ok]").onclick=FK.closeModal);
    el.querySelector("[data-quit]").onclick=()=>FK.backHandler();
    if(done){
      bindExplain(); FK.bindEndRow(el,"guess");
      el.querySelector("[data-new]").onclick=()=>{ FK.sfx("tap"); if(level){ FK.playLevel("guess",level); return; } FK.go("guess",{diff,era},{replace:true}); };
      const nl=el.querySelector("[data-nextlv]"); if(nl) nl.onclick=()=>FK.playLevel("guess",res.lvl.nextN);
      if(res&&res.lvl&&res.lvl.chest&&!res._ch){ res._ch=1; setTimeout(()=>FK.chestModal(res.lvl.chest,res.lvl.n),900); }
      el.querySelector("[data-share]").onclick=()=>FK.shareCard({mode:"guess",score:res?res.score||0:0,level,stars:res&&res.lvl?res.lvl.stars:null,win,tries:guesses.length,max:MAX,grid:guesses.map(g=>{ const c=compare(g,T); return COLS.map(col=>c[col]); }),pose:win?"sampiyon":"uzgun"});
      return;
    }
    const inp=el.querySelector("[data-in]"), ac=el.querySelector("[data-ac]");
    bindExplain();
    FK.bindBoosts(el,{ hint:()=>{ const k=known(); const c=["club","lg","no","pos","by","nat","wc"].filter(x=>!k[x]); if(!c.length){ FK.toast("👍","check"); return; } hinted[c[0]]=true; FK.sfx("win"); FK.toast(t("b_hint")+": "+t("col_"+c[0]),"bulb",1800); draw(); } });
    const submit=val=>{
      const p=all.find(x=>FK.norm(x.name)===FK.norm(val));
      if(!p){ inp.classList.add("err"); setTimeout(()=>inp.classList.remove("err"),600); FK.toast(t("notInList"),"info",1600); return; }
      if(guesses.some(g=>g.name===p.name)) return;
      guesses.push(p); query="";
      if(p.name===T.name){ done=true; win=true; FK.sfx("win"); FK.vib([30,40,60]); }
      else { FK.sfx("no"); FK.vib(40); if(guesses.length>=MAX) done=true;
        /* ilk bölümlerde Kafa yardım eder: 3 yanlışta lig, 6 yanlışta mevki açılır */
        else if(level && level<=40){ const k=known(), give=guesses.length===3?"lg":guesses.length===6?"pos":null;
          if(give && !k[give]){ hinted[give]=true; setTimeout(()=>FK.toast(t("kafaHint",{c:t("col_"+give)}),"bulb",2600),350); } } }
      if(done){
        const score = win ? Math.round((MAX+1-guesses.length)*25*[1,1,1.2,1.4,1.7][diff]) : 0;
        res=FK.finishGame({mode:"guess",diff,level,correct:win?1:0,total:1,score,bestStreak:win?1:0,timeSum:0,extra:{win,guesses:guesses.length}}); res.score=score;
        draw(0); if(win) FK.confetti(el);
        let d=500; res.ach.forEach(a=>{ setTimeout(()=>FK.toast(t("achUnlocked")+" <b>"+t("ach_"+a.id)+"</b>","trophy",3000),d); d+=1200; });
        res.missions.forEach(m=>FK.toast(t("missionDone",{m:FK.missionText(m)}),"check"));
        if(res.levelUp) setTimeout(()=>FK.levelUpModal(res.levelUp),d+300);
        return;
      }
      const wk=el.classList.contains("kb") && document.activeElement===inp; draw(0); if(wk) setTimeout(()=>{ const i=el.querySelector("[data-in]"); if(i) i.focus(); },50); else el.classList.remove("kb");
    };
    inp.oninput=()=>{ query=inp.value; const q=FK.norm(query); if(q.length<2){ ac.classList.add("hide"); return; }
      const m=names.filter(n=>FK.norm(n).indexOf(q)>=0 && !guesses.some(g=>g.name===n)).slice(0,6);
      ac.innerHTML=m.map(n=>'<button data-n="'+FK.esc(n)+'">'+FK.esc(n)+'</button>').join(""); ac.classList.toggle("hide",!m.length);
      ac.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>submit(b.dataset.n)); if(el.classList.contains("kb")) scb(); };
    inp.onkeydown=e=>{ if(e.key==="Enter"){ const f=ac.querySelector("[data-n]"); submit(f?f.dataset.n:inp.value); } };
    el.querySelector("[data-go]").onclick=()=>{ const f=ac.querySelector("[data-n]"); submit(f?f.dataset.n:inp.value); };
    const scb=()=>{ const sc=el.querySelector("[data-sc]"); if(sc) sc.scrollTop=sc.scrollHeight; };
    const h0=window.innerHeight; inp.addEventListener("focus",()=>{ el.classList.add("kb"); scb(); setTimeout(scb,350); setTimeout(()=>{ scb(); if(window.innerHeight>=h0*0.9 && window.innerHeight>=600) el.classList.remove("kb"); },1000); });
    inp.addEventListener("blur",()=>setTimeout(()=>{ const a=document.activeElement; if(!a||!a.matches||!a.matches("[data-in]")) el.classList.remove("kb"); },200));
    if(!el._gxR){ el._gxR=1; let mx=window.innerHeight;
      window.addEventListener("resize",()=>{ const h=window.innerHeight; if(h>mx) mx=h;
        if(!el.classList.contains("kb")) return;
        if(h>=mx*0.9){ el.classList.remove("kb"); const a=document.activeElement; if(a&&a.matches&&a.matches("[data-in]")) a.blur(); return; }
        const sc=el.querySelector("[data-sc]"); if(sc) sc.scrollTop=sc.scrollHeight; }); }
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

FK.screens.word = el => { el.classList.add("mframe"); el.style.setProperty("--mc","#B79DFF");
  const s=FK.state, today=FK.dayKey(), W=FK.dailyWord(), A=W[0];
  if(!s.word||s.word.date!==today) s.word={date:today,guesses:[],done:false,win:false};
  const st=s.word; let cur=""; let res=null;
  const keyState=()=>{ const k={}; st.guesses.forEach(g=>{ const sc=scoreWord(g,A); for(let i=0;i<5;i++){ const p=k[g[i]]; const v=sc[i]; if(p==="ok") continue; if(p==="near"&&v==="no") continue; k[g[i]]=v; } }); return k; };
  const share=()=>"Futbol Kafası · "+t("m_word")+" "+today+"\n"+st.guesses.map(g=>scoreWord(g,A).map(x=>x==="ok"?"🟩":x==="near"?"🟨":"⬛").join("")).join("\n")+"\n"+(st.win?st.guesses.length:"X")+"/6 #FutbolKafası";
  const draw=(anim)=>{
    const ks=keyState();
    let grid=""; for(let r=0;r<6;r++){ const g=st.guesses[r]; const sc=g?scoreWord(g,A):null; const w=g||(r===st.guesses.length&&!st.done?cur:"");
      grid+='<div class="wrow'+(anim==="shake"&&r===st.guesses.length?" shake":"")+'">'; for(let i=0;i<5;i++){ const ch=w[i]||""; grid+='<span class="wtile'+(sc?" "+sc[i]+" flip":ch?" filled":"")+'" style="'+(sc&&anim==="flip"&&r===st.guesses.length-1?'animation-delay:'+(i*120)+'ms':'animation-delay:0ms;animation-duration:0s')+'">'+ch+'</span>'; } grid+='</div>'; }
    el.innerHTML='<div class="game-head"><button class="icon-btn" data-quit aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><div class="h-display" style="font-size:22px">'+t("m_word")+'</div><div class="small muted" style="margin-top:3px">'+new Date(today+"T12:00:00").toLocaleDateString(FK.lang()==="en"?"en-GB":"tr-TR",{day:"numeric",month:"long"})+'</div></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
    '<div class="scroll" style="padding-top:6px;display:flex;flex-direction:column"><div class="stack" style="gap:12px;flex:1">'+
     '<div class="row wcat-row">'+(FK.kafa?FK.kafa("bilge",52):'')+'<span class="chip wcat">'+FK.ic(W[1]==="p"?"user":"shield",15,2.4)+t("wordCat_"+W[1])+'</span></div>'+
     '<div class="wgrid">'+grid+'</div>'+
     (st.done
       ? '<div class="card center stack" style="gap:10px"><div class="h-display h2" style="color:'+(st.win?'var(--green-l)':'#FCA5A5')+'">'+(st.win?t("wordWin",{n:st.guesses.length}):t("wordLose",{a:A}))+'</div>'+(res?'<div class="row" style="justify-content:center;gap:8px"><span class="chip chip-xp">+'+res.xp+' XP</span><span class="chip chip-gem">'+FK.gemIc(12)+'+'+res.gems+'</span></div>'+FK.doubleBtn(res):'')+'<div class="small muted">'+t("wordDone")+'</div><button class="btn btn-primary" data-share>'+FK.ic("share",22,2.4)+t("share")+'</button></div>'
       : '<div class="kb"><div class="wnote">'+t("wordNote")+'</div>'+ROWS.map(r=>'<div class="kbrow">'+[...r].map(ch=> ch==="⏎"?'<button class="key wide" data-k="ENTER" aria-label="'+t("check")+'">'+FK.ic("check",22,3)+'</button>' : ch==="⌫"?'<button class="key wide" data-k="BACK" aria-label="sil">'+FK.ic("left",20,2.4)+'</button>' : '<button class="key '+(ks[ch]||"")+'" data-k="'+ch+'">'+ch+'</button>').join("")+'</div>').join("")+'</div>')+
    '</div></div>';
    el.querySelector("[data-quit]").onclick=FK.back;
    if(st.done){ el.querySelector("[data-share]").onclick=()=>FK.shareCard({mode:"word",win:st.win,tries:st.guesses.length,max:6,wgrid:st.guesses.map(g=>scoreWord(g,A)),pose:st.win?"sampiyon":"uzgun",text:share()}); return; }
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
