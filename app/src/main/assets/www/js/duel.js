/* ==========================================================
   v1.0 — Düello: kodla arkadaşına meydan oku (Firestore fk_duels/{code})
   İki oyuncu aynı 10 soruyu çözer; aynı anda oynamak şart değil.
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, N=()=>window.FKAndroid;
Object.assign(FK_I18N.tr,{
  m_duel:"Düello", du_title:"DÜELLO", du_sub:"Arkadaşına kod gönder, aynı 10 soruda kim daha iyi görelim!", du_create:"Düello oluştur", du_join:"Katıl", du_codePh:"KOD GİR",
  du_login:"Düello için Google ile giriş yapmalısın. Böylece rakibin seni tanır ve skorun kaybolmaz.", du_mine:"Düellolarım", du_none:"Henüz düellon yok. İlkini başlat!",
  du_code:"Düello kodu", du_share:"Kodu paylaş", du_shareTxt:"⚔️ Futbol Kafası'nda sana meydan okuyorum!\nDüello kodu: {c}\nAna sayfa → Düello Başlat → kodu gir.\n#FutbolKafası", du_play:"Oyna",
  du_wait:"Rakibin henüz oynamadı", du_waitJoin:"Rakip bekleniyor… Kodu arkadaşına gönder", du_refresh:"Yenile", du_you:"Sen", du_opp:"Rakip", du_pending:"oynamadı", du_played:"oynadı · skor gizli", du_empty:"katılmadı",
  du_win:"KAZANDIN! 🏆", du_lose:"Bu sefer olmadı", du_draw:"BERABERE!", du_pts:"{s} puan · {c}/10 doğru", du_notFound:"Bu kodla düello bulunamadı", du_full:"Bu düello dolu", du_err:"Bağlantı sorunu. Tekrar dene.",
  du_reward:"Düello ödülü: +{g} elmas", duelQuit:"Düellodan çıkarsan şimdiye kadarki puanın sayılır. Çıkılsın mı?", du_st_play:"Sıra sende", du_st_wait:"Rakip bekleniyor", du_st_done:"Bitti", du_new:"Yeni düello", du_rules:"10 soru · Güçlendirici yok · Hızlı cevap daha çok puan"
});
Object.assign(FK_I18N.en,{
  m_duel:"Duel", du_title:"DUEL", du_sub:"Send a code to a friend and see who does better on the same 10 questions!", du_create:"Create duel", du_join:"Join", du_codePh:"ENTER CODE",
  du_login:"Sign in with Google to duel, so your opponent knows you and your score is safe.", du_mine:"My duels", du_none:"No duels yet. Start your first!",
  du_code:"Duel code", du_share:"Share code", du_shareTxt:"⚔️ I challenge you in Futbol Kafası!\nDuel code: {c}\nHome → Start Duel → enter the code.\n#FutbolKafası", du_play:"Play",
  du_wait:"Your opponent hasn't played yet", du_waitJoin:"Waiting for an opponent… Send the code to a friend", du_refresh:"Refresh", du_you:"You", du_opp:"Opponent", du_pending:"not played", du_played:"played · score hidden", du_empty:"not joined",
  du_win:"YOU WIN! 🏆", du_lose:"Not this time", du_draw:"DRAW!", du_pts:"{s} pts · {c}/10 correct", du_notFound:"No duel found with this code", du_full:"This duel is full", du_err:"Connection problem. Try again.",
  du_reward:"Duel reward: +{g} gems", duelQuit:"If you leave, your score so far counts. Leave?", du_st_play:"Your turn", du_st_wait:"Waiting for opponent", du_st_done:"Finished", du_new:"New duel", du_rules:"10 questions · No boosters · Faster answers score more"
});
FK.MODES.duel={ icon:"swords", g:["#8B5CF6","#4338CA"], fg:"#fff", diff:false, total:10 };
const AB="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode=()=>{ let c=""; for(let i=0;i<6;i++) c+=AB[Math.floor(Math.random()*AB.length)]; return c; };
const mine=()=>{ const s=FK.state; s.duels=s.duels||{}; return s.duels; };
const me=()=>{ const u=FK.user()||{}, P=FK.state.profile; return {uid:u.uid||"", name:P.name||"?", av:P.avatar||0}; };
const docs={}; let pend=null;   // pend: {type, code, cb}
const get=(code,type,cb)=>{ pend={type,code,cb}; try{ N().duelGet(code); }catch(e){ pend=null; FK.toast(t("du_err"),"info"); } };
const set=(code,obj,type,cb)=>{ pend={type,code,cb}; try{ N().duelSet(code,JSON.stringify(obj)); }catch(e){ pend=null; FK.toast(t("du_err"),"info"); } };

const _nat=window.fkNative;
window.fkNative=(ev,a,b)=>{
  if(ev==="duel"){ let doc=null; try{ doc=b?JSON.parse(b):null; }catch(e){} if(doc) docs[a]=doc; const p=pend; pend=null; if(p&&p.cb) p.cb(doc, b==="!"); return; }
  if(ev==="duelSet"){ const p=pend; pend=null; if(p&&p.cb) p.cb(b==="1"); return; }
  if(_nat) _nat(ev,a,b);
};

const create=(tries=0)=>{ const code=newCode(), m=me();
  set(code,{seed:code,a:m,b:null,at:Date.now()},"create",ok=>{
    if(!ok){ if(tries<2) create(tries+1); else FK.toast(t("du_err"),"info"); return; }
    docs[code]={seed:code,a:m,b:null}; mine()[code]={side:"a",at:Date.now()}; FK.save(); FK.go("duelres",{code}); }); };
const join=code=>{ code=(code||"").toUpperCase().replace(/[^A-Z0-9]/g,""); if(code.length!==6){ FK.toast(t("du_notFound"),"info"); return; }
  get(code,"join",(doc,err)=>{ const m=me();
    if(!doc){ FK.toast(t(err?"du_err":"du_notFound"),"info"); return; }
    if(doc.a&&doc.a.uid===m.uid){ mine()[code]=mine()[code]||{side:"a",at:Date.now()}; FK.save(); FK.go("duelres",{code}); return; }
    if(doc.b&&doc.b.uid===m.uid){ mine()[code]=mine()[code]||{side:"b",at:Date.now()}; FK.save(); FK.go("duelres",{code}); return; }
    if(doc.b){ FK.toast(t("du_full"),"info"); return; }
    set(code,{b:m},"joinSet",ok=>{ if(!ok){ FK.toast(t("du_err"),"info"); return; } doc.b=m; docs[code]=doc; mine()[code]={side:"b",at:Date.now()}; FK.save(); FK.go("duelres",{code}); }); }); };

FK.duelDone = g => { const {code,side}=g.duel, m=me();
  const r=Object.assign(m,{score:g.score,correct:g.correct,time:Math.round(g.timeSum||0),done:true});
  const rec=mine()[code]||(mine()[code]={side,at:Date.now()}); rec.done=true; rec.score=g.score; rec.correct=g.correct;
  try{ FK.finishGame({mode:"duel",diff:0,correct:g.correct,total:g.qs.length,score:g.score,bestStreak:g.bestStreak,timeSum:g.timeSum,extra:{}}); }catch(e){}
  if(docs[code]) docs[code][side]=r; FK.save();
  const o={}; o[side]=r; set(code,o,"submit",ok=>{ if(!ok){ rec.unsent=r; FK.save(); FK.toast(t("du_err"),"info"); } else { delete rec.unsent; FK.save(); } FK.render&&FK.render(); });
  FK.go("duelres",{code},{root:true}); };

/* ---------------- lobi ---------------- */
FK.screens.duel = el => {
  const u=FK.user(), list=Object.keys(mine()).map(c=>Object.assign({code:c},mine()[c])).sort((a,b)=>b.at-a.at).slice(0,8);
  el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:26px;margin:0">'+t("du_title")+'</h1></div><span class="pill">'+FK.gemIc()+FK.fmtNum(FK.state.gems)+'</span></div>'+
  '<div class="scroll"><div class="stack" style="gap:14px">'+
   '<div class="du-hero"><div class="rays2" style="opacity:.3"></div><div class="du-vs">'+FK.kafa("kaptan",96,"bob")+'<span class="du-sw">'+FK.ic("swords",40,2)+'</span><div style="transform:scaleX(-1)">'+FK.kafa("atesli",96,"bob")+'</div></div><div class="small" style="position:relative;font-weight:700;line-height:1.4">'+t("du_sub")+'</div><div class="small" style="position:relative;opacity:.8;margin-top:6px">'+t("du_rules")+'</div></div>'+
   (!u ? '<div class="card center stack" style="gap:12px"><div class="small muted" style="line-height:1.5">'+t("du_login")+'</div><button class="btn btn-white" data-login style="color:#1E3A8A">'+t("acc_signin")+'</button></div>'
       : '<button class="ol-card" data-quick><div class="rays2" style="opacity:.25"></div><span class="chip ol-live">● '+t("ol_live")+'</span><div class="row" style="gap:12px;position:relative"><span style="font-size:42px">⚡</span><div class="grow" style="text-align:left"><div class="h-display" style="font-size:28px">'+t("ol_quick")+'</div><div class="small" style="opacity:.9">'+t("ol_quickS")+'</div></div><span class="ol-en">⚡1</span></div><div class="ol-cupb">🏆 '+t("ol_cup",{n:(FK.state.ol||{}).cup||0})+' · '+t("ol_lg"+FK.olLeague((FK.state.ol||{}).cup||0))+' · '+t("ol_stats",{w:(FK.state.ol||{}).w||0,l:(FK.state.ol||{}).l||0})+'</div></button>'+
         '<button class="small" data-olr style="color:var(--muted);text-decoration:underline;background:none;border:0;margin-top:-6px">'+t("howTo")+'</button>'+
         '<button class="row card ch-mini" data-chain style="gap:12px;width:100%;text-align:left"><span style="font-size:30px">⛓️</span><div class="grow"><b style="font-size:16px">'+t("m_chain")+'</b><div class="small muted">'+t("m_chainS")+'</div></div><span class="chip chip-new">'+t("newTag")+'</span></button>'+
         '<div class="sec-title" style="margin-top:4px">'+t("ol_friend")+'</div>'+
         '<button class="btn btn-purple" data-create style="height:60px">'+FK.ic("swords",22,2.2)+t("du_create")+'</button>'+
         '<div class="du-join"><input class="input" data-code maxlength="6" placeholder="'+t("du_codePh")+'" autocapitalize="characters" autocomplete="off" spellcheck="false"><button class="btn btn-primary" data-join>'+t("du_join")+'</button></div>'+
         '<div class="sec-title" style="margin-top:6px">'+t("du_mine")+'</div>'+
         (list.length? list.map(d=>'<button class="du-row" data-open="'+d.code+'"><span class="du-c">'+d.code+'</span><span class="grow small muted" style="text-align:left">'+(d.result?t("du_st_done"):d.done?t("du_st_wait"):t("du_st_play"))+'</span>'+(d.done?'<b>'+FK.fmtNum(d.score||0)+'</b>':'<span class="chip chip-new">'+t("du_play")+'</span>')+(d.result==="w"?'<span>🏆</span>':'')+FK.ic("right",16)+'</button>').join("")
                      : '<div class="card center small muted">'+t("du_none")+'</div>'))+
  '</div></div>';
  el.querySelector("[data-back]").onclick=FK.back;
  const lg=el.querySelector("[data-login]"); if(lg) lg.onclick=()=>FK.signIn(()=>FK.render());
  const chb=el.querySelector("[data-chain]"); if(chb) chb.onclick=()=>{ FK.sfx("tap"); FK.go("chain"); };
  const qb=el.querySelector("[data-quick]"); if(qb) qb.onclick=()=>{ FK.sfx("tap"); FK.quickMatch(); };
  const orl=el.querySelector("[data-olr]"); if(orl) orl.onclick=()=>FK.modal('<div class="stack" style="gap:12px"><div style="display:flex;justify-content:center">'+FK.kafa("bilge",80,"bob")+'</div><div class="h-display h2 center">'+t("howTo")+'</div><div style="line-height:1.55;font-size:15px">'+t("ol_rules")+'</div><button class="btn btn-primary" data-ok>'+t("close")+'</button></div>',w=>w.querySelector("[data-ok]").onclick=FK.closeModal);
  const cr=el.querySelector("[data-create]"); if(cr) cr.onclick=()=>{ FK.sfx("tap"); create(); };
  const jb=el.querySelector("[data-join]"), ci=el.querySelector("[data-code]");
  if(jb){ jb.onclick=()=>join(ci.value); ci.oninput=()=>{ ci.value=ci.value.toUpperCase().replace(/[^A-Z0-9]/g,""); }; ci.onkeydown=e=>{ if(e.key==="Enter") join(ci.value); }; }
  el.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>FK.go("duelres",{code:b.dataset.open}));
};

