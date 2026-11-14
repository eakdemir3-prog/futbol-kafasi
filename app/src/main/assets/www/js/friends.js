/* ==========================================================
   v1.4 — Arkadaşlar
   Herkesin 6 haneli arkadaş kodu var (fk_codes/{KOD} → uid, ad, avatar).
   Kodla ya da online maç sonrası "Arkadaş ekle" ile eklenir. Arkadaşa maç daveti: fk_inv/{alıcıUid}
   ========================================================== */
(function(){
const FK=window.FK, t=FK.t, N=()=>window.FKAndroid;
Object.assign(FK_I18N.tr,{
  fr_title:"ARKADAŞLAR", fr_btn:"Arkadaşlar", fr_myCode:"Arkadaş kodun", fr_share:"Kodu paylaş", fr_copy:"Kopyala",
  fr_shareTxt:"⚽ Futbol Kafası'nda beni arkadaş ekle!\nArkadaş kodum: {c}\nProfil → Arkadaşlar → Kod ile ekle\n#FutbolKafası",
  fr_add:"Kod ile ekle", fr_addPh:"ARKADAŞ KODU", fr_addBtn:"Ekle", fr_list:"Arkadaşlarım ({n})", fr_empty:"Henüz arkadaşın yok. Kodunu paylaş ya da online maçtan sonra rakibini ekle!",
  fr_invQ:"Hızlı Maç", fr_invC:"Kulüp Zinciri", fr_added:"{n} arkadaş eklendi", fr_already:"{n} zaten arkadaşın", fr_notFound:"Bu kodla oyuncu bulunamadı", fr_self:"Bu senin kodun 🙂",
  fr_addOpp:"Arkadaş ekle", fr_isFriend:"Arkadaşın", fr_remove:"Arkadaşlıktan çıkar", fr_removeQ:"{n} arkadaş listenden çıkarılsın mı?", fr_login:"Arkadaş eklemek için Google ile giriş yapmalısın.",
  fr_invited:"Davet gönderildi, {n} bekleniyor…", fr_invGot:"{n} seni {m} maçına çağırıyor!", fr_accept:"Kabul et", fr_decline:"Şimdi değil", fr_invNo:"{n} daveti kabul etmedi", fr_lastSeen:"🏆 {c}"
});
Object.assign(FK_I18N.en,{
  fr_title:"FRIENDS", fr_btn:"Friends", fr_myCode:"Your friend code", fr_share:"Share code", fr_copy:"Copy",
  fr_shareTxt:"⚽ Add me as a friend in Futbol Kafası!\nMy friend code: {c}\nProfile → Friends → Add by code\n#FutbolKafası",
  fr_add:"Add by code", fr_addPh:"FRIEND CODE", fr_addBtn:"Add", fr_list:"My friends ({n})", fr_empty:"No friends yet. Share your code or add your opponent after an online match!",
  fr_invQ:"Quick Match", fr_invC:"Club Chain", fr_added:"{n} added as a friend", fr_already:"{n} is already your friend", fr_notFound:"No player found with this code", fr_self:"That's your own code 🙂",
  fr_addOpp:"Add friend", fr_isFriend:"Friends", fr_remove:"Remove friend", fr_removeQ:"Remove {n} from your friends?", fr_login:"Sign in with Google to add friends.",
  fr_invited:"Invite sent, waiting for {n}…", fr_invGot:"{n} is inviting you to a {m} match!", fr_accept:"Accept", fr_decline:"Not now", fr_invNo:"{n} didn't accept the invite", fr_lastSeen:"🏆 {c}"
});
const FL=()=>{ const s=FK.state; s.friends=s.friends||[]; return s.friends; };
FK.myCode = () => { const u=FK.user(); if(!u||!u.uid) return null; const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let h=2166136261;
  for(const ch of u.uid){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619)>>>0; } let c=""; for(let i=0;i<6;i++){ c+=A[h%32]; h=((Math.floor(h/32))^Math.imul(h,2654435761))>>>0; } return c; };
FK.isFriend = uid => FL().some(f=>f.uid===uid);
FK.addFriend = f => { if(!f||!f.uid) return false; const L=FL(); if(L.some(x=>x.uid===f.uid)){ FK.toast(t("fr_already",{n:f.name}),"info",2000); return false; }
  L.unshift({uid:f.uid,name:String(f.name||"?").slice(0,18),av:f.av||0,cup:f.cup||0,at:Date.now()}); FK.save(); FK.sfx("gem"); FK.toast(t("fr_added",{n:f.name}),"gem",2200); return true; };
FK.friendBtn = opp => opp&&opp.uid ? (FK.isFriend(opp.uid)?'<button class="btn btn-ghost" disabled>'+FK.ic("check",16,2.6)+t("fr_isFriend")+'</button>':'<button class="btn fr-addbtn" data-addfr>'+FK.ic("user",18,2.2)+'+ '+t("fr_addOpp")+'</button>') : '';
FK.bindFriendBtn = (el,opp) => { const b=el.querySelector("[data-addfr]"); if(b) b.onclick=()=>{ if(FK.addFriend(opp)){ b.outerHTML='<button class="btn btn-ghost" disabled>'+FK.ic("check",16,2.6)+t("fr_isFriend")+'</button>'; } }; };

FK.screens.friends = el => {
  const code=FK.myCode(), L=FL();
  el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:26px;margin:0">'+t("fr_title")+'</h1></div></div>'+
   '<div class="scroll"><div class="stack" style="gap:14px">'+
   '<div class="fr-code"><div class="rays2" style="opacity:.25"></div><span class="label" style="position:relative;color:#E0E7FF">'+t("fr_myCode")+'</span>'+
     (code?'<div class="du-code fr-c">'+code.split("").map(c=>'<i>'+c+'</i>').join("")+'</div><div class="row" style="gap:8px;position:relative"><button class="btn btn-sm fr-w" data-share>'+FK.ic("share",16)+t("fr_share")+'</button><button class="btn btn-sm fr-w2" data-copy>'+t("fr_copy")+'</button></div>'
       :'<div class="small" style="position:relative;margin:10px 0">'+t("fr_login")+'</div><button class="btn btn-sm fr-w" data-login style="position:relative">Google</button>')+'</div>'+
   '<div class="card"><div class="sec-title" style="margin-bottom:10px">'+t("fr_add")+'</div><div class="row" style="gap:8px"><input class="input du-in" data-code maxlength="6" placeholder="'+t("fr_addPh")+'" autocapitalize="characters" autocomplete="off"><button class="btn btn-green" data-add style="width:auto;padding:0 20px">'+t("fr_addBtn")+'</button></div></div>'+
   '<div class="sec-title">'+t("fr_list",{n:L.length})+'</div>'+
   (L.length?'<div class="stack" style="gap:10px">'+L.map((f,i)=>'<div class="fr-row">'+FK.avatar(f.av||0,46,null,"none")+'<div class="grow" style="min-width:0"><b class="ol-nm" style="font-size:15px">'+FK.esc(f.name)+'</b><span class="small muted">'+t("fr_lastSeen",{c:f.cup||0})+'</span></div>'+
      '<button class="fr-inv q" data-inv="'+i+'" data-m="quiz" aria-label="'+t("fr_invQ")+'">⚡</button><button class="fr-inv c" data-inv="'+i+'" data-m="chain" aria-label="'+t("fr_invC")+'">⛓️</button><button class="fr-x" data-rm="'+i+'">'+FK.ic("x",16,2.4)+'</button></div>').join("")+'</div>'
     :'<div class="card center small muted" style="line-height:1.5">'+FK.kafa("selam",70)+'<div>'+t("fr_empty")+'</div></div>')+
   '</div></div>';
  el.querySelector("[data-back]").onclick=()=>FK.back();
  const sh=el.querySelector("[data-share]"); if(sh) sh.onclick=()=>FK.share(t("fr_shareTxt",{c:code}));
  const cp=el.querySelector("[data-copy]"); if(cp) cp.onclick=()=>{ try{ navigator.clipboard.writeText(code); }catch(e){} FK.toast(t("shared"),"info",1500); };
  const lg=el.querySelector("[data-login]"); if(lg) lg.onclick=()=>FK.signIn(()=>FK.render&&FK.render());
  el.querySelector("[data-add]").onclick=()=>{ const v=(el.querySelector("[data-code]").value||"").toUpperCase().replace(/[^A-Z0-9]/g,"");
    if(!FK.user()){ FK.toast(t("fr_login"),"info",2600); return; } if(v.length!==6){ FK.toast(t("fr_notFound"),"info",2000); return; } if(v===code){ FK.toast(t("fr_self"),"info",2000); return; }
    FK.lookupCode(v,f=>{ if(!f){ FK.toast(t("fr_notFound"),"info",2200); return; } if(FK.addFriend(f)) FK.render(); }); };
  el.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{ const f=L[+b.dataset.rm]; FK.confirm(t("fr_removeQ",{n:FK.esc(f.name)}),t("fr_remove"),()=>{ L.splice(+b.dataset.rm,1); FK.save(); FK.render(); },true); });
  el.querySelectorAll("[data-inv]").forEach(b=>b.onclick=()=>{ const f=L[+b.dataset.inv]; FK.sfx("tap"); FK.invite&&FK.invite(f,b.dataset.m); });
};
/* kodu buluta yaz + gelen davetleri dinle */
const call=(fn,...a)=>{ try{ const n=N(); if(n&&n[fn]){ n[fn](...a); return true; } }catch(e){} return false; };
FK.friendsBoot = () => { const c=FK.myCode(); if(!c) return; const P=FK.state.profile; call("codeSet",c,JSON.stringify({name:(P.name||"?").slice(0,18),av:P.avatar||0,cup:(FK.state.ol||{}).cup||0,at:Date.now()})); call("invWatch"); };
setTimeout(FK.friendsBoot,2500);
const rid=()=>{ const A="abcdefghijkmnpqrstuvwxyz23456789"; let s=""; for(let i=0;i<12;i++) s+=A[Math.floor(Math.random()*A.length)]; return s; };
FK.invite = (f,mode) => { const u=FK.user(); if(!u){ FK.toast(t("fr_login"),"info",2600); return; }
  const P=FK.state.profile, me={uid:u.uid,name:(P.name||"?").slice(0,18),av:P.avatar||0,cup:mode==="chain"?(FK.state.ch||{}).cup||0:(FK.state.ol||{}).cup||0}, room=rid();
  call("livePut",room,JSON.stringify({mode,seed:room,a:me,b:{uid:f.uid,name:f.name,av:f.av||0,cup:f.cup||0},at:Date.now(),ra:1,inv:1}));
  call("invSend",f.uid,JSON.stringify({from:me,mode,room,at:Date.now()}));
  FK.go(mode==="chain"?"chplay":"ollive",{room,side:"a",mode:"live",invite:f}); };
