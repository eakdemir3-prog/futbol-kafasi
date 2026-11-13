/* ==========================================================
   v1.1 — BÖLÜM SİSTEMİ
   5 lig × bölümler. Futbolcuyu Bul / Kulübü Tanı / Oyuncuyu Tahmin Et: 200 bölüm,
   Bayrak / Kariyer: 100 bölüm. Her bölüm 1-3 yıldız; her 10 bölümde sandık.
   Sorular oyuncu veritabanından (FK_GPLAYERS) üretilir; zorluk = ün + emeklilik + kulüp.
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, L=FK.L;

Object.assign(FK_I18N.tr,{
  lg_0:"Amatör", lg_1:"Süper Lig", lg_2:"Avrupa", lg_3:"Efsane", lg_4:"Futbol Kafası",
  lvN:"Bölüm {n}", lvPlay:"Bölüm {n} · Oyna", lvLocked:"Önceki bölümü en az 1 yıldızla bitir", lvLeagueLocked:"{l} ligi {n}. bölümde açılır",
  lvNext:"Sonraki bölüm", lvRetry:"Tekrar dene", lvFail:"Bölümü geçmek için en az {n} doğru gerekiyor", lvStars:"{a}/{b} yıldız",
  lvChest:"Sandık açıldı!", lvChestS:"{n}. bölümü geçtin", lvLeagueDone:"{l} ligi tamamlandı! 🏆", lvRules:"Nasıl oynanır?", lvMap:"Bölümler",
  lvSoon:"Bu lig yakında açılacak", c_was:"Kariyerinde {v} forması giydi", c_now:"Şu an {v} forması giyiyor", c_last:"Son kulübü: {v}", c_born:"{v} doğumlu", c_wcWin:"Dünya Kupası kazandı",
  c_league:"Lig: {v}", c_pl:"Bu kulüpte oynamış bir isim: {v}", c_plStar:"Bu kulüpte oynamış bir yıldız: {v}", c_cont:"Kıta: {v}",
  cont_EU:"Avrupa", cont_SA:"Güney Amerika", cont_NA:"Kuzey Amerika", cont_AF:"Afrika", cont_AS:"Asya", cont_OC:"Okyanusya"
});
Object.assign(FK_I18N.en,{
  lg_0:"Amateur", lg_1:"Süper Lig", lg_2:"Europe", lg_3:"Legend", lg_4:"Futbol Kafası",
  lvN:"Level {n}", lvPlay:"Level {n} · Play", lvLocked:"Finish the previous level with at least 1 star", lvLeagueLocked:"{l} league opens at level {n}",
  lvNext:"Next level", lvRetry:"Try again", lvFail:"You need at least {n} correct to pass", lvStars:"{a}/{b} stars",
  lvChest:"Chest opened!", lvChestS:"You passed level {n}", lvLeagueDone:"{l} league complete! 🏆", lvRules:"How to play?", lvMap:"Levels",
  lvSoon:"This league opens soon", c_was:"Played for {v} in his career", c_now:"Currently plays for {v}", c_last:"Last club: {v}", c_born:"Born in {v}", c_wcWin:"Won the World Cup",
  c_league:"League: {v}", c_pl:"A player who played here: {v}", c_plStar:"A star who played here: {v}", c_cont:"Continent: {v}",
  cont_EU:"Europe", cont_SA:"South America", cont_NA:"North America", cont_AF:"Africa", cont_AS:"Asia", cont_OC:"Oceania"
});

/* N: bölüm sayısı, per: lig başına bölüm, open: şu an açık olan son bölüm (veri büyüdükçe artar) */
FK.LV = {
  player:{ N:200, per:40, open:200, pass:[5,7,9] },
  club:  { N:200, per:40, open:200, pass:[5,7,9] },
  guess: { N:200, per:40, open:200 },
  flag:  { N:100, per:20, open:100, pass:[5,7,9] },
  career:{ N:100, per:20, open:100, pass:[3,4,5] }
};
const LGC=[["#D97706","#7C2D12"],["#22C55E","#14532D"],["#3B82F6","#1E3A8A"],["#F59E0B","#78350F"],["#A855F7","#4C1D95"]];
const LGE=["🥉","⚽","🌍","📜","👑"];
FK.lvState = mode => { const s=FK.state; s.lv=s.lv||{}; return s.lv[mode]||(s.lv[mode]={cur:1,st:{}}); };
FK.lvLeague = (mode,n) => Math.floor((n-1)/FK.LV[mode].per);
const xOf = (mode,n) => (n-1)/(FK.LV[mode].N-1);

