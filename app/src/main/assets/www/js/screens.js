/* ==========================================================
   EKRANLAR: açılış, giriş, profil kurulumu, ana sayfa, oyunlar,
   sıralama, görevler, profil ve ayarlar
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, S=FK.screens;

/* ---------- hoş geldin ---------- */
S.welcome = el => {
  el.classList.add("welcome");
  el.innerHTML='<svg class="pitch-lines" aria-hidden="true" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#22C55E" stroke-opacity=".14" stroke-width="2"><rect x="24" y="40" width="342" height="560" rx="6"/><line x1="24" y1="320" x2="366" y2="320"/><circle cx="195" cy="320" r="62"/><rect x="110" y="40" width="170" height="80"/><rect x="110" y="520" width="170" height="80"/></g></svg>'+
  '<div class="topbar" style="justify-content:flex-end;position:relative"><div class="seg" style="grid-template-columns:1fr 1fr;width:110px"><button data-l="tr" class="'+(FK.lang()==="tr"?"on":"")+'">TR</button><button data-l="en" class="'+(FK.lang()==="en"?"on":"")+'">EN</button></div></div>'+
  '<div class="scroll" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;position:relative">'+
   '<div style="filter:drop-shadow(0 18px 30px rgba(34,197,94,.45))">'+FK.kafa("kaptan",170,"bob")+'</div>'+
   '<div style="margin-top:4px">'+FK.logoText(300)+'</div>'+
   '<div style="font-family:var(--display);font-weight:800;font-size:17px;letter-spacing:1.2px;color:var(--yellow-l);text-align:center;margin-top:4px">'+t("slogan")+'</div>'+
   '<div class="row" style="flex-wrap:wrap;justify-content:center;gap:8px;margin-top:12px"><span class="chip" style="background:rgba(34,197,94,.14);color:#86EFAC">'+t("tag1")+'</span><span class="chip" style="background:rgba(139,92,246,.18);color:#C4B5FD">'+t("tag2")+'</span><span class="chip" style="background:rgba(255,138,31,.16);color:#FDBA74">'+t("tag3")+'</span></div>'+
  '</div>'+
  '<div style="padding:12px 24px calc(28px + var(--safe-b));display:flex;flex-direction:column;gap:12px;position:relative">'+
   '<button class="btn btn-white" data-g><span style="width:26px;height:26px;border-radius:13px;border:2px solid #2563EB;color:#2563EB;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px">G</span>'+t("google")+'</button>'+
   '<button class="btn btn-ghost" data-guest>'+t("guest")+'</button>'+
   '<p class="center small muted" style="margin:4px 0 0;line-height:1.5">'+t("guestNote")+'</p></div>';
  el.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{ FK.state.profile.lang=b.dataset.l; FK.save(); FK.render(); });
  el.querySelector("[data-g]").onclick=()=>{ FK.sfx("tap"); FK.signIn(); };
  el.querySelector("[data-guest]").onclick=()=>{ FK.sfx("tap"); FK.go("setup",{step:0}); };
};