/* ---------------- düello odası / sonuç ---------------- */
FK.screens.duelres = (el,{code}) => {
  const rec=mine()[code]||{side:"a"}, side=rec.side, other=side==="a"?"b":"a";
  FK.backHandler=()=>{ FK.stack=[{name:"home",params:{}}]; FK.go("duel"); return true; };
  const reward=doc=>{ const A=doc[side], B=doc[other]; if(!A||!B||!A.done||!B.done||rec.result) return;
    const w = A.score>B.score || (A.score===B.score && (A.time||0)<(B.time||0)), dr = A.score===B.score && (A.time||0)===(B.time||0);
    rec.result = dr?"d":w?"w":"l"; const g=dr?10:w?30:5; const s=FK.state; s.gems+=g; if(w) s.stats.duelWins=(s.stats.duelWins||0)+1; FK.save();
    FK.sfx(w?"win":"gem"); if(w) FK.confetti(el); setTimeout(()=>FK.toast(t("du_reward",{g}),"gem",3200),600); };
  const pl=(p,lbl,isMe,hide)=>'<div class="du-p'+(isMe?" me":"")+'">'+(p?FK.avatar(p.av||0,64,null,isMe?FK.frameOf():"none"):'<div class="av" style="width:64px;height:64px;background:var(--card2);color:var(--muted)">?</div>')+
    '<b>'+FK.esc(p?p.name:"—")+'</b><span class="small muted">'+lbl+'</span>'+
    (p&&p.done&&hide?'<div class="du-score q">✓</div><span class="small muted">'+t("du_played")+'</span>':p&&p.done?'<div class="h-display du-score">'+FK.fmtNum(p.score)+'</div><span class="small muted">'+p.correct+'/10</span>':'<div class="du-score q">?</div><span class="small muted">'+t(p?"du_pending":"du_empty")+'</span>')+'</div>';
  const draw=()=>{ const doc=docs[code]||{}, A=doc[side]||(rec.done?Object.assign(me(),{score:rec.score,correct:rec.correct,done:true}):me()), B=doc[other];
    const both=A&&A.done&&B&&B.done; if(both) reward(doc);
    const res=rec.result;
    el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:26px;margin:0">'+t("du_title")+'</h1></div><button class="pill" data-ref>'+FK.ic("replay",14,2.4)+t("du_refresh")+'</button></div>'+
    '<div class="scroll"><div class="stack" style="gap:14px">'+
     (both ? '<div class="du-banner '+res+'">'+FK.kafa(res==="w"?"sampiyon":res==="d"?"taraftar":"uzgun",110,"bob")+'<div class="h-display" style="font-size:34px">'+t(res==="w"?"du_win":res==="d"?"du_draw":"du_lose")+'</div></div>'
           : '<div class="du-codebox"><span class="label">'+t("du_code")+'</span><div class="du-code">'+code.split("").map(c=>'<i>'+c+'</i>').join("")+'</div><button class="btn btn-ghost btn-sm" data-share style="width:auto;padding:0 16px">'+FK.ic("share",16)+t("du_share")+'</button></div>')+
     '<div class="du-arena">'+pl(A,t("du_you"),true)+'<span class="du-mid">VS</span>'+pl(B,t("du_opp"),false,!A.done)+'</div>'+
     (!A.done ? '<button class="btn btn-primary" data-play style="height:62px">'+FK.ic("ball",24,2.2)+t("du_play")+'</button><div class="small muted center">'+t("du_rules")+'</div>'
      : !both ? '<div class="card center stack" style="gap:8px">'+FK.kafa("bilge",70,"bob").replace('<svg','<svg style="margin:0 auto"')+'<b>'+t(B?"du_wait":"du_waitJoin")+'</b></div>'
      : '<button class="btn btn-purple" data-new>'+FK.ic("swords",20,2.2)+t("du_new")+'</button>')+
    '</div></div>';
    el.querySelector("[data-back]").onclick=()=>FK.backHandler();
    el.querySelector("[data-ref]").onclick=()=>load(true);
    const sh=el.querySelector("[data-share]"); if(sh) sh.onclick=()=>FK.shareCard({mode:"duel",code,pose:"atesli",text:t("du_shareTxt",{c:code})});
    const pb=el.querySelector("[data-play]"); if(pb) pb.onclick=()=>{ FK.sfx("tap"); FK.duelGame(code,side); };
    const nb=el.querySelector("[data-new]"); if(nb) nb.onclick=()=>FK.backHandler();
  };
  const load=show=>{ if(!N()||!N().duelGet) return; get(code,"view",(doc,err)=>{ if(!el.isConnected) return; if(err&&show) FK.toast(t("du_err"),"info");
    if(doc && rec.unsent && !(doc[side]&&doc[side].done)){ const o={}; o[side]=rec.unsent; doc[side]=rec.unsent; set(code,o,"resend",ok=>{ if(ok){ delete rec.unsent; FK.save(); } }); }
    draw(); }); };
  draw(); load(false);
};
})();