/* ---------- oyuncu havuzu + zorluk puanı ---------- */
const hash = s => { let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))|0; return (h>>>0)/4294967295; };
const BIGN=["Real Madrid","Barcelona","Manchester City","Manchester United","Liverpool","Arsenal","Chelsea","Bayern Munich","Bayern Münih","Paris Saint-Germain","PSG","Juventus","Inter","Inter Milan","AC Milan","Milan","Atlético Madrid","Galatasaray","Fenerbahçe","Beşiktaş","Trabzonspor","Borussia Dortmund","Tottenham","Napoli","Al Nassr","Inter Miami"];
let _gp=null, _big=null;
const big = () => _big||(_big=new Set(Object.keys(FK_GCLUBS).filter(k=>BIGN.indexOf(FK_GCLUBS[k][0])>=0)));
FK.gp = () => {
  if(_gp) return _gp;
  const act=new Set(window.FK_ACTIVE||[]), B=big();
  _gp=FK_GPLAYERS.map(r=>{ const clubs=r[7].split(",").filter(c=>FK_GCLUBS[c]); const p={name:r[0],by:r[1],nat:r[2],pos:r[3],no:r[4],wc:r[5],fame:r[6],clubs,act:act.has(r[0])};
    const cur=clubs[clubs.length-1]; let sc=[0,.05,.38,.68][p.fame]||.68;
    if(!p.act) sc+=.14; if(p.act&&B.has(cur)) sc-=.06; if(!clubs.some(c=>B.has(c))) sc+=.1; if(p.wc) sc-=.04;
    p.sc=Math.max(0,Math.min(1,sc+(hash(p.name)-.5)*.1)); return p; }).filter(p=>p.clubs.length);
  return _gp;
};
/* hedef zorluğa en yakın, yakın zamanda sorulmamış öğeler */
FK.pickBy = (mode,items,x,count,key) => {
  const w=Math.max(count*7,70);
  const near=items.slice().sort((a,b)=>Math.abs(a.sc-x)-Math.abs(b.sc-x)).slice(0,w);
  const out=FK.fresh(mode,near,key,count); FK.markSeen(mode,out.map(key)); return out;
};
const cn = c => (FK_GCLUBS[c]||[c])[0];
const pick = (a,r=Math.random) => a[Math.floor(r()*a.length)];
const uniq = a => [...new Set(a)];

/* ---------- FUTBOLCUYU BUL ---------- */
const HAND = () => { const m={}; (window.FK_PLAYERS||[]).forEach(p=>m[p.name]=p); return m; };
function buildPlayerLv(n){
  const x=xOf("player",n), all=FK.gp(), H=HAND();
  return FK.pickBy("player",all,x,10,p=>p.name).map(p=>{
    const cur=p.clubs[p.clubs.length-1], past=uniq(p.clubs.slice(0,-1)).filter(c=>c!==cur), h=H[p.name];
    const pastC = past.length ? past.slice().sort((a,b)=>hash(p.name+a)-hash(p.name+b)) : [];
    let c3, c4;
    if(h && x<.5){ c3=L(h.c[0]); c4=L(h.c[1]); }
    else {
      c3 = pastC[0] ? t("c_was",{v:cn(pastC[0])}) : t("c_born",{v:p.by});
      if(x<.6) c4 = p.act ? t("c_now",{v:cn(cur)}) : t("c_last",{v:cn(cur)});
      else c4 = pastC[1] ? t("c_was",{v:cn(pastC[1])}) : p.wc ? t("c_wcWin") : t("c_born",{v:p.by});
    }
    // yanlış şıklar: aynı mevki, benzer zorluk; zor bölümlerde aynı kıtadan
    const cont=FK_CONTINENT[p.nat];
    let cand=all.filter(o=>o.name!==p.name && o.pos===p.pos && Math.abs(o.sc-p.sc)<.25);
    if(x>.45){ const c2=cand.filter(o=>FK_CONTINENT[o.nat]===cont); if(c2.length>=3) cand=c2; }
    if(cand.length<3) cand=all.filter(o=>o.name!==p.name && o.pos===p.pos);
    const wrong=FK.shuffle(cand).slice(0,3).map(o=>o.name);
    return { answer:p.name, opts:FK.shuffle([p.name].concat(wrong)), clues:[ t("c_nat",{v:FK.cAdj(p.nat)}), t("c_pos",{v:t("pos_"+p.pos)}), c3, c4 ], cc:p.nat, pos:p.pos, no:p.no };
  });
}

