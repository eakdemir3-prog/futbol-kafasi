/* ==========================================================
   v1.0 — Yeni ses motoru (Web Audio ile üretilir, dosya yok)
   Menü dokunuşları: ses yok, hafif titreşim. Oyun içi: futbol temalı sesler.
   ========================================================== */
(function(){
const FK=window.FK;
let ctx=null, out=null, rev=null, noiseBuf=null;
function init(){
  if(ctx) return ctx;
  ctx=new (window.AudioContext||window.webkitAudioContext)();
  const comp=ctx.createDynamicsCompressor(); comp.threshold.value=-18; comp.ratio.value=4;
  out=ctx.createGain(); out.gain.value=0.95; out.connect(comp); comp.connect(ctx.destination);
  // kısa oda yankısı
  const len=Math.floor(ctx.sampleRate*0.9), ir=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let c=0;c<2;c++){ const d=ir.getChannelData(c); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3); }
  rev=ctx.createConvolver(); rev.buffer=ir; const rg=ctx.createGain(); rg.gain.value=0.22; rev.connect(rg); rg.connect(out);
  noiseBuf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate); const nd=noiseBuf.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=Math.random()*2-1;
  return ctx;
}
const now=()=>ctx.currentTime;
function env(g,t,a,peak,dec){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec); }
function tone(f,t,{type="sine",a=0.005,peak=0.2,dec=0.4,wet=true,glide=0,detune=0}={}){
  const o=ctx.createOscillator(), g=ctx.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if(glide) o.frequency.exponentialRampToValueAtTime(glide,t+a+dec); o.detune.value=detune;
  env(g,t,a,peak,dec); o.connect(g); g.connect(out); if(wet) g.connect(rev); o.start(t); o.stop(t+a+dec+0.05); return o; }
function bell(f,t,peak=0.16,dec=0.7){ tone(f,t,{peak,dec}); tone(f*2.76,t,{peak:peak*0.25,dec:dec*0.45}); tone(f*5.4,t,{peak:peak*0.08,dec:dec*0.25}); }
function noise(t,{dur=0.2,type="bandpass",freq=1500,q=1,peak=0.2,a=0.005,wet=false}={}){
  const s=ctx.createBufferSource(); s.buffer=noiseBuf; const f=ctx.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q; const g=ctx.createGain(); env(g,t,a,peak,dur);
  s.connect(f); f.connect(g); g.connect(out); if(wet) g.connect(rev); s.start(t,Math.random()); s.stop(t+a+dur+0.05); return {s,f,g}; }
function whistle(t,dur,peak=0.11){ // hakem düdüğü: tiz ton + hızlı titreşim (bilye sesi)
  const o=ctx.createOscillator(), lfo=ctx.createOscillator(), lg=ctx.createGain(), g=ctx.createGain();
  o.type="sine"; o.frequency.value=2850; lfo.frequency.value=34; lg.gain.value=140; lfo.connect(lg); lg.connect(o.frequency);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+0.02); g.gain.setValueAtTime(peak,t+dur-0.04); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(out); g.connect(rev); o.start(t); lfo.start(t); o.stop(t+dur+0.05); lfo.stop(t+dur+0.05);
  noise(t,{dur:dur,freq:3000,q:4,peak:peak*0.25}); }
function crowd(t,dur=1.4,peak=0.09){ const n=noise(t,{dur,freq:900,q:0.6,peak,a:0.25,wet:true}); n.f.frequency.setValueAtTime(700,t); n.f.frequency.linearRampToValueAtTime(1300,t+dur*0.4); }

let combo=0, lastOk=0;
const S={
  ok(){ const t=now(); const n=Date.now(); combo = n-lastOk<6000 ? Math.min(combo+1,6) : 0; lastOk=n;
    const st=Math.pow(2,combo/12*2); bell(1047*st,t,0.15,0.55); bell(1568*st,t+0.08,0.13,0.7); },
  no(){ const t=now(); combo=0; tone(190,t,{type:"sine",peak:0.28,dec:0.32,glide:85,wet:false}); tone(150,t+0.02,{type:"triangle",peak:0.08,dec:0.25,glide:70,wet:false}); noise(t,{dur:0.06,type:"lowpass",freq:500,peak:0.12}); },
  tick(){ const t=now(); noise(t,{dur:0.035,freq:2200,q:6,peak:0.22}); tone(1400,t,{peak:0.05,dec:0.04,wet:false}); },
  count(){ const t=now(); noise(t,{dur:0.03,freq:1600,q:5,peak:0.16}); tone(880,t,{type:"triangle",peak:0.06,dec:0.08,wet:false}); },
  whistle(){ const t=now(); whistle(t,0.16); whistle(t+0.24,0.42); },
  whistleEnd(){ const t=now(); whistle(t,0.9,0.1); },
  win(){ const t=now(); [523,659,784,1047].forEach((f,i)=>{ tone(f,t+i*0.09,{type:"triangle",peak:0.12,dec:0.35}); tone(f*1.005,t+i*0.09,{type:"sine",peak:0.06,dec:0.35}); });
    [1047,1319,1568].forEach(f=>tone(f,t+0.4,{type:"triangle",peak:0.07,dec:0.9})); crowd(t+0.15,1.3,0.07); },
  lvl(){ const t=now(); [392,523,659,784,1047].forEach((f,i)=>tone(f,t+i*0.1,{type:"triangle",peak:0.12,dec:0.4})); [523,659,784,1047].forEach(f=>tone(f,t+0.55,{type:"sawtooth",peak:0.025,dec:1.1})); bell(2093,t+0.55,0.08,1.2); crowd(t+0.2,1.8,0.1); },
  coin(){ const t=now(); bell(2637,t,0.1,0.25); bell(3520,t+0.07,0.09,0.4); noise(t+0.12,{dur:0.12,freq:5000,q:2,peak:0.05}); tone(1319,t+0.14,{type:"triangle",peak:0.06,dec:0.3}); },
  gem(){ const t=now(); [2093,2637,3136,4186].forEach((f,i)=>bell(f,t+i*0.06,0.06,0.35)); }
};
FK.sfx = type => {
  if(type==="tap"){ FK.vib(8); return; }               // menü: ses yok, hafif titreşim
  if(!FK.state.settings.sound) return;
  try{ init(); if(ctx.state==="suspended") ctx.resume(); (S[type]||S.tick)(); }catch(e){}
};
})();
