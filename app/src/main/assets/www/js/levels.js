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
  c_league:"Lig: {v}", c_pl:"Bu kulüpte oynamış bir isim: {v}", c_plNow:"Şu an burada oynuyor: {v}", c_lgNow:"Şu an bu ligde oynuyor: {v}", c_initialS:"Soyadının baş harfi: {v}", c_lgLast:"Son oynadığı lig: {v}", c_plLeg:"Bu kulübün eski oyuncusu: {v}", c_plStar:"Bu kulüpte oynamış bir yıldız: {v}", c_cont:"Kıta: {v}",
  cont_EU:"Avrupa", cont_SA:"Güney Amerika", cont_NA:"Kuzey Amerika", cont_AF:"Afrika", cont_AS:"Asya", cont_OC:"Okyanusya"
});
Object.assign(FK_I18N.en,{
  lg_0:"Amateur", lg_1:"Süper Lig", lg_2:"Europe", lg_3:"Legend", lg_4:"Futbol Kafası",
  lvN:"Level {n}", lvPlay:"Level {n} · Play", lvLocked:"Finish the previous level with at least 1 star", lvLeagueLocked:"{l} league opens at level {n}",
  lvNext:"Next level", lvRetry:"Try again", lvFail:"You need at least {n} correct to pass", lvStars:"{a}/{b} stars",
  lvChest:"Chest opened!", lvChestS:"You passed level {n}", lvLeagueDone:"{l} league complete! 🏆", lvRules:"How to play?", lvMap:"Levels",
  lvSoon:"This league opens soon", c_was:"Played for {v} in his career", c_now:"Currently plays for {v}", c_last:"Last club: {v}", c_born:"Born in {v}", c_wcWin:"Won the World Cup",
  c_league:"League: {v}", c_pl:"A player who played here: {v}", c_plNow:"Currently plays here: {v}", c_lgNow:"Currently plays in: {v}", c_initialS:"Surname starts with: {v}", c_lgLast:"Last league: {v}", c_plLeg:"Former player here: {v}", c_plStar:"A star who played here: {v}", c_cont:"Continent: {v}",
  cont_EU:"Europe", cont_SA:"South America", cont_NA:"North America", cont_AF:"Africa", cont_AS:"Asia", cont_OC:"Oceania"
});

/* N: bölüm sayısı, per: lig başına bölüm, open: şu an açık olan son bölüm (veri büyüdükçe artar) */
FK.LV = {
  player:{ N:200, per:40, open:200, pass:[5,7,9] },
  club:  { N:200, per:40, open:200, pass:[5,7,9] },
  guess: { N:200, per:40, open:200 },
  flag:  { N:100, per:20, open:100, pass:[5,7,9] },
  career:{ N:100, per:20, open:100, pass:[5,7,9] }
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
  const CUR=window.FK_GP_CUR||FK_GPLAYERS.length;
  _gp=FK_GPLAYERS.map((r,i)=>{ const clubs=r[7].split(",").filter(c=>FK_GCLUBS[c]); const p={name:r[0],by:r[1],nat:r[2],pos:r[3],no:r[4],wc:r[5],fame:r[6],clubs,act:act.has(r[0]),wd:i>=CUR};
    const cur=clubs[clubs.length-1];
    /* elle seçilmiş yıldızlar önce; Wikidata'dan gelen oyuncular (ünü otomatik) daha sonraki bölümlerde */
    let sc = p.wd ? ([0,.45,.62,.82][p.fame]||.82) : ([0,.02,.32,.68][p.fame]||.68);
    if(!p.act) sc+=.14; if(p.act&&B.has(cur)) sc-=(p.fame===2&&!p.wd?.1:.06); if(!clubs.some(c=>B.has(c))) sc+=.1; if(p.wc) sc-=.04;
    p.sc=Math.max(0,Math.min(1,sc+(hash(p.name)-.5)*.1)); return p; }).filter(p=>p.clubs.length);
  return _gp;
};
/* geçmişe dayalı modlar için (Kariyer, Kulübü Tanı): + kadrosu doğrulanamayan Wikidata oyuncuları */
let _gpx=null;
FK.resetPools = () => { _gp=null; _gpx=null; };
FK.gpx = () => { if(_gpx) return _gpx; const B=big();
  _gpx=FK.gp().concat((window.FK_XPLAYERS||[]).map(r=>{ const clubs=r[7].split(",").filter(c=>FK_GCLUBS[c]); const p={name:r[0],by:r[1],nat:r[2],pos:r[3],no:0,wc:r[5],fame:r[6],clubs,act:false};
    let sc=([0,.05,.38,.68][p.fame]||.68)+.08; if(!clubs.some(c=>B.has(c))) sc+=.1; p.sc=Math.max(0,Math.min(1,sc+(hash(p.name)-.5)*.1)); return p; }).filter(p=>p.clubs.length));
  return _gpx; };