/* ---------- KULÜBÜ TANI ---------- */
let _clubs=null;
const RICHALIAS={"Tottenham Hotspur":"Tottenham","Bayern Münih":"Bayern Munich"};
FK.clubPool = () => {
  if(_clubs) return _clubs;
  const rich={}; (window.FK_CLUBS||[]).forEach(c=>rich[RICHALIAS[c[0]]||c[0]]=c);
  const by={}; FK.gp().forEach(p=>uniq(p.clubs).forEach(c=>(by[c]=by[c]||[]).push(p)));
  const B=big(), TOP=new Set(["ENG","ESP","ITA","GER","FRA","TUR"]);
  _clubs=Object.keys(by).map(code=>{ const g=FK_GCLUBS[code], lg=g[2], LG=FK_LEAGUES[lg]||[null,lg,lg,lg], r=rich[g[0]];
    const pl=by[code].slice().sort((a,b)=>a.sc-b.sc);
    let sc = r ? (r[7]-1)/3*.8 : (B.has(code)?.05:TOP.has(lg)?.35:.6) - Math.min(pl.length,12)*.025;
    if(!r && pl.length<2) sc+=.15;
    return {code,name:g[0],lg,cc:LG[0],lgName:[LG[2],LG[3]],short:LG[1],pl,rich:r,sc:Math.max(0,Math.min(1,sc+(hash(code)-.5)*.08))};
  }).filter(c=>c.cc);
  return _clubs;
};
function buildClubLv(n){
  const x=xOf("club",n), all=FK.clubPool();
  return FK.pickBy("club",all,x,10,c=>c.code).map(c=>{
    const star=c.pl[0], low=c.pl[c.pl.length-1], mid=c.pl[Math.floor(c.pl.length/2)];
    const clues=[ t("c_country",{v:FK.flag(c.cc)+" "+FK.cName(c.cc)}), t("c_league",{v:L(c.lgName)}) ];
    if(c.rich && x<.5){ clues.push(t("c_city",{v:L([c.rich[2],c.rich[3]])})); clues.push(L([c.rich[5],c.rich[6]])); }
    else if(x<.4){ clues.push(t("c_plStar",{v:star.name})); clues.push(c.pl[1]?t("c_pl",{v:c.pl[1].name}):(c.rich?L([c.rich[5],c.rich[6]]):t("c_plStar",{v:star.name}))); }
    else { clues.push(t("c_pl",{v:(low||mid).name})); clues.push(c.pl.length>1?t("c_pl",{v:(mid!==low?mid:star).name}):(c.rich?t("c_year",{v:c.rich[4]}):t("c_plStar",{v:star.name}))); }
    let cand=all.filter(o=>o.code!==c.code && o.lg===c.lg);
    if(cand.length<3) cand=cand.concat(all.filter(o=>o.code!==c.code && o.cc!==c.cc && Math.abs(o.sc-c.sc)<.3));
    const wrong=FK.shuffle(cand).slice(0,3).map(o=>o.name);
    return { answer:c.name, opts:FK.shuffle([c.name].concat(wrong)), clues, cc:c.cc, year:c.rich?c.rich[4]:c.short };
  });
}

/* ---------- KARİYER YOLU ---------- */
let _car=null;
FK.careerPool = () => {
  if(_car) return _car;
  const hand={}; (window.FK_CAREERS||[]).forEach(c=>hand[c.name]=c);
  _car=FK.gp().map(p=>{ const seq=p.clubs.filter((c,i)=>i===0||c!==p.clubs[i-1]); const cnt={};
    const order=seq.map(c=>{ cnt[c]=(cnt[c]||0)+1; return cn(c)+(cnt[c]>1?" ("+cnt[c]+")":""); });
    const h=hand[p.name]; return {name:p.name, sc:p.sc, clubs:h?h.clubs:order}; }).filter(c=>c.clubs.length>=3 && c.clubs.length<=8);
  return _car;
};
function buildCareerLv(n){
  return FK.pickBy("career",FK.careerPool(),xOf("career",n),5,c=>c.name).map(c=>({ answer:c.name, order:c.clubs.slice(), pool:FK.shuffle(c.clubs.slice()) }));
}

