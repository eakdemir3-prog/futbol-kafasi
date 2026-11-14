/* ==========================================================
   ÇEKİRDEK: veri deposu, dil, XP/seviye, görevler, başarımlar, ses
   Not: Bu sürüm yerel demo modudur. Online sürümde XP, elmas, skor
   ve ödüller sunucu (Cloud Functions) tarafından doğrulanacaktır.
   ========================================================== */
(function(){
const FK = window.FK = {};
FK.VERSION="1.4.2";
FK.PEN=5; /* yanlış cevapta süre cezası (sn) */
FK.penFx = el => { const d=document.createElement("div"); d.className="pen-fx"; d.textContent="−"+FK.PEN+(FK.lang()==="en"?"s":" sn"); el.appendChild(d); setTimeout(()=>d.remove(),1100); };
const KEY = "fk_state_v1";

/* ---------- yardımcılar ---------- */
FK.pad = n => String(n).padStart(2,"0");
FK.dayKey = (d=new Date()) => d.getFullYear()+"-"+FK.pad(d.getMonth()+1)+"-"+FK.pad(d.getDate());
FK.weekKey = (d=new Date()) => { const x=new Date(d); const day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); return FK.dayKey(x); };
FK.daysLeftInWeek = () => { const day=(new Date().getDay()+6)%7; return 7-day; };
FK.msToMidnight = () => { const n=new Date(); const m=new Date(n); m.setHours(24,0,0,0); return m-n; };
FK.fmtHMS = ms => { const s=Math.max(0,Math.floor(ms/1000)); return FK.pad(Math.floor(s/3600))+":"+FK.pad(Math.floor(s%3600/60))+":"+FK.pad(s%60); };
FK.fmtNum = n => Number(n).toLocaleString(FK.lang()==="tr"?"tr-TR":"en-US");
FK.esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
FK.hash = str => { let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; };
FK.rng = seed => { let a=(typeof seed==="string"?FK.hash(seed):seed)>>>0; return ()=>{ a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; };
FK.shuffle = (arr,r=Math.random) => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
FK.norm = s => String(s).toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9 ]/g,"").trim();

/* ---------- tekrar engelleme: son görülenler havuz bitene kadar tekrar gelmez ---------- */
FK.fresh = (mode, items, keyFn, count, r=Math.random) => {
  const s=FK.state; s.seen=s.seen||{}; let seen=s.seen[mode]||[];
  const keys=items.map(keyFn);
  let unseen=items.filter((x,i)=>seen.indexOf(keys[i])<0);
  if(unseen.length<count){
    // havuz bitti: bu havuzu sıfırla ama en son görülenleri (son tur) yine dışarıda tut
    const recent=seen.slice(-Math.min(count*2, Math.max(0,items.length-count)));
    seen=seen.filter(k=>keys.indexOf(k)<0).concat(recent.filter(k=>keys.indexOf(k)>=0));
    s.seen[mode]=seen;
    unseen=items.filter((x,i)=>seen.indexOf(keys[i])<0);
  }
  const pick=FK.shuffle(unseen,r).slice(0,count);
  if(pick.length<count) pick.push(...FK.shuffle(items.filter(x=>pick.indexOf(x)<0),r).slice(0,count-pick.length));
  return pick;
};
FK.markSeen = (mode, keys) => { const s=FK.state; s.seen=s.seen||{}; const a=(s.seen[mode]||[]).filter(k=>keys.indexOf(k)<0).concat(keys); s.seen[mode]=a.slice(-600); FK.save(); };

/* ---------- dil ---------- */
FK.lang = () => (FK.state && FK.state.profile && FK.state.profile.lang) || "tr";
FK.t = (k,vars) => { const L=FK_I18N[FK.lang()]||FK_I18N.tr; let s=(k in L)?L[k]:(FK_I18N.tr[k]!==undefined?FK_I18N.tr[k]:k); if(vars) for(const v in vars) s=s.split("{"+v+"}").join(vars[v]); return s; };
FK.L = v => Array.isArray(v) ? (FK.lang()==="en"?v[1]:v[0]) : v;

