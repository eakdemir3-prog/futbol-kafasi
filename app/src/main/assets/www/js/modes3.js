/* ==========================================================
   v0.4 — Yeni silüet · Günlük seri (alev + dondurma) ·
   Hangisi Daha Fazla · Doğru mu Yanlış mı (60 sn)
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t;

/* ---------------- dil metinleri ---------------- */
Object.assign(FK_I18N.tr,{
  m_more:"Hangisi Daha Fazla", m_moreS:"İki seçenek · Seri kır · İlk hatada biter",
  rules_more:"İki oyuncu, kulüp ya da ülke gelir. Hangisinin sayısı daha fazlaysa ona dokun. Her soru için 8 saniyen var. Doğru bildikçe seri uzar, ilk hatada oyun biter. Sadece değişmeyen istatistikler sorulur.",
  m_tf:"Doğru mu Yanlış mı", m_tfS:"60 saniye · Kaydır · Kombo",
  rules_tf:"60 saniyede olabildiğince çok cümleyi doğru ya da yanlış diye işaretle. Sağa kaydır veya DOĞRU'ya bas, sola kaydır veya YANLIŞ'a bas. Art arda doğrular kombo çarpanını büyütür (x4'e kadar). Her yanlış cevap süreden 5 saniye düşer.",
  q_intl:"Hangisinin milli takımda daha çok golü var?", q_wcGoals:"Hangisi Dünya Kupası'nda daha çok gol attı?", q_ballon:"Hangisinin daha çok Ballon d'Or ödülü var?",
  q_uclP:"Hangisi daha çok Şampiyonlar Ligi kazandı?", q_uclC:"Hangi kulüp daha çok Şampiyonlar Ligi / Avrupa Kupası kazandı?", q_wc:"Hangi ülke daha çok Dünya Kupası kazandı?",
  u_intl:"gol", u_wcGoals:"gol", u_ballon:"ödül", u_uclP:"kupa", u_uclC:"kupa", u_wc:"kupa",
  moreScore:"SERİ", moreOver:"Seri bitti!", moreRes:"{n} doğru üst üste", newRecord:"YENİ REKOR!", again:"Tekrar oyna", exitGame:"Çık",
  tfTrue:"DOĞRU", tfFalse:"YANLIŞ", tfOver:"Süre doldu!", tfRes:"{a} doğru · {b} yanlış", combo:"KOMBO",
  tf_wc:"{y} Dünya Kupası'nı {c} kazandı.", tf_nat:"{p} {a} bir futbolcu.", tf_club:"{p} şu an {c} forması giyiyor.",
  tf_ucl:"{c} toplam {n} kez Şampiyonlar Ligi / Avrupa Kupası kazandı.", tf_ballon:"{p} kariyerinde {n} Ballon d'Or kazandı.", tf_born:"{p} {y} doğumlu.",
  tf_intl:"{p} milli takımda {n} gol attı.",
  st_title:"Günlük Seri", st_days:"{n} gün", st_best:"En iyi: {n} gün", st_info:"Her gün en az bir oyun bitir, alevin büyüsün. Bir gün kaçırırsan elindeki seri dondurma serini korur.",
  st_freeze:"Seri dondurma", st_have:"Elinde: {n}/2", st_buy:"Satın al", st_noGem:"Yeterli elmas yok", st_full:"En fazla 2 dondurma taşıyabilirsin",
  st_bought:"Seri dondurma alındı ❄️", st_saved:"Seri dondurma serini kurtardı! ❄️ ({n} gün)", st_lost:"{n} günlük serin bitti. Bugün yeniden başla!",
  st_up:"🔥 {n} günlük seri!", st_goal:"Seri ödülleri", st_reward:"{n} günlük seri ödülü: +{g} elmas",
  st_week:"Son 7 gün", st_today:"Bugün oynadın", st_todo:"Bugün henüz oynamadın"
});
Object.assign(FK_I18N.en,{
  m_more:"Higher or Lower", m_moreS:"Two options · Build a streak · One mistake ends it",
  rules_more:"Two players, clubs or countries appear. Tap the one with the higher number. You have 8 seconds per question. Every correct pick extends your streak; the first mistake ends the game. Only fixed, settled stats are used.",
  m_tf:"True or False", m_tfS:"60 seconds · Swipe · Combo",
  rules_tf:"Mark as many statements as you can in 60 seconds. Swipe right or tap TRUE, swipe left or tap FALSE. Correct answers in a row raise your combo multiplier (up to x4). Each wrong answer costs 5 seconds.",
  q_intl:"Who scored more international goals?", q_wcGoals:"Who scored more World Cup goals?", q_ballon:"Who has more Ballon d'Or awards?",
  q_uclP:"Who won more Champions League titles?", q_uclC:"Which club won more Champions League / European Cups?", q_wc:"Which country won more World Cups?",
  u_intl:"goals", u_wcGoals:"goals", u_ballon:"awards", u_uclP:"titles", u_uclC:"titles", u_wc:"titles",
  moreScore:"STREAK", moreOver:"Streak over!", moreRes:"{n} correct in a row", newRecord:"NEW RECORD!", again:"Play again", exitGame:"Exit",
  tfTrue:"TRUE", tfFalse:"FALSE", tfOver:"Time's up!", tfRes:"{a} correct · {b} wrong", combo:"COMBO",
  tf_wc:"{c} won the {y} World Cup.", tf_nat:"{p} is {a}.", tf_club:"{p} currently plays for {c}.",
  tf_ucl:"{c} have won the Champions League / European Cup {n} times.", tf_ballon:"{p} won {n} Ballon d'Or award(s).", tf_born:"{p} was born in {y}.",
  tf_intl:"{p} scored {n} international goals.",
  st_title:"Daily Streak", st_days:"{n} days", st_best:"Best: {n} days", st_info:"Finish at least one game every day to grow your flame. Miss a day and a streak freeze protects it.",
  st_freeze:"Streak freeze", st_have:"Owned: {n}/2", st_buy:"Buy", st_noGem:"Not enough gems", st_full:"You can hold at most 2 freezes",
  st_bought:"Streak freeze bought ❄️", st_saved:"A streak freeze saved your streak! ❄️ ({n} day)", st_lost:"Your {n}-day streak ended. Start again today!",
  st_up:"🔥 {n}-day streak!", st_goal:"Streak rewards", st_reward:"{n}-day streak reward: +{g} gems",
  st_week:"Last 7 days", st_today:"You played today", st_todo:"You haven't played today"
});

