/* ==========================================================
   v1.6 — taslak ekranlar: portre avatarlar, 4 sekmeli alt menü, hoş geldin,
   kurulum adımları, yardım, enerji, duraklatma, seviye tamamlandı, düello, arkadaşlar.
   Oyun kuralları ve kayıtlı veriler değişmez; çoğu ekran mevcut işleyişin üstüne giydirilir.
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, S=FK.screens, IMG=n=>'<img class="v6i" src="img/'+n+'.webp" alt="" draggable="false">';
Object.assign(FK_I18N.tr,{ nv_home:"Ana Sayfa", nv_duel:"Düello", nv_friends:"Arkadaşlar", nv_ch:"Mücadele", v6_hi:"HOŞ GELDİN!", v6_hiS:"Türkiye'nin futbol bilgi yarışması!", v6_guest:"Misafir Oyna", v6_google:"Google ile Devam Et",
  v6_s0:"KULLANICI ADI", v6_s1:"AVATAR SEÇ", v6_s2:"ÜLKE SEÇ", v6_s3:"FAVORİ TAKIM", v6_create:"Hesabı Oluştur", v6_next:"Devam Et",
  v6_help:"YARDIM", v6_how:"Nasıl Oynanır?", v6_h1:"1. SORUYU OKU", v6_h1s:"Futbol bilgini kullan.", v6_h2:"2. CEVABI SEÇ", v6_h2s:"Doğru seçeneğe dokun.", v6_h3:"3. İLERLE", v6_h3s:"Doğru cevapla seviyeyi geç, ödülleri kap!", v6_faq:"SIK SORULAN SORULAR",
  v6_en:"ENERJİ", v6_enS:"Soru çözmek için enerjiye ihtiyacın var.", v6_enR:"Enerji Yenileniyor", v6_enR2:"1 enerjiye kalan süre", v6_enFull:"Enerjin dolu!", v6_enBuy:"ENERJİ AL", v6_free:"ÜCRETSİZ İZLE",
  v6_pause:"OYUN DURAKLATILDI", v6_cont:"DEVAM ET", v6_quit:"OYUNDAN ÇIK", v6_lvDone:"SEVİYE TAMAMLANDI!", v6_lvFail:"TEKRAR DENE!", v6_ok:"Doğru", v6_no:"Yanlış", v6_nextLv:"SONRAKİ SEVİYE", v6_map:"HARİTAYA DÖN",
  v6_duel:"ONLINE DÜELLO", v6_duelS:"Gerçek rakiplerle futbol bilgini yarıştır!", v6_find:"RAKİP BUL", v6_room:"ODA KUR", v6_joinR:"ODAYA KATIL", v6_search:"RAKİP ARANIYOR", v6_searchS:"Sana uygun bir rakip buluyoruz...", v6_cancel:"İPTAL ET",
  v6_fr:"ARKADAŞLAR", v6_rank:"Sıralama", v6_mine:"Kodlu düellolarım", v6_ach:"BAŞARIMLAR" });
Object.assign(FK_I18N.en,{ nv_home:"Home", nv_duel:"Duel", nv_friends:"Friends", nv_ch:"Challenge", v6_hi:"WELCOME!", v6_hiS:"The football knowledge quiz!", v6_guest:"Play as guest", v6_google:"Continue with Google",
  v6_s0:"USERNAME", v6_s1:"PICK AVATAR", v6_s2:"PICK COUNTRY", v6_s3:"FAVOURITE TEAM", v6_create:"Create account", v6_next:"Continue",
  v6_help:"HELP", v6_how:"How to play?", v6_h1:"1. READ THE QUESTION", v6_h1s:"Use your football knowledge.", v6_h2:"2. PICK THE ANSWER", v6_h2s:"Tap the right option.", v6_h3:"3. MOVE ON", v6_h3s:"Answer right, pass levels, grab rewards!", v6_faq:"FAQ",
  v6_en:"ENERGY", v6_enS:"You need energy to play.", v6_enR:"Energy refilling", v6_enR2:"time to next energy", v6_enFull:"Energy full!", v6_enBuy:"GET ENERGY", v6_free:"WATCH FREE",
  v6_pause:"GAME PAUSED", v6_cont:"CONTINUE", v6_quit:"QUIT GAME", v6_lvDone:"LEVEL COMPLETE!", v6_lvFail:"TRY AGAIN!", v6_ok:"Correct", v6_no:"Wrong", v6_nextLv:"NEXT LEVEL", v6_map:"BACK TO MAP",
  v6_duel:"ONLINE DUEL", v6_duelS:"Test your football knowledge against real rivals!", v6_find:"FIND RIVAL", v6_room:"CREATE ROOM", v6_joinR:"JOIN ROOM", v6_search:"SEARCHING", v6_searchS:"Finding a rival for you...", v6_cancel:"CANCEL",
  v6_fr:"FRIENDS", v6_rank:"Leaderboard", v6_mine:"My code duels", v6_ach:"ACHIEVEMENTS" });
const rib=(txt,c,fs)=>'<div class="v6-rib" style="--rc:'+(c||"#C6FF3D")+(fs?';--fs:'+fs+'px':'')+'"><span>'+txt+'</span></div>';
FK.v6rib=rib;

/* ---------- portre avatarlar (ilk 6 ücretsiz, diğerleri mağazada) ---------- */
FK.PORT_START=FK.AVATARS.length;
const PG=[["#C6FF3D","#84CC16"],["#FF7D72","#E11D48"],["#FFD23F","#F59E0B"],["#B79DFF","#7C3AED"],["#5CD0F5","#0EA5E9"],["#5FE3CF","#14B8A6"]];
for(let i=1;i<=12;i++) FK.AVATARS.push(i<=6?{p:"av"+(i<10?"0":"")+i,g:PG[(i-1)%6],lv:1}:{p:"av"+(i<10?"0":"")+i,g:PG[(i-1)%6],cost:100+i*20});
const _av=FK.avatar;
FK.avatar=(idx,size=44,ring=null,frame)=>{ const a=FK.AVATARS[idx];
  if(!a||!a.p) return _av(idx,size,ring,frame);
  const inner='<div class="av pav" style="width:'+size+'px;height:'+size+'px;background:linear-gradient(145deg,'+a.g[0]+','+a.g[1]+')"><img src="img/'+a.p+'.webp" alt="" draggable="false"></div>';
  let h=ring===null?inner:'<div class="av-ring" style="background:conic-gradient(var(--green) 0 '+ring+'%, #233556 '+ring+'% 100%)">'+inner+'</div>';
  const fr=frame!==undefined?frame:(ring!==null&&FK.frameOf?FK.frameOf():"none"); if(fr&&fr!=="none") h='<div class="fr fr-'+fr+'" style="--fs:'+size+'px">'+h+'</div>';
  return h; };

