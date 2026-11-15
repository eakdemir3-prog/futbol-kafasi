/* Uzaktan veri düzeltmesi — açılışta arka planda indirilir; değiştiyse hemen uygulanır ve bir sonraki açılış için saklanır */
(function(){
const FK=window.FK;
FK.PATCH_URL = FK.LEGAL + "fk-data.json";
FK.fetchPatch = () => {
  if(!window.fetch) return;
  fetch(FK.PATCH_URL+"?t="+Math.floor(Date.now()/3600000),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(P=>{
    if(!P||typeof P!=="object") return;
    let old=null; try{ old=localStorage.getItem("fk_patch"); }catch(e){}
    const s=JSON.stringify(P); if(old===s) return;
    try{ localStorage.setItem("fk_patch",s); }catch(e){}
    if(window.FK_APPLY_PATCH(P) && FK.resetPools) FK.resetPools();
  }).catch(()=>{});
};
setTimeout(FK.fetchPatch,1500);
})();