/* ---------- ülkeler ---------- */
FK.countries = {};
FK_COUNTRIES.forEach(c=>FK.countries[c[0]]={code:c[0],tr:c[1],en:c[2],tier:c[3],adjTr:c[4],adjEn:c[5]});
Object.keys(FK_EXTRA_NATS).forEach(k=>{const c=FK_EXTRA_NATS[k];FK.countries[k]={code:k,tr:c[0],en:c[1],tier:9,adjTr:c[2],adjEn:c[3]};});
FK.cName = code => { const c=FK.countries[code]; return c?(FK.lang()==="en"?c.en:c.tr):code; };
FK.cAdj = code => { const c=FK.countries[code]; return c?(FK.lang()==="en"?c.adjEn:c.adjTr):code; };
FK.flag = code => {
  if(code==="GB-ENG") return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}";
  if(code==="GB-SCT") return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";
  if(code==="GB-WLS") return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}";
  if(code==="SU") return "☭";
  return code.toUpperCase().replace(/./g,ch=>String.fromCodePoint(127397+ch.charCodeAt(0)));
};

/* ---------- varsayılan durum ---------- */
function fresh(){
  return { v:1, created:Date.now(), onboarded:false,
    profile:{ name:"", avatar:0, country:"TR", club:"", lang:(navigator.language||"tr").slice(0,2)==="en"?"en":"tr" },
    xp:0, gems:50, league:0,
    stats:{ games:0, correct:0, answered:0, bestStreak:0, timeSum:0, byMode:{} },
    daily:{ date:"", missions:[], plays:{}, modes:[] },
    weekly:{ week:"", missions:[], xp:0, dailyDays:[] },
    lastWeek:null,
    daily10:{ date:"", score:0, correct:0, done:false },
    wordle:{ date:"", guesses:[], done:false, win:false },
    login:{ last:"", streak:0 },
    ach:{}, careerFirst:0,
    settings:{ sound:true, vib:true }
  };
}
FK.load = () => {
  try{ const s=JSON.parse(localStorage.getItem(KEY)); if(s && s.v===1){ FK.state=Object.assign(fresh(),s); FK.state.settings=Object.assign(fresh().settings,s.settings||{}); return; } }catch(e){}
  FK.state=fresh();
};
FK.save = () => { try{ localStorage.setItem(KEY,JSON.stringify(FK.state)); }catch(e){} };
FK.resetAll = () => { try{ localStorage.removeItem(KEY); }catch(e){} FK.state=fresh(); };

/* ---------- seviye ---------- */
FK.MAX_LEVEL = 100;
FK.xpForLevel = l => 80 + l*40;              // l -> l+1 için gereken XP
FK.levelInfo = (xp=FK.state.xp) => {
  let l=1, rest=xp;
  while(l<FK.MAX_LEVEL && rest>=FK.xpForLevel(l)){ rest-=FK.xpForLevel(l); l++; }
  const need = l>=FK.MAX_LEVEL ? 1 : FK.xpForLevel(l);
  return { level:l, cur:rest, need, pct: l>=FK.MAX_LEVEL?100:Math.round(rest/need*100) };
};

/* ---------- ligler ---------- */
FK.LEAGUES = [
  {k:"bronze",c1:"#B45309",c2:"#FDBA74",txt:"#FDBA74"},
  {k:"silver",c1:"#64748B",c2:"#E2E8F0",txt:"#E2E8F0"},
  {k:"gold",c1:"#EAB308",c2:"#FDE68A",txt:"#FDE047"},
  {k:"diamond",c1:"#0284C7",c2:"#7DD3FC",txt:"#7DD3FC"},
  {k:"legendL",c1:"#7C3AED",c2:"#FACC15",txt:"#C4B5FD"}
];
const BOT_NAMES=["GolMakinesi","OfsaytKralı","TribünSesi","KaleciDede","Frikikçi10","SerbestVuruş","KornerBayrağı","Paslaşma","TikiTaka","ÇalımUstası","DokuzNumara","BekKanat","OrtaSahaBeyni","Rövaşata","PenaltıTaktik","SonDakikaGolü","AsistKralı","SahaKenarı","KafaVuruşu","DeparAtan","TopSaklayan","Libero5","ÇiftForvet","UzakKöşe","AltıPas"];
FK.leagueTable = () => {
  const s=FK.state, wk=FK.weekKey(), r=FK.rng("league"+wk+s.league);
  const dayFrac = (((new Date().getDay()+6)%7)+ (new Date().getHours()/24)) / 7;
  const names=FK.shuffle(BOT_NAMES,r).slice(0,19);
  const base=[520,700,900,1150,1450][Math.min(s.league,4)];
  const rows=names.map((n,i)=>({ name:n, bot:true, av:Math.floor(r()*8), xp:Math.round(base*(0.2+r()*1.5)*Math.min(1,dayFrac*1.05+0.04)) }));
  rows.push({ name:s.profile.name||"?", me:true, av:s.profile.avatar, xp:s.weekly.xp });
  rows.sort((a,b)=>b.xp-a.xp);
  return rows;
};