/* ---------------- 1) YENİ SİLÜET ----------------
   Forma yakası, neon kenar ışığı, saç dokusu, kavisli omuzlar, koyu degrade */
let bid=0;
const BODY="M0 190C2 162 16 147 42 139C60 133 76 129 86 125L86 115C76 109 68 99 64 87C60 76 59 64 61 54C62 30 76 14 100 14C124 14 138 30 139 54C141 64 140 76 136 87C132 99 124 109 114 115L114 125C124 129 140 133 158 139C184 147 198 162 200 190Z";
FK.bust = (o={}) => {
  const id="fkb"+(++bid), w=o.w||150, h=o.h||(w*0.95), rim=o.rim||"#4ADE80", op=o.show?0.55:1;
  return '<svg class="'+(o.cls||"gbust")+'" aria-hidden="true" width="'+w+'" height="'+h+'" viewBox="0 0 200 190" style="opacity:'+op+'">'+
   '<defs><linearGradient id="'+id+'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E2A47"/><stop offset=".55" stop-color="#0B1222"/><stop offset="1" stop-color="#04070E"/></linearGradient>'+
   '<filter id="'+id+'f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>'+
   // neon kenar ışığı (bulanık + keskin)
   '<path d="'+BODY+'" fill="none" stroke="'+rim+'" stroke-width="6" stroke-opacity=".55" filter="url(#'+id+'f)"/>'+
   '<ellipse cx="60" cy="66" rx="7" ry="12" fill="none" stroke="'+rim+'" stroke-width="5" stroke-opacity=".4" filter="url(#'+id+'f)"/><ellipse cx="140" cy="66" rx="7" ry="12" fill="none" stroke="'+rim+'" stroke-width="5" stroke-opacity=".4" filter="url(#'+id+'f)"/>'+
   // kulaklar + gövde
   '<ellipse cx="60" cy="66" rx="7" ry="12" fill="url(#'+id+'g)"/><ellipse cx="140" cy="66" rx="7" ry="12" fill="url(#'+id+'g)"/>'+
   '<path d="'+BODY+'" fill="url(#'+id+'g)" stroke="'+rim+'" stroke-width="1.6" stroke-opacity=".85"/>'+
   // saç dokusu
   '<path d="M64 50C66 28 80 13 100 12C121 12 136 27 137 50C131 39 124 33 115 31C107 28 95 29 86 32C77 35 69 41 64 50Z" fill="#05080F" opacity=".9"/>'+
   '<g fill="none" stroke="#fff" stroke-opacity=".10" stroke-width="1.6" stroke-linecap="round"><path d="M78 26c6-4 14-6 22-6"/><path d="M84 32c8-5 18-6 28-4"/><path d="M106 18c10 1 18 6 23 13"/><path d="M70 40c4-6 9-10 15-13"/></g>'+
   // forma yakası (V yaka + bant)
   '<path d="M76 131C84 135 92 137 100 152C108 137 116 135 124 131" fill="none" stroke="#334155" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'+
   '<path d="M76 131C84 135 92 137 100 152C108 137 116 135 124 131" fill="none" stroke="'+rim+'" stroke-opacity=".35" stroke-width="1.4" stroke-linejoin="round"/>'+
   '<g stroke="#fff" stroke-opacity=".06" stroke-width="2"><path d="M30 160c20-6 40-8 56-8"/><path d="M170 160c-20-6-40-8-56-8"/></g>'+
   (o.no?'<text x="100" y="182" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="900" font-size="26" fill="#fff" fill-opacity=".8">'+o.no+'</text>':'')+
   '</svg>';
};

