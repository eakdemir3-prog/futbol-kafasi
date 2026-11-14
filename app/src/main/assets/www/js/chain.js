/* ==========================================================
   v1.3 — KULÜP ZİNCİRİ
   Sırayla: mevcut kulüpte oynamış bir futbolcu yaz → o futbolcunun başka bir kulübünü seç → sıra rakipte.
   Modlar: online (fk_live odası, sıra tabanlı) · aynı telefonda 2 kişi · Kafa Bot
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, N=()=>window.FKAndroid;
Object.assign(FK_I18N.tr,{
  m_chain:"Kulüp Zinciri", m_chainS:"Ortak futbolcuyla kulüpten kulübe", ch_title:"KULÜP ZİNCİRİ",
  ch_sub:"Kulüpte oynamış bir futbolcu yaz, onun başka bir kulübüne geç. Zinciri koparan kaybeder!",
  ch_online:"Online maç", ch_onlineS:"Canlı rakiple sırayla", ch_local:"Aynı telefonda", ch_localS:"Arkadaşınla elden ele", ch_bot:"Kafa Bot'a karşı", ch_botS:"Tek başına antrenman",
  ch_p1:"1. Oyuncu", ch_p2:"2. Oyuncu", ch_ask:"Bu kulüpte oynamış bir futbolcu yaz", ch_ph:"Futbolcu adı…", ch_pick:"{p} hangi kulübe götürsün?",
  ch_wrong:"{p} {c} forması giymedi!", ch_used:"{p} zaten kullanıldı", ch_noClub:"{p} ile gidilecek yeni kulüp kalmadı", ch_time:"Süre doldu!", ch_turnMe:"Sıra sende", ch_turnOpp:"Rakip düşünüyor…",
  ch_turnOf:"Sıra: {n}", ch_pass:"Telefonu {n} oyuncusuna ver", ch_ready:"Hazırım", ch_win:"{n} kazandı!", ch_links:"{n} halka", ch_again:"Tekrar oyna",
  ch_rules:"Kulüp Zinciri: Ekrandaki kulüpte oynamış bir futbolcu yaz. Doğruysa o futbolcunun oynadığı başka bir kulübü seç; zincir o kulüple devam eder ve sıra rakibe geçer. Her hamle 15 saniye. Aynı futbolcu ya da kulüp ikinci kez kullanılamaz. Yanlış cevap ya da süre bitimi 1 can götürür; 3 canı biten kaybeder. Sadece oyundaki futbolcu listesindekiler kabul edilir, yazarken öneriler çıkar. Online: galibiyet +25 kupa ve 30 💎, mağlubiyet −15 kupa ve 5 💎.",
  ch_noOpp:"Şu an online rakip yok, Kafa Bot'a karşı oynuyorsun.", ch_passB:"Pas", ch_passed:"{n} pas geçti", ch_start:"Başlangıç kulübü", ch_bySel:"{p} ile"
});
Object.assign(FK_I18N.en,{
  m_chain:"Club Chain", m_chainS:"Club to club via a shared player", ch_title:"CLUB CHAIN",
  ch_sub:"Name a player from the club, then jump to another of his clubs. Break the chain and you lose!",
  ch_online:"Online match", ch_onlineS:"Take turns with a live opponent", ch_local:"Same phone", ch_localS:"Pass and play with a friend", ch_bot:"Vs Kafa Bot", ch_botS:"Solo practice",
  ch_p1:"Player 1", ch_p2:"Player 2", ch_ask:"Name a player who played for this club", ch_ph:"Player name…", ch_pick:"Where does {p} take the chain?",
  ch_wrong:"{p} never played for {c}!", ch_used:"{p} has already been used", ch_noClub:"No new club left to reach with {p}", ch_time:"Time's up!", ch_turnMe:"Your turn", ch_turnOpp:"Opponent is thinking…",
  ch_turnOf:"Turn: {n}", ch_pass:"Hand the phone to {n}", ch_ready:"Ready", ch_win:"{n} wins!", ch_links:"{n} links", ch_again:"Play again",
  ch_rules:"Club Chain: name a player who played for the club on screen. If correct, pick another club he played for; the chain moves there and it's your opponent's turn. 15 seconds per move. A player or club can't be used twice. A wrong answer or running out of time costs 1 life; lose all 3 and you lose. Only players in the game's list count, suggestions appear as you type. Online: win +25 cups and 30 💎, loss −15 cups and 5 💎.",
  ch_noOpp:"No one is online right now, you're playing Kafa Bot.", ch_passB:"Pass", ch_passed:"{n} passed", ch_start:"Starting club", ch_bySel:"via {p}"
});
FK.MODES.chain={ icon:"link", g:["#0EA5E9","#1E3A8A"], fg:"#fff", diff:false, total:0 };

const SEC=15, LIVES=3;
const chs=()=>{ const s=FK.state; s.ch=s.ch||{cup:0,w:0,l:0}; return s.ch; };
let DB=null;
const db=()=>{ if(DB) return DB; const P=[], byClub={};
  const LO=window.FK_LOANS||{};
  FK_GPLAYERS.concat(window.FK_XPLAYERS||[]).forEach(x=>{ const cl=[...new Set((String(x[7])+","+(x[8]||"")+","+(LO[x[0]]||"")).split(",").filter(c=>c&&FK_GCLUBS[c]))]; if(!cl.length) return; const p={name:x[0],fame:x[6],clubs:cl,n:FK.norm(x[0])}; P.push(p); cl.forEach(c=>(byClub[c]=byClub[c]||[]).push(p)); });
  const starts=Object.keys(byClub).filter(c=>byClub[c].filter(p=>p.clubs.length>=2).length>=10).sort();
  DB={P,byClub,starts,byName:Object.fromEntries(P.map(p=>[p.name,p]))}; return DB; };
const cn=c=>FK_GCLUBS[c]?FK_GCLUBS[c][0]:c;
const badge=(c,s)=>FK.clubBadge?FK.clubBadge(c,s||40):'';

/* ---------- lobi ---------- */
FK.screens.chain = el => {
  const o=chs();
  el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:26px;margin:0">'+t("ch_title")+'</h1></div><span class="pill">'+FK.gemIc()+FK.fmtNum(FK.state.gems)+'</span></div>'+
   '<div class="scroll"><div class="stack" style="gap:14px">'+
   '<div class="ch-hero"><div class="rays2" style="opacity:.3"></div><div class="ch-demo">'+["GS","ARS","OM"].map((c,i)=>(i?'<i>'+FK.ic("link",18,2.4)+'</i>':'')+badge(c,52)).join("")+'</div><div class="small" style="position:relative;font-weight:700;line-height:1.45;margin-top:10px">'+t("ch_sub")+'</div></div>'+
   '<button class="ol-card ch-on" data-on><div class="row" style="gap:12px;position:relative"><span style="font-size:38px">🌐</span><div class="grow"><div class="h-display" style="font-size:26px">'+t("ch_online")+'</div><div class="small" style="opacity:.9">'+t("ch_onlineS")+'</div></div><span class="ol-en">⚡1</span></div><div class="ol-cupb">🏆 '+t("ol_cup",{n:o.cup})+' · '+t("ol_lg"+FK.olLeague(o.cup))+' · '+t("ol_stats",{w:o.w,l:o.l})+'</div></button>'+
   '<div class="grid2"><button class="mode" data-loc><div class="mode-top" style="background:linear-gradient(135deg,#22C55E,#15803D);color:#fff">'+FK.ic("user",32,2)+'</div><div class="mode-body"><div class="mode-name">'+t("ch_local")+'</div><div class="mode-desc">'+t("ch_localS")+'</div></div></button>'+
   '<button class="mode" data-bot><div class="mode-top" style="background:linear-gradient(135deg,#F97316,#B45309);color:#fff">'+(FK.kafa?FK.kafa("bilge",46):'')+'<span class="mode-best" style="color:#fff">⚡1</span></div><div class="mode-body"><div class="mode-name">'+t("ch_bot")+'</div><div class="mode-desc">'+t("ch_botS")+'</div></div></button></div>'+
   '<button class="small" data-r style="color:var(--muted);text-decoration:underline;background:none;border:0">'+t("howTo")+'</button>'+
   '</div></div>';
  el.querySelector("[data-back]").onclick=()=>FK.back();
  el.querySelector("[data-on]").onclick=()=>{ FK.sfx("tap"); if(!FK.user()){ FK.toast(t("ol_login"),"info",3000); FK.signIn(); return; } FK.useEnergy(()=>FK.go("olwait",{mode:"chain"})); };
  el.querySelector("[data-loc]").onclick=()=>{ FK.sfx("tap"); FK.go("chplay",{mode:"local"}); };
  el.querySelector("[data-bot]").onclick=()=>{ FK.sfx("tap"); FK.useEnergy(()=>FK.go("chplay",{mode:"bot"})); };
  el.querySelector("[data-r]").onclick=()=>FK.modal('<div class="stack" style="gap:12px"><div style="display:flex;justify-content:center">'+FK.kafa("bilge",80,"bob")+'</div><div class="h-display h2 center">'+t("howTo")+'</div><div style="line-height:1.55;font-size:15px">'+t("ch_rules")+'</div><button class="btn btn-primary" data-ok>'+t("close")+'</button></div>',w=>w.querySelector("[data-ok]").onclick=FK.closeModal);
};