/* ---------- profil kurulumu (4 adım) ---------- */
S.setup = (el,{step,edit}) => {
  const P=FK.state.profile; const draft=S.setup.draft=S.setup.draft||{name:P.name,avatar:P.avatar,country:P.country,club:P.club};
  const steps=4; let filter="";
  const foot=(ok)=>'<div style="padding:12px 16px calc(18px + var(--safe-b))"><button class="btn btn-primary" data-next '+(ok?'':'disabled')+'>'+(step===steps-1?t("done"):t("next"))+'</button></div>';
  const top='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow step-dots">'+[0,1,2,3].map(i=>'<i class="'+(i===step?"on":"")+'"></i>').join("")+'</div><div style="width:44px"></div></div>';
  const hdr=(a,b)=>'<h1 class="h-display h2" style="margin:8px 0 6px">'+t(a)+'</h1><p class="muted" style="margin:0 0 18px;font-size:14px">'+t(b)+'</p>';
  const go=()=>{ if(step<steps-1) FK.go("setup",{step:step+1,edit},{replace:true}); else { Object.assign(P,draft); FK.state.onboarded=true; S.setup.draft=null; FK.save(); FK.go(edit?"profile":"home",{},{root:true}); } };
  const back=()=>{ if(step>0) FK.go("setup",{step:step-1,edit},{replace:true}); else { S.setup.draft=null; FK.back(); } };
  FK.backHandler=()=>{ back(); return true; };

  if(step===0){
    el.innerHTML=top+'<div class="scroll">'+hdr("ob1","ob1s")+'<div class="field"><input class="input" data-in maxlength="16" placeholder="'+t("unPh")+'" value="'+FK.esc(draft.name)+'" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="hint" data-h></div></div></div>'+foot(false);
    const inp=el.querySelector("[data-in]"), h=el.querySelector("[data-h]"), nb=el.querySelector("[data-next]");
    const val=()=>{ const e=FK.checkName(inp.value); draft.name=inp.value.trim(); inp.classList.toggle("err",!!e&&inp.value.length>0); h.className="hint "+(e?(inp.value?"err":""):"ok"); h.textContent=e?(inp.value?t(e):""):t("unOk"); nb.disabled=!!e; };
    inp.oninput=val; val(); setTimeout(()=>inp.focus(),300);
    inp.onkeydown=e=>{ if(e.key==="Enter"&&!nb.disabled) go(); };
  }
  if(step===1){
    const lv=FK.levelInfo().level;
    el.innerHTML=top+'<div class="scroll">'+hdr("ob2","ob2s")+'<div class="center" style="margin-bottom:18px;display:flex;justify-content:center">'+FK.avatar(draft.avatar,96)+'</div><div class="pick-grid">'+FK.AVATARS.map((a,i)=>{ const locked=a.lv>lv; return '<button class="pick'+(i===draft.avatar?" on":"")+'" data-a="'+i+'" '+(locked?'disabled style="opacity:.4;position:relative"':'')+'>'+FK.avatar(i,52)+(locked?'<span style="position:absolute;bottom:4px;right:6px;font-size:10px;font-weight:800;color:var(--muted)">'+t("lv")+a.lv+'</span>':'')+'</button>'; }).join("")+'</div></div>'+foot(true);
    el.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{ draft.avatar=+b.dataset.a; FK.sfx("tap"); FK.render(); });
  }
  if(step===2){
    const list=FK_COUNTRIES.map(c=>c[0]).sort((a,b)=>FK.cName(a).localeCompare(FK.cName(b),FK.lang()));
    const draw=()=>{ const sc=el.querySelector(".scroll"); const y=sc?sc.scrollTop:0;
      el.innerHTML=top+'<div class="scroll">'+hdr("ob3","ob3s")+'<div class="search"><input class="input" data-q placeholder="'+t("searchPh")+'" value="'+FK.esc(filter)+'"></div><div class="list-pick">'+list.filter(c=>!filter||FK.norm(FK.cName(c)).indexOf(FK.norm(filter))>=0).map(c=>'<button class="lp'+(c===draft.country?" on":"")+'" data-c="'+c+'"><span class="flag">'+FK.flag(c)+'</span><span class="grow">'+FK.esc(FK.cName(c))+'</span>'+(c===draft.country?FK.ic("check",20,2.6):'')+'</button>').join("")+'</div></div>'+foot(true);
      bind(); const q=el.querySelector("[data-q]"); q.oninput=()=>{ filter=q.value; draw(); const nq=el.querySelector("[data-q]"); nq.focus(); nq.setSelectionRange(filter.length,filter.length); };
      el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ draft.country=b.dataset.c; FK.sfx("tap"); draw(); });
      const nsc=el.querySelector(".scroll"); if(nsc) nsc.scrollTop=y;
    };
    draw(); return;
  }
  if(step===3){
    el.innerHTML=top+'<div class="scroll">'+hdr("ob4","ob4s")+'<div class="list-pick">'+
      '<button class="lp'+(!draft.club?" on":"")+'" data-k=""><span class="av" style="width:30px;height:30px;background:var(--card2)">'+FK.ic("ball",18)+'</span><span class="grow">'+t("noClub")+'</span></button>'+
      FK_FAV_CLUBS.map(c=>'<button class="lp'+(c[0]===draft.club?" on":"")+'" data-k="'+FK.esc(c[0])+'"><span style="width:30px;height:30px;border-radius:15px;background:linear-gradient(90deg,'+c[1]+' 50%,'+c[2]+' 50%);border:2px solid #0B1426;flex-shrink:0"></span><span class="grow">'+FK.esc(c[0])+'</span>'+(c[0]===draft.club?FK.ic("check",20,2.6):'')+'</button>').join("")+'</div></div>'+foot(true);
    el.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{ draft.club=b.dataset.k; FK.sfx("tap"); const y=el.querySelector(".scroll").scrollTop; FK.render(); el.querySelector(".scroll").scrollTop=y; });
  }
  bind();
  function bind(){ el.querySelector("[data-back]").onclick=back; const n=el.querySelector("[data-next]"); if(n) n.onclick=()=>{ FK.sfx("tap"); go(); }; }
};

