/* v1.6 — özgün çizgi-roman tarzı çizimler (SVG). Gerçek kişi, arma veya forma deseni içermez. */
(function(){
const K='#130A2E';
const S=(w,h,vb,body,st='')=>`<svg class="il" width="${w}" height="${h}" viewBox="${vb}" style="${st}" fill="none" stroke="${K}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const lines=(x,y,r,n,a0,a1,len=14)=>{let o='';for(let i=0;i<n;i++){const a=(a0+(a1-a0)*i/(n-1))*Math.PI/180;o+=`<path d="M${x+Math.cos(a)*r} ${y+Math.sin(a)*r} L${x+Math.cos(a)*(r+len)} ${y+Math.sin(a)*(r+len)}" stroke-width="5"/>`;}return o;};
/* top */
const ball=(cx,cy,r)=>`<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFDF6"/>
 <path d="M${cx} ${cy-r*.35} L${cx+r*.33} ${cy-r*.1} L${cx+r*.2} ${cy+r*.28} L${cx-r*.2} ${cy+r*.28} L${cx-r*.33} ${cy-r*.1} Z" fill="${K}" stroke-width="3"/>
 <path d="M${cx} ${cy-r} L${cx} ${cy-r*.35} M${cx+r*.33} ${cy-r*.1} L${cx+r*.9} ${cy-r*.3} M${cx+r*.2} ${cy+r*.28} L${cx+r*.55} ${cy+r*.8} M${cx-r*.2} ${cy+r*.28} L${cx-r*.55} ${cy+r*.8} M${cx-r*.33} ${cy-r*.1} L${cx-r*.9} ${cy-r*.3}" stroke-width="3.5"/>
 <path d="M${cx-r*.2} ${cy-r} L${cx} ${cy-r*.72} L${cx+r*.2} ${cy-r} Z M${cx+r*.98} ${cy-r*.05} L${cx+r*.78} ${cy-r*.2} L${cx+r*.85} ${cy+r*.4} Z M${cx-r*.98} ${cy-r*.05} L${cx-r*.78} ${cy-r*.2} L${cx-r*.85} ${cy+r*.4} Z M${cx+r*.25} ${cy+r*.96} L${cx+r*.48} ${cy+r*.7} L${cx+r*.65} ${cy+r*.75} Z M${cx-r*.25} ${cy+r*.96} L${cx-r*.48} ${cy+r*.7} L${cx-r*.65} ${cy+r*.75} Z" fill="${K}" stroke-width="2.5"/>
 <circle cx="${cx}" cy="${cy}" r="${r}"/><path d="M${cx-r*.55} ${cy-r*.62} Q${cx-r*.2} ${cy-r*.85} ${cx+r*.05} ${cy-r*.82}" stroke="#fff" stroke-width="4" opacity=".9"/></g>`;
window.FK.IL={
 ball:(sz=110)=>S(sz,sz,'0 0 120 120',lines(60,60,48,3,-60,-20,12)+ball(60,62,42)),
 pitchBall:()=>S(170,104,'0 0 170 104',`<path d="M10 100 Q60 60 170 70" stroke="#130A2E" stroke-width="4"/><ellipse cx="70" cy="96" rx="40" ry="10" stroke-width="4"/><circle cx="70" cy="96" r="3" fill="${K}"/>`+lines(118,44,44,3,-150,-110,12)+ball(118,48,40)),
 flags:()=>S(150,104,'0 0 150 104',`<path d="M40 100 L80 14" /><path d="M110 100 L70 14"/>
  <path d="M76 22 L130 26 L116 42 L132 58 L70 52 Z" fill="#fff"/><path d="M74 22 L20 30 L34 46 L18 62 L80 52 Z" fill="#C6FF3D"/>
  <circle cx="52" cy="42" r="9" fill="#fff" stroke-width="3.5"/><path d="M104 32 l6 0 l0 6 q-3 6 -6 0 Z M100 36 l14 0" stroke-width="3" fill="#fff"/>`+lines(75,20,30,3,-130,-50,10)),
 silhouette:(c='#0F0A28')=>S(150,140,'0 0 150 140',`<path d="M20 140 Q22 98 52 90 L62 84 Q50 72 50 54 Q48 22 76 20 Q104 20 102 52 Q102 72 90 84 L98 90 Q128 98 130 140 Z" fill="${c}"/>
  <text x="128" y="44" font-family="Barlow Condensed" font-weight="900" font-size="46" fill="#fff" stroke="${K}" stroke-width="4" paint-order="stroke">?</text>`+lines(76,52,48,3,-160,-120,10)),
 shirtArrow:()=>S(140,140,'0 0 140 140',`<path d="M44 34 L22 44 L8 70 L26 78 L32 70 L32 128 L108 128 L108 70 L114 78 L132 70 L118 44 L96 34 Q70 50 44 34 Z" fill="#FFFDF6"/>
  <text x="70" y="104" text-anchor="middle" font-family="Barlow Condensed" font-style="italic" font-weight="900" font-size="46" fill="${K}" stroke="none">10</text>
  <path d="M10 46 Q14 10 52 14" stroke-width="10" stroke="${K}"/><path d="M10 46 Q14 10 52 14" stroke-width="5" stroke="#C6FF3D"/><path d="M46 4 L60 15 L44 24 Z" fill="#C6FF3D"/>
  <path d="M90 128 Q122 134 128 104" stroke-width="10" stroke="${K}"/><path d="M90 128 Q122 134 128 104" stroke-width="5" stroke="#C6FF3D"/><path d="M118 106 L130 94 L136 110 Z" fill="#C6FF3D"/>`),
 shields:()=>S(140,140,'0 0 140 140',`<path d="M20 30 L62 18 L104 30 L104 70 Q104 108 62 124 Q20 108 20 70 Z" fill="#fff"/><path d="M34 40 L50 36 L50 108 Q34 96 34 70 Z M62 33 L78 37 L78 112 Q70 118 62 120 Z" fill="#8B6CF0" stroke-width="3"/>
  <path d="M74 52 L104 44 L134 52 L134 82 Q134 112 104 124 Q74 112 74 82 Z" fill="#C6FF3D"/><path d="M104 66 l5 10 l11 1 l-8 7 l3 11 l-11 -6 l-11 6 l3 -11 l-8 -7 l11 -1 Z" fill="${K}" stroke-width="2"/>`+lines(120,40,22,3,-110,-40,9)),
 stopwatch:()=>S(150,110,'0 0 150 110',`<circle cx="92" cy="60" r="42" fill="#FFFDF6"/><circle cx="92" cy="60" r="32" stroke-width="3"/><path d="M84 12 L100 12 M92 12 L92 18" stroke-width="6"/><rect x="82" y="2" width="20" height="10" rx="3" fill="#C6FF3D"/>
  <path d="M124 26 l10 -10" stroke-width="6"/><path d="M92 60 L92 38 M92 60 L108 70" stroke-width="5"/><circle cx="92" cy="60" r="4" fill="${K}"/>
  <path d="M8 52 L40 52 M2 66 L36 66 M12 80 L42 80" stroke-width="6"/>`),
 shirt:(sz=120,c='#FFFDF6',no='')=>S(sz,sz,'0 0 140 140',`<path d="M44 24 L22 34 L8 60 L26 68 L32 60 L32 126 L108 126 L108 60 L114 68 L132 60 L118 34 L96 24 Q70 40 44 24 Z" fill="${c}"/><path d="M52 27 Q70 37 88 27" stroke-width="4"/>${no?`<text x="70" y="98" text-anchor="middle" font-family="Barlow Condensed" font-style="italic" font-weight="900" font-size="44" fill="${K}" stroke="none">${no}</text>`:''}`),
 ballQ:()=>S(150,120,'0 0 150 120',ball(62,72,40)+`<text x="118" y="56" text-anchor="middle" font-family="Barlow Condensed" font-weight="900" font-size="74" fill="#C6FF3D" stroke="${K}" stroke-width="5" paint-order="stroke">?</text>`+lines(70,70,46,3,-140,-100,10)),
 trophy:(sz=150)=>S(sz,sz,'0 0 150 150',`<path d="M44 20 L106 20 L104 66 Q100 92 75 96 Q50 92 46 66 Z" fill="#FFD23F"/><path d="M46 30 Q18 30 22 54 Q26 72 48 74 M104 30 Q132 30 128 54 Q124 72 102 74" stroke-width="6"/>
  <path d="M66 96 L84 96 L86 114 L64 114 Z" fill="#FFD23F"/><rect x="46" y="114" width="58" height="18" rx="3" fill="#8B5CF6"/><path d="M75 36 l6 12 l13 2 l-10 9 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -9 l13 -2 Z" fill="${K}" stroke-width="2"/>
  <path d="M56 28 Q54 56 64 78" stroke="#FFF6C2" stroke-width="5"/>`+lines(75,60,58,5,-160,-20,12)),
 star:(on=true,sz=64)=>S(sz,sz,'0 0 64 64',`<path d="M32 4 l8 18 l20 2 l-15 13 l5 20 l-18 -11 l-18 11 l5 -20 l-15 -13 l20 -2 Z" fill="${on?'#FFD23F':'#6D4FD0'}"/>`+(on?'<path d="M26 18 l4 -8" stroke="#FFF6C2" stroke-width="4"/>':'')),
 goal:()=>S(230,150,'0 0 230 150',`<path d="M10 140 L10 18 L220 18 L220 140" stroke-width="7" stroke="#fff"/><path d="M10 140 L10 18 L220 18 L220 140" stroke-width="2" stroke="${K}"/>
  ${Array.from({length:12},(_,i)=>`<path d="M${24+i*17} 22 L${24+i*17} 138" stroke="#fff" stroke-width="1.5" opacity=".5"/>`).join('')}${Array.from({length:7},(_,i)=>`<path d="M14 ${34+i*16} L216 ${34+i*16}" stroke="#fff" stroke-width="1.5" opacity=".5"/>`).join('')}`),
 calendar:()=>S(130,120,'0 0 130 120',`<rect x="12" y="22" width="106" height="92" rx="10" fill="#FFF1D6"/><path d="M12 46 L118 46" /><rect x="12" y="22" width="106" height="24" rx="10" fill="#B79DFF"/>
  <path d="M38 12 L38 32 M64 12 L64 32 M90 12 L90 32" stroke-width="7"/>${[0,1,2].map(r=>[0,1,2,3].map(c=>`<rect x="${24+c*22}" y="${56+r*18}" width="14" height="11" rx="2" stroke-width="3"/>`).join('')).join('')}`+ball(96,94,16)),
};
})();
/* v1.6: ChatGPT ile üretilen özgün çizimler (img/*.webp) — SVG yedeklerin yerine */
(function(){ const IL=window.FK.IL, im=(n,c)=>'<img class="il ilimg'+(c?' '+c:'')+'" src="img/'+n+'.webp" alt="" draggable="false">';
  Object.assign(IL,{ ball:()=>im("ball"), pitchBall:()=>im("pitchball"), flags:()=>im("flags"), silhouette:()=>im("mystery"), shirtArrow:()=>im("transfer"),
    shields:()=>im("shields"), stopwatch:()=>im("stopwatch"), ballQ:()=>im("ballq"), trophy:()=>im("trophy"), goal:()=>im("goal"), calendar:()=>im("calendar"),
    shieldQ:()=>im("shield_q"), player10:()=>im("player10"), whistle:()=>im("whistle"), flagBlank:()=>im("flag"), logo:c=>im("logo",c) });
})();
