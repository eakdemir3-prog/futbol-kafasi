/* Yardım Merkezi — SSS, veri kaynakları, hatalı bilgi bildirme */
(function(){
const FK=window.FK, t=FK.t;
const MAIL="eakdemir3@gmail.com";
const TR=[
 ["🎮","Oyun modları",[
  "<b>Hızlı Maç</b>: Rastgele bir rakiple 10 soruluk canlı yarış. Rakip bulunamazsa önceki bir oyuncunun kaydına (hayalet) karşı oynarsın.",
  "<b>Kulüp Zinciri</b>: Sırayla bir futbolcu ve onun oynadığı başka bir kulübü söyleyerek zinciri uzatırsın. Her hamle 15 sn, 3 can. Bilemiyorsan <b>Pas</b> de (1 can gider).",
  "<b>Oyuncuyu Tahmin Et</b>: Gizli futbolcuyu ipuçlarıyla bul. Yeşil = aynı, sarı = yakın/geçmişte, kırmızı = farklı.",
  "<b>Doğru mu Yanlış mı</b> ve bazı modlarda yanlış cevap <b>5 saniye</b> kaybettirir."]],
 ["⚡","Enerji ve elmas",[
  "En fazla <b>10 enerji</b> olur; her <b>30 dakikada 1</b> enerji dolar.",
  "Reklam izleyerek <b>+2 enerji</b> alabilirsin (günde 5 kez).",
  "Elmasla: 1 enerji <b>40</b>, tam dolum <b>250</b> elmas.",
  "Oyun sonunda elmas kazanırsın: %70 üzeri ve tam isabet ekstra elmas verir."]],
 ["🏆","Kupalar ve ligler",[
  "Online galibiyet <b>+25 kupa</b>, mağlubiyet <b>−15 kupa</b>.",
  "Ligler: Bronz (0) · Gümüş (200) · Altın (500) · Elmas (1000) · Efsane (1800).",
  "Kulüp Zinciri kupaları ayrı tutulur."]],
 ["👥","Arkadaşlar",[
  "Profil → Arkadaşlar ekranında 6 haneli <b>kişisel kodun</b> var. Kodunu paylaş, arkadaşın kendi ekranından eklesin.",
  "Online maçtan sonra <b>Arkadaş ekle</b> butonuyla rakibini ekleyebilirsin.",
  "Arkadaş listesindeki ⚡ (Hızlı Maç) veya ⛓️ (Zincir) ile davet gönderirsin. Davet 60 sn geçerlidir.",
  "Online özellikler için Google hesabıyla giriş gerekir."]],
 ["📊","Futbolcu verileri nereden geliyor?",[
  "Oyuncu, kulüp ve kariyer bilgileri açık kaynaklardan derlenir: <b>Wikidata</b> (CC0) ve <b>Wikipedia</b> kadro sayfaları; şüpheli kayıtlar kulüplerin ve liglerin resmî duyurularıyla tek tek kontrol edilir.",
  "🆓 = <b>kulüpsüz</b> oyuncu (son kulübü gösterilir) · 🏁 = <b>emekli</b> oyuncu (son kulübü gösterilir).",
  "Transfer ve kulüpsüz düzeltmeleri <b>uygulama güncellemesi beklemeden</b> internetten otomatik indirilir.",
  "Gerçek kulüp logoları ve oyuncu fotoğrafları kullanılmaz; rozetler oyuna özel çizimdir."]],
 ["🔐","Hesap ve veriler",[
  "Misafir olarak oynarsan ilerlemen sadece bu cihazda kalır. Google hesabına bağlarsan ilerlemen yedeklenir.",
  "Profil → <b>Verilerimi sil</b> ile bu cihazdaki tüm ilerlemeyi silebilirsin. Hesap silme için gizlilik sayfasındaki adımları izle."]]
];
const EN=[
 ["🎮","Game modes",[
  "<b>Quick Match</b>: a live 10-question race against a random opponent. If nobody is found you play a previous player's recording (ghost).",
  "<b>Club Chain</b>: take turns naming a player and another club he played for. 15 s per move, 3 lives. Stuck? Tap <b>Pass</b> (costs 1 life).",
  "<b>Guess the Player</b>: find the hidden player from the clues. Green = same, yellow = close/past, red = different.",
  "In <b>True or False</b> and some other modes a wrong answer costs <b>5 seconds</b>."]],
 ["⚡","Energy and gems",[
  "You can hold up to <b>10 energy</b>; <b>1 energy every 30 minutes</b>.",
  "Watch an ad for <b>+2 energy</b> (5 times a day).",
  "With gems: 1 energy <b>40</b>, full refill <b>250</b> gems.",
  "You earn gems at the end of each game, with bonuses for 70%+ and perfect runs."]],
 ["🏆","Cups and leagues",[
  "Online win <b>+25 cups</b>, loss <b>−15 cups</b>.",
  "Leagues: Bronze (0) · Silver (200) · Gold (500) · Diamond (1000) · Legend (1800).",
  "Club Chain cups are tracked separately."]],
 ["👥","Friends",[
  "Profile → Friends shows your 6-character <b>personal code</b>. Share it and your friend adds you from their screen.",
  "After an online match tap <b>Add friend</b> to add your opponent.",
  "Use ⚡ (Quick Match) or ⛓️ (Chain) in your friends list to send an invite. Invites last 60 s.",
  "Online features need a Google sign-in."]],
 ["📊","Where does the player data come from?",[
  "Player, club and career data is compiled from open sources: <b>Wikidata</b> (CC0) and <b>Wikipedia</b> squad pages; doubtful entries are checked one by one against official club and league announcements.",
  "🆓 = <b>free agent</b> (last club shown) · 🏁 = <b>retired</b> (last club shown).",
  "Transfer and free-agent corrections download automatically, <b>without waiting for an app update</b>.",
  "No real club logos or player photos are used; badges are drawn for the game."]],
 ["🔐","Account and data",[
  "As a guest your progress stays on this device. Link a Google account to back it up.",
  "Profile → <b>Delete my data</b> wipes all progress on this device. For account deletion follow the steps on the privacy page."]]
];
FK.screens.help = el => {
  const en=FK.lang()==="en", D=en?EN:TR;
  const pd=window.FK_PATCH_DATE;
  el.innerHTML='<div class="topbar"><button class="icon-btn" data-back aria-label="'+t("back")+'">'+FK.ic("left",22,2.4)+'</button><div class="grow"><h1 class="h-display" style="font-size:26px;margin:0">'+(en?"Help center":"Yardım merkezi")+'</h1></div></div>'+
   '<div class="scroll"><div class="stack" style="gap:12px">'+
   '<div class="hp-hero">'+FK.kafa("selam",64)+'<div class="grow"><b>'+(en?"How can we help?":"Nasıl yardımcı olabiliriz?")+'</b><div class="small" style="opacity:.85;margin-top:4px">'+(en?"Tap a topic to open it.":"Bir başlığa dokun, açılsın.")+'</div></div></div>'+
   D.map((s,i)=>'<details class="hp-q"'+(i===0?' open':'')+'><summary><span class="hp-ic">'+s[0]+'</span><b class="grow">'+s[1]+'</b>'+FK.ic("right",16,2.4)+'</summary><ul>'+s[2].map(x=>'<li>'+x+'</li>').join("")+'</ul></details>').join("")+
   '<div class="card hp-rep"><b>'+(en?"Spotted wrong player info?":"Hatalı bir bilgi mi gördün?")+'</b><div class="small muted" style="margin:6px 0 12px;line-height:1.5">'+(en?"Wrong club, birth year, nationality or a missed transfer — tell us and we fix it in the online data update.":"Yanlış kulüp, doğum yılı, uyruk ya da kaçan bir transfer — bize yaz, internetten gelen veri güncellemesiyle düzeltelim.")+'</div>'+
    '<input class="input" data-pl placeholder="'+(en?"Player name":"Futbolcu adı")+'" autocomplete="off" style="margin-bottom:8px">'+
    '<input class="input" data-wr placeholder="'+(en?"What is wrong? (e.g. now at Club X)":"Ne yanlış? (ör. artık X kulübünde)")+'" autocomplete="off" style="margin-bottom:10px">'+
    '<button class="btn btn-primary" data-rep>'+(en?"Report":"Bildir")+'</button></div>'+
   '<button class="setting card" data-mail style="padding:14px">'+FK.ic("help",20)+'<span class="grow">'+(en?"Contact us":"Bize yaz")+'</span>'+FK.ic("right",18)+'</button>'+
   '<div class="center small muted">'+t("version",{v:FK.VERSION})+(pd?' · '+(en?"data":"veri")+' '+pd:'')+'</div>'+
   '</div></div>';
  el.querySelector("[data-back]").onclick=()=>FK.back();
  const mail=(sub,body)=>FK.openUrl("mailto:"+MAIL+"?subject="+encodeURIComponent(sub)+"&body="+encodeURIComponent(body));
  el.querySelector("[data-rep]").onclick=()=>{
    const pl=el.querySelector("[data-pl]").value.trim(), wr=el.querySelector("[data-wr]").value.trim();
    if(!pl){ FK.toast(en?"Write the player's name":"Futbolcunun adını yaz","info"); return; }
    FK.sfx("tap"); mail("Futbol Kafası — "+(en?"data report":"hatalı bilgi")+": "+pl, (en?"Player: ":"Oyuncu: ")+pl+"\n"+(en?"Problem: ":"Sorun: ")+wr+"\n\nv"+FK.VERSION);
  };
  el.querySelector("[data-mail]").onclick=()=>mail("Futbol Kafası — "+(en?"support":"destek"),"\n\nv"+FK.VERSION);
};
})();