/* ---------- ana sayfa ---------- */
S.home = el => {
  FK.rollover();
  const s=FK.state, li=FK.levelInfo(), L=FK.LEAGUES[s.league];
  const table=FK.leagueTable(), pos=table.findIndex(x=>x.me)+1;
  const d10=s.daily10.date===FK.dayKey()&&s.daily10.done;
  const ms=s.daily.missions, doneN=ms.filter(m=>m.p>=m.n).length;
  const recent=FK.ACH.filter(a=>s.ach[a.id]).sort((a,b)=>s.ach[b.id]-s.ach[a.id]).slice(0,3);
  el.classList.add("has-nav");
  el.innerHTML='<div class="scroll"><div class="stack">'+
   '<div class="row" style="gap:12px">'+
    '<button data-go="profile" aria-label="'+t("navProfile")+'">'+FK.avatar(s.profile.avatar,46,li.pct)+'</button>'+
    '<div class="grow" style="min-width:0"><b style="display:block;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+FK.esc(s.profile.name)+'</b><span class="small muted" style="white-space:nowrap">'+t("level")+' '+li.level+'</span><div class="bar" style="margin-top:6px"><i style="width:'+li.pct+'%"></i></div></div>'+
    '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><div style="display:flex;gap:6px">'+FK.energyPill()+'<button class="pill" data-go="shop">'+FK.gemIc()+FK.fmtNum(s.gems)+'<b style="color:var(--green-l);margin-left:2px">+</b></button></div>'+FK.streakPill()+'</div>'+
   '</div>'+
   FK.kafaHome()+
   '<button class="row card tight" data-go="rank" style="width:100%;text-align:left;gap:12px;background:linear-gradient(90deg,'+L.c1+'29,'+L.c1+'08);border-color:'+L.c1+'59">'+FK.leagueBadge(s.league,32)+'<div class="grow"><div style="font-family:var(--display);font-weight:800;font-size:19px;letter-spacing:.5px;color:'+L.txt+'">'+t("leagueLbl",{l:t(L.k)})+'</div><div class="small" style="color:#CBD5E1">'+t("leaguePos",{p:pos})+'</div></div><span class="small" style="font-weight:600;color:'+L.c2+'">'+t("leagueDays",{d:FK.daysLeftInWeek()})+'</span></button>'+
   '<div class="card-hero" style="background:linear-gradient(135deg,#16A34A,#0D9488);box-shadow:0 14px 30px rgba(22,163,74,.35)">'+FK.bgBall(170)+
    '<div class="label" style="color:#D1FAE5">'+t("challenge")+'</div><div class="h-display" style="font-size:34px;margin-top:4px">'+t("daily10")+'</div>'+
    '<div style="margin-top:6px;font-size:13px;color:#ECFDF5">'+(d10?t("daily10Done",{s:'<b>'+FK.fmtNum(s.daily10.score)+'</b>'}):t("daily10s"))+'</div>'+
    '<div class="row" style="margin-top:14px;justify-content:space-between"><button class="btn btn-sm" data-mode="daily" style="background:#fff;color:#065F46;padding:0 22px">'+(d10?FK.ic("check",18,2.6)+t("completed"):t("start"))+'</button><span class="row small" style="font-weight:600;color:#ECFDF5;gap:6px">'+FK.ic("clock",14)+'<span data-cd>'+t("newSet",{t:FK.fmtHMS(FK.msToMidnight())})+'</span></span></div></div>'+
   '<div class="grid2"><button class="btn btn-orange" data-go="games" style="height:62px;justify-content:flex-start">'+FK.ic("bolt",24,2.2)+'<span style="font-family:var(--display);font-weight:900;font-style:italic;font-size:20px;line-height:1;text-align:left;white-space:pre-line">'+t("playNow")+'</span></button>'+
   '<button class="btn btn-purple" data-duel style="height:62px;justify-content:flex-start">'+FK.ic("swords",24,2)+'<span style="font-family:var(--display);font-weight:900;font-style:italic;font-size:20px;line-height:1;text-align:left;white-space:pre-line">'+t("duelStart")+'</span></button></div>'+
   (FK.isPro()?'':'<button class="pro-card" data-pro><span class="pro-crown-s">👑</span><div class="grow" style="text-align:left"><div class="h-display" style="font-size:22px">'+t("proT")+'</div><div class="small" style="font-weight:600;color:#422006">'+t("proCard")+'</div></div>'+FK.ic("right",20,2.6)+'</button>')+FK.shopCard()+'<div class="card stack" style="gap:12px"><div class="row" style="justify-content:space-between"><span class="sec-title">'+t("dailyMissions")+'</span><button class="small muted" data-go="missions" style="font-weight:600">'+t("nDone",{a:doneN,b:ms.length})+' ›</button></div>'+ms.map(missionRow).join("")+'</div>'+
   (recent.length?'<div class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="sec-title">'+t("recentAch")+'</span><button class="small muted" data-go="profile" style="font-weight:600">'+t("seeAll")+' ›</button></div><div class="grid3">'+recent.map(achTile).join("")+'</div></div>':'')+
   '<div class="row card tight" style="gap:12px">'+'<span style="color:#F87171">'+FK.ic("flag",26)+'</span><div class="grow"><div style="font-weight:700;font-size:14px">'+t("fanWar")+(s.profile.club?' · '+FK.esc(s.profile.club):'')+'</div><div class="small muted">'+t("fanWarS")+'</div></div><span class="chip chip-soon">'+t("soon")+'</span></div>'+
  '</div></div>'+FK.nav("home");
  FK.bindNav(el); bindCommon(el);
  bindMissions(el,()=>FK.render());
  const sp=el.querySelector("[data-streak]"); if(sp) sp.onclick=()=>{ FK.sfx("tap"); FK.streakModal(); }; FK.streakNote();
  const pc=el.querySelector("[data-pro]"); if(pc) pc.onclick=()=>{ FK.sfx("tap"); FK.go("pro"); };
  const fgm=el.querySelector("[data-fgem]"); if(fgm) fgm.onclick=()=>FK.freeGems(()=>FK.render()); FK.starterCheck&&FK.starterCheck();
  const cd=el.querySelector("[data-cd]"); const iv=setInterval(()=>{ if(!document.body.contains(cd)){ clearInterval(iv); return; } cd.textContent=t("newSet",{t:FK.fmtHMS(FK.msToMidnight())}); if(FK.msToMidnight()<1000) setTimeout(()=>FK.render(),1500); },1000);
  FK.onLeave=()=>clearInterval(iv);
  if(s.lastWeek){ const lw=s.lastWeek; s.lastWeek=null; FK.save();
    FK.modal('<div class="center"><div style="display:flex;justify-content:center;margin-bottom:10px">'+FK.leagueBadge(lw.to,60)+'</div><div class="h-display h2">'+t("leagueLbl",{l:t(FK.LEAGUES[lw.to].k)})+'</div><p class="muted">#'+lw.pos+'</p><button class="btn btn-primary" data-ok>'+t("done")+'</button></div>',w=>w.querySelector("[data-ok]").onclick=FK.closeModal); }
};
function missionRow(m){
  const done=m.p>=m.n, pct=Math.round(Math.min(1,m.p/m.n)*100);
  return '<div class="mission'+(m.c?" done":"")+'"><div class="grow"><div class="row small" style="justify-content:space-between;font-weight:600;font-size:13px"><span class="ttl">'+FK.missionText(m)+'</span><span class="muted">'+Math.min(m.p,m.n)+'/'+m.n+'</span></div><div class="bar" style="margin-top:6px"><i style="width:'+pct+'%"></i></div></div>'+
   (m.c?'<span class="chip chip-xp">'+t("claimed")+'</span>':done?'<button class="btn btn-claim" data-claim="'+m.id+'">'+FK.gemIc(12)+'+'+m.gem+' '+t("claim")+'</button>':'<span class="chip chip-gem">'+FK.gemIc(12)+'+'+m.gem+'</span>')+'</div>';
}
function bindMissions(el,after){
  el.querySelectorAll("[data-claim]").forEach(b=>b.onclick=()=>{
    const s=FK.state; const m=s.daily.missions.concat(s.weekly.missions).find(x=>x.id===b.dataset.claim);
    const before=FK.levelInfo().level;
    if(m && FK.claimMission(m)){ FK.sfx("win"); FK.vib(40); FK.toast('+'+m.gem+' '+t("gems")+' · +'+m.xp+' XP',"gem"); after(); const lv=FK.levelInfo().level; if(lv>before) FK.levelUpModal(lv); }
  });
}
function achTile(a){ const on=!!FK.state.ach[a.id]; return '<div class="ach'+(on?"":" off")+'"><div class="badge" style="background:linear-gradient(145deg,'+a.c+','+a.c+'88);color:#fff">'+FK.ic(a.ic,28,2.2)+'</div><b>'+t("ach_"+a.id)+'</b><span>'+t("ach_"+a.id+"D")+'</span></div>'; }
function bindCommon(el){
  el.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); FK.go(b.dataset.go,{},{root:["games","rank","missions","profile","home"].indexOf(b.dataset.go)>=0}); });
  FK.energyTick&&FK.energyTick(el);
  el.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); FK.go("intro",{mode:b.dataset.mode}); });
  el.querySelectorAll("[data-duel]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); FK.go("duel"); });
}