/* ---------- oyun başlatma ---------- */
FK.lvSec = (mode,n) => { const x=xOf(mode,n); return mode==="flag" ? Math.round(10-x*4) : Math.round(15-x*5); };
FK.lvClueTime = (mode,n) => Math.round(40-xOf(mode,n)*12);
FK.playLevel = (mode,n) => {
  const S=FK.lvState(mode); if(n>S.cur) { FK.toast(t("lvLocked"),"lock"); return; }
  FK.useEnergy(()=>{
    const lg=FK.lvLeague(mode,n), d=Math.min(4,lg+1);
    if(mode==="guess"){
      const pool=FK.gp(), T=FK.pickBy("guess",pool,xOf("guess",n),1,p=>p.name)[0];
      FK.go("guess",{diff:[1,2,3,3,4][lg],era:"mix",level:n,target:T.name,max:[8,8,7,7,6][lg]},{replace:true}); return; }
    let qs;
    if(mode==="player") qs=buildPlayerLv(n);
    else if(mode==="club") qs=buildClubLv(n);
    else if(mode==="career") qs=buildCareerLv(n);
    else if(mode==="flag") qs=FK.buildFlag(1+Math.min(3,Math.floor(xOf("flag",n)*4)));
    const g={ mode, diff:d, level:n, sec:FK.lvSec(mode,n), ct:FK.lvClueTime(mode,n), qs, i:0, score:0, correct:0, streak:0, bestStreak:0, timeSum:0, res:[], jokers:lg>=3?1:2, practice:false, extra:{careersOk:0,firstTry:0} };
    FK.go("play",{g},{replace:true});
  });
};

/* ---------- yıldız, ilerleme, sandık ---------- */
FK.lvStarsFor = g => {
  if(g.mode==="guess"){ const e=g.extra||{}; if(!e.win) return 0; return e.guesses<=3?3:e.guesses<=5?2:1; }
  const p=FK.LV[g.mode].pass; return g.correct>=p[2]?3:g.correct>=p[1]?2:g.correct>=p[0]?1:0;
};
const _fin=FK.finishGame;
FK.finishGame = g => {
  const r=_fin(g);
  if(!g.level || !FK.LV[g.mode]) return r;
  const S=FK.lvState(g.mode), n=g.level, M=FK.LV[g.mode], st=FK.lvStarsFor(g), prev=S.st[n]||0;
  if(st>prev) S.st[n]=st;
  const first = st>0 && prev===0;
  if(st>0 && n>=S.cur) S.cur=Math.min(M.N,n+1);
  let chest=null;
  if(first && n%10===0){
    const leagueEnd = n%M.per===0, s=FK.state;
    const gems = leagueEnd?100:25, boosts=[]; for(let i=0;i<(leagueEnd?3:1);i++){ const b=FK.BOOSTS[Math.floor(Math.random()*FK.BOOSTS.length)]; FK.addBoost(b.id,1); boosts.push(b.e); }
    s.gems+=gems; chest={gems,boosts,leagueEnd,league:FK.lvLeague(g.mode,n)};
  }
  FK.save();
  r.lvl={n,stars:st,prev,chest,next:st>0 && n<M.N, nextN:n+1, need:M.pass?M.pass[0]:0};
  return r;
};
FK.chestModal = (c,n) => {
  FK.sfx("lvl"); FK.vib([40,40,80]);
  FK.modal('<div style="position:relative;overflow:hidden;text-align:center;padding:6px 0"><div class="rays"></div><div style="position:relative">'+
    '<div class="chest-ic">🎁</div><div class="h-display" style="font-size:30px">'+(c.leagueEnd?t("lvLeagueDone",{l:t("lg_"+c.league)}):t("lvChest"))+'</div>'+
    '<div class="small muted" style="margin-top:4px">'+t("lvChestS",{n})+'</div>'+
    '<div class="row" style="justify-content:center;gap:10px;margin-top:16px"><span class="chip chip-gem" style="font-size:16px">'+FK.gemIc(16)+'+'+c.gems+'</span>'+c.boosts.map(e=>'<span class="chip" style="font-size:18px;background:var(--card2)">'+e+'</span>').join("")+'</div>'+
    '<button class="btn btn-primary" style="margin-top:18px" data-ok>'+t("done")+'</button></div></div>', w=>{ w.querySelector("[data-ok]").onclick=FK.closeModal; FK.confetti(w); });
};
FK.starsHtml = (n,size=26) => '<span class="lv-stars">'+[1,2,3].map(i=>'<i class="'+(i<=n?"on":"")+'" style="font-size:'+size+'px;animation-delay:'+(i*.18)+'s">★</i>').join("")+'</span>';