/* ---------- oyun ---------- */
FK.screens.chplay = (el,p) => {
  const D=db(), mode=p.mode, side=p.side||"a", os=side==="a"?"b":"a", room=p.room, m=(()=>{ const u=FK.user()||{}, P=FK.state.profile; return {uid:u.uid||"",name:(P.name||"?").slice(0,18),av:P.avatar||0,cup:chs().cup}; })();
  const call=(fn,...a)=>{ try{ const n=N(); if(n&&n[fn]){ n[fn](...a); return true; } }catch(e){} return false; };
  let names={a:m.name,b:mode==="local"?t("ch_p2"):mode==="bot"?t("ol_bot"):"?"}, avs={a:m.av,b:0}, opp=null;
  if(mode==="local"){ names.a=t("ch_p1"); }
  let G=null, applied=0, turnT0=0, raf=null, ended=false, phase="wait", botT=null, readyT=null, lastSeen=Date.now(), picking=null, handoff=false;
  const sideName=s=>names[s];
  const newGame=seed=>{ const r=FK.rng("chain-"+seed); const c=D.starts[Math.floor(r()*D.starts.length)]; G={cur:c,chain:[{c,p:null,s:null}],usedP:{},usedC:{[c]:1},lives:{a:LIVES,b:LIVES},turn:"a"}; };
  const isMine=()=>mode==="local"||G.turn===side;
  const set=o=>{ if(mode==="live") call("livePut",room,JSON.stringify(o)); };
  const cleanup=()=>{ ended=true; cancelAnimationFrame(raf); clearTimeout(botT); clearTimeout(readyT); FK.chainH=null; if(mode==="live") call("liveStop"); };
  FK.backHandler=()=>{ if(ended){ FK.backHandler=null; FK.go("chain",{},{replace:true}); return true; }
    if(mode==="local"||phase==="wait"){ cleanup(); FK.backHandler=null; FK.back(); return true; }
    FK.confirm(t("ol_quit"),t("ol_leave"),()=>{ set({["l"+side]:1}); end(os,true); },true); return true; };

  /* hamle uygula (herkes aynı sırayla) */
  function apply(mv){ if(ended||G.over) return; const s=mv.s; applied++;
    if(mv.r==="ok"){ G.chain.push({c:mv.c,p:mv.p,s}); G.usedP[mv.p]=1; G.usedC[mv.c]=1; G.cur=mv.c; FK.sfx("ok"); }
    else { G.lives[s]--; FK.sfx("no"); FK.vib(60);
      FK.toast(mv.r==="pass"?t("ch_passed",{n:sideName(s)})+" · −❤️":mv.r==="time"?t("ch_time")+" · "+sideName(s)+" −❤️":(mv.p?t("ch_wrong",{p:mv.p,c:cn(G.cur)}):t("ch_time"))+" · −❤️","info",2200); }
    if(G.lives[s]<=0){ G.over=1; render(); setTimeout(()=>end(s==="a"?"b":"a"),900); return; }
    G.turn=s==="a"?"b":"a"; turnT0=performance.now(); picking=null;
    if(mode==="local"){ handoff=true; }
    render(); }
  function myMove(mv){ mv.s=G.turn; mv.n=applied; if(mode==="live") set({m:{[applied]:mv}}); apply(mv); }

  /* çizim */
  function render(){ if(ended) return; phase="play";
    const turnMe=isMine(), last=G.chain.slice(-6), cur=G.cur;
    const pl=s=>'<div class="ol-pl'+(s===side&&mode!=="local"?" me":"")+(G.turn===s?" ch-turn":"")+'" data-pl="'+s+'">'+(mode==="bot"&&s==="b"?FK.kafa("bilge",38):FK.avatar(avs[s]||0,38,null,"none"))+'<div class="grow" style="min-width:0"><b class="ol-nm">'+FK.esc(sideName(s))+'</b><span class="ch-lv">'+"❤️".repeat(Math.max(0,G.lives[s]))+'<s>'+"🤍".repeat(LIVES-Math.max(0,G.lives[s]))+'</s></span></div></div>';
    el.innerHTML='<div class="ol-top">'+pl("a")+'<div class="ol-mid"><div class="small" style="font-weight:800">'+t("ch_links",{n:G.chain.length-1})+'</div><div class="ol-ring"><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="24" class="bg"/><circle cx="27" cy="27" r="24" class="fg" data-ring/></svg><b data-sec>'+SEC+'</b></div></div>'+pl("b")+'</div>'+
     '<div class="scroll" style="padding-top:6px"><div class="ch-chain">'+last.map((k,i)=>(k.p?'<div class="ch-lnk">'+FK.ic("link",14,2.4)+'<span>'+FK.esc(k.p)+'</span></div>':'')+'<div class="ch-node'+(i===last.length-1?" cur":"")+'">'+badge(k.c,i===last.length-1?54:34)+'<b>'+FK.esc(cn(k.c))+'</b>'+(k.s?'<span class="ch-by">'+FK.esc(sideName(k.s))+'</span>':'<span class="ch-by">'+t("ch_start")+'</span>')+'</div>').join("")+'</div>'+
     '<div class="ch-panel'+(turnMe?" me":"")+'">'+(turnMe
       ? (picking ? '<div class="small" style="font-weight:800;margin-bottom:8px">'+t("ch_pick",{p:FK.esc(picking.name)})+'</div><div class="ch-picks">'+picking.opts.map(c=>'<button class="ch-pick" data-c="'+c+'">'+badge(c,34)+'<span>'+FK.esc(cn(c))+'</span></button>').join("")+'</div>'
          : '<div class="small" style="font-weight:800;margin-bottom:8px">'+(mode==="local"?'<span class="ch-who">'+t("ch_turnOf",{n:FK.esc(sideName(G.turn))})+'</span> ':'')+t("ch_ask")+'</div><div class="row" style="gap:8px;align-items:flex-start"><div class="ac grow"><input class="input" data-in placeholder="'+t("ch_ph")+'" autocomplete="off" autocapitalize="words" spellcheck="false"><div class="ac-list down hide" data-ac></div></div><button class="ch-pass" data-pass>'+t("ch_passB")+'<small>−❤️</small></button></div>')
       : '<div class="ch-wait">'+(mode==="bot"?FK.kafa("bilge",54,"bob"):'⏳')+'<b>'+t("ch_turnOpp")+'</b></div>')+'</div></div></div>';
    if(handoff){ handoff=false; showHand(); }
    bind(); loop(); }
  function showHand(){ const ov=document.createElement("div"); ov.className="ch-hand"; ov.innerHTML='<div class="stack" style="gap:16px;align-items:center">'+FK.ic("user",54,2)+'<div class="h-display" style="font-size:26px;text-align:center">'+t("ch_pass",{n:FK.esc(sideName(G.turn))})+'</div><button class="btn btn-primary" style="max-width:220px">'+t("ch_ready")+'</button></div>';
    el.appendChild(ov); cancelAnimationFrame(raf); ov.querySelector("button").onclick=()=>{ ov.remove(); turnT0=performance.now(); loop(); const i=el.querySelector("[data-in]"); if(i) i.focus(); }; }
  function bind(){
    el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ if(!picking) return; const pk=picking; picking=null; myMove({r:"ok",p:pk.name,c:b.dataset.c}); });
    const ps=el.querySelector("[data-pass]"); if(ps) ps.onclick=()=>{ FK.sfx("tap"); picking=null; myMove({r:"pass",p:"",c:""}); };
    const inp=el.querySelector("[data-in]"), ac=el.querySelector("[data-ac]"); if(!inp) return;
    const choose=name=>{ const pp=D.byName[name]; if(!pp) return; ac.classList.add("hide");
      if(G.usedP[name]){ FK.toast(t("ch_used",{p:name}),"info",1800); inp.value=""; return; }
      if(pp.clubs.indexOf(G.cur)<0){ myMove({r:"wrong",p:name,c:""}); return; }
      const opts=pp.clubs.filter(c=>c!==G.cur&&!G.usedC[c]);
      if(!opts.length){ FK.toast(t("ch_noClub",{p:name}),"info",2000); inp.value=""; return; }
      picking={name,opts}; render(); };
    inp.oninput=()=>{ const q=FK.norm(inp.value); if(q.length<2){ ac.classList.add("hide"); return; }
      const mm=D.P.filter(x=>x.n.indexOf(q)>=0).sort((x,y)=>(x.n.indexOf(q)===0?0:1)-(y.n.indexOf(q)===0?0:1)||x.fame-y.fame).slice(0,6);
      ac.innerHTML=mm.map(x=>'<button data-nm="'+FK.esc(x.name)+'">'+FK.esc(x.name)+'</button>').join("");
      ac.classList.toggle("hide",!mm.length);
      ac.querySelectorAll("[data-nm]").forEach(b=>b.onclick=()=>choose(b.dataset.nm)); };
    if(mode!=="local") setTimeout(()=>{ try{ inp.focus(); }catch(e){} },50);
  }
  function loop(){ cancelAnimationFrame(raf); const ring=el.querySelector("[data-ring]"), lbl=el.querySelector("[data-sec]"); let lastS=-1;
    const step=now=>{ if(ended||G.over||el.querySelector(".ch-hand")) return; const left=Math.max(0,SEC-(now-turnT0)/1000);
      if(ring) ring.style.strokeDashoffset=String(150.8*(1-left/SEC)); const s=Math.ceil(left); if(s!==lastS){ lastS=s; if(lbl) lbl.textContent=s; if(s<=3&&s>0&&isMine()) FK.sfx("tick"); }
      if(left<=0){ if(isMine()){ picking=null; myMove({r:"time",p:"",c:""}); return; }
        if(mode==="bot"&&G.turn==="b"){ myBot({r:"time",p:"",c:""}); return; }
        if(mode==="live"&&(now-turnT0)/1000>SEC+10){ FK.toast(t("ol_left"),"info",2600); end(side,false,true); return; } }
      raf=requestAnimationFrame(step); };
    raf=requestAnimationFrame(step);
    if(mode==="bot"&&G.turn==="b"&&!G.over) botTurn(); }
  function botTurn(){ clearTimeout(botT); const cur=G.cur, n=G.chain.length;
    const cand=(D.byClub[cur]||[]).filter(x=>!G.usedP[x.name]&&x.clubs.some(c=>c!==cur&&!G.usedC[c]));
    const pOk=Math.max(0.45,0.9-n*0.025-(cand.length<3?0.2:0)), r=Math.random();
    const delay=2200+Math.random()*5200;
    botT=setTimeout(()=>{ if(ended||G.turn!=="b"||G.cur!==cur) return;
      if(!cand.length||r>pOk){ if(Math.random()<.6) myBot({r:"pass",p:"",c:""}); return; }      // bulamadı: pas ya da süre
      const pool=cand.sort((x,y)=>x.fame-y.fame+(Math.random()-.5)*1.6).slice(0,6), pk=pool[Math.floor(Math.random()*pool.length)];
      const opts=pk.clubs.filter(c=>c!==cur&&!G.usedC[c]).sort((x,y)=>(D.byClub[y]||[]).length-(D.byClub[x]||[]).length);
      myBot({r:"ok",p:pk.name,c:opts[Math.random()<.6?0:Math.floor(Math.random()*opts.length)]}); },delay); }
  function myBot(mv){ clearTimeout(botT); mv.s="b"; mv.n=applied; if(mv.r==="ok") FK.toast("🤖 "+mv.p+" → "+cn(mv.c),"info",1600); apply(mv); }

  function end(winner,quit,oppLeft){ if(ended) return; cleanup(); FK.backHandler=null;
    const iWin=mode==="local"?null:(winner===side); let g=0,dc=0; const o=chs();
    if(mode==="live"){ dc=iWin?25:-15; g=iWin?30:5; o.cup=Math.max(0,o.cup+dc); if(iWin) o.w++; else o.l++; FK.state.gems+=g; if(iWin) FK.state.stats.duelWins=(FK.state.stats.duelWins||0)+1; }
    else if(mode==="bot"){ g=iWin?15:3; FK.state.gems+=g; }
    FK.save(); if(mode==="live"&&!quit) set({["f"+side]:1});
    if(quit){ FK.go("chain",{},{replace:true}); return; }
    const res=mode==="local"?"w":iWin?"w":"l";
    el.innerHTML='<div class="scroll"><div class="stack" style="gap:16px">'+
     '<div class="du-banner '+res+'">'+FK.kafa(res==="w"?"sampiyon":"uzgun",104,"bob")+'<div class="h-display" style="font-size:30px">'+(mode==="local"?t("ch_win",{n:FK.esc(sideName(winner))}):t(iWin?"du_win":"du_lose"))+'</div></div>'+
     '<div class="card"><div class="small muted" style="font-weight:800;margin-bottom:8px">'+t("ch_links",{n:G.chain.length-1})+'</div><div class="ch-full">'+G.chain.map((k,i)=>(i?'<i>'+FK.esc(k.p)+'</i>':'')+'<span>'+badge(k.c,26)+FK.esc(cn(k.c))+'</span>').join("")+'</div></div>'+
     (mode!=="local"?'<div class="card center"><b style="font-size:18px">+'+g+' 💎'+(mode==="live"?' · '+(dc>0?"+":"")+dc+' '+t("ol_cups").toLowerCase():'')+'</b>'+(mode==="live"?'<div class="small muted" style="margin-top:4px">🏆 '+t("ol_cup",{n:o.cup})+' · '+t("ol_lg"+FK.olLeague(o.cup))+'</div>':'')+'</div>':'')+
     (mode==="live"&&opp?FK.friendBtn(opp):'')+
     '<button class="btn btn-primary" data-again style="height:56px">'+FK.ic("replay",18,2.2)+t("ch_again")+'</button>'+
     '<button class="btn btn-ghost" data-sh>'+FK.ic("share",16)+t("share")+'</button>'+
     '<button class="btn btn-ghost" data-home>'+t("m_chain")+'</button></div></div>';
    if(res==="w"){ FK.sfx("win"); FK.confetti(el); }
    if(mode==="live"&&opp) FK.bindFriendBtn(el,opp);
    el.querySelector("[data-home]").onclick=()=>FK.go("chain",{},{replace:true});
    el.querySelector("[data-again]").onclick=()=>{ if(mode==="local") FK.go("chplay",{mode:"local"},{replace:true}); else if(mode==="bot") FK.useEnergy(()=>FK.go("chplay",{mode:"bot"},{replace:true})); else FK.useEnergy(()=>FK.go("olwait",{mode:"chain"},{replace:true})); };
    el.querySelector("[data-sh]").onclick=()=>FK.share(t("m_chain")+" ⛓️ "+G.chain.map(k=>FK_GCLUBS[k.c]?FK_GCLUBS[k.c][1]:k.c).join(" → ")+"\n"+t("ch_links",{n:G.chain.length-1})+" · #FutbolKafası");
  }

  /* başlat */
  if(mode==="live"){
    if(p.invite){ el.innerHTML='<div class="scroll"><div class="stack" style="gap:16px;align-items:center;text-align:center;padding-top:60px"><div class="ol-radar"><i></i><i></i><i></i>'+FK.avatar(p.invite.av||0,84,null,"none")+'</div><div class="h-display" style="font-size:24px">'+t("fr_invited",{n:FK.esc(p.invite.name)})+'</div><button class="btn btn-ghost" data-x style="max-width:240px">'+t("ol_cancel")+'</button></div></div>';
      el.querySelector("[data-x]").onclick=()=>{ set({la:1}); cleanup(); FK.backHandler=null; FK.back(); }; }
    else el.innerHTML='<div class="scroll"><div class="stack" style="gap:16px;align-items:center;text-align:center;padding-top:80px">'+FK.kafa("kaptan",110,"bob")+'<div class="h-display" style="font-size:28px">'+t("ol_found")+'</div><div class="small muted">'+t("ol_get")+'</div></div></div>';
    FK.chainH=(r,v)=>{ if(ended||r!==room||!v||v==="!") return; let d; try{ d=JSON.parse(v); }catch(e){ return; } lastSeen=Date.now();
      if(!G){ opp=d[os]; names={a:d.a.name,b:d.b.name}; avs={a:d.a.av,b:d.b.av}; newGame(d.seed); }
      if(phase==="wait"){ if(d.db&&p.invite){ FK.toast(t("fr_invNo",{n:p.invite.name}),"info",2600); cleanup(); FK.backHandler=null; FK.back(); return; }
        if(d.la&&side==="b"){ FK.toast(t("ol_left"),"info",2200); cleanup(); FK.backHandler=null; FK.go("home",{},{root:true}); return; }
        if(side==="b"&&!d.rb) set({rb:1}); if(d.ra&&(d.rb||side==="b")){ clearTimeout(readyT); turnT0=performance.now(); FK.sfx("whistle"); render(); } return; }
      const mv=d.m||{}; while(mv[applied]&&!ended){ const x=mv[applied]; if(x.s===side){ applied++; continue; } apply(x); }
      if(d["l"+os]&&!ended){ FK.toast(t("ol_left"),"info",2600); end(side,false,true); } };
    call("liveWatch",room); if(side==="b") set({rb:1});
    readyT=setTimeout(()=>{ if(phase==="wait"&&!ended){ if(p.invite){ FK.toast(t("fr_invNo",{n:p.invite.name}),"info",2600); cleanup(); FK.backHandler=null; FK.back(); return; } FK.toast(t("ol_noConn"),"info",2600); call("liveStop"); FK.chainH=null; FK.go("chplay",{mode:"bot"},{replace:true}); } },p.invite?60000:9000);
  } else {
    if(p.noOpp) FK.toast(t("ch_noOpp"),"info",2800);
    newGame("x"+Date.now()+Math.random()); turnT0=performance.now(); FK.sfx("whistle"); render();
  }
};
})();