let lastInv="";
const onInv = j => { let v=null; try{ v=JSON.parse(j); }catch(e){} if(!v||!v.room||v.room===lastInv) return; if(Date.now()-(v.at||0)>90000) { call("invClear"); return; } lastInv=v.room;
  const f=v.from||{}; FK.sfx("whistle"); FK.vib([60,40,60]);
  FK.modal('<div class="stack" style="gap:14px;align-items:center;text-align:center">'+FK.avatar(f.av||0,72,null,"none")+'<div class="h-display" style="font-size:22px">'+t("fr_invGot",{n:FK.esc(f.name||"?"),m:t(v.mode==="chain"?"fr_invC":"fr_invQ")})+'</div><div class="grid2" style="width:100%"><button class="btn btn-ghost btn-sm" data-no>'+t("fr_decline")+'</button><button class="btn btn-green btn-sm" data-yes>'+t("fr_accept")+'</button></div></div>',w=>{
    w.querySelector("[data-no]").onclick=()=>{ FK.closeModal(); call("livePut",v.room,JSON.stringify({db:1})); call("invClear"); };
    w.querySelector("[data-yes]").onclick=()=>{ FK.closeModal(); call("invClear"); if(f.uid&&!FK.isFriend(f.uid)) FK.addFriend(f); FK.go(v.mode==="chain"?"chplay":"ollive",{room:v.room,side:"b",mode:"live"}); }; }); };

/* kod → oyuncu (yerelde yoksa bulut) */
let lk=null; FK.lookupCode=(code,cb)=>{ lk=cb; try{ const n=N(); if(n&&n.codeGet){ n.codeGet(code); return; } }catch(e){} cb(null); };
const _nat=window.fkNative;
window.fkNative=(ev,a,b)=>{ if(ev==="inv"){ onInv(b); return; } if(ev==="auth"&&a==="1") setTimeout(FK.friendsBoot,3000); if(ev==="code"){ let f=null; try{ f=b?JSON.parse(b):null; }catch(e){} if(lk){ const c=lk; lk=null; c(f); } return; } if(_nat) _nat(ev,a,b); };
})();
