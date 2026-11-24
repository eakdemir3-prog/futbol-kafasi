/* ==========================================================
   v1.5 — TRANSFER ROTASI (Kariyer Yolu'nun yerine) ve KADROYU TAMAMLA
   Transfer Rotası: kulüpler sırayla (yıllarıyla) gösterilir, futbolcu 4 şıktan bulunur.
   Kadroyu Tamamla: bir kulübün güncel kadrosundan 4-3-3 dizilir, eksik oyuncu 3 şıktan bulunur.
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t;
Object.assign(FK_I18N.tr,{
  m_career:"Transfer Rotası", m_careerS:"Kulüplerden futbolcuyu bul", rt_ask:"Bu futbolcu kim?",
  m_kadro:"Kadroyu Tamamla", m_kadroS:"Sahadaki eksik oyuncuyu bul", kd_ask:"{c} · eksik {p} kim?", kd_sub:"Güncel kadrodan 11 · 4-3-3",
  rules_career:"Transfer Rotası: Bir futbolcunun kulüpleri oynadığı sırayla (yıllarıyla) gösterilir. Bu rotayı izleyen futbolcuyu 4 şıktan bul. İleri bölümlerde bazı kulüpler ? ile gizlenir.",
  rules_kadro:"Kadroyu Tamamla: Bir kulübün güncel kadrosundan 4-3-3 diziliş sahada. Bir mevki ? ile boş. Eksik oyuncuyu 3 şıktan bul. KL: kaleci, DF: defans, OS: orta saha, FV: forvet.",
  mi_career:"Transfer Rotası'nda {n} futbolcu bul", ach_career:"Rota Uzmanı", ach_careerD:"Transfer Rotası'nda 5 futbolcu bul",
  kdp_GK:"kaleci", kdp_DF:"defans oyuncusu", kdp_MF:"orta saha", kdp_FW:"forvet", kdl_GK:"KL", kdl_DF:"DF", kdl_MF:"OS", kdl_FW:"FV"
});
Object.assign(FK_I18N.en,{
  m_career:"Transfer Route", m_careerS:"Find the player from his clubs", rt_ask:"Who is this player?",
  m_kadro:"Complete the Squad", m_kadroS:"Find the missing player on the pitch", kd_ask:"{c} · who is the missing {p}?", kd_sub:"Current squad XI · 4-3-3",
  rules_career:"Transfer Route: a player's clubs are shown in the order he played for them (with years). Find the player from 4 options. In later levels some clubs are hidden with ?.",
  rules_kadro:"Complete the Squad: a club's current squad in a 4-3-3 on the pitch. One spot is empty. Find the missing player from 3 options. GK: goalkeeper, DF: defender, MF: midfielder, FW: forward.",
  mi_career:"Find {n} players in Transfer Route", ach_career:"Route Expert", ach_careerD:"Find 5 players in Transfer Route",
  kdp_GK:"goalkeeper", kdp_DF:"defender", kdp_MF:"midfielder", kdp_FW:"forward", kdl_GK:"GK", kdl_DF:"DF", kdl_MF:"MF", kdl_FW:"FW"
});
if(FK.MODES.career) FK.MODES.career.total=10;
FK.MODES.kadro={ icon:"grid", g:["#16A34A","#14532D"], fg:"#fff", diff:false, total:10 };
if(FK.LV){ FK.LV.kadro={ N:200, per:40, open:200, pass:[5,7,9] }; }
const lamps='<div class="spot l"></div><div class="spot r"></div><div class="lamps"><i></i><i></i><i></i><i></i><i></i><i></i></div>';
const arrow='<svg class="rt-arr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FACC15" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';

/* ---------- TRANSFER ROTASI ---------- */
FK.routeStage = (q,timer) => { const n=q.clubs.length, sz=n<=3?56:n<=4?46:n<=5?40:34;
  return '<div class="stage stadium rt-stage">'+lamps+'<div class="rt-row">'+q.clubs.map((c,i)=>(i?arrow:'')+'<div class="rt-c">'+(q.hide&&q.hide[i]?'<span class="cbadge rt-q" style="width:'+sz+'px;height:'+sz+'px">?</span>':FK.clubBadge(c,sz))+(q.years&&q.years[i]?'<span class="rt-y">'+q.years[i]+'</span>':'')+'</div>').join("")+'</div>'+
    timer+'<div class="rt-ask">'+t("rt_ask")+'</div></div>'; };