/* hedef zorluğa en yakın, yakın zamanda sorulmamış öğeler */
FK.pickBy = (mode,items,x,count,key) => {
  const w = x<.25 ? Math.max(count*4,40) : Math.max(count*7,70);
  const near=items.slice().sort((a,b)=>Math.abs(a.sc-x)-Math.abs(b.sc-x)).slice(0,w);
  const out=FK.fresh(mode,near,key,count); FK.markSeen(mode,out.map(key)); return out;
};
const cn = c => (FK_GCLUBS[c]||[c])[0];
const pick = (a,r=Math.random) => a[Math.floor(r()*a.length)];
const uniq = a => [...new Set(a)];

/* ---------- FUTBOLCUYU BUL ---------- */
const HAND = () => { const m={}; (window.FK_PLAYERS||[]).forEach(p=>m[p.name]=p); return m; };
/* ipucu seçici: rastgele 4 tür; kolayda güçlüler öne çıkar, sıra her soruda farklı (zayıftan güçlüye, gürültülü) */
FK.pickClues = (C,x) => FK.shuffle(C).map(e=>({e,w:e[0]*(1-x)+(1-e[0])*x*.6+Math.random()*.5})).sort((a,b)=>b.w-a.w).slice(0,4)
  .map(o=>({k:o.e[0]+Math.random()*.45,s:o.e[1]})).sort((a,b)=>a.k-b.k).map(o=>o.s);
function buildPlayerLv(n){
  const x=xOf("player",n), all=FK.gp(), H=HAND();
  return FK.pickBy("player",all,x,10,p=>p.name).map(p=>{
    const cur=p.clubs[p.clubs.length-1], past=uniq(p.clubs.slice(0,-1)).filter(c=>c!==cur), h=H[p.name];
    const pastC = past.length ? past.slice().sort((a,b)=>hash(p.name+a)-hash(p.name+b)) : [];
    /* uyruk, mevki ve numara kartta görünüyor; ipuçları başka bilgiler */
    const C=[[.2,t("c_born",{v:p.by})]], LGc=FK_LEAGUES[(FK_GCLUBS[cur]||[])[2]];
    if(LGc) C.push([.4,(p.act?t("c_lgNow",{v:L([LGc[2],LGc[3]])}):t("c_lgLast",{v:L([LGc[2],LGc[3]])}))]);
    if(pastC[0]) C.push([.55,t("c_was",{v:cn(pastC[0])})]);
    if(pastC[1]) C.push([.5,t("c_was",{v:cn(pastC[1])})]);
    C.push([.8,(window.FK_FREE&&FK_FREE[p.name])?t("c_last",{v:cn(cur)})+" 🆓":p.act?t("c_now",{v:cn(cur)}):t("c_last",{v:cn(cur)})]);
    if(p.wc) C.push([.55,t("c_wcWin")]);
    if(h){ C.push([.9,L(h.c[0])]); if(h.c[1]) C.push([.9,L(h.c[1])]); }
    C.push([.45,p.name.indexOf(" ")>0?t("c_initialS",{v:p.name.split(" ").pop()[0]}):t("c_initial",{v:p.name[0]})]);
    const clues=FK.pickClues(C,x);
    // yanlış şıklar: aynı mevki, benzer zorluk; zor bölümlerde aynı kıtadan
    const cont=FK_CONTINENT[p.nat];
    let cand=all.filter(o=>o.name!==p.name && o.pos===p.pos && Math.abs(o.sc-p.sc)<.25);
    if(x>.45){ const c2=cand.filter(o=>FK_CONTINENT[o.nat]===cont); if(c2.length>=3) cand=c2; }
    if(cand.length<3) cand=all.filter(o=>o.name!==p.name && o.pos===p.pos);
    const wrong=FK.shuffle(cand).slice(0,3).map(o=>o.name);
    return { answer:p.name, opts:FK.shuffle([p.name].concat(wrong)), clues, cc:p.nat, pos:p.pos, no:p.no };
  });
}