const SW='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 4l9 9M20 4l-9 9M7 13l-3 3 4 4 3-3M17 13l3 3-4 4-3-3"/></svg>';
/* ---------- hoş geldin ---------- */
S.welcome=el=>{ el.classList.add("welcome","v6w");
  el.innerHTML='<div class="topbar" style="justify-content:flex-end"><div class="seg" style="grid-template-columns:1fr 1fr;width:110px"><button data-l="tr" class="'+(FK.lang()==="tr"?"on":"")+'">TR</button><button data-l="en" class="'+(FK.lang()==="en"?"on":"")+'">EN</button></div></div>'+
   '<div class="scroll v6w-c">'+IMG("logo").replace('class="v6i"','class="v6i v6w-logo"')+IMG("hero_welcome").replace('class="v6i"','class="v6i v6w-hero"')+rib(t("v6_hi"),"#FF7D72",40)+'<p class="v6w-s">'+t("v6_hiS")+'</p></div>'+
   '<div class="v6w-b"><button class="btn btn-ghost v6g" data-g><span class="gG">G</span>'+t("v6_google")+'</button><button class="btn btn-primary" data-guest>'+FK.ic("user",20,2.4)+t("v6_guest")+'</button><p class="center small muted" style="margin:2px 0 0;line-height:1.45">'+t("guestNote")+'</p></div>';
  el.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{ FK.state.profile.lang=b.dataset.l; FK.save(); FK.render(); });
  el.querySelector("[data-g]").onclick=()=>{ FK.sfx("tap"); FK.signIn(); };
  el.querySelector("[data-guest]").onclick=()=>{ FK.sfx("tap"); FK.go("setup",{step:0}); }; };

