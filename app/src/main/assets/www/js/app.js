/* Uygulama başlangıcı */
(function(){
const FK=window.FK;
FK.load();
FK.applyTheme();
document.documentElement.lang=FK.lang();
FK.rollover();
const app=document.getElementById("app");
const sp=document.createElement("div"); sp.className="splash";
sp.innerHTML='<div class="logo" style="display:flex;flex-direction:column;align-items:center"><div style="filter:drop-shadow(0 18px 30px rgba(0,0,0,.4))">'+FK.logoBall(150,true)+'</div><div style="margin-top:-14px">'+FK.logoText(290)+'</div></div>';
app.appendChild(sp);
const start=()=>{
  if(FK.state.onboarded) FK.go("home",{},{root:true}); else FK.go("welcome",{},{root:true});
  sp.classList.add("out"); setTimeout(()=>sp.remove(),400);
};
const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
Promise.race([fontsReady,new Promise(r=>setTimeout(r,800))]).then(()=>setTimeout(start,1300));
window.addEventListener("error",e=>{ try{ console.error("FK error",e.message); }catch(_){} });
})();