/* ---------- KULÜBÜ TANI ---------- */
let _clubs=null;
const RICHALIAS={"Tottenham Hotspur":"Tottenham","Bayern Münih":"Bayern Munich"};
FK.clubPool = () => {
  if(_clubs) return _clubs;
  const rich={}; (window.FK_CLUBS||[]).forEach(c=>rich[RICHALIAS[c[0]]||c[0]]=c);
  const by={}; FK.gpx().forEach(p=>uniq(p.clubs).forEach(c=>(by[c]=by[c]||[]).push(p)));
  const B=big(), TOP=new Set(["ENG","ESP","ITA","GER","FRA","TUR"]);
  _clubs=Object.keys(by).map(code=>{ const g=FK_GCLUBS[code], lg=g[2], LG=FK_LEAGUES[lg]||[null,lg,lg,lg], r=rich[g[0]];
    const pl=by[code].slice().sort((a,b)=>a.sc-b.sc);
    let sc = r ? (r[7]-1)/3*.8 : B.has(code) ? .05 : (TOP.has(lg)?.42:.66) - Math.min(pl.length,12)*.01;
    if(!r && pl.length<2) sc+=.15;
    return {code,name:g[0],lg,cc:LG[0],lgName:[LG[2],LG[3]],short:LG[1],pl,rich:r,sc:Math.max(0,Math.min(1,sc+(hash(code)-.5)*.08))};
  }).filter(c=>c.cc&&(c.rich||c.pl.length>=3));
  return _clubs;
};
function buildClubLv(n){
  const x=xOf("club",n), all=FK.clubPool();
  return FK.pickBy("club",all,x,10,c=>c.code).map(c=>{
    /* ipucu havuzu: [güç 0-1, metin] — ülke yok (bayrak kartta görünüyor) */
    const C=[], pl=c.pl, R=c.rich, nm=c.name.replace(/^(FC|AFC|SC|AC|AS|CF|SV|VfB|VfL|1\. FC) /,"");
    const used={}; const P=(arr,f)=>{ const o=arr.filter(p=>!used[p.name]&&f(p)); return o.length?o[Math.floor(Math.random()*Math.min(3,o.length))]:null; };
    C.push([.3,t("c_league",{v:L(c.lgName)})]);
    const inName=v=>FK.norm(c.name).indexOf(FK.norm(v))>=0;
    if(R){ if(!inName(R[2])&&!inName(R[3])) C.push([.65,t("c_city",{v:L([R[2],R[3]])})]); C.push([.25,t("c_year",{v:R[4]})]); if(!inName(nm)||!FK.norm(L([R[5],R[6]])).includes(FK.norm(nm))) C.push([.9,L([R[5],R[6]])]); if(R[8]) C.push([.45,t("c_colors",{v:R[8]})]); }
    const star=P(pl,()=>true); if(star){ used[star.name]=1; C.push([star.fame<=2?.85:.45,t(star.fame<=2?"c_plStar":"c_pl",{v:star.name})]); }
    const now=P(pl,p=>p.act&&p.clubs[p.clubs.length-1]===c.code); if(now){ used[now.name]=1; C.push([.6,t("c_plNow",{v:now.name})]); }
    const leg=P(pl,p=>p.clubs[p.clubs.length-1]!==c.code); if(leg){ used[leg.name]=1; C.push([.7,t("c_plLeg",{v:leg.name})]); }
    const low=pl.slice().reverse().find(p=>!used[p.name]); if(low){ used[low.name]=1; C.push([.35,t("c_pl",{v:low.name})]); }
    C.push([.5,t("c_initial",{v:FK.upper?FK.upper(nm[0]):nm[0].toUpperCase()})]);
    C.push([.15,t("c_len",{v:nm.replace(/[^A-Za-zÀ-ÿĞğİıŞşÇçÖöÜü]/g,"").length})]);
    /* rastgele 4 tür seç; kolay bölümlerde güçlü ipuçlarını tercih et, sonra gürültülü güç sırasına diz */
    const clues=FK.pickClues(C,x);
    /* yanlış şıklar: kolayda tanınmış ve farklı ülkelerden, zorda aynı ligden */
    let cand = x<.35 ? all.filter(o=>o.code!==c.code && o.cc!==c.cc && Math.abs(o.sc-c.sc)<.2)
                     : all.filter(o=>o.code!==c.code && o.lg===c.lg);
    if(cand.length<3) cand=cand.concat(all.filter(o=>o.code!==c.code && Math.abs(o.sc-c.sc)<.3));
    const seen={}; seen[c.name]=1; const wrong=[]; FK.shuffle(cand).forEach(o=>{ if(wrong.length<3&&!seen[o.name]){ seen[o.name]=1; wrong.push(o.name); } });
    return { answer:c.name, opts:FK.shuffle([c.name].concat(wrong)), clues, cc:c.cc, year:R?R[4]:c.short };
  });
}