/* ---------- kurulum: üst kısım, şeritler, avatarlar ---------- */
const _setup=S.setup; const SC=["#5CD0F5","#B79DFF","#FF8F3F","#5FE3CF"];
S.setup=(el,p)=>{ const P=FK.state.profile; if(p.step===1&&!p.edit&&(S.setup.draft||{}).avatar<FK.PORT_START&&!P.avPicked){ (S.setup.draft=S.setup.draft||{name:P.name,avatar:P.avatar,country:P.country,club:P.club}).avatar=FK.PORT_START; }
  const deco=()=>{ if(el.querySelector(".v6-steps")) return; const st=p.step;
    const tb=el.querySelector(".topbar"); if(tb){ const dots=tb.querySelector(".step-dots"); if(dots) dots.outerHTML='<div class="grow v6-sh">'+IMG("logo").replace('class="v6i"','class="v6i v6-mlogo"')+'</div><b class="v6-n">'+(st+1)+' / 4</b>'; const sp=tb.querySelector('div[style*="width:44px"]'); if(sp) sp.remove(); }
    tb&&tb.insertAdjacentHTML("afterend",'<div class="v6-steps">'+[0,1,2,3].map(i=>'<i class="'+(i<=st?"on":"")+'"></i>').join("<u class=\""+"\"></u>")+'</div>');
    const h=el.querySelector(".scroll h1.h2"); if(h){ h.outerHTML=rib(t("v6_s"+st),SC[st],34); }
    const sub=el.querySelector(".scroll > p.muted"); if(sub) sub.classList.add("v6-sub");
    if(st===0){ const f=el.querySelector(".field"); if(f) f.insertAdjacentHTML("afterend",'<div class="v6-ill">'+IMG("whistle")+'</div>'); }
    if(st===1){ el.querySelectorAll(".pick[data-a]").forEach(b=>{ const i=+b.dataset.a, a=FK.AVATARS[i]; if(!(a&&a.p&&!a.cost) && !(i===(S.setup.draft||{}).avatar)) b.remove(); });
      el.querySelectorAll(".pick[data-a]").forEach(b=>b.addEventListener("click",()=>{ FK.state.profile.avPicked=1; })); }
    const nb=el.querySelector("[data-next]"); if(nb){ nb.innerHTML=st===3?t("v6_create")+" ✓":t("v6_next")+" →"; } };
  _setup(el,p); deco();
  const mo=new MutationObserver(()=>{ if(!el.isConnected){ mo.disconnect(); return; } deco(); }); mo.observe(el,{childList:true}); };
S.setup.draft=null;

/* ---------- yardım: 3 adım ---------- */
const _help=S.help; if(_help) S.help=(el,p)=>{ _help(el,p);
  const hero=el.querySelector(".hp-hero"); if(hero) hero.outerHTML='<div class="v6-howt">'+t("v6_how")+'</div>'+
    [["whistle","#5CD0F5","v6_h1"],["ball_fly","#B79DFF","v6_h2"],["trophy","#FF7D72","v6_h3"]].map(([im,c,k])=>'<div class="v6-hs" style="background:'+c+'">'+IMG(im)+'<div><b>'+t(k)+'</b><span>'+t(k+"s")+'</span></div></div>').join("")+'<div class="v6-faq">'+t("v6_faq")+'</div>'; };

