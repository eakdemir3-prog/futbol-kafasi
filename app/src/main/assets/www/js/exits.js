/* v1.4.4 — her oyundan kendi ön sayfasına çıkış */
(function(){
const FK=window.FK, t=FK.t;
Object.assign(FK_I18N.tr,{ toLevels:"Bölümler", toModeHome:"Oyun menüsü", quitMid:"Oyundan çıkmak istiyor musun? Bu oyunun ilerlemesi kaybolur.", kafaHint:"Kafa'dan ipucu: {c} açıldı" });
Object.assign(FK_I18N.en,{ toLevels:"Levels", toModeHome:"Game menu", quitMid:"Quit this game? Progress in this round will be lost.", kafaHint:"Kafa's tip: {c} revealed" });
FK.modeHome = mode => {
  FK.closeModal(); FK.backHandler=null;
  if(mode==="duel"){ FK.stack=[{name:"home",params:{}}]; FK.go("duel"); return; }
  if(mode==="chain"||mode==="ortak"){ FK.stack=[{name:"games",params:{}}]; FK.go("ortak"); return; }
  if(mode==="word"||!FK.MODES[mode]&&mode!=="more"&&mode!=="tf"){ FK.go("games",{},{root:true}); return; }
  FK.stack=[{name:"games",params:{}}]; FK.go("intro",{mode});
};
/* oyun sonu alt satırı: [mod ön sayfası] [paylaş] [🏠] */
FK.endRow = (mode,shareAttr) => {
  const lv=FK.LV&&FK.LV[mode];
  return '<div class="end-row"><button class="btn btn-ghost" data-mh>'+FK.ic(lv?"grid":"left",18,2.4)+(lv?t("toLevels"):t("toModeHome"))+'</button>'+
    (shareAttr?'<button class="btn btn-ghost" '+shareAttr+' aria-label="'+t("share")+'">'+FK.ic("share",18)+'</button>':'')+
    '<button class="btn btn-ghost" data-hm aria-label="'+t("home")+'">'+FK.ic("home",20,2.2)+'</button></div>';
};
FK.bindEndRow = (el,mode,before) => {
  const a=el.querySelector("[data-mh]"); if(a) a.onclick=()=>{ FK.sfx("tap"); if(before) before(); FK.modeHome(mode); };
  const h=el.querySelector("[data-hm]"); if(h) h.onclick=()=>{ FK.sfx("tap"); if(before) before(); FK.go("home",{},{root:true}); };
};
})();
/* v1.5 neon: iki renkli başlıklar (son kelime lime). Ekranlar kendini yeniden çizdiği için gözlemciyle uygulanır */
(function(){ let q=false;
  const two=()=>{ q=false; document.querySelectorAll("#app .topbar h1.h-display:not([data-2]), #app h1.h1:not([data-2]), #app .card-hero h1.h-display:not([data-2])").forEach(h=>{ h.dataset["2"]=1;
    if(h.children.length) return; const tx=h.textContent.trim(), i=tx.lastIndexOf(" "); if(i<1) return;
    h.innerHTML=FK.esc(tx.slice(0,i))+' <span class="g2">'+FK.esc(tx.slice(i+1))+'</span>'; }); };
  const start=()=>{ const a=document.getElementById("app"); if(!a||!window.MutationObserver) return; new MutationObserver(()=>{ if(!q){ q=true; requestAnimationFrame(two); } }).observe(a,{childList:true,subtree:true}); two(); };
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
})();