/* yıllar: FK_CYEARS[ad] = ["2015–2017", …] (kulüp sırasıyla, tekrarsız) */
FK.buildRoute = (pool,x,count,seedKey) => {
  const all=FK.gpx(), byClub={}; all.forEach(p=>p.clubs.forEach(c=>(byClub[c]=byClub[c]||[]).push(p)));
  const Y=window.FK_CYEARS||{};
  return FK.pickBy("career",pool,x,count,c=>c.name).map(c=>{
    const p=all.find(z=>z.name===c.name)||{clubs:[]};
    const seq=p.clubs.filter((cc,i)=>i===0||cc!==p.clubs[i-1]).slice(-7);
    const yrs=(Y[c.name]||[]).slice(-seq.length);
    const nh = x<.3?0 : x<.6?1 : 2, hide={};
    if(nh&&seq.length>=4){ const mids=FK.shuffle(seq.map((_,i)=>i).slice(1,-1)).slice(0,Math.min(nh,seq.length-3)); mids.forEach(i=>hide[i]=1); }
    /* yanlış şıklar: aynı kulüplerde oynamış, benzer dönem/ün */
    const near={}; seq.forEach(cc=>(byClub[cc]||[]).forEach(o=>{ if(o.name!==c.name) near[o.name]=o; }));
    const sp=o=>(o.pos==="GK")===(p.pos==="GK");
    let cand=Object.values(near).filter(o=>sp(o)&&Math.abs((o.by||0)-(p.by||0))<=8&&Math.abs((o.fame||2)-(p.fame||2))<=1);
    const c1=cand.filter(o=>o.pos===p.pos); if(c1.length>=3) cand=c1;
    if(cand.length<3) cand=cand.concat(FK.shuffle(all.filter(o=>o.name!==c.name&&o.pos===p.pos&&Math.abs((o.by||0)-(p.by||0))<=6&&Math.abs(o.sc-p.sc)<.3)));
    const wrong=[]; FK.shuffle(cand).forEach(o=>{ if(wrong.length<3&&wrong.indexOf(o.name)<0) wrong.push(o.name); });
    return { answer:c.name, clubs:seq, years:yrs.length===seq.length?yrs:null, hide, opts:FK.shuffle([c.name].concat(wrong)) };
  }).filter(q=>q.clubs.length>=2&&q.opts.length===4);
};

/* ---------- KADROYU TAMAMLA ---------- */
const POS=[["GK",50,87],["DF",12,66],["DF",37,70],["DF",63,70],["DF",88,66],["MF",24,44],["MF",50,51],["MF",76,44],["FW",16,17],["FW",50,12],["FW",84,17]];
let _kd=null;
FK.kadroPool = () => { if(_kd) return _kd; const S=window.FK_SQUADS||{}, gp={}; FK.gpx().forEach(p=>gp[p.name]=p);
  const cp={}; FK.clubPool().forEach(c=>cp[c.code]=c);
  _kd=Object.keys(S).filter(c=>FK_GCLUBS[c]).map(code=>{ const L=S[code].map(([n,pos],i)=>({n,pos,sc:gp[n]?gp[n].sc:1+i*.01}));
    const by=k=>L.filter(p=>p.pos===k).sort((a,b)=>a.sc-b.sc);
    /* Wikipedia kanatları çoğu zaman OS yazar: OS+FV içinden en bilinen 6 kişi; FV etiketliler öne, kalan forvet yerleri kanat OS'lerle dolar */
    const xi={GK:L.filter(p=>p.pos==="GK").slice(0,1),DF:by("DF").slice(0,4)}, att=L.filter(p=>p.pos==="MF"||p.pos==="FW").sort((a,b)=>a.sc-b.sc).slice(0,6);
    if(xi.GK.length<1||xi.DF.length<4||att.length<6) return null;
    const fw=att.filter(p=>p.pos==="FW").slice(0,3); att.filter(p=>p.pos==="MF"&&fw.length<3&&fw.indexOf(p)<0).slice(0,3-fw.length).forEach(p=>fw.push(p));
    xi.FW=fw; xi.MF=att.filter(p=>fw.indexOf(p)<0);
    const c=cp[code]; return {code,name:FK_GCLUBS[code][0],lg:FK_GCLUBS[code][2],xi,sc:c?c.sc:.7}; }).filter(Boolean);
  return _kd; };