/* ---------- bölüm haritası (başlangıç ekranının yerine) ---------- */
FK.lvMap = (el,mode) => {
  const M=FK.MODES[mode], LVm=FK.LV[mode], S=FK.lvState(mode), s=FK.state;
  let lg=s.lvTab&&s.lvTab[mode]!=null ? s.lvTab[mode] : FK.lvLeague(mode,S.cur);
  const draw=()=>{
    const from=lg*LVm.per+1, to=from+LVm.per-1, cur=S.cur;
    const totalSt=Object.values(S.st).reduce((a,b)=>a+b,0);
    el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:24px;margin:0">'+FK.modeName(mode)+'</h1><div class="small muted">★ '+totalSt+' / '+(LVm.N*3)+'</div></div>'+FK.energyPill()+'</div>'+
    '<div class="lv-tabs">'+[0,1,2,3,4].map(i=>{ const st=i*LVm.per+1, lock=st>cur;
      return '<button class="lv-tab'+(i===lg?" on":"")+(lock?" lock":"")+'" data-lg="'+i+'" style="--c1:'+LGC[i][0]+';--c2:'+LGC[i][1]+'"><span>'+(lock?"🔒":LGE[i])+'</span><b>'+t("lg_"+i)+'</b></button>'; }).join("")+'</div>'+
    '<div class="scroll lv-scroll"><div class="lv-head" style="background:linear-gradient(135deg,'+LGC[lg][0]+','+LGC[lg][1]+')"><span class="lv-hic">'+LGE[lg]+'</span><div class="grow"><div class="h-display" style="font-size:24px">'+t("lg_"+lg)+'</div><div class="small" style="opacity:.9">'+t("lvN",{n:from+"–"+to})+'</div></div><button class="pill" data-rules style="background:rgba(0,0,0,.25);color:#fff">'+FK.ic("info",14,2.4)+t("lvRules")+'</button></div>'+
    '<div class="lv-grid">'+Array.from({length:LVm.per},(_,k)=>{ const n=from+k, stars=S.st[n]||0, lock=n>cur, isCur=n===cur, chest=n%10===0;
      return '<button class="lv-b'+(lock?" lock":"")+(isCur?" cur":"")+(stars?" done":"")+'" data-n="'+n+'" style="--c1:'+LGC[lg][0]+';--c2:'+LGC[lg][1]+'">'+(chest?'<span class="lv-ch">'+(stars?"✅":"🎁")+'</span>':'')+'<b>'+(lock?FK.ic("lock",16,2.4):n)+'</b><span class="lv-s">'+[1,2,3].map(i=>'<i class="'+(i<=stars?"on":"")+'">★</i>').join("")+'</span></button>'; }).join("")+'</div>'+
    '</div>'+
    '<div style="padding:10px 16px calc(16px + var(--safe-b))"><button class="btn btn-primary" data-go-cur>'+FK.ic("ball",22,2.4)+t("lvPlay",{n:cur})+' <span class="en-cost">⚡1</span></button></div>';
    el.querySelector("[data-back]").onclick=FK.back;
    el.querySelectorAll("[data-lg]").forEach(b=>b.onclick=()=>{ const i=+b.dataset.lg; if(i*LVm.per+1>S.cur){ FK.toast(t("lvLeagueLocked",{l:t("lg_"+i),n:i*LVm.per+1}),"lock"); return; } lg=i; s.lvTab=s.lvTab||{}; s.lvTab[mode]=i; FK.save(); FK.sfx("tap"); draw(); });
    el.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{ const n=+b.dataset.n; if(n>S.cur){ FK.toast(t("lvLocked"),"lock"); return; } FK.sfx("tap"); FK.playLevel(mode,n); });
    el.querySelector("[data-go-cur]").onclick=()=>{ FK.sfx("tap"); FK.playLevel(mode,S.cur); };
    el.querySelector("[data-rules]").onclick=()=>FK.modal('<div class="stack" style="gap:12px"><div style="display:flex;justify-content:center">'+FK.kafa("bilge",80,"bob")+'</div><div class="h-display h2 center">'+t("howTo")+'</div><div style="font-size:14px;line-height:1.55">'+t("rules_"+mode)+'</div><button class="btn btn-primary" data-ok>'+t("done")+'</button></div>',w=>w.querySelector("[data-ok]").onclick=FK.closeModal);
    const c=el.querySelector(".lv-b.cur"); if(c) setTimeout(()=>c.scrollIntoView({block:"center"}),30);
    FK.energyTick&&FK.energyTick(el);
  };
  draw();
};
const _intro=FK.screens.intro;
FK.screens.intro = (el,p) => FK.LV[p.mode] ? FK.lvMap(el,p.mode) : _intro(el,p);
})();