/* ---------- oyunlar ---------- */
S.games = el => {
  const s=FK.state; FK.rollover();
  const d10=s.daily10.date===FK.dayKey()&&s.daily10.done, wd=s.word&&s.word.date===FK.dayKey()&&s.word.done;
  const best=m=>(s.stats.byMode[m]||{}).best||0;
  const card=m=>{ const M=FK.MODES[m], bst=best(m);
    const tag = m==="daily" ? (d10?'<span class="mode-best" style="color:'+M.fg+'">'+FK.ic("check",16,2.8)+'</span>':'<span class="mode-best" style="color:'+M.fg+'">'+t("today")+'</span>')
      : m==="word" ? (wd?'<span class="mode-best" style="color:'+M.fg+'">'+FK.ic("check",16,2.8)+'</span>':'<span class="chip chip-new">'+t("newTag")+'</span>')
      : m==="chain" ? '<span class="chip chip-new">'+t("newTag")+'</span>'
      : (m==="more"||m==="tf")&&!bst ? '<span class="chip chip-new">'+t("newTag")+'</span>' : (bst?'<span class="mode-best" style="color:'+M.fg+'">'+t("best",{s:FK.fmtNum(bst)})+'</span>':'');
    return '<button class="mode" data-mode="'+m+'"><div class="mode-top" style="background:linear-gradient(135deg,'+M.g[0]+','+M.g[1]+');color:'+M.fg+'">'+FK.ic(M.icon,34,2)+tag+'</div><div class="mode-body"><div class="mode-name">'+FK.modeName(m)+'</div><div class="mode-desc">'+t("m_"+m+"S")+'</div></div></button>'; };
  el.classList.add("has-nav");
  el.innerHTML='<div class="scroll"><div class="stack">'+
   '<div class="row" style="justify-content:space-between;align-items:flex-end"><div><h1 class="h-display h1">'+t("games")+'</h1><div class="small muted" style="margin-top:4px;font-size:13px">'+t("gamesS")+'</div></div><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
   '<button class="card-hero" data-mode="guess" style="width:100%;text-align:left;padding:0;overflow:hidden;background:radial-gradient(circle at 75% 40%,#D946EF,#7E22CE 55%,#3B0764);box-shadow:0 14px 30px rgba(168,85,247,.4)"><div class="rays2" style="opacity:.8"></div><div class="row" style="position:relative;padding:16px;gap:12px;align-items:flex-end"><div class="grow"><span class="chip" style="background:#FACC15;color:#422006;font-size:11px">'+FK.ic("star",12,2.6)+' '+t("bestMode")+'</span><div class="h-display" style="font-size:26px;margin-top:8px">'+t("m_guess")+'</div><div style="margin-top:6px;font-size:12px;color:#F5D0FE">'+t("m_guessS")+'</div>'+(best("guess")?'<div class="small" style="margin-top:6px;font-weight:700;color:#FDE047">'+t("best",{s:FK.fmtNum(best("guess"))})+'</div>':'')+'</div>'+FK.bust({cls:"hero-bust",w:104})+'</div></button>'+
   '<button class="row card-hero" data-duel style="width:100%;text-align:left;gap:14px;padding:16px;background:linear-gradient(120deg,#7C3AED,#4338CA);box-shadow:0 14px 28px rgba(109,40,217,.35)"><div style="width:58px;height:58px;border-radius:18px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;flex-shrink:0">'+FK.ic("swords",32,1.8)+'</div><div class="grow"><div style="font-family:var(--display);font-weight:900;font-style:italic;font-size:24px;line-height:1">'+t("duel")+'</div><div style="margin-top:4px;font-size:12px;color:#E0E7FF">'+t("duelS")+'</div></div><span class="chip ol-live">● '+(t("ol_live"))+'</span></button>'+
   '<div class="grid2">'+["chain","more","tf","player","club","flag","daily","career","word"].map(card).join("")+'</div>'+
  '</div></div>'+FK.nav("games");
  FK.bindNav(el); bindCommon(el);
  el.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{ FK.sfx("tap"); const m=b.dataset.mode; if(m==="word") FK.go("word"); else if(m==="chain") FK.go("chain"); else FK.go("intro",{mode:m}); });
};

