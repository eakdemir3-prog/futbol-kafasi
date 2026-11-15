/* v1.4.3 — Kafa (maskot) avatarları ve yeni çerçeveler. Hepsi mağazada elmasla. */
(function(){
const FK=window.FK, t=FK.t;
Object.assign(FK_I18N.tr,{ cosKafa:"Kafa avatarları", cosKafaS:"Klasik", cosKafaA:"Hareketli", cosOld:"Simge avatarları", cosFrNew:"Yeni çerçeveler" });
Object.assign(FK_I18N.en,{ cosKafa:"Kafa avatars", cosKafaS:"Classic", cosKafaA:"Animated", cosOld:"Icon avatars", cosFrNew:"New frames" });

/* k = maskot pozu, fx = görünüm efekti/animasyon. Sıra değişmez: profilde indeks olarak saklanır. */
const K=[
  // klasik (hareketsiz)
  {k:"kaptan",  g:["#22C55E","#14532D"], cost:100},
  {k:"taraftar",g:["#EF4444","#7F1D1D"], cost:100},
  {k:"kaleci",  g:["#14B8A6","#134E4A"], cost:120},
  {k:"bilge",   g:["#A855F7","#3B0764"], cost:120},
  {k:"satici",  g:["#F59E0B","#78350F"], cost:150},
  {k:"uykucu",  g:["#3B82F6","#172554"], cost:150},
  {k:"uzgun",   g:["#94A3B8","#334155"], cost:150},
  {k:"atesli",  g:["#FB923C","#7C2D12"], cost:200},
  {k:"sampiyon",g:["#FDE047","#A16207"], cost:250},
  {k:"kaptan",  g:["#E7E5E4","#57534E"], cost:250, fx:"retro"},
  // hareketli
  {k:"kaptan",  g:["#4ADE80","#166534"], cost:300, fx:"bob"},
  {k:"taraftar",g:["#F43F5E","#4C0519"], cost:300, fx:"wave"},
  {k:"kaleci",  g:["#2DD4BF","#0F766E"], cost:350, fx:"sway"},
  {k:"uykucu",  g:["#6366F1","#1E1B4B"], cost:350, fx:"zzz"},
  {k:"bilge",   g:["#C084FC","#4C1D95"], cost:400, fx:"aura"},
  {k:"atesli",  g:["#F97316","#450A0A"], cost:450, fx:"fire"},
  {k:"sampiyon",g:["#FACC15","#713F12"], cost:500, fx:"shine"},
  {k:"kaptan",  g:["#FDE68A","#92400E"], cost:650, fx:"gold"},
  {k:"kaptan",  g:["#BAE6FD","#0C4A6E"], cost:650, fx:"ice"},
  {k:"sampiyon",g:["#1E1B4B","#0B1026"], cost:800, fx:"galaxy"},
  {k:"atesli",  g:["#EC4899","#312E81"], cost:1000, fx:"rainbow"}
];
FK.KAFA_START=FK.AVATARS.length;
K.forEach(a=>{ a.i="ball"; FK.AVATARS.push(a); });

/* yeni çerçeveler (PRO çerçevesi sonda kalır) */
const NF=[
  {id:"ball",cost:150},{id:"pitch",cost:150},{id:"scarf",cost:200},{id:"cards",cost:200},
  {id:"chain",cost:250},{id:"var",cost:300},{id:"bolt",cost:350},{id:"stars",cost:350},
  {id:"stadium",cost:400},{id:"trophy",cost:450},{id:"diamond",cost:500},{id:"kafa",cost:600},
  {id:"legend",cost:1000}
];
const pi=FK.FRAMES.findIndex(f=>f.pro); FK.FRAMES.splice(pi<0?FK.FRAMES.length:pi,0,...NF);

const VB="-235 -300 470 470";
const kav=(a,size)=>'<div class="av kav kfx-'+(a.fx||"none")+'" style="width:'+size+'px;height:'+size+'px;background:linear-gradient(145deg,'+a.g[0]+','+a.g[1]+');--fs:'+size+'px"><svg class="kav-s" viewBox="'+VB+'" width="'+Math.round(size*1.02)+'" height="'+Math.round(size*1.02)+'" aria-hidden="true"><g>'+FK.kafaPose(a.k)+'</g></svg></div>';

const _av=FK.avatar;
FK.avatar = (idx,size=44,ring=null,frame) => {
  const a=FK.AVATARS[idx]||FK.AVATARS[0];
  let h;
  if(a.k){
    const inner=kav(a,size);
    const fr = frame!==undefined ? frame : (ring!==null ? FK.frameOf() : "none");
    h = ring===null ? inner : '<div class="av-ring" style="background:conic-gradient(var(--green) 0 '+ring+'%, #233556 '+ring+'% 100%)">'+inner+'</div>';
    if(fr && fr!=="none") h='<div class="fr fr-'+fr+'" style="--fs:'+size+'px">'+h+'</div>';
  } else h=_av(idx,size,ring,frame);
  if(h.indexOf('fr-kafa"')>0) h=h.replace(/<\/div>$/,'<span class="fr-peek">'+FK.kafa("taraftar",Math.round(size*.42))+'</span></div>');
  return h;
};
})();
