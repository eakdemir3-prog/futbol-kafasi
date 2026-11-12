/* OYUNCUYU TAHMİN ET — 5 büyük lig + Süper Lig güncel kadro eklemesi (kontrol: 12 Kasım 2026, kulüp kadroları)
   Format: [ad, doğum yılı, ülke, mevki, forma no (şu anki kulüp), Dünya Kupası, ün (1-3), "KULÜPLER (sonuncu = şu anki)"]  */
(function(){
const N="#475569", W="#FFFFFF", K="#111827";
Object.assign(window.FK_LEAGUES,{
 ECU:["EC","ECU","Ekvador Ligi","Ecuadorian Serie A"], SVN:["SI","SVN","Slovenya Ligi","Slovenian PrvaLiga"]
});
Object.assign(window.FK_CONTINENT,{EC:"SA",SI:"EU",SK:"EU",GN:"AF",GA:"AF",XK:"EU",IE:"EU"});
Object.assign(window.FK_GCLUBS,{
 CRY:["Crystal Palace","CRY","ENG","#1D4ED8","#DC2626"], CHL:["Charlton","CHA","ENG","#DC2626",W], NFO:["Nottingham Forest","NFO","ENG","#DC2626",W],
 BRC:["Bristol City","BRC","ENG","#DC2626",W], BOU:["Bournemouth","BOU","ENG","#DC2626",K], SHU:["Sheffield United","SHU","ENG","#DC2626",W],
 MDB:["Middlesbrough","MID","ENG","#DC2626",W], BNS:["Barnsley","BAR","ENG","#DC2626",W], RDG:["Reading","REA","ENG","#1D4ED8",W], NWC:["Norwich","NOR","ENG","#FACC15","#16A34A"],
 ANG:["Angers","SCO","FRA",K,W], REI:["Reims","REI","FRA","#DC2626",W], TRO:["Troyes","ESTAC","FRA","#1D4ED8",W], LOR:["Lorient","FCL","FRA","#F97316",K], CAE:["Caen","SMC","FRA","#1D4ED8","#DC2626"],
 AZ:["AZ Alkmaar","AZ","NED","#DC2626",W], VOL:["Volendam","VOL","NED","#F97316",K], SPR:["Sparta Rotterdam","SPA","NED","#DC2626",W],
 IDV:["Independiente del Valle","IDV","ECU",K,"#1D4ED8"], BRG:["Braga","SCB","POR","#DC2626",W], HBS:["Hertha BSC","BSC","GER","#1D4ED8",W], UHG:["Unterhaching","SPV","GER","#DC2626","#1D4ED8"],
 DYJ:["Defensa y Justicia","DyJ","ARG","#FACC15","#16A34A"], BEG:["Belgrano","CAB","ARG","#38BDF8",W], DUN:["Dundee United","DUN","SCO","#F97316",K],
 EIB:["Eibar","EIB","ESP","#1D4ED8","#9F1239"], ESY:["Espanyol","ESP","ESP","#1D4ED8",W], OLI:["Olimpija","OLI","SVN","#16A34A",W], TOR:["Torino","TOR","ITA","#7F1D1D",W],
 EMP:["Empoli","EMP","ITA","#1D4ED8",W], ANW:["Antwerp","ANT","BEL","#DC2626",W], ANA:["Atlético Nacional","NAC","COL","#16A34A",W], HAM:["Hammarby","HIF","SWE","#16A34A",W],
 GRS:["Giresunspor","GRS","TUR","#16A34A",W], RIZ:["Rizespor","RİZ","TUR","#16A34A","#1D4ED8"], BUR:["Bursaspor","BUR","TUR","#16A34A",W], GNC:["Gençlerbirliği","GNÇ","TUR","#DC2626",K],
 FCM:["Midtjylland","FCM","DEN",K,"#DC2626"], WIN:["Winterthur","WIN","SUI","#DC2626",W]
});
// Kulüp değiştiren mevcut oyuncular: [ad, eklenecek kulüp(ler), yeni forma no]
const FIX = [
 ["Ferran Torres","PSG",9], ["João Cancelo","BAR",2], ["Fabinho","TS",6], ["Zeki Çelik","JUV",2],
 ["Mohamed Salah",null,10], ["Enzo Fernández",null,17], ["Omar Marmoush",null,22], ["Rasmus Højlund",null,19],
 ["Emiliano Martínez",null,1], ["Rafael Leão",null,27], ["Ronald Araújo",null,33], ["Viktor Gyökeres",null,14],
 ["Trent Alexander-Arnold",null,12], ["Luis Díaz",null,14], ["Kim Min-jae",null,3]
];
FIX.forEach(f=>{ const p=window.FK_GPLAYERS.find(x=>x[0]===f[0]); if(!p) return; if(f[1]) p[7]+=","+f[1]; if(f[2]) p[4]=f[2]; });
// Arda Güler Real Madrid'de (15) devam ediyor — kiralık bilgisi hatalıydı
const arda=window.FK_GPLAYERS.find(x=>x[0]==="Arda Güler"); if(arda) arda[7]=arda[7].replace(/,LEV$/,"");
const alt=window.FK_GPLAYERS.find(x=>x[0]==="Altay Bayındır"); if(alt) alt[7]=alt[7].replace(/CLT$/,"CLV");
delete window.FK_GCLUBS.CLT;

const ADD = [
 // ARSENAL
 ["David Raya",1995,"ES","GK",1,1,2,"BLB,BRT,ARS"], ["Gabriel Magalhães",1997,"BR","DF",6,0,2,"AVA,LIL,ARS"], ["Ben White",1997,"GB-ENG","DF",4,0,3,"BHA,ARS"],
 ["Jurriën Timber",2001,"NL","DF",12,0,3,"AJA,ARS"], ["Riccardo Calafiori",2002,"IT","DF",33,0,3,"ROM,BAS,BLG,ARS"], ["Eberechi Eze",1998,"GB-ENG","MF",10,0,2,"QPR,CRY,ARS"],
 ["Noni Madueke",2002,"GB-ENG","FW",20,0,3,"PSV,CHE,ARS"], ["Piero Hincapié",2002,"EC","DF",5,0,3,"TAL,LEV,ARS"], ["Myles Lewis-Skelly",2006,"GB-ENG","DF",49,0,3,"ARS"],
 ["Ezri Konsa",1997,"GB-ENG","DF",15,0,3,"CHL,BRT,AVL,ARS"],
 // MAN CITY
 ["Rayan Cherki",2003,"FR","MF",10,0,2,"LYO,MCI"], ["Elliot Anderson",2002,"GB-ENG","MF",5,0,3,"NEW,NFO,MCI"], ["Antoine Semenyo",2000,"GH","FW",42,0,3,"BRC,BOU,MCI"],
 ["Marc Guéhi",2000,"GB-ENG","DF",6,0,3,"CHE,CRY,MCI"], ["Iliman Ndiaye",2000,"SN","FW",7,0,3,"SHU,OM,EVE,MCI"], ["Rayan Aït-Nouri",2001,"DZ","DF",21,0,3,"ANG,WOL,MCI"],
 // LIVERPOOL
 ["Ibrahima Konaté",1999,"FR","DF",16,0,2,"SOC,RBL,LIV,RMA"], ["Milos Kerkez",2003,"HU","DF",6,0,3,"AZ,BOU,LIV"], ["Jeremie Frimpong",2000,"NL","DF",30,0,3,"CEL,LEV,LIV"],
 ["Ryan Gravenberch",2002,"NL","MF",38,0,3,"AJA,FCB,LIV"], ["Hugo Ekitike",2002,"FR","FW",22,0,2,"REI,PSG,FRA,LIV"], ["Bradley Barcola",2002,"FR","FW",29,0,2,"LYO,PSG,LIV"],
 ["Giorgi Mamardashvili",2000,"GE","GK",25,0,3,"DTB,VAL,LIV"], ["Víctor Muñoz",2003,"ES","FW",23,1,3,"RMA,OSA,LIV"],
 // CHELSEA
 ["Moisés Caicedo",2001,"EC","MF",25,0,2,"IDV,BHA,CHE"], ["Reece James",1999,"GB-ENG","DF",24,0,3,"CHE"], ["Levi Colwill",2003,"GB-ENG","DF",6,0,3,"CHE"],
 ["João Pedro",2001,"BR","FW",9,0,3,"FLU,WAT,BHA,CHE"], ["Pedro Neto",2000,"PT","FW",7,0,3,"BRG,WOL,CHE"], ["Estêvão",2007,"BR","FW",41,0,2,"PAL,CHE"],
 ["Morgan Rogers",2002,"GB-ENG","MF",17,0,3,"MDB,AVL,CHE"], ["Jamie Gittens",2004,"GB-ENG","FW",11,0,3,"BVB,CHE"], ["Marc Cucurella",1998,"ES","DF",17,1,2,"EIB,GET,BHA,CHE,RMA"],
 // MAN UTD
 ["Matheus Cunha",1999,"BR","FW",10,0,3,"SIO,RBL,HBS,ATM,WOL,MUN"], ["Bryan Mbeumo",1999,"CM","FW",19,0,3,"TRO,BRT,MUN"], ["Benjamin Šeško",2003,"SI","FW",30,0,3,"LIE,SAL,RBL,MUN"],
 ["Kobbie Mainoo",2005,"GB-ENG","MF",37,0,3,"MUN"], ["Lisandro Martínez",1998,"AR","DF",6,1,2,"DYJ,AJA,MUN"], ["Mason Mount",1999,"GB-ENG","MF",7,0,3,"CHE,MUN"],
 ["Harry Maguire",1993,"GB-ENG","DF",5,0,3,"SHU,HUL,LEI,MUN"], ["Amad Diallo",2002,"CI","FW",16,0,3,"ATA,MUN"], ["Diogo Dalot",1999,"PT","DF",2,0,3,"POR,MUN"],
 ["Youri Tielemans",1997,"BE","MF",18,0,3,"AND,MON,LEI,AVL,MUN"],
 // TOTTENHAM
 ["Micky van de Ven",2001,"NL","DF",37,0,3,"VOL,WOB,TOT"], ["Pedro Porro",1999,"ES","DF",23,1,3,"GIR,SCP,TOT"], ["Dominic Solanke",1997,"GB-ENG","FW",19,0,3,"CHE,LIV,BOU,TOT"],
 ["Sandro Tonali",2000,"IT","MF",16,0,2,"BRE,MIL,NEW,TOT"], ["Xavi Simons",2003,"NL","MF",7,0,2,"PSG,PSV,PSG,TOT"], ["Cristian Romero",1998,"AR","DF",21,1,2,"BEG,GEN,ATA,TOT,ATM"],
 ["Andy Robertson",1994,"GB-SCT","DF",3,0,2,"DUN,HUL,LIV,TOT"], ["Anthony Gordon",2001,"GB-ENG","FW",17,0,2,"EVE,NEW,BAR"], ["Nick Woltemade",2002,"DE","FW",27,0,3,"WER,STU,NEW,JUV"],
 // REAL MADRID
 ["Dean Huijsen",2005,"ES","DF",4,0,3,"JUV,BOU,RMA"], ["Éder Militão",1998,"BR","DF",3,0,2,"SAO,POR,RMA"], ["Ferland Mendy",1995,"FR","DF",23,0,3,"LHA,LYO,RMA"],
 ["Álvaro Carreras",2003,"ES","DF",18,0,3,"BEN,RMA"], ["Brahim Díaz",1999,"MA","MF",21,0,2,"MCI,RMA,MIL,RMA"], ["Yan Diomande",2006,"CI","FW",25,0,3,"LEG,RBL,RMA"],
 ["Denzel Dumfries",1996,"NL","DF",24,0,3,"SPR,HEE,PSV,INT,RMA"],
 // BARCELONA
 ["Jules Koundé",1998,"FR","DF",23,0,2,"BOR,SEV,BAR"], ["Alejandro Balde",2003,"ES","DF",3,0,3,"BAR"], ["Pau Cubarsí",2007,"ES","DF",5,1,2,"BAR"],
 ["Gavi",2004,"ES","MF",6,1,2,"BAR"], ["Fermín López",2003,"ES","MF",7,0,3,"BAR"], ["Joan García",2001,"ES","GK",1,1,3,"ESY,BAR"],
 ["Eric García",2001,"ES","DF",24,1,3,"MCI,BAR"], ["Karim Adeyemi",2002,"DE","FW",14,0,3,"UHG,SAL,BVB,BAR"], ["Andreas Christensen",1996,"DK","DF",15,0,3,"CHE,BAR"],
 // ATLÉTICO / LALIGA
 ["Jan Oblak",1993,"SI","GK",13,0,2,"OLI,BEN,ATM"], ["Koke",1992,"ES","MF",6,0,3,"ATM"], ["Marcos Llorente",1995,"ES","DF",14,1,3,"RMA,ATM"],
 ["Giuliano Simeone",2002,"AR","FW",20,0,3,"RIV,ATM"], ["Ademola Lookman",1997,"NG","FW",11,0,3,"CHL,EVE,RBL,ATA,ATM"], ["Alejandro Grimaldo",1995,"ES","DF",22,1,3,"BEN,LEV,ATM"],
 ["Lee Kang-in",2001,"KR","FW",7,0,3,"VAL,MLL,PSG,ATM"], ["Mikel Oyarzabal",1997,"ES","FW",10,1,2,"RSO"],
 // INTER / MILAN / JUVE / NAPOLI
 ["Marcus Thuram",1997,"FR","FW",9,0,2,"SOC,GUI,MGL,INT"], ["Alessandro Bastoni",1999,"IT","DF",95,0,2,"ATA,INT"], ["Federico Dimarco",1997,"IT","DF",32,0,3,"INT"],
 ["Manuel Akanji",1995,"CH","DF",25,0,3,"WIN,BAS,BVB,MCI,INT"], ["Piotr Zieliński",1994,"PL","MF",7,0,3,"UDI,NAP,INT"], ["Francesco Pio Esposito",2005,"IT","FW",94,0,3,"INT"],
 ["John Stones",1994,"GB-ENG","DF",6,0,2,"BNS,EVE,MCI,INT"],
 ["Adrien Rabiot",1995,"FR","MF",12,0,2,"PSG,JUV,OM,MIL"], ["Ruben Loftus-Cheek",1996,"GB-ENG","MF",8,0,3,"CHE,MIL"], ["Fikayo Tomori",1997,"GB-ENG","DF",23,0,3,"CHE,MIL"],
 ["Gleison Bremer",1997,"BR","DF",3,0,3,"CAM,TOR,JUV"], ["Manuel Locatelli",1998,"IT","MF",5,0,3,"MIL,SAS,JUV"], ["Teun Koopmeiners",1998,"NL","MF",8,0,3,"AZ,ATA,JUV"],
 ["Francisco Conceição",2002,"PT","FW",7,0,3,"POR,AJA,POR,JUV"], ["Weston McKennie",1998,"US","MF",22,0,3,"S04,JUV"], ["Andrea Cambiaso",2000,"IT","DF",20,0,3,"GEN,JUV"],
 ["Randal Kolo Muani",1998,"FR","FW",9,0,2,"NAN,FRA,PSG,JUV"], ["Douglas Luiz",1998,"BR","MF",12,0,3,"VAS,AVL,JUV"],
 ["Scott McTominay",1996,"GB-SCT","MF",8,0,2,"MUN,NAP"], ["Stanislav Lobotka",1994,"SK","MF",68,0,3,"NSJ,CLV,NAP"], ["Giovanni Di Lorenzo",1993,"IT","DF",22,0,3,"EMP,NAP"],
 ["Frank Anguissa",1995,"CM","MF",99,0,3,"OM,FUL,NAP"], ["Noa Lang",1999,"NL","FW",70,0,3,"AJA,BRU,PSV,NAP"], ["Matteo Politano",1993,"IT","FW",21,0,3,"SAS,INT,NAP"],
 // BUNDESLIGA
 ["Michael Olise",2001,"FR","FW",17,0,2,"RDG,CRY,FCB"], ["Dayot Upamecano",1998,"FR","DF",2,0,3,"SAL,RBL,FCB"], ["Jonathan Tah",1996,"DE","DF",4,0,3,"HSV,LEV,FCB"],
 ["Aleksandar Pavlović",2004,"DE","MF",45,0,3,"FCB"], ["Konrad Laimer",1997,"AT","DF",27,0,3,"SAL,RBL,FCB"],
 ["Gregor Kobel",1997,"CH","GK",1,0,3,"HOF,STU,BVB"], ["Nico Schlotterbeck",1999,"DE","DF",4,0,3,"FRB,BVB"], ["Serhou Guirassy",1996,"GN","FW",9,0,2,"LIL,KOL,REN,STU,BVB"],
 ["Jobe Bellingham",2005,"GB-ENG","MF",7,0,3,"BIR,SUN,BVB"],
 // LIGUE 1
 ["Désiré Doué",2005,"FR","FW",14,0,2,"REN,PSG"], ["Warren Zaïre-Emery",2006,"FR","MF",33,0,3,"PSG"], ["João Neves",2004,"PT","MF",87,0,2,"BEN,PSG"],
 ["Willian Pacho",2001,"EC","DF",51,0,3,"IDV,ANW,FRA,PSG"], ["Lucas Hernández",1996,"FR","DF",21,1,3,"ATM,FCB,PSG"], ["Lucas Chevalier",2001,"FR","GK",30,0,3,"LIL,PSG"],
 // SÜPER LİG
 ["Gabriel Sara",1999,"BR","MF",8,0,3,"SAO,NWC,GS"], ["Lucas Torreira",1996,"UY","MF",34,0,3,"PES,SAM,ARS,FIO,GS"], ["Davinson Sánchez",1996,"CO","DF",6,0,3,"ANA,AJA,TOT,GS"],
 ["Yunus Akgün",2000,"TR","FW",11,0,3,"GS"], ["Roland Sallai",1997,"HU","FW",7,0,3,"FRB,GS"], ["Mario Lemina",1993,"GA","MF",99,0,3,"OM,JUV,SOU,NIC,WOL,GS"],
 ["İsmail Jakobs",1999,"SN","DF",4,0,3,"KOL,MON,GS"], ["Deniz Gül",2004,"TR","FW",21,0,3,"HAM,POR,GS"],
 ["Milan Škriniar",1995,"SK","DF",37,0,3,"SAM,INT,PSG,FB"], ["Mattéo Guendouzi",1999,"FR","MF",6,0,3,"LOR,ARS,OM,LAZ,FB"], ["N'Golo Kanté",1991,"FR","MF",91,1,1,"CAE,LEI,CHE,ITT,FB"],
 ["Nélson Semedo",1993,"PT","DF",27,0,3,"BEN,BAR,WOL,FB"], ["Marco Asensio",1996,"ES","MF",10,0,2,"MLL,RMA,PSG,FB"], ["Mason Greenwood",2001,"GB-ENG","FW",11,0,2,"MUN,OM,FB"],
 ["Nathan Aké",1995,"NL","DF",15,0,3,"CHE,BOU,MCI,FB"], ["Vedat Muriqi",1994,"XK","FW",19,0,3,"GRS,RIZ,FB,LAZ,MLL,FB"], ["Oğuz Aydın",2000,"TR","FW",70,0,3,"ALN,FB"],
 ["Mert Günok",1989,"TR","GK",34,0,3,"FB,BUR,IBB,BJK,FB"], ["İrfan Can Kahveci",1995,"TR","MF",17,0,3,"GNC,IBB,FB"],
 ["Leandro Trossard",1994,"BE","FW",19,0,2,"GNK,BHA,ARS,BJK"], ["Salih Özcan",1998,"TR","MF",6,0,3,"KOL,BVB,BJK"], ["Rıdvan Yılmaz",2001,"TR","DF",33,0,3,"BJK,RAN,BJK"],
 ["André Onana",1996,"CM","GK",24,0,3,"AJA,INT,MUN,TS"], ["Paul Onuachu",1994,"NG","FW",30,0,3,"FCM,GNK,SOU,TS"]
];
const have=new Set(window.FK_GPLAYERS.map(p=>p[0]));
ADD.forEach(p=>{ if(!have.has(p[0])) window.FK_GPLAYERS.push(p); });
// Hepsi şu an aktif → Güncel moduna ekle
ADD.forEach(p=>{ if(window.FK_ACTIVE.indexOf(p[0])<0) window.FK_ACTIVE.push(p[0]); });
})();