/* ---------- avatarlar (seviyeyle açılır) ---------- */
FK.AVATARS = [
  {i:"ball",g:["#22C55E","#14532D"],lv:1},{i:"bolt",g:["#FACC15","#CA8A04"],lv:1},{i:"star",g:["#3B82F6","#1E3A8A"],lv:1},{i:"shield",g:["#F97316","#9A3412"],lv:1},
  {i:"flame",g:["#EF4444","#7F1D1D"],lv:3},{i:"boot",g:["#14B8A6","#115E59"],lv:5},{i:"whistle",g:["#A855F7","#581C87"],lv:8},{i:"crown",g:["#FDE047","#B45309"],lv:12},
  {i:"trophy",g:["#E2E8F0","#475569"],lv:20},{i:"rocket",g:["#EC4899","#831843"],lv:30},{i:"brain",g:["#22D3EE","#155E75"],lv:45},{i:"gem",g:["#38BDF8","#1E40AF"],lv:60}
];

/* ---------- görevler ---------- */
const DAILY_POOL=[
  {id:"games",n:3,gem:10,xp:30},{id:"correct",n:20,gem:15,xp:40},{id:"daily",n:1,gem:15,xp:40},{id:"streak",n:5,gem:10,xp:30},
  {id:"flag8",n:1,gem:15,xp:40},{id:"career",n:2,gem:15,xp:40},{id:"player",n:5,gem:10,xp:30},{id:"modes",n:3,gem:15,xp:40},{id:"wordle",n:1,gem:10,xp:30}
];
const WEEKLY_POOL=[{id:"wGames",n:20,gem:60,xp:200},{id:"wCorrect",n:150,gem:80,xp:250},{id:"wDaily",n:5,gem:100,xp:300}];
FK.missionText = m => { const map={games:"mi_games",correct:"mi_correct",daily:"mi_daily",streak:"mi_streak",flag8:"mi_flag8",career:"mi_career",player:"mi_player",modes:"mi_modes",wordle:"mi_wordle",wGames:"mi_wGames",wCorrect:"mi_wCorrect",wDaily:"mi_wDaily"}; return FK.t(map[m.id],{n:m.n}); };

FK.rollover = () => {
  const s=FK.state, today=FK.dayKey(), wk=FK.weekKey();
  if(s.daily.date!==today){
    const r=FK.rng("missions"+today);
    const extra=FK.shuffle(DAILY_POOL.filter(m=>m.id!=="games"&&m.id!=="daily"),r)[0];
    const pool=[DAILY_POOL.find(m=>m.id==="games"), extra, DAILY_POOL.find(m=>m.id==="daily")];
    s.daily={ date:today, missions:pool.map(m=>({id:m.id,n:m.n,gem:m.gem,xp:m.xp,p:0,c:false})), plays:{}, modes:[] };
  }
  if(s.weekly.week!==wk){
    if(s.weekly.week){ // haftalık lig sonucu (demo)
      const table=FK.leagueTable(); const pos=table.findIndex(x=>x.me)+1;
      let move=0; if(pos<=5 && s.league<4) move=1; else if(pos>=16 && s.league>0) move=-1;
      s.lastWeek={ pos, from:s.league, to:s.league+move }; s.league+=move;
    }
    s.weekly={ week:wk, missions:WEEKLY_POOL.map(m=>({id:m.id,n:m.n,gem:m.gem,xp:m.xp,p:0,c:false})), xp:0, dailyDays:[] };
  }
  if(s.login.last!==today){
    const y=new Date(); y.setDate(y.getDate()-1);
    s.login.streak = s.login.last===FK.dayKey(y) ? s.login.streak+1 : 1;
    s.login.last=today;
  }
  FK.save();
};