/* ---------- enerji ---------- */
const _em=FK.energyModal;
FK.energyModal=cb=>{ _em(cb); const w=document.querySelector(".modal-wrap:last-of-type"); if(!w) return; w.classList.add("v6-enw");
  const fix=()=>{ const b=w.querySelector(".en-body"); if(!b||b.dataset.v6) return; b.dataset.v6=1;
    const k=b.querySelector(":scope>div:first-child"); if(k) k.outerHTML=rib(t("v6_en"),"#C6FF3D",38)+'<p class="v6-sub">'+t("v6_enS")+'</p><div class="v6-ill">'+IMG("battery")+'</div>';
    const h=b.querySelector(".h-display.h2"); if(h) h.remove();
    const tm=b.querySelector("[data-en-m]"); const box=document.createElement("div"); box.className="v6-entm";
    box.innerHTML='<div>'+t("v6_enR")+'</div><b>⏱ <span data-en-m2>'+(tm?tm.textContent:"")+'</span></b><div class="small">'+t("v6_enR2")+'</div>';
    const nx=tm&&tm.closest(".small"); if(nx){ nx.replaceWith(box); } else { box.innerHTML='<b>'+t("v6_enFull")+'</b>'; const f=b.querySelector(".en-bar"); f&&f.after(box); }
    const ad=b.querySelector("[data-ad]"); if(ad) ad.insertAdjacentHTML("beforebegin",'<div class="v6-enbuy">'+t("v6_enBuy")+'</div>'); };
  fix(); new MutationObserver(()=>{ fix(); const a=w.querySelector("[data-en-m]"), c=w.querySelector("[data-en-m2]"); if(a&&c) c.textContent=a.textContent; }).observe(w,{childList:true,subtree:true,characterData:true}); };

/* ---------- duraklatma ---------- */
const _cf=FK.confirm;
FK.confirm=(msg,ok,onOk,danger)=>{ const q=[t("quitMid"),t("exitConfirm"),t("duelQuit"),t("ol_quit")];
  if(q.indexOf(msg)<0) return _cf(msg,ok,onOk,danger);
  FK.modal('<div class="v6-pause"><div class="v6-pt">'+t("v6_pause").replace(" ","<br>")+'</div>'+IMG("whistle")+'<p class="small" style="opacity:.85;margin:0 0 6px;line-height:1.45">'+msg+'</p><button class="btn btn-primary" data-c>▶ '+t("v6_cont")+'</button><button class="btn btn-ghost" data-o>⎋ '+t("v6_quit")+'</button></div>',w=>{ w.classList.add("v6-pw"); w.querySelector("[data-c]").onclick=FK.closeModal; w.querySelector("[data-o]").onclick=()=>{ FK.closeModal(); onOk(); }; }); };

/* ---------- sonuç: seviye tamamlandı ---------- */
const _res=S.result; S.result=(el,p)=>{ _res(el,p); const {g,res}=p; if(!res.lvl) return;
  const won=res.lvl.stars>0, total=g.qs.length;
  el.classList.add("v6-lv");
  const top='<div class="v6-lvtop">'+IMG(won?"trophy_laurel":"ball")+rib(won?t("v6_lvDone"):t("v6_lvFail"),won?"#C6FF3D":"#FF7D72",36)+'<div class="v6-st">'+[1,2,3].map(i=>'<i class="'+(i<=res.lvl.stars?"on":"")+'">★</i>').join("")+'</div>'+
    (won?'':'<div class="small" style="color:#FCA5A5;margin-top:2px">'+t("lvFail",{n:res.lvl.need})+'</div>')+
    '<div class="v6-okno"><span>✅ '+t("v6_ok")+': <b>'+g.correct+'</b></span><i></i><span>❌ '+t("v6_no")+': <b>'+(total-g.correct)+'</b></span></div></div>';
  const st=el.querySelector(".stack"); if(st){ ["res-mode","rs-rib"].forEach(c=>{ const x=st.querySelector("."+c); x&&x.remove(); }); const sh=st.querySelector(".lv-stars"); sh&&sh.closest(".center")&&sh.closest(".center").remove(); const kr=st.querySelector(".kafa-res,.kres"); kr&&kr.remove(); st.insertAdjacentHTML("afterbegin",top); const ra=st.querySelector(".rs-art"); ra&&ra.remove(); }
  const nl=el.querySelector("[data-nextlv]"); if(nl) nl.innerHTML='▶ '+t("v6_nextLv")+' <span class="en-cost">⚡1</span>';
  const mh=el.querySelector("[data-mh]"); if(mh) mh.innerHTML='📍 '+t("v6_map"); };