/* ---------- sıralama ---------- */
S.rank = (el,params) => {
  const s=FK.state; FK.rollover();
  let tab=(params&&params.tab)||"league";
  const draw=()=>{
    let body="";
    if(tab==="league"){
      const rows=FK.leagueTable(), me=rows.findIndex(x=>x.me), L=FK.LEAGUES[s.league];
      const top3=rows.slice(0,3), cols=["#64748B","#EAB308","#B45309"], order=[1,0,2], hgt=[74,92,60];
      body='<button class="row card tight" style="gap:12px;width:100%;text-align:left;border-color:'+L.c1+'59">'+FK.leagueBadge(s.league,30)+'<div class="grow"><div style="font-family:var(--display);font-weight:800;font-size:18px;color:'+L.txt+'">'+t("leagueLbl",{l:t(L.k)})+'</div><div class="small muted">'+t("weekEnds",{d:FK.daysLeftInWeek()})+'</div></div></button>'+
       '<div class="podium">'+order.map(k=>{ const r=top3[k]; if(!r) return ''; return '<div class="pod">'+(k===0?'<svg aria-hidden="true" width="26" height="18" viewBox="0 0 28 20"><path d="M2 18L4 4l6 6 4-8 4 8 6-6 2 14z" fill="#FACC15" stroke="#FDE68A" stroke-width="1.5" stroke-linejoin="round"/></svg>':'')+'<div style="border-radius:50%;padding:3px;background:'+cols[k===0?1:k===1?0:2]+';'+(k===0?'box-shadow:0 0 22px rgba(250,204,21,.45)':'')+'">'+FK.avatar(r.av,k===0?60:50)+'</div><div class="nm">'+FK.esc(r.me?t("you"):r.name)+'</div><div class="blk" style="height:'+hgt[k]+'px;background:linear-gradient(180deg,'+[ "#EAB308","#64748B","#B45309"][k]+','+["#A16207","#334155","#78350F"][k]+')"><b style="font-size:'+(k===0?30:26)+'px;'+(k===0?'color:#422006':'')+'">'+(k+1)+'</b><span class="small" style="'+(k===0?'color:#422006;font-weight:700':'color:#E2E8F0')+'">'+FK.fmtNum(r.xp)+'</span></div></div>'; }).join("")+'</div>'+
       '<div class="stack" style="gap:6px">'+rows.slice(3).map((r,k)=>{ const rank=k+4; let zone=""; if(rank===4) zone='<div class="zone" style="color:var(--green-l)">'+FK.ic("up",14,2.6)+t("promo")+' (1-5)</div>'; if(rank===16) zone='<div class="zone" style="color:#F87171">'+FK.ic("down",14,2.6)+t("demo")+' (16-20)</div>';
         return zone+'<div class="lrow'+(r.me?" me":"")+'"><span class="rk">'+rank+'</span>'+FK.avatar(r.av,34)+'<span class="nm">'+FK.esc(r.me?(t("you")+" · "+r.name):r.name)+'</span><span class="sc">'+FK.fmtNum(r.xp)+'</span></div>'; }).join("")+'</div>'+
       '<div class="offline-note">'+FK.ic("wifiOff",18)+'<span>'+t("demoNote")+'</span></div>';
      if(me>=0) setTimeout(()=>{ const m=el.querySelector(".lrow.me"); if(m) m.scrollIntoView({block:"center",behavior:"smooth"}); },350);
    } else {
      const modes=["guess","more","tf","player","club","flag","daily","career","word"];
      const any=modes.some(m=>(s.stats.byMode[m]||{}).plays);
      body= any ? '<div class="stack" style="gap:8px">'+modes.map(m=>{ const b=s.stats.byMode[m]||{plays:0,best:0}; const M=FK.MODES[m];
          return '<div class="lrow"><span style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,'+M.g[0]+','+M.g[1]+');color:'+M.fg+';display:flex;align-items:center;justify-content:center;flex-shrink:0">'+FK.ic(M.icon,20)+'</span><span class="nm">'+FK.modeName(m)+'<span class="small muted" style="display:block;font-weight:500">'+b.plays+' × </span></span><span class="sc">'+(b.best?FK.fmtNum(b.best):'–')+'</span></div>'; }).join("")+'</div>'
        : '<div class="card center" style="padding:30px 16px"><div style="color:var(--muted);display:flex;justify-content:center">'+FK.ic("trophy",44,1.6)+'</div><div style="font-weight:700;margin-top:10px">'+t("noRecord")+'</div><div class="small muted" style="margin-top:4px">'+t("playToSee")+'</div></div>';
    }
    el.innerHTML='<div class="scroll"><div class="stack"><div class="row" style="justify-content:space-between;align-items:flex-end"><h1 class="h-display h1">'+t("rank")+'</h1><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
     '<div class="seg" style="grid-template-columns:1fr 1fr"><button data-tab="league" class="'+(tab==="league"?"on":"")+'">'+t("rankLeague")+'</button><button data-tab="records" class="'+(tab==="records"?"on":"")+'">'+t("rankRecords")+'</button></div>'+body+'</div></div>'+FK.nav("rank");
    el.classList.add("has-nav"); FK.bindNav(el);
    el.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{ tab=b.dataset.tab; FK.sfx("tap"); draw(); });
  };
  draw();
};