/* ---------- başarımlar ---------- */
FK.ACH = [
  {id:"first",ic:"ball",c:"#22C55E",gem:10,test:s=>s.stats.games>=1},
  {id:"c100",ic:"target",c:"#3B82F6",gem:20,test:s=>s.stats.correct>=100},
  {id:"c500",ic:"brain",c:"#14B8A6",gem:50,test:s=>s.stats.correct>=500},
  {id:"streak10",ic:"flame",c:"#EF4444",gem:25,test:s=>s.stats.bestStreak>=10},
  {id:"perfect",ic:"star",c:"#FACC15",gem:25,test:(s,g)=>g&&g.total>=10&&g.correct===g.total},
  {id:"legend",ic:"crown",c:"#A855F7",gem:30,test:(s,g)=>g&&g.diff===4&&g.correct>=7},
  {id:"flag",ic:"flag",c:"#F97316",gem:20,test:(s,g)=>g&&g.mode==="flag"&&g.correct===10},
  {id:"career",ic:"route",c:"#8B5CF6",gem:25,test:s=>s.careerFirst>=5},
  {id:"days7",ic:"calendar",c:"#EC4899",gem:30,test:s=>s.login.streak>=7},
  {id:"lv10",ic:"rocket",c:"#38BDF8",gem:30,test:s=>FK.levelInfo(s.xp).level>=10},
  {id:"wordle",ic:"search",c:"#10B981",gem:20,test:(s,g)=>g&&g.mode==="guess"&&g.extra&&g.extra.win&&g.extra.guesses<=3},
  {id:"allModes",ic:"grid",c:"#F59E0B",gem:30,test:s=>["player","club","flag","daily","career","guess","word"].every(m=>s.stats.byMode[m]&&s.stats.byMode[m].plays>0)}
];
FK.checkAch = g => {
  const s=FK.state, got=[];
  FK.ACH.forEach(a=>{ if(!s.ach[a.id] && a.test(s,g)){ s.ach[a.id]=Date.now(); s.gems+=a.gem; got.push(a); } });
  return got;
};

/* ---------- oyun sonu: ödül hesabı ----------
   g = {mode, diff, correct, total, score, bestStreak, timeSum, practice, extra:{careersOk, firstTry, players, win, guesses}} */
FK.finishGame = g => {
  const s=FK.state; FK.rollover();
  const before=FK.levelInfo().level;
  const bm=s.stats.byMode[g.mode]||(s.stats.byMode[g.mode]={plays:0,best:0,correct:0});
  const isRecord = !g.practice && g.score>bm.best && bm.plays>0;
  bm.plays++; bm.correct+=g.correct; if(!g.practice && g.score>bm.best) bm.best=g.score;
  s.stats.games++; s.stats.correct+=g.correct; s.stats.answered+=g.total; s.stats.timeSum+=g.timeSum||0;
  if(g.bestStreak>s.stats.bestStreak) s.stats.bestStreak=g.bestStreak;

  // XP: oyun bitirme + doğru + puan. Aynı modu aşırı tekrar edene azalan getiri (hızlı seviye kasmayı önler)
  const pk=g.mode+(g.diff||0); s.daily.plays[pk]=(s.daily.plays[pk]||0)+1;
  const n=s.daily.plays[pk]; const mult = n>10?0.25 : n>5?0.5 : 1;
  const diffMult=[1,1,1.2,1.4,1.7][g.diff||1]||1;
  let xp=Math.round((10 + g.correct*8 + g.score/25) * diffMult * mult);
  if(g.mode==="daily" && !g.practice) xp*=2;
  if(g.practice) xp=Math.round(xp*0.5);
  let gems = 1 + (g.total && g.correct/g.total>=0.7 ? 2:0) + (g.total>=5 && g.correct===g.total ? 3:0);
  if(g.practice) gems=0;
  s.xp+=xp; s.gems+=gems; s.weekly.xp+=xp;
  if(s.daily.modes.indexOf(g.mode)<0) s.daily.modes.push(g.mode);

  // görev ilerlemesi (gerçek oyun hareketlerinden)
  const done=[];
  const bump=(m,val,abs)=>{ if(m.c||m.p>=m.n) return; const old=m.p; m.p = abs ? Math.max(m.p,val) : m.p+val; if(m.p>=m.n && old<m.n){ m.p=m.n; done.push(m);} };
  s.daily.missions.forEach(m=>{
    if(m.id==="games") bump(m,1);
    if(m.id==="correct") bump(m,g.correct);
    if(m.id==="daily" && g.mode==="daily" && !g.practice) bump(m,1);
    if(m.id==="streak") bump(m,g.bestStreak,true);
    if(m.id==="flag8" && g.mode==="flag" && g.correct>=8) bump(m,1);
    if(m.id==="career" && g.mode==="career") bump(m,(g.extra&&g.extra.careersOk)||0);
    if(m.id==="player" && g.mode==="player") bump(m,g.correct);
    if(m.id==="modes") bump(m,s.daily.modes.length,true);
    if(m.id==="wordle" && g.mode==="word" && g.extra && g.extra.win) bump(m,1);
  });
  s.weekly.missions.forEach(m=>{
    if(m.id==="wGames") bump(m,1);
    if(m.id==="wCorrect") bump(m,g.correct);
    if(m.id==="wDaily" && g.mode==="daily" && !g.practice){ const d=FK.dayKey(); if(s.weekly.dailyDays.indexOf(d)<0){ s.weekly.dailyDays.push(d); bump(m,1);} }
  });
  if(g.mode==="career" && g.extra) s.careerFirst+=g.extra.firstTry||0;

  const ach=FK.checkAch(g);
  const after=FK.levelInfo().level;
  FK.save();
  return { xp, gems, tired:mult<1, record:isRecord, missions:done, ach, levelUp: after>before ? after : 0, level:after };
};