/* ---------- düello ana ekranı ---------- */
const _du=S.duel; S.duel=(el,p)=>{ _du(el,p); const sc=el.querySelector(".scroll .stack"); if(!sc) return;
  const hero=sc.querySelector(".du-hero"); if(hero) hero.outerHTML='<div class="v6-dh">'+IMG("hero_duel")+'<div class="v6-dht">'+rib(t("v6_duel").replace(" ","<br>"),"#C6FF3D",40)+'<p>'+t("v6_duelS")+'</p></div></div>';
  const q=sc.querySelector("[data-quick]"); if(q){ q.className="v6-bb lime"; q.innerHTML=SW+'<b>'+t("v6_find")+'</b><span>›</span>'; }
  const cr=sc.querySelector("[data-create]"); const jn=sc.querySelector(".du-join");
  if(cr&&q){ cr.className="v6-bb cyan"; cr.removeAttribute("style"); cr.innerHTML='<i class="v6-plus">+</i><b>'+t("v6_room")+'</b><span>›</span>'; q.after(cr);
    const jb=document.createElement("button"); jb.className="v6-bb lav"; jb.innerHTML=FK.ic("user",26,2.4)+'<b>'+t("v6_joinR")+'</b><span>›</span>'; cr.after(jb);
    if(jn){ jn.style.display="none"; jb.after(jn); jb.onclick=()=>{ FK.sfx("tap"); jn.style.display=jn.style.display==="none"?"":"none"; const i=jn.querySelector("input"); i&&i.focus(); }; } }
  sc.querySelectorAll(".sec-title").forEach(x=>{ if(x.textContent===t("ol_friend")) x.remove(); });
  const fr=sc.querySelector("[data-friends]"); fr&&fr.remove(); };

/* ---------- rakip aranıyor ---------- */
const _ow=S.olwait; S.olwait=(el,p)=>{ _ow(el,p); el.classList.add("v6-ow");
  const r=el.querySelector(".ol-radar"); if(r){ r.insertAdjacentHTML("beforebegin",rib(t("v6_search").replace(" ","<br>"),"#C6FF3D",40)+'<p class="v6-sub" style="margin-top:-4px">'+t("v6_searchS")+'</p>'); r.classList.add("v6-ring"); r.insertAdjacentHTML("afterbegin",IMG("search_ring")); }
  el.querySelectorAll(".ol-wait > .h-display:not(.ol-sec), .ol-wait > .small.muted").forEach(x=>x.remove());
  const s=el.querySelector("[data-sec]"); if(s){ s.classList.add("v6-cd"); }
  const x=el.querySelector("[data-x]"); if(x) x.textContent=t("v6_cancel"); };

/* ---------- arkadaşlar ---------- */
const _fr=S.friends; S.friends=(el,p)=>{ _fr(el,p); const sc=el.querySelector(".scroll .stack"); if(!sc) return;
  sc.insertAdjacentHTML("afterbegin",'<div class="v6-frh">'+IMG("handshake")+'</div>'); };

/* ---------- mücadele: sıralama kısayolu ---------- */
const _mi=S.missions; S.missions=(el,p)=>{ _mi(el,p); const deco=()=>{ const h=el.querySelector(".scroll .stack > .row"); if(h&&!h.querySelector("[data-rank]")){ h.insertAdjacentHTML("beforeend",'<button class="pill" data-rank style="margin-left:6px">🏆 '+t("v6_rank")+'</button>'); h.querySelector("[data-rank]").onclick=()=>{ FK.sfx("tap"); FK.go("rank"); }; } }; deco();
  new MutationObserver(()=>{ if(el.isConnected) deco(); }).observe(el,{childList:true}); };

/* ---------- ana sayfa: sağ üstte profil ---------- */
const _home=S.home; S.home=(el,p)=>{ _home(el,p); const g=el.querySelector(".hm-gear"); if(g){ g.innerHTML=FK.avatar(FK.state.profile.avatar,46,null,"none"); g.classList.add("v6-me"); } };
})();