const COMMON=new Set(["Silva","Santos","Martínez","Fernández","Fernandes","García","González","Rodríguez","López","Pérez","Gómez","Sánchez","Díaz","Hernández","Costa","Souza","Pereira","Oliveira","Alves","Gomes","Ramos","Lopes","Yılmaz","Kim","Lee","Park","Mendy","Diallo","Traoré","Koné","Touré","Diop","Camara","Sow","Jones","Williams","Johnson","Martin","Thomas","Fofana","Cissé","Doumbia","Mendes","Ndiaye"]);
const shortNm=n=>{ const w=n.split(" "); if(w.length===1) return n; let last=w[w.length-1];
  if(/^(Júnior|Junior|Jr\.?|Neto|Filho)$/.test(last)) return w[0];
  if(last.length<=3&&w.length>2) return w.slice(-2).join(" ");
  if(COMMON.has(last)) return w[0][0]+". "+last;
  return last; };
FK.buildKadro = (x,count,seed) => { const P=FK.kadroPool(), r=FK.rng(seed);
  const pool=P.slice().sort((a,b)=>Math.abs(a.sc-x*.8)-Math.abs(b.sc-x*.8)).slice(0,x<.25?24:50);
  const out=[]; let guard=0, usedC={};
  while(out.length<count&&guard++<200){ const c=pool[Math.floor(r()*pool.length)]; if(usedC[c.code]&&guard<100) continue; usedC[c.code]=1;
    const slots=[]; const cnt={GK:0,DF:0,MF:0,FW:0}; POS.forEach(([k,xx,yy])=>{ const p=c.xi[k][cnt[k]++]; slots.push({k,x:xx,y:yy,n:p.n,sc:p.sc}); });
    /* eksik oyuncu: kolayda en bilinenlerden, zorda rastgele (kaleci hariç) */
    const cand=slots.map((s,i)=>i).filter(i=>slots[i].k!=="GK"); cand.sort((a,b)=>slots[a].sc-slots[b].sc);
    const mi=x<.35?cand[Math.floor(r()*Math.min(4,cand.length))]:cand[Math.floor(r()*cand.length)], miss=slots[mi];
    const others=[]; P.forEach(o=>{ if(o.code===c.code) return; if(x>=.35&&o.lg!==c.lg) return; (o.xi[miss.k]||[]).forEach(pp=>{ if(Math.abs(pp.sc-miss.sc)<.45) others.push(pp.n); }); });
    const wrong=[]; FK.shuffle(others.length>=2?others:P.flatMap(o=>(o.xi[miss.k]||[]).map(pp=>pp.n)),r).forEach(n=>{ if(wrong.length<2&&n!==miss.n&&wrong.indexOf(n)<0&&!slots.some(s=>s.n===n)) wrong.push(n); });
    if(wrong.length<2) continue;
    out.push({ answer:miss.n, club:c.code, clubName:c.name, pos:miss.k, slots, miss:mi, opts:FK.shuffle([miss.n].concat(wrong),r) }); }
  return out; };
const shirt=(c1,c2,no)=>'<svg width="34" height="34" viewBox="0 0 40 40"><path d="M12 4 L6 7 L2 15 L8 18 L10 16 V36 H30 V16 L32 18 L38 15 L34 7 L28 4 C26 8 14 8 12 4Z" fill="'+c1+'" stroke="#0A0B26" stroke-width="1.6"/><path d="M20 7 V36" stroke="'+c2+'" stroke-width="6"/></svg>';
FK.kadroStage = (q,timer) => { const C=FK_GCLUBS[q.club]||["","","","#DC2626","#FACC15"];
  return '<div class="stage kd-pitch"><span class="kd-433">4-3-3</span><div class="kd-l mid"></div><div class="kd-l circ"></div><div class="kd-l box b"></div><div class="kd-l box t"></div>'+
    q.slots.map((s,i)=>'<div class="kd-p'+(i===q.miss?' miss':'')+'" data-slot="'+i+'" style="left:'+s.x+'%;top:'+s.y+'%">'+(i===q.miss?'<div class="kd-q">?</div>':shirt("#FFF1D6","#B79DFF"))+'<span class="kd-pos">'+t("kdl_"+s.k)+'</span><span class="kd-nm">'+(i===q.miss?'?':FK.esc(shortNm(s.n)))+'</span></div>').join("")+timer+'</div>'; };
FK.kadroReveal = (el,q) => { const d=el.querySelector('[data-slot="'+q.miss+'"]'); if(!d) return; const C=FK_GCLUBS[q.club]||["","","","#DC2626","#FACC15"];
  d.classList.remove("miss"); d.classList.add("got"); d.innerHTML=shirt("#FFF1D6","#B79DFF")+'<span class="kd-pos">'+t("kdl_"+q.pos)+'</span><span class="kd-nm">'+FK.esc(shortNm(q.answer))+'</span>'; };
})();