FK.claimMission = (m) => {
  if(m.c || m.p<m.n) return false;          // tamamlanmadan ödül yok
  m.c=true; FK.state.gems+=m.gem; FK.state.xp+=m.xp; FK.state.weekly.xp+=m.xp;
  FK.checkAch(); FK.save(); return true;
};
FK.unclaimedCount = () => { const s=FK.state; return s.daily.missions.concat(s.weekly.missions).filter(m=>!m.c&&m.p>=m.n).length; };

/* ---------- kullanıcı adı denetimi ---------- */
const BAD=["amk","aq","sik","sık","orospu","oç","pic","piç","yarrak","göt","got","ibne","fuck","shit","bitch","dick","pussy","nigger","nazi","hitler","admin","moderator","futbolkafasi"];
FK.checkName = name => {
  const n=name.trim();
  if(n.length<3) return "unShort";
  if(n.length>16) return "unLong";
  if(!/^[A-Za-z0-9_ÇĞİÖŞÜçğıöşü]+$/.test(n)) return "unChars";
  const low=FK.norm(n).replace(/[_0-9]/g,"");
  if(BAD.some(b=>low.indexOf(FK.norm(b))>=0)) return "unBad";
  return "";
};

/* ---------- ses ve titreşim ---------- */
let actx=null;
FK.sfx = type => {
  if(!FK.state.settings.sound) return;
  try{
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    const notes={ ok:[[660,0],[880,.09]], no:[[220,0],[160,.12]], tap:[[520,0]], win:[[523,0],[659,.1],[784,.2],[1047,.32]], tick:[[1200,0]], lvl:[[392,0],[523,.12],[659,.24],[784,.36],[1047,.5]] }[type]||[[440,0]];
    const t0=actx.currentTime;
    notes.forEach(([f,dt])=>{ const o=actx.createOscillator(), gn=actx.createGain(); o.type=type==="no"?"sawtooth":"triangle"; o.frequency.value=f; gn.gain.setValueAtTime(0.0001,t0+dt); gn.gain.exponentialRampToValueAtTime(type==="tick"?0.05:0.18,t0+dt+0.01); gn.gain.exponentialRampToValueAtTime(0.0001,t0+dt+(type==="tick"?0.05:0.22)); o.connect(gn); gn.connect(actx.destination); o.start(t0+dt); o.stop(t0+dt+0.25); });
  }catch(e){}
};
FK.vib = p => { if(FK.state.settings.vib && navigator.vibrate) try{ navigator.vibrate(p); }catch(e){} };
})();