/* ---------- görevler ---------- */
S.missions = el => {
  const s=FK.state; FK.rollover();
  const draw=()=>{
    el.classList.add("has-nav");
    el.innerHTML='<div class="scroll"><div class="stack"><div class="row" style="justify-content:space-between;align-items:flex-end"><h1 class="h-display h1">'+t("missions")+'</h1><span class="pill">'+FK.gemIc()+FK.fmtNum(s.gems)+'</span></div>'+
     '<div class="card stack" style="gap:14px"><div class="row" style="justify-content:space-between"><span class="sec-title">'+t("dailyMissions")+'</span><span class="small muted row" style="gap:4px">'+FK.ic("clock",14)+'<span data-cd>'+t("resetIn",{t:FK.fmtHMS(FK.msToMidnight())})+'</span></span></div>'+s.daily.missions.map(missionRow).join("")+'</div>'+
     '<div class="card stack" style="gap:14px;border-color:rgba(139,92,246,.4);background:linear-gradient(180deg,rgba(139,92,246,.10),var(--card) 60%)"><div class="row" style="justify-content:space-between"><span class="sec-title" style="color:#C4B5FD">'+t("weeklyMissions")+'</span><span class="small muted">'+t("weekEnds",{d:FK.daysLeftInWeek()})+'</span></div>'+s.weekly.missions.map(missionRow).join("")+'</div>'+
     '<div class="card"><div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="sec-title">'+t("achievements")+'</span><span class="small muted">'+Object.keys(s.ach).length+'/'+FK.ACH.length+'</span></div><div class="grid3">'+FK.ACH.map(achTile).join("")+'</div></div>'+
    '</div></div>'+FK.nav("missions");
    FK.bindNav(el); bindMissions(el,draw);
    const cd=el.querySelector("[data-cd]"); const iv=setInterval(()=>{ if(!document.body.contains(cd)){ clearInterval(iv); return; } cd.textContent=t("resetIn",{t:FK.fmtHMS(FK.msToMidnight())}); },1000);
    FK.onLeave=()=>clearInterval(iv);
  };
  draw();
};