/* ---------------- 2) GÜNLÜK SERİ ---------------- */
const FREEZE_COST=40, MILES=[[3,10],[7,30],[30,100],[100,300]];
const dk=FK.dayKey, addD=(k,n)=>{ const d=new Date(k+"T12:00:00"); d.setDate(d.getDate()+n); return dk(d); };
const diffD=(a,b)=>Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/864e5);
const P=()=>{ const s=FK.state; if(!s.play) s.play={last:"",streak:0,best:0,freezes:1,days:{},miles:{}}; return s.play; };
FK.streakCheck = () => { // gün değişiminde: kaçırılan günleri dondurmayla kapat ya da seriyi sıfırla
  const p=P(), today=dk(); if(!p.last || p.streak<=0) return;
  const gap=diffD(p.last,today)-1; if(gap<=0) return;
  if(p.freezes>=gap){ p.freezes-=gap; for(let i=1;i<=gap;i++) p.days[addD(p.last,i)]="f"; p.last=addD(today,-1); p.note={k:"st_saved",n:gap}; }
  else { p.note={k:"st_lost",n:p.streak}; p.streak=0; }
  FK.save();
};
const _roll=FK.rollover; FK.rollover=()=>{ _roll(); FK.streakCheck(); };
const _fin=FK.finishGame; FK.finishGame=g=>{
  const r=_fin(g); const p=P(), today=dk();
  if(p.last!==today){
    p.streak = p.last===addD(today,-1) ? p.streak+1 : 1; p.last=today; p.days[today]="p"; p.best=Math.max(p.best,p.streak);
    r.streakUp=p.streak;
    MILES.forEach(([n,g])=>{ if(p.streak>=n && !p.miles[n]){ p.miles[n]=1; FK.state.gems+=g; r.streakGem=(r.streakGem||[]).concat([[n,g]]); } });
    const keys=Object.keys(p.days).sort(); while(keys.length>40) delete p.days[keys.shift()];
    FK.save();
    setTimeout(()=>{ FK.toast(t("st_up",{n:p.streak}),"info",2600); (r.streakGem||[]).forEach((x,i)=>setTimeout(()=>FK.toast(t("st_reward",{n:x[0],g:x[1]}),"gem",3000),1400*(i+1))); },700);
  }
  return r;
};
FK.flameTier = n => n>=100?["#FDE047","#F59E0B"] : n>=30?["#E9D5FF","#A855F7"] : n>=7?["#BAE6FD","#0EA5E9"] : n>=1?["#FED7AA","#F97316"] : ["#CBD5E1","#475569"];
FK.flame = (n,s=18) => { const [a,b]=FK.flameTier(n), k=n>=1?Math.min(1.35,1+Math.min(n,60)/150):0.9, w=Math.round(s*k), id="fl"+(++bid);
  return '<svg aria-hidden="true" width="'+w+'" height="'+w+'" viewBox="0 0 24 24" class="flame'+(n>=1?' on':'')+'"><defs><linearGradient id="'+id+'" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+b+'"/><stop offset="1" stop-color="'+a+'"/></linearGradient></defs><path d="M12 23c4.4 0 7.5-3.1 7.5-7.4 0-5.3-5.2-7.6-5.4-12.6-3.1 2.1-5.3 5.3-5.3 8.4-1.1-1-2-2.3-2.1-4.2C4.6 9.3 4.5 12.4 4.5 15.6 4.5 19.9 7.6 23 12 23z" fill="url(#'+id+')"/><path d="M12 22c2.2 0 3.8-1.6 3.8-3.8 0-2.7-2.6-3.9-2.7-6.4-1.6 1.1-2.7 2.7-2.7 4.3-.6-.5-1-1.2-1.1-2.1-.9 1.3-1 2.9-1 4.3 0 2.1 1.6 3.7 3.7 3.7z" fill="#fff" fill-opacity="'+(n>=1?.55:.25)+'"/></svg>'; };
FK.streakPill = () => { const p=P(); return '<button class="pill streak-pill" data-streak aria-label="'+t("st_title")+'">'+FK.flame(p.streak,16)+t("streakDays",{n:p.streak})+(p.freezes?'<span class="frz">❄'+p.freezes+'</span>':'')+'</button>'; };
FK.streakModal = () => {
  const p=P(), s=FK.state, today=dk();
  const week=[...Array(7)].map((_,i)=>{ const k=addD(today,i-6), v=p.days[k]; const lbl=new Date(k+"T12:00:00").toLocaleDateString(FK.lang()==="en"?"en-GB":"tr-TR",{weekday:"short"}).slice(0,2);
    return '<div class="wd'+(v==="p"?" p":v==="f"?" f":"")+(k===today?" today":"")+'"><i>'+(v==="p"?FK.flame(1,16):v==="f"?"❄":"")+'</i><span>'+lbl+'</span></div>'; }).join("");
  const draw=w=>{
    w.querySelector(".modal").innerHTML='<div class="center stack" style="gap:12px">'+
     '<div class="big-flame">'+(FK.kafa&&p.streak>0?FK.kafa(p.last===today?"atesli":"uykucu",110,"bob"):FK.flame(p.streak,74))+'</div>'+
     '<div><div class="h-display" style="font-size:40px;line-height:1">'+t("st_days",{n:p.streak})+'</div><div class="small muted" style="margin-top:4px">'+t("st_best",{n:p.best})+' · '+(p.last===today?t("st_today"):t("st_todo"))+'</div></div>'+
     '<div class="week">'+week+'</div>'+
     '<p class="small" style="margin:0;color:#CBD5E1;line-height:1.5">'+t("st_info")+'</p>'+
     '<div class="row card tight" style="gap:12px;text-align:left"><span style="font-size:28px">❄️</span><div class="grow"><b style="font-size:14px">'+t("st_freeze")+'</b><div class="small muted">'+t("st_have",{n:p.freezes}).replace("/2","/"+FK.freezeCap())+'</div></div><button class="btn btn-sm btn-claim" data-buy '+(p.freezes>=FK.freezeCap()?'disabled':'')+'>'+FK.gemIc(12)+FREEZE_COST+' '+t("st_buy")+'</button></div>'+
     (p.adDay!==today&&p.freezes<FK.freezeCap()?'<button class="btn btn-reward btn-sm" data-fad>🎬 '+t("freezeAd")+'</button>':'')+'<div style="text-align:left"><div class="label muted" style="margin-bottom:6px">'+t("st_goal")+'</div><div class="miles">'+MILES.map(([n,g])=>'<div class="mile'+(p.miles[n]?" on":"")+'">'+FK.flame(n,18)+'<b>'+n+'</b><span>'+FK.gemIc(11)+g+'</span></div>').join("")+'</div></div>'+
     '<button class="btn btn-primary" data-ok>'+t("done")+'</button></div>';
    w.querySelector("[data-ok]").onclick=FK.closeModal;
    const fa=w.querySelector("[data-fad]"); if(fa) fa.onclick=()=>FK.rewarded("freeze",ok=>{ if(!ok) return; p.adDay=today; p.freezes=Math.min(FK.freezeCap(),p.freezes+1); FK.save(); FK.toast(t("st_bought"),"gem"); FK.streakModal(); });
    w.querySelector("[data-buy]").onclick=()=>{
      if(p.freezes>=FK.freezeCap()){ FK.toast(t("st_full"),"info"); return; }
      if(s.gems<FREEZE_COST){ FK.toast(t("st_noGem"),"info"); return; }
      s.gems-=FREEZE_COST; p.freezes++; FK.save(); FK.sfx("win"); FK.toast(t("st_bought"),"gem"); draw(w); if(FK.render) setTimeout(()=>{},0);
    };
  };
  FK.modal('<div></div>',w=>draw(w.closest(".modal-wrap")||w));
};
FK.streakNote = () => { const p=P(); if(p.note){ const n=p.note; p.note=null; FK.save(); setTimeout(()=>FK.toast(t(n.k,{n:n.n}),"info",3600),600); } };

/* ---------------- ortak: sonuç kartı ---------------- */
function endCard(el,{title,big,sub,res,record,mode,again}){
  return '<div class="card center stack end-card" style="gap:10px">'+
    (record?'<span class="chip" style="align-self:center;background:#FACC15;color:#422006">'+FK.ic("star",12,2.6)+' '+t("newRecord")+'</span>':'')+
    (FK.kafa?'<div style="display:flex;justify-content:center">'+FK.kafa(record?"sampiyon":(res&&res.xp>=30)?"taraftar":"uzgun",110,"bob")+'</div>':'')+'<div class="h-display h2">'+title+'</div><div class="h-display" style="font-size:56px;line-height:1;color:var(--green-l)">'+big+'</div><div class="small muted">'+sub+'</div>'+
    (res?'<div class="row" style="justify-content:center;gap:8px"><span class="chip chip-xp">+'+res.xp+' XP</span><span class="chip chip-gem">'+FK.gemIc(12)+'+'+res.gems+'</span></div>'+FK.doubleBtn(res):'')+
    '<button class="btn btn-primary" data-again>'+FK.ic("replay",22,2.4)+t("again")+' <span class="en-cost">⚡1</span></button><div class="grid2"><button class="btn btn-ghost" data-esh>'+FK.ic("share",18)+t("share")+'</button><button class="btn btn-ghost" data-exit>'+t("exitGame")+'</button></div></div>';
}
function afterRes(res){ let d=500; res.ach.forEach(a=>{ setTimeout(()=>FK.toast(t("achUnlocked")+" <b>"+t("ach_"+a.id)+"</b>","trophy",3000),d); d+=1200; });
  res.missions.forEach(m=>FK.toast(t("missionDone",{m:FK.missionText(m)}),"check")); if(res.levelUp) setTimeout(()=>FK.levelUpModal(res.levelUp),d+300); }

/* ---------------- 3) HANGİSİ DAHA FAZLA ---------------- */
const CATS=["intl","wcGoals","ballon","uclP","uclC","wc"];
function morePair(last){
  for(let k=0;k<50;k++){
    const cat=CATS[Math.floor(Math.random()*CATS.length)], L=FK_MORE[cat];
    const a=L[Math.floor(Math.random()*L.length)], b=L[Math.floor(Math.random()*L.length)];
    if(a===b || a[2]===b[2]) continue;
    const key=[a[0],b[0]].sort().join("|"); if(last.indexOf(key)>=0) continue;
    last.push(key); if(last.length>30) last.shift();
    return {cat,a,b};
  }
  return {cat:"wc",a:FK_MORE.wc[0],b:FK_MORE.wc[3]};
}
const moreName = (cat,it) => cat==="wc" ? FK.cName(it[1]) : it[0];
const moreIcon = (cat,it) => cat==="uclC" && it[3] && FK_GCLUBS[it[3]] ? FK.clubBadge(it[3],46) : '<span class="mflag">'+FK.flag(it[1])+'</span>';
FK.screens.more = el => {
  const s=FK.state, QT=8000; let streak=0, q=null, locked=false, over=false, res=null, record=false, tmr=null, t0=0;
  const last=(s.moreLast=s.moreLast||[]);
  const best=()=>((s.stats.byMode.more||{}).best||0);
  const next=()=>{ q=morePair(last); locked=false; draw(); t0=Date.now(); tick(); };
  const tick=()=>{ clearTimeout(tmr); const bar=el.querySelector("[data-ring]"); if(!bar) return;
    const left=Math.max(0,QT-(Date.now()-t0)); bar.style.strokeDashoffset=String(201*(1-Math.min(1,left/QT))); bar.classList.toggle("warn",left<3000);
    if(left<=0){ pick(-1); return; } tmr=setTimeout(tick,100); };
  const pick=side=>{
    if(locked||over) return; locked=true; clearTimeout(tmr);
    const win = q.a[2]>q.b[2] ? 0 : 1, ok = side===win;
    el.querySelectorAll("[data-side]").forEach(b=>{ const i=+b.dataset.side; const it=i?q.b:q.a; b.classList.add(i===win?"win":"lose"); if(i===side) b.classList.add("picked");
      const v=b.querySelector("[data-val]"); let c=0; const target=it[2]; const st=Date.now(); const an=()=>{ const p=Math.min(1,(Date.now()-st)/450); c=Math.round(target*p); v.textContent=c; if(p<1) requestAnimationFrame(an); }; v.classList.add("show"); an(); });
    if(ok){ streak++; FK.sfx("ok"); FK.vib(25); setTimeout(next,1100); }
    else { FK.sfx("no"); FK.vib([60,40,60]); if(streak>=1 && (FK.inv("second")>0 || (!usedChance && streak>=3))){ setTimeout(offer,900); } else setTimeout(end,1300); }
  };
  let usedChance=false;
  const offer=()=>{ if(!el.isConnected) return; offerM(); };
  const offerM=()=>FK.modal('<div class="center stack" style="gap:12px"><div class="h-display h2">'+t("moreOver")+'</div><div class="h-display" style="font-size:48px;color:var(--green-l)">'+streak+'</div><button class="btn btn-primary" data-sb>❤️ '+t("b_second")+(FK.inv("second")>0?' ('+FK.inv("second")+')':' · '+FK.gemIc(16)+'60')+'</button>'+(!usedChance&&streak>=3?'<button class="btn btn-reward" data-sc>🎬 '+t("secondChance")+'</button>':'')+'<button class="btn btn-ghost" data-no>'+t("exitGame")+'</button></div>',w=>{ w.dataset.lock=1;
    const sc=w.querySelector("[data-sc]"); if(sc) sc.onclick=()=>{ FK.closeModal(); FK.rewarded("chance",ok=>{ usedChance=true; if(ok) next(); else end(); }); };
    w.querySelector("[data-sb]").onclick=()=>{ FK.closeModal(); FK.useBoost("second",()=>next(),()=>end()); };
    w.querySelector("[data-no]").onclick=()=>{ FK.closeModal(); end(); }; });
  const end=()=>{ if(!el.isConnected||over) return; over=true; record=streak>best() && best()>0;
    res=FK.finishGame({mode:"more",diff:0,correct:streak,total:streak+1,score:streak,bestStreak:streak,timeSum:0});
    draw(); if(record||streak>=10) FK.confetti(el); afterRes(res); };
  const bigIcon=(cat,it)=> cat==="uclC" && it[3] && FK_GCLUBS[it[3]] ? FK.clubBadge(it[3],74) : '<span class="mflag">'+FK.flag(it[1])+'</span>';
  const card=(i,it)=>'<button class="mcard mc2 c'+i+'" data-side="'+i+'"><div class="mc-ic">'+bigIcon(q.cat,it)+'</div><div class="mc-txt"><div class="mname" lang="en">'+FK.esc(moreName(q.cat,it))+'</div>'+(q.cat!=="wc"&&q.cat!=="uclC"?'<div class="small mc-sub">'+FK.esc(FK.cName(it[1]))+'</div>':'')+'</div><div class="mval"><b data-val>?</b><span>'+t("u_"+q.cat)+'</span></div></button>';
  const draw=()=>{
    el.innerHTML='<div class="game-head"><button class="icon-btn" data-quit aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><div class="h-display" style="font-size:22px">'+t("m_more")+'</div><div class="small muted" style="margin-top:3px">'+t("best",{s:FK.fmtNum(best())})+'</div></div><span class="pill fire'+(streak>=5?" hot":"")+'">'+FK.fireIc()+streak+'</span></div>'+
    '<div class="scroll mx" style="padding-top:8px">'+
     (over ? '<div class="stack" style="gap:14px">'+endCard(el,{title:t("moreOver"),big:streak,sub:t("moreRes",{n:streak}),res,record})+'</div>'
      : '<div class="more-q2"><span class="label">'+t("moreScore")+' '+streak+'</span><div class="h-display">'+t("q_"+q.cat)+'</div></div>'+
        '<div class="more-arena">'+card(0,q.a)+'<div class="vsb"><svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="32" class="vr0"/><circle cx="36" cy="36" r="32" class="vr1" data-ring stroke-dasharray="201" stroke-dashoffset="0"/></svg><b>VS</b></div>'+card(1,q.b)+'</div>'+
        FK.boostBar(["time","pass"]))+
    '</div>';
    el.querySelector("[data-quit]").onclick=()=>{ clearTimeout(tmr); FK.back(); };
    if(over){ el.querySelector("[data-again]").onclick=()=>{ FK.sfx("tap"); FK.useEnergy(()=>FK.go("more",{},{replace:true})); }; el.querySelector("[data-exit]").onclick=()=>FK.back(); el.querySelector("[data-esh]").onclick=()=>FK.shareCard({mode:"more",score:streak,big:streak,sub:t("moreRes",{n:streak}),pose:streak>=5?"sampiyon":"taraftar"}); return; }
    el.querySelectorAll("[data-side]").forEach(b=>b.onclick=()=>pick(+b.dataset.side));
    FK.bindBoosts(el,{ time:()=>{ if(locked) return; t0+=10000; tick(); }, pass:()=>{ if(locked) return; clearTimeout(tmr); next(); } });
  };
  FK.onLeave=()=>clearTimeout(tmr);
  next();
};

/* ---------------- 4) DOĞRU MU YANLIŞ MI ---------------- */
function rnd(a){ return a[Math.floor(Math.random()*a.length)]; }
let tfKind='wc';
function tfMake(){
  const truth=Math.random()<0.5, kind=rnd(["wc","nat","club","club","ucl","ballon","born","intl"]); tfKind=kind;
  const act=(window.FK_ACTIVE||[]), all=FK_GPLAYERS.filter(p=>p[6]<=2);
  if(kind==="wc"){ const w=rnd(FK_WC_WINNERS); let c=w[1]; if(!truth){ const others=[...new Set(FK_WC_WINNERS.map(x=>x[1]))].filter(x=>x!==w[1]); c=rnd(others); }
    return {txt:t("tf_wc",{y:w[0],c:FK.cName(c)}),ans:truth}; }
  if(kind==="nat"){ const p=rnd(all); let n=p[2]; if(!truth){ n=rnd([...new Set(all.map(x=>x[2]))].filter(x=>x!==p[2])); }
    return {txt:t("tf_nat",{p:p[0],a:FK.cAdj(n)}),ans:truth}; }
  if(kind==="club"){ const pool=FK_GPLAYERS.filter(p=>act.indexOf(p[0])>=0 && p[6]<=2); const p=rnd(pool); const cs=p[7].split(","), cur=cs[cs.length-1];
    let c=cur; if(!truth){ const big=["RMA","BAR","ATM","MCI","MUN","LIV","ARS","CHE","TOT","FCB","BVB","PSG","JUV","INT","MIL","NAP","GS","FB","BJK","TS","HIL","NAS","MIA"].filter(x=>x!==cur && cs.indexOf(x)<0); c=rnd(big); }
    return {txt:t("tf_club",{p:p[0],c:FK_GCLUBS[c][0]}),ans:truth}; }
  if(kind==="ucl"){ const c=rnd(FK_MORE.uclC); let n=c[2]; if(!truth) n=Math.max(0,n+rnd([-2,-1,1,2])); if(!truth&&n===c[2]) n=c[2]+1;
    return {txt:t("tf_ucl",{c:c[0],n}),ans:n===c[2]}; }
  if(kind==="ballon"){ const p=rnd(FK_MORE.ballon.filter(x=>x[2]>0)); let n=p[2]; if(!truth) n=Math.max(0,n+rnd([-1,1,2])); if(!truth&&n===p[2]) n=p[2]+1;
    return {txt:t("tf_ballon",{p:p[0],n}),ans:n===p[2]}; }
  if(kind==="intl"){ const p=rnd(FK_MORE.intl); let n=p[2]; if(!truth) n=p[2]+rnd([-9,-6,-4,4,6,9]); if(n<0) n=p[2]+5;
    return {txt:t("tf_intl",{p:p[0],n}),ans:n===p[2]}; }
  const p=rnd(all); let y=p[1]; if(!truth) y=p[1]+rnd([-3,-2,-1,1,2,3]);
  return {txt:t("tf_born",{p:p[0],y}),ans:y===p[1]};
}
FK.screens.tf = el => {
  const s=FK.state, DUR=60000; let st=null, cur=null, ok=0, bad=0, combo=0, score=0, over=false, res=null, record=false, tmr=null, seen=[], bestC=0;
  const best=()=>((s.stats.byMode.tf||{}).best||0);
  const mult=()=>Math.min(4,1+Math.floor(combo/4));
  const mk=()=>{ const q=tfMake(); q.kind=tfKind; return q; };
  const nextQ=()=>{ for(let k=0;k<20;k++){ const q=mk(); if(seen.indexOf(q.txt)<0){ seen.push(q.txt); if(seen.length>60) seen.shift(); return q; } } return mk(); };
  const answer=v=>{
    if(over||!cur) return; const right = v===cur.ans; const cardEl=el.querySelector("[data-card]");
    if(right){ ok++; combo++; bestC=Math.max(bestC,combo); score+=100*mult(); FK.sfx("ok"); FK.vib(20); }
    else { bad++; combo=0; FK.sfx("no"); FK.vib([50,30,50]); st-=FK.PEN*1000; FK.penFx(el); tick(); }
    if(cardEl){ cardEl.style.transform=""; cardEl.classList.add(right?"good":"bad", v?"fly-r":"fly-l"); const st=cardEl.querySelector(v?"[data-sy]":"[data-sn]"); if(st) st.style.opacity=1; }
    setTimeout(()=>{ cur=nextQ(); draw(); },260);
  };
  const tick=()=>{ clearTimeout(tmr); const left=Math.max(0,DUR-(Date.now()-st)); const b=el.querySelector("[data-tbar]"), n=el.querySelector("[data-left]");
    if(b){ b.style.width=(left/DUR*100)+"%"; b.classList.toggle("warn",left<10000); } if(n) n.textContent=Math.ceil(left/1000);
    if(left<=0){ end(); return; } tmr=setTimeout(tick,100); };
  const end=()=>{ over=true; clearTimeout(tmr); FK.sfx("whistleEnd"); record=score>best()&&best()>0;
    res=FK.finishGame({mode:"tf",diff:0,correct:ok,total:ok+bad,score,bestStreak:bestC,timeSum:0}); draw(); if(record) FK.confetti(el); afterRes(res); };
  const draw=()=>{
    el.innerHTML='<div class="game-head"><button class="icon-btn" data-quit aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><div class="h-display" style="font-size:22px">'+t("m_tf")+'</div><div class="small muted" style="margin-top:3px">'+t("best",{s:FK.fmtNum(best())})+'</div></div>'+(over?'':'<span class="pill tf-time">'+FK.ic("clock",14)+'<b data-left>60</b></span>')+'</div>'+
    '<div class="scroll tfx" style="padding-top:8px">'+
    (over ? '<div class="stack" style="gap:14px">'+endCard(el,{title:t("tfOver"),big:FK.fmtNum(score),sub:t("tfRes",{a:ok,b:bad}),res,record})+'</div>'
     : '<div class="tbar big"><i data-tbar></i></div>'+
       '<div class="row" style="justify-content:space-between;margin-top:10px"><span class="h-display tf-score">'+FK.fmtNum(score)+'</span><span class="combo m'+mult()+'">'+t("combo")+' x'+mult()+'</span></div>'+
       '<div class="tf-deck"><div class="tf-back b2"></div><div class="tf-back b1"></div>'+
        '<div class="tf-card cm'+mult()+'" data-card><span class="tf-stamp yes" data-sy>'+t("stampYes")+' ✓</span><span class="tf-stamp no" data-sn>'+t("stampNo")+' ✗</span>'+
         '<span class="tf-cat">'+({wc:"🏆",nat:"🌍",club:"🔁",ucl:"⭐",ballon:"🥇",intl:"⚽",born:"🎂"}[cur.kind]||"⚽")+' '+t("tc_"+cur.kind)+'</span><div class="tf-txt">'+FK.esc(cur.txt)+'</div>'+
         '<div class="tf-foot">'+(FK.kafa?FK.kafa("bilge",58):'')+'<div class="tf-hint">⟵ '+t("tfFalse")+' · '+t("tfTrue")+' ⟶</div></div></div></div>'+
       '<div class="tf-btns"><button class="tf-rb no" data-a="0" aria-label="'+t("tfFalse")+'">'+FK.ic("x",34,3)+'</button>'+FK.boostBar(["time"])+'<button class="tf-rb yes" data-a="1" aria-label="'+t("tfTrue")+'">'+FK.ic("check",34,3)+'</button></div>')+
    '</div>';
    el.querySelector("[data-quit]").onclick=()=>{ clearTimeout(tmr); FK.back(); };
    if(over){ el.querySelector("[data-again]").onclick=()=>{ FK.sfx("tap"); FK.useEnergy(()=>FK.go("tf",{},{replace:true})); }; el.querySelector("[data-exit]").onclick=()=>FK.back(); el.querySelector("[data-esh]").onclick=()=>FK.shareCard({mode:"tf",score,sub:t("tfRes",{a:ok,b:bad}),pose:ok>=10?"sampiyon":"taraftar"}); return; }
    el.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>answer(b.dataset.a==="1"));
    FK.bindBoosts(el,{ time:()=>{ st+=10000; tick(); } });
    const c=el.querySelector("[data-card]"); let x0=null;
    c.addEventListener("touchstart",e=>{ x0=e.touches[0].clientX; },{passive:true});
    const sy=c.querySelector("[data-sy]"), sn=c.querySelector("[data-sn]");
    c.addEventListener("touchmove",e=>{ if(x0==null) return; const dx=e.touches[0].clientX-x0; c.style.transition="none"; c.style.transform="translateX("+dx+"px) rotate("+(dx/18)+"deg)"; sy.style.opacity=Math.max(0,Math.min(1,dx/80)); sn.style.opacity=Math.max(0,Math.min(1,-dx/80)); c.classList.toggle("tint-y",dx>30); c.classList.toggle("tint-n",dx<-30); },{passive:true});
    c.addEventListener("touchend",e=>{ if(x0==null) return; const dx=(e.changedTouches[0].clientX-x0); x0=null; c.style.transition=""; if(Math.abs(dx)>70) answer(dx>0); else { c.style.transform=""; sy.style.opacity=0; sn.style.opacity=0; c.classList.remove("tint-y","tint-n"); } });
    tick();
  };
  FK.onLeave=()=>clearTimeout(tmr);
  cur=nextQ(); st=Date.now(); draw();
};

/* ---------------- kayıt ---------------- */
FK.MODES.more={ icon:"bolt", g:["#F43F5E","#BE123C"], fg:"#fff", diff:false, total:1 };
FK.MODES.tf={ icon:"check", g:["#0EA5E9","#0369A1"], fg:"#fff", diff:false, total:1 };
const _start=FK.startGame; FK.startGame=(mode,diff,practice)=>{ if(mode==="more"||mode==="tf"){ FK.go(mode,{},{replace:true}); return; } return _start(mode,diff,practice); };
})();