/* ---------- KARİYER YOLU ---------- */
let _car=null;
FK.careerPool = () => {
  if(_car) return _car;
  const hand={}; (window.FK_CAREERS||[]).forEach(c=>hand[c.name]=c);
  _car=FK.gpx().map(p=>{ const seq=p.clubs.filter((c,i)=>i===0||c!==p.clubs[i-1]); const cnt={};
    const order=seq.map(c=>{ cnt[c]=(cnt[c]||0)+1; return cn(c)+(cnt[c]>1?" ("+cnt[c]+")":""); });
    const h=hand[p.name]; return {name:p.name, sc:p.sc, clubs:h?h.clubs:order}; }).filter(c=>c.clubs.length>=3 && c.clubs.length<=8);
  return _car;
};
function buildCareerLv(n){
  /* v1.5 Transfer Rotası: kulüpler sırayla, futbolcu 4 şıktan */
  return FK.buildRoute(FK.careerPool(),xOf("career",n),10);
}

/* ---------- oyun başlatma ---------- */
FK.lvSec = (mode,n) => { const x=xOf(mode,n); return mode==="flag" ? Math.round(10-x*4) : mode==="career"||mode==="kadro" ? Math.round(20-x*6) : Math.round(15-x*5); };
FK.lvClueTime = (mode,n) => Math.round(40-xOf(mode,n)*12);
FK.playLevel = (mode,n) => {
  const S=FK.lvState(mode); if(n>S.cur) { FK.toast(t("lvLocked"),"lock"); return; }
  FK.useEnergy(()=>{
    const lg=FK.lvLeague(mode,n), d=Math.min(4,lg+1);
    if(mode==="guess"){
      const era=n<=120?"now":n<=160?"old":"mix";
      const pool=FK.gp().filter(p=>era==="now"?p.act:era==="old"?!p.act:true), T=FK.pickBy("guess",pool,xOf("guess",n),1,p=>p.name)[0];
      FK.go("guess",{diff:[1,2,3,3,4][lg],era,level:n,target:T.name,max:[10,8,7,7,6][lg]},{replace:true}); return; }
    if(mode==="ortak"){ const x=xOf(mode,n); FK.go("orplay",{level:n,x,diff:d,pairs:FK.orPairs(x,10,"or"+n+"-"+Date.now()),sec:Math.round(30-x*10)},{replace:true}); return; }
    let qs;
    if(mode==="kadro") qs=FK.buildKadro(xOf(mode,n),10,"kd"+n+"-"+Date.now());
    else if(mode==="player") qs=buildPlayerLv(n);
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
    const gems = leagueEnd?50:10, boosts=[]; for(let i=0;i<(leagueEnd?3:1);i++){ const b=FK.BOOSTS[Math.floor(Math.random()*FK.BOOSTS.length)]; FK.addBoost(b.id,1); boosts.push(b.e); }
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
/* v1.6: seviye haritası — sahada aşağıdan yukarı kıvrılan yol, en üstte kupa */
FK.lvLockToast = msg => { FK.sfx&&FK.sfx("wrong"); document.querySelectorAll(".toast.low").forEach(x=>x.remove()); FK.toast(msg,"lock",2000); const a=document.querySelectorAll(".toast"); const d=a[a.length-1]; if(d) d.classList.add("low"); };
FK.lvPathMap = (from,cur,st,W,H) => {
  const n=10, top=Math.round(Math.min(W*561/720*0.5,H*0.27)), gap=(H-top-56)/(n-1), tight=false, xs=gap<44?[0.18,0.5,0.82,0.5]:[0.25,0.5,0.75,0.5], sz=Math.round(Math.max(44,Math.min(64,gap*1.35)));
  const pts=Array.from({length:n},(_,k)=>[W*xs[k%xs.length],H-44-k*gap]);
  const seg=i=>{ const [px,py]=pts[i-1],[x,y]=pts[i]; return tight?' L'+x+' '+y:' C'+px+' '+(py-(py-y)*.6)+' '+x+' '+(y+(py-y)*.6)+' '+x+' '+y; }, sw=tight?8:Math.round(Math.min(24,sz*.4));
  let d='M'+pts[0][0]+' '+pts[0][1]; for(let i=1;i<n;i++) d+=seg(i);
  const done=Math.min(n-1,cur-from); let d2=''; if(done>0){ d2='M'+pts[0][0]+' '+pts[0][1]; for(let i=1;i<=done;i++) d2+=seg(i); }
  const nodes=pts.map(([x,y],k)=>{ const m=from+k, stars=st[m]||0, lock=m>cur, isCur=m===cur, chest=m%10===0;
    return '<button class="lvp-n pn'+(lock?" lock":"")+(isCur?" cur":"")+(stars?" done":"")+'" data-n="'+m+'" style="left:'+x+'px;top:'+y+'px;--z:'+sz+'px">'+(chest?'<span class="lvp-ch">'+(stars?"✅":"🎁")+'</span>':'')+'<b>'+(lock?FK.ic("lock",Math.round(sz*.36),2.6):m)+'</b>'+(lock?'':'<span class="lvp-s">'+[1,2,3].map(i=>'<i class="'+(i<=stars?"on":"")+'">★</i>').join("")+'</span>')+'</button>'; }).join("");
  return '<div class="lvp v6 fit" style="height:'+H+'px"><svg class="lvp-path" viewBox="0 0 '+W+' '+H+'"><path d="'+d+'" fill="none" stroke="#130A2E" stroke-width="'+(sw+8)+'" stroke-linecap="round" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="#8B5CF6" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round"/>'+(d2?'<path d="'+d2+'" fill="none" stroke="#C6FF3D" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 12"/>':'')+'</svg>'+nodes+'</div>';
};
FK.lvMap = (el,mode) => {
  const M=FK.MODES[mode], LVm=FK.LV[mode], S=FK.lvState(mode), s=FK.state;
  let lg=s.lvTab&&s.lvTab[mode]!=null ? s.lvTab[mode] : FK.lvLeague(mode,S.cur);
  const pgOf=()=>{ const f=lg*LVm.per+1; return S.cur<f?0:Math.min(3,Math.floor((S.cur-f)/10)); }; let pg=pgOf();
  const draw=()=>{
    const from=lg*LVm.per+1, to=from+LVm.per-1, cur=S.cur;
    const totalSt=Object.values(S.st).reduce((a,b)=>a+b,0);
    el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:24px;margin:0">'+FK.modeName(mode)+'</h1><div class="small muted">★ '+totalSt+' / '+(LVm.N*3)+'</div></div>'+FK.energyPill()+'</div>'+
    '<div class="lv-tabs">'+[0,1,2,3,4].map(i=>{ const st=i*LVm.per+1, lock=st>cur;
      return '<button class="lv-tab'+(i===lg?" on":"")+(lock?" lock":"")+'" data-lg="'+i+'" style="--c1:'+LGC[i][0]+';--c2:'+LGC[i][1]+'"><span>'+(lock?"🔒":LGE[i])+'</span><b>'+t("lg_"+i)+'</b></button>'; }).join("")+'</div>'+
    '<div class="lv-scroll lv-fit"><div class="lvp-host"></div></div>'+
    '<div class="lv-pgr"><button class="lv-pi" data-rules aria-label="'+t("lvRules")+'">'+FK.ic("info",18,2.6)+'</button>'+[0,1,2,3].map(i=>{ const a=from+i*10; return '<button class="lv-pp'+(i===pg?" on":"")+(a>cur?" lk":"")+'" data-pg="'+i+'">'+a+'–'+(a+9)+'</button>'; }).join("")+'</div>'+
    '<div style="padding:10px 16px calc(16px + var(--safe-b))"><button class="btn btn-primary" data-go-cur>'+FK.ic("ball",22,2.4)+t("lvPlay",{n:cur})+' <span class="en-cost">⚡1</span></button></div>';
    el.querySelector("[data-back]").onclick=FK.back;
    el.querySelectorAll("[data-lg]").forEach(b=>b.onclick=()=>{ const i=+b.dataset.lg; if(i*LVm.per+1>S.cur){ FK.toast(t("lvLeagueLocked",{l:t("lg_"+i),n:i*LVm.per+1}),"lock"); return; } lg=i; pg=pgOf(); s.lvTab=s.lvTab||{}; s.lvTab[mode]=i; FK.save(); FK.sfx("tap"); draw(); });
    const sc=el.querySelector(".lv-fit"), host=el.querySelector(".lvp-host");
    const lay=()=>{ const W=host.clientWidth, H=sc.clientHeight-14; if(W<50||H<200) return; host.innerHTML=FK.lvPathMap(from+pg*10,cur,S.st,W,H);
      host.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{ const n=+b.dataset.n; if(n>S.cur){ FK.lvLockToast(t("lvLockedN",{n:S.cur})); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); const c=host.querySelector(".lvp-n.cur"); if(c){ c.classList.remove("glow"); void c.offsetWidth; c.classList.add("glow"); } return; } FK.sfx("tap"); FK.playLevel(mode,n); }); };
    lay(); requestAnimationFrame(lay); if(window.ResizeObserver){ let lw=0,lh=0; new ResizeObserver(()=>{ if(sc.clientWidth!==lw||sc.clientHeight!==lh){ lw=sc.clientWidth; lh=sc.clientHeight; lay(); } }).observe(sc); }
    const goPg=i=>{ if(i<0||i>3||i===pg) return; if(from+i*10>S.cur){ FK.lvLockToast(t("lvLockedP",{a:(from+i*10)+"–"+(from+i*10+9),n:from+i*10-1})); return; } pg=i; FK.sfx("tap"); draw(); };
    el.querySelectorAll("[data-pg]").forEach(b=>b.onclick=()=>goPg(+b.dataset.pg));
    let sx=null; sc.addEventListener("touchstart",e=>{ sx=e.touches[0].clientX; },{passive:true}); sc.addEventListener("touchend",e=>{ if(sx==null) return; const dx=e.changedTouches[0].clientX-sx; sx=null; if(Math.abs(dx)>60) goPg(pg+(dx<0?1:-1)); },{passive:true});
    el.querySelector("[data-go-cur]").onclick=()=>{ FK.sfx("tap"); FK.playLevel(mode,S.cur); };
    el.querySelector("[data-rules]").onclick=()=>FK.modal('<div class="stack" style="gap:12px"><div style="display:flex;justify-content:center">'+FK.kafa("bilge",80,"bob")+'</div><div class="h-display h2 center">'+t("howTo")+'</div><div style="font-size:14px;line-height:1.55">'+t("rules_"+mode)+'</div><button class="btn btn-primary" data-ok>'+t("done")+'</button></div>',w=>w.querySelector("[data-ok]").onclick=FK.closeModal);
    FK.energyTick&&FK.energyTick(el);
  };
  draw();
};
const _intro=FK.screens.intro;
FK.screens.intro = (el,p) => FK.LV[p.mode] ? FK.lvMap(el,p.mode) : _intro(el,p);
})();