/* ---------- profil ---------- */
S.profile = el => {
  const s=FK.state, li=FK.levelInfo(), P=s.profile, L=FK.LEAGUES[s.league];
  const acc=s.stats.answered?Math.round(s.stats.correct/s.stats.answered*100):0;
  const sw=(k,on)=>'<span class="switch'+(on?" on":"")+'" data-sw="'+k+'"></span>';
  el.classList.add("has-nav");
  el.innerHTML='<div class="scroll"><div class="stack">'+
   '<div class="row" style="justify-content:space-between"><h1 class="h-display h1">'+t("profile")+'</h1><button class="btn btn-ghost btn-sm" data-edit>'+FK.ic("edit",16)+t("edit")+'</button></div>'+
   '<div class="prof-head">'+FK.avatar(P.avatar,96,li.pct)+'<div class="row" style="gap:8px"><b style="font-size:22px">'+FK.esc(P.name)+'</b><span style="font-size:22px">'+FK.flag(P.country)+'</span></div>'+
    '<div class="row" style="gap:8px;flex-wrap:wrap;justify-content:center"><span class="chip chip-xp">'+t("level")+' '+li.level+'</span><span class="chip" style="background:'+L.c1+'33;color:'+L.txt+'">'+t("leagueLbl",{l:t(L.k)})+'</span>'+(P.club?'<span class="chip" style="background:var(--card2);color:var(--text)">'+FK.esc(P.club)+'</span>':'')+'</div>'+
    '<div style="width:100%;max-width:300px"><div class="row small muted" style="justify-content:space-between"><span>XP</span><span>'+FK.fmtNum(li.cur)+' / '+FK.fmtNum(li.need)+'</span></div><div class="bar lg" style="margin-top:6px"><i style="width:'+li.pct+'%"></i></div></div></div>'+
   '<div class="grid3">'+[[s.stats.games,"totalGames","#4ADE80"],[s.stats.correct,"totalCorrect","#7DD3FC"],[FK.lang()==="tr"?"%"+acc:acc+"%","accuracy","#FDE047"],[s.stats.bestStreak,"bestStreak","#FDBA74"],[s.stats.duelWins||0,"duelsWon","#C4B5FD"],[s.gems,"gems","#38BDF8"]].map(x=>'<div class="stat"><b style="color:'+x[2]+'">'+(typeof x[0]==="number"?FK.fmtNum(x[0]):x[0])+'</b><span>'+t(x[1])+'</span></div>').join("")+'</div>'+
   '<div class="card"><div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="sec-title">'+t("achievements")+'</span><span class="small muted">'+Object.keys(s.ach).length+'/'+FK.ACH.length+'</span></div><div class="grid3">'+FK.ACH.map(achTile).join("")+'</div></div>'+
   '<div><div class="sec-title" style="margin:6px 0 10px">'+t("settings")+'</div><div class="card" style="padding:0 4px">'+
    '<div class="setting">'+FK.ic("globe",20)+'<span class="grow">'+t("language")+'</span><div class="seg" style="grid-template-columns:1fr 1fr;width:110px;padding:3px"><button data-l="tr" class="'+(P.lang==="tr"?"on":"")+'" style="height:30px">TR</button><button data-l="en" class="'+(P.lang==="en"?"on":"")+'" style="height:30px">EN</button></div></div>'+
    '<div class="setting">'+FK.ic("bulb",20)+'<span class="grow">'+t("theme")+'</span><div class="seg" style="grid-template-columns:1fr 1fr 1fr;width:180px;padding:3px">'+["dark","light","system"].map(m=>'<button data-th="'+m+'" class="'+(((s.settings.theme||"dark")===m)?"on":"")+'" style="height:30px;font-size:12px">'+t(m==="dark"?"thDark":m==="light"?"thLight":"thSys")+'</button>').join("")+'</div></div>'+
    '<button class="setting" data-gopro>'+'<span style="font-size:18px;width:20px;text-align:center">👑</span><span class="grow">'+t("proT")+(FK.isPro()?'<span class="small" style="display:block;color:#FACC15;font-weight:600">'+t("proOwned")+'</span>':'')+'</span>'+FK.ic("right",18)+'</button>'+
    '<button class="setting" data-t="sound">'+FK.ic("sound",20)+'<span class="grow">'+t("sound")+'</span>'+sw("sound",s.settings.sound)+'</button>'+
    '<button class="setting" data-t="vib">'+FK.ic("vib",20)+'<span class="grow">'+t("vibration")+'</span>'+sw("vib",s.settings.vib)+'</button>'+
    FK.accountRows()+
    '<button class="setting" data-url="gizlilik.html">'+FK.ic("doc",20)+'<span class="grow">'+t("privacy")+'</span>'+FK.ic("right",18)+'</button>'+
    '<button class="setting" data-url="kullanim-kosullari.html">'+FK.ic("doc",20)+'<span class="grow">'+t("terms")+'</span>'+FK.ic("right",18)+'</button>'+(window.FKAndroid&&FKAndroid.privacyRequired&&FKAndroid.privacyRequired()?'<button class="setting" data-privopt>'+FK.ic("shield",20)+'<span class="grow">'+t("privacyOpt")+'</span>'+FK.ic("right",18)+'</button>':'')+
    '<button class="setting" data-soon="soonMsg">'+FK.ic("help",20)+'<span class="grow">'+t("help")+'</span>'+FK.ic("right",18)+'</button>'+
    '<button class="setting" data-reset style="color:#FCA5A5">'+FK.ic("trash",20)+'<span class="grow">'+t("resetData")+'</span></button>'+
   '</div><div class="center small muted" style="margin-top:14px">'+t("version",{v:FK.VERSION})+' · EA Vision Labs</div></div>'+
  '</div></div>'+FK.nav("profile");
  FK.bindNav(el);
  el.querySelector("[data-edit]").onclick=()=>{ FK.sfx("tap"); FK.go("pedit"); };
  el.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{ P.lang=b.dataset.l; FK.save(); FK.render(); });
  el.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{ const k=b.dataset.t; s.settings[k]=!s.settings[k]; FK.save(); b.querySelector(".switch").classList.toggle("on",s.settings[k]); if(k==="vib"&&s.settings.vib) FK.vib(40); if(k==="sound") FK.sfx("tap"); });
  el.querySelectorAll("[data-soon]").forEach(b=>b.onclick=()=>FK.toast(t(b.dataset.soon),"info",3500));
  FK.bindAccount(el);
  el.querySelectorAll("[data-th]").forEach(b=>b.onclick=()=>{ s.settings.theme=b.dataset.th; FK.save(); FK.applyTheme(); FK.render(); });
  el.querySelectorAll("[data-url]").forEach(b=>b.onclick=()=>FK.openUrl(FK.LEGAL+b.dataset.url));
  const gp=el.querySelector("[data-gopro]"); if(gp) gp.onclick=()=>FK.go("pro");
  const po=el.querySelector("[data-privopt]"); if(po) po.onclick=()=>{ try{ FKAndroid.privacyOptions(); }catch(e){} };
  el.querySelector("[data-reset]").onclick=()=>FK.confirm(t("resetConfirm"),t("resetData"),()=>{ FK.resetAll(); FK.go("welcome",{},{root:true}); },true);
};
FK.setupDraftReset = () => { S.setup.draft=null; };
})();
