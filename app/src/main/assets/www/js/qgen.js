/* ==========================================================
   v1.1 — Soru havuzu genişletme
   1) Elle yazılmış ek sorular (değişmeyen tarihsel bilgiler)
   2) Oyuncu veritabanından otomatik üretilen sorular (sabit tohumla: herkeste aynı)
   ========================================================== */
(function(){
const FK=window.FK;
const Q=(k,d,tr,en,a)=>({k,d,q:[tr,en],a});
const C=(tr,en)=>[tr,en];
window.FK_QUESTIONS.push(
 // ---- Dünya Kupası ----
 Q("wc",2,"1950 Dünya Kupası'nı hangi ülke kazandı?","Who won the 1950 World Cup?",[C("Uruguay","Uruguay"),C("Brezilya","Brazil"),C("İtalya","Italy"),C("İsveç","Sweden")]),
 Q("wc",2,"1970 Dünya Kupası'nı hangi ülke kazandı?","Who won the 1970 World Cup?",[C("Brezilya","Brazil"),C("İtalya","Italy"),C("Batı Almanya","West Germany"),C("Meksika","Mexico")]),
 Q("wc",3,"1974 Dünya Kupası'nı hangi ülke kazandı?","Who won the 1974 World Cup?",[C("Batı Almanya","West Germany"),C("Hollanda","Netherlands"),C("Polonya","Poland"),C("Brezilya","Brazil")]),
 Q("wc",2,"1978 Dünya Kupası'nı hangi ülke kazandı?","Who won the 1978 World Cup?",[C("Arjantin","Argentina"),C("Hollanda","Netherlands"),C("Brezilya","Brazil"),C("İtalya","Italy")]),
 Q("wc",2,"1982 Dünya Kupası'nı hangi ülke kazandı?","Who won the 1982 World Cup?",[C("İtalya","Italy"),C("Batı Almanya","West Germany"),C("Brezilya","Brazil"),C("Fransa","France")]),
 Q("wc",2,"1990 Dünya Kupası'nı hangi ülke kazandı?","Who won the 1990 World Cup?",[C("Batı Almanya","West Germany"),C("Arjantin","Argentina"),C("İtalya","Italy"),C("İngiltere","England")]),
 Q("wc",2,"1994 Dünya Kupası'nı hangi ülke kazandı?","Who won the 1994 World Cup?",[C("Brezilya","Brazil"),C("İtalya","Italy"),C("İsveç","Sweden"),C("Bulgaristan","Bulgaria")]),
 Q("wc",1,"2002 Dünya Kupası'nı hangi ülke kazandı?","Who won the 2002 World Cup?",[C("Brezilya","Brazil"),C("Almanya","Germany"),C("Türkiye","Türkiye"),C("Güney Kore","South Korea")]),
 Q("wc",1,"2010 Dünya Kupası hangi ülkede düzenlendi?","Where was the 2010 World Cup held?",[C("Güney Afrika","South Africa"),C("Brezilya","Brazil"),C("Almanya","Germany"),C("Japonya","Japan")]),
 Q("wc",1,"2014 Dünya Kupası hangi ülkede düzenlendi?","Where was the 2014 World Cup held?",[C("Brezilya","Brazil"),C("Rusya","Russia"),C("Arjantin","Argentina"),C("Meksika","Mexico")]),
 Q("wc",1,"2018 Dünya Kupası hangi ülkede düzenlendi?","Where was the 2018 World Cup held?",[C("Rusya","Russia"),C("Almanya","Germany"),C("Katar","Qatar"),C("Fransa","France")]),
 Q("wc",1,"2006 Dünya Kupası hangi ülkede düzenlendi?","Where was the 2006 World Cup held?",[C("Almanya","Germany"),C("İtalya","Italy"),C("Fransa","France"),C("İspanya","Spain")]),
 Q("wc",2,"2014 Dünya Kupası finalinde Almanya'nın golünü kim attı?","Who scored Germany's goal in the 2014 World Cup final?",["Mario Götze","Thomas Müller","Miroslav Klose","Toni Kroos"]),
 Q("wc",2,"2010 Dünya Kupası finalinde İspanya'nın golünü kim attı?","Who scored Spain's goal in the 2010 World Cup final?",["Andrés Iniesta","David Villa","Xavi","Fernando Torres"]),
 Q("wc",2,"2014 Dünya Kupası yarı finalinde Almanya Brezilya'yı kaç kaç yendi?","What was the score when Germany beat Brazil in the 2014 semi-final?",["7-1","5-0","4-1","6-2"]),
 Q("wc",2,"2022 Dünya Kupası'nda Altın Top'u (en iyi oyuncu) kim kazandı?","Who won the Golden Ball at the 2022 World Cup?",["Lionel Messi","Kylian Mbappé","Luka Modrić","Julián Álvarez"]),
 Q("wc",3,"2018 Dünya Kupası'nda Altın Top'u (en iyi oyuncu) kim kazandı?","Who won the Golden Ball at the 2018 World Cup?",["Luka Modrić","Kylian Mbappé","Antoine Griezmann","Harry Kane"]),
 Q("wc",2,"2018 Dünya Kupası'nın gol kralı kim?","Who was the top scorer of the 2018 World Cup?",["Harry Kane","Romelu Lukaku","Kylian Mbappé","Cristiano Ronaldo"]),
 Q("wc",2,"2022 Dünya Kupası'nın gol kralı kim?","Who was the top scorer of the 2022 World Cup?",["Kylian Mbappé","Lionel Messi","Olivier Giroud","Julián Álvarez"]),
 Q("wc",3,"2014 Dünya Kupası'nın gol kralı kim?","Who was the top scorer of the 2014 World Cup?",["James Rodríguez","Thomas Müller","Lionel Messi","Neymar"]),
 Q("wc",2,"Pelé kaç kez Dünya Kupası kazandı?","How many World Cups did Pelé win?",["3","2","4","1"]),
 Q("wc",2,"Dünya Kupası'nın tüm turnuvalarında yer alan tek ülke hangisi?","Which is the only country to play at every World Cup?",[C("Brezilya","Brazil"),C("Almanya","Germany"),C("İtalya","Italy"),C("Arjantin","Argentina")]),
 Q("wc",3,"1966 Dünya Kupası finalinde hat-trick yapan oyuncu kim?","Who scored a hat-trick in the 1966 World Cup final?",["Geoff Hurst","Bobby Charlton","Bobby Moore","Roger Hunt"]),
 Q("wc",3,"Türkiye ilk kez hangi yıl Dünya Kupası'nda oynadı?","In which year did Türkiye first play at a World Cup?",["1954","1950","1962","2002"]),
 Q("wc",2,"2002 Dünya Kupası üçüncülük maçında Türkiye hangi takımı yendi?","Whom did Türkiye beat in the 2002 World Cup third-place match?",[C("Güney Kore","South Korea"),C("Japonya","Japan"),C("Senegal","Senegal"),C("ABD","USA")]),
 Q("wc",3,"2002 Dünya Kupası çeyrek finalinde Türkiye hangi takımı eledi?","Whom did Türkiye knock out in the 2002 World Cup quarter-final?",[C("Senegal","Senegal"),C("Japonya","Japan"),C("ABD","USA"),C("İrlanda","Ireland")]),
 Q("wc",3,"2002 Dünya Kupası çeyrek finalinde Senegal'e karşı altın golü kim attı?","Who scored the golden goal against Senegal in the 2002 quarter-final?",["İlhan Mansız","Hasan Şaş","Ümit Davala","Emre Belözoğlu"]),
 // ---- Avrupa Şampiyonası ----
 Q("eu",1,"EURO 2012'yi hangi ülke kazandı?","Who won EURO 2012?",[C("İspanya","Spain"),C("İtalya","Italy"),C("Almanya","Germany"),C("Portekiz","Portugal")]),
 Q("eu",1,"EURO 2008'i hangi ülke kazandı?","Who won EURO 2008?",[C("İspanya","Spain"),C("Almanya","Germany"),C("Rusya","Russia"),C("Türkiye","Türkiye")]),
 Q("eu",2,"EURO 2000'i hangi ülke kazandı?","Who won EURO 2000?",[C("Fransa","France"),C("İtalya","Italy"),C("Portekiz","Portugal"),C("Hollanda","Netherlands")]),
 Q("eu",2,"EURO 1996'yı hangi ülke kazandı?","Who won EURO 1996?",[C("Almanya","Germany"),C("Çekya","Czechia"),C("İngiltere","England"),C("Fransa","France")]),
 Q("eu",2,"EURO 2016 finalinde Portekiz'in golünü kim attı?","Who scored Portugal's goal in the EURO 2016 final?",["Éder","Cristiano Ronaldo","Nani","Renato Sanches"]),
 Q("eu",2,"EURO 2020 finali hangi stadyumda oynandı?","Where was the EURO 2020 final played?",["Wembley","San Siro","Allianz Arena",C("Olimpiyat Stadı","Olympic Stadium")]),
 Q("eu",1,"EURO 2024 hangi ülkede düzenlendi?","Where was EURO 2024 held?",[C("Almanya","Germany"),C("Fransa","France"),C("İngiltere","England"),C("İtalya","Italy")]),
 Q("eu",2,"EURO 2032'ye Türkiye hangi ülkeyle birlikte ev sahipliği yapacak?","Which country will co-host EURO 2032 with Türkiye?",[C("İtalya","Italy"),C("İspanya","Spain"),C("Yunanistan","Greece"),C("Fransa","France")]),
 Q("eu",2,"EURO 2008 çeyrek finalinde Türkiye hangi takımı penaltılarla eledi?","Whom did Türkiye beat on penalties in the EURO 2008 quarter-final?",[C("Hırvatistan","Croatia"),C("Çekya","Czechia"),C("Almanya","Germany"),C("İsviçre","Switzerland")]),
 Q("eu",2,"EURO 2008 yarı finalinde Türkiye'yi hangi takım eledi?","Who knocked Türkiye out in the EURO 2008 semi-final?",[C("Almanya","Germany"),C("İspanya","Spain"),C("Rusya","Russia"),C("Hollanda","Netherlands")]),
 Q("eu",2,"EURO 2024 son 16 turunda Türkiye hangi takımı yendi?","Whom did Türkiye beat in the EURO 2024 round of 16?",[C("Avusturya","Austria"),C("Gürcistan","Georgia"),C("Çekya","Czechia"),C("Portekiz","Portugal")]),
 // ---- Şampiyonlar Ligi / Avrupa kupaları ----
 Q("cl",1,"2024 Şampiyonlar Ligi'ni hangi takım kazandı?","Who won the 2024 Champions League?",["Real Madrid","Borussia Dortmund",C("Bayern Münih","Bayern Munich"),"Paris Saint-Germain"]),
 Q("cl",1,"2025 Şampiyonlar Ligi'ni hangi takım kazandı?","Who won the 2025 Champions League?",["Paris Saint-Germain","Inter","Arsenal","Barcelona"]),
 Q("cl",2,"2025 Şampiyonlar Ligi finalinde PSG hangi takımı yendi?","Whom did PSG beat in the 2025 Champions League final?",["Inter","Arsenal","Barcelona","Real Madrid"]),
 Q("cl",2,"2022 Şampiyonlar Ligi finalinde Real Madrid hangi takımı yendi?","Whom did Real Madrid beat in the 2022 Champions League final?",["Liverpool","Manchester City","Chelsea",C("Bayern Münih","Bayern Munich")]),
 Q("cl",2,"2021 Şampiyonlar Ligi'ni hangi takım kazandı?","Who won the 2021 Champions League?",["Chelsea","Manchester City","Real Madrid",C("Bayern Münih","Bayern Munich")]),
 Q("cl",2,"2020 Şampiyonlar Ligi'ni hangi takım kazandı?","Who won the 2020 Champions League?",[C("Bayern Münih","Bayern Munich"),"Paris Saint-Germain","Liverpool","Barcelona"]),
 Q("cl",2,"2019 Şampiyonlar Ligi'ni hangi takım kazandı?","Who won the 2019 Champions League?",["Liverpool","Tottenham","Barcelona","Ajax"]),
 Q("cl",1,"2016, 2017 ve 2018'de Şampiyonlar Ligi'ni üst üste kazanan takım hangisi?","Which club won the Champions League in 2016, 2017 and 2018?",["Real Madrid","Barcelona",C("Bayern Münih","Bayern Munich"),"Juventus"]),
 Q("cl",2,"2015 Şampiyonlar Ligi'ni hangi takım kazandı?","Who won the 2015 Champions League?",["Barcelona","Juventus","Real Madrid",C("Bayern Münih","Bayern Munich")]),
 Q("cl",2,"2010 Şampiyonlar Ligi'ni hangi takım kazandı?","Who won the 2010 Champions League?",["Inter",C("Bayern Münih","Bayern Munich"),"Barcelona","Manchester United"]),
 Q("cl",2,"2008 Şampiyonlar Ligi finali hangi iki takım arasında oynandı?","Which two clubs played the 2008 Champions League final?",["Manchester United - Chelsea","Liverpool - Milan","Arsenal - Barcelona","Chelsea - Liverpool"]),
 Q("cl",1,"Şampiyonlar Ligi'nin tüm zamanlar en golcü oyuncusu kim?","Who is the Champions League's all-time top scorer?",["Cristiano Ronaldo","Lionel Messi","Robert Lewandowski","Karim Benzema"]),
 Q("cl",2,"1999 Şampiyonlar Ligi finalinde Manchester United son dakikalarda hangi takımı yendi?","Whom did Manchester United beat with late goals in the 1999 final?",[C("Bayern Münih","Bayern Munich"),"Juventus","Barcelona","Valencia"]),
 Q("cl",3,"Ajax Şampiyonlar Ligi'ni en son hangi yıl kazandı?","When did Ajax last win the Champions League?",["1995","1996","1973","1992"]),
 Q("cl",2,"UEFA Avrupa Ligi'ni en çok kazanan kulüp hangisi?","Which club has won the UEFA Europa League the most?",["Sevilla","Liverpool","Inter",C("Atlético Madrid","Atlético Madrid")]),
 Q("cl",2,"Galatasaray 2000 UEFA Süper Kupası'nda hangi takımı yendi?","Whom did Galatasaray beat in the 2000 UEFA Super Cup?",["Real Madrid","Barcelona",C("Bayern Münih","Bayern Munich"),"Milan"]),
 // ---- Türk futbolu ----
 Q("tr",1,"Süper Lig'i en çok kazanan kulüp hangisi?","Which club has won the Süper Lig the most?",["Galatasaray","Fenerbahçe","Beşiktaş","Trabzonspor"]),
 Q("tr",3,"Galatasaray'ın stadyumu İstanbul'un hangi ilçesindedir?","In which Istanbul district is Galatasaray's stadium?",["Sarıyer","Kadıköy","Beşiktaş","Şişli"]),
 Q("tr",1,"Fenerbahçe İstanbul'un hangi ilçesinin kulübüdür?","Fenerbahçe is a club from which Istanbul district?",["Kadıköy","Beşiktaş","Üsküdar","Sarıyer"]),
 Q("tr",1,"'Karadeniz Fırtınası' hangi kulübün lakabıdır?","'Black Sea Storm' is the nickname of which club?",["Trabzonspor","Samsunspor","Rizespor","Giresunspor"]),
 Q("tr",1,"'Sarı Kanaryalar' hangi kulübün lakabıdır?","'Yellow Canaries' is the nickname of which club?",["Fenerbahçe","Galatasaray","Ankaragücü","Göztepe"]),
 Q("tr",2,"'Timsah' lakabı hangi kulübe aittir?","The 'Crocodile' nickname belongs to which club?",["Bursaspor","Konyaspor","Göztepe","Sivasspor"]),
 Q("tr",2,"2019-20 Süper Lig şampiyonu hangi takım?","Who won the 2019-20 Süper Lig?",[C("İstanbul Başakşehir","İstanbul Başakşehir"),"Trabzonspor","Galatasaray","Fenerbahçe"]),
 Q("tr",2,"Fatih Terim yönetimindeki Galatasaray 1996-2000 arasında üst üste kaç kez lig şampiyonu oldu?","How many consecutive league titles did Galatasaray win under Fatih Terim in 1996-2000?",["4","3","5","2"]),
 Q("tr",1,"Rüştü Reçber hangi mevkide oynardı?","What position did Rüştü Reçber play?",[C("Kaleci","Goalkeeper"),C("Stoper","Centre-back"),C("Forvet","Striker"),C("Orta saha","Midfielder")]),
 Q("tr",3,"Emre Belözoğlu Inter'den sonra hangi İngiliz kulübüne transfer oldu?","Which English club did Emre Belözoğlu join after Inter?",["Newcastle United","Blackburn Rovers","Everton","Aston Villa"]),
 Q("tr",3,"Nihat Kahveci'nin forma giydiği İspanyol kulübü hangisi?","Which Spanish club did Nihat Kahveci play for?",["Real Sociedad","Sevilla","Valencia","Celta Vigo"]),
 Q("tr",3,"Tugay Kerimoğlu İngiltere'de hangi kulüpte oynadı?","Which English club did Tugay Kerimoğlu play for?",["Blackburn Rovers","Bolton Wanderers","Fulham","Newcastle United"]),
 Q("tr",2,"Mesut Özil hangi Türk kulübünde forma giydi?","Which of these Turkish clubs did Mesut Özil play for?",["Fenerbahçe","Galatasaray","Beşiktaş","Trabzonspor"]),
 Q("tr",3,"Gheorghe Hagi Galatasaray'a hangi kulüpten geldi?","Which club did Gheorghe Hagi join Galatasaray from?",["Barcelona","Real Madrid","Brescia","Steaua Bükreş"]),
 // ---- Futbolcular ----
 Q("pl",2,"2023 Ballon d'Or'u kim kazandı?","Who won the 2023 Ballon d'Or?",["Lionel Messi","Erling Haaland","Kylian Mbappé","Kevin De Bruyne"]),
 Q("pl",2,"2024 Ballon d'Or'u kim kazandı?","Who won the 2024 Ballon d'Or?",["Rodri","Vinícius Júnior","Jude Bellingham","Dani Carvajal"]),
 Q("pl",2,"2025 Ballon d'Or'u kim kazandı?","Who won the 2025 Ballon d'Or?",["Ousmane Dembélé","Lamine Yamal","Vitinha","Mohamed Salah"]),
 Q("pl",2,"2018 Ballon d'Or'u kim kazandı?","Who won the 2018 Ballon d'Or?",["Luka Modrić","Cristiano Ronaldo","Antoine Griezmann","Kylian Mbappé"]),
 Q("pl",3,"2007 Ballon d'Or'u kim kazandı?","Who won the 2007 Ballon d'Or?",["Kaká","Cristiano Ronaldo","Lionel Messi","Didier Drogba"]),
 Q("pl",3,"2006 Ballon d'Or'u kim kazandı?","Who won the 2006 Ballon d'Or?",["Fabio Cannavaro","Gianluigi Buffon","Thierry Henry","Ronaldinho"]),
 Q("pl",1,"Cristiano Ronaldo profesyonel kariyerine hangi kulüpte başladı?","Where did Cristiano Ronaldo start his professional career?",["Sporting CP","Benfica","Porto","Manchester United"]),
 Q("pl",1,"Zlatan İbrahimović hangi ülkenin futbolcusudur?","Which country did Zlatan Ibrahimović play for?",[C("İsveç","Sweden"),C("Norveç","Norway"),C("Danimarka","Denmark"),C("Bosna-Hersek","Bosnia")]),
 Q("pl",1,"Didier Drogba hangi ülkenin futbolcusudur?","Which country did Didier Drogba play for?",[C("Fildişi Sahili","Ivory Coast"),C("Gana","Ghana"),C("Kamerun","Cameroon"),C("Senegal","Senegal")]),
 Q("pl",1,"Gheorghe Hagi hangi ülkenin futbolcusudur?","Which country did Gheorghe Hagi play for?",[C("Romanya","Romania"),C("Bulgaristan","Bulgaria"),C("Macaristan","Hungary"),C("Sırbistan","Serbia")]),
 Q("pl",1,"'Kral' lakabıyla bilinen Brezilyalı efsane kim?","Which Brazilian legend is known as 'The King'?",["Pelé","Ronaldo","Zico","Garrincha"]),
 Q("pl",2,"'Kaiser' lakabıyla bilinen futbolcu kim?","Which footballer was known as 'Der Kaiser'?",["Franz Beckenbauer","Gerd Müller","Lothar Matthäus","Karl-Heinz Rummenigge"]),
 Q("pl",2,"Kaká Real Madrid'e hangi kulüpten transfer oldu?","Which club did Kaká join Real Madrid from?",["Milan","São Paulo","Inter","Chelsea"]),
 Q("pl",2,"Neymar Barcelona'dan PSG'ye hangi yıl transfer oldu?","In which year did Neymar move from Barcelona to PSG?",["2017","2016","2018","2019"]),
 Q("pl",1,"Erling Haaland Manchester City'ye hangi kulüpten geldi?","Which club did Erling Haaland join Manchester City from?",["Borussia Dortmund","Red Bull Salzburg","Molde",C("Bayern Münih","Bayern Munich")]),
 Q("pl",2,"Jude Bellingham Real Madrid'e hangi kulüpten transfer oldu?","Which club did Jude Bellingham join Real Madrid from?",["Borussia Dortmund","Birmingham City","Liverpool","Chelsea"]),
 Q("pl",1,"Kylian Mbappé Real Madrid'e hangi yıl katıldı?","In which year did Kylian Mbappé join Real Madrid?",["2024","2022","2023","2025"]),
 Q("pl",3,"Thierry Henry Arsenal'e hangi kulüpten geldi?","Which club did Thierry Henry join Arsenal from?",["Juventus","Monaco","Barcelona","Inter"]),
 Q("pl",2,"Ronaldinho Barcelona'ya hangi kulüpten geldi?","Which club did Ronaldinho join Barcelona from?",["Paris Saint-Germain","Grêmio","Milan","Flamengo"]),
 Q("pl",1,"Paolo Maldini tüm kariyerini hangi kulüpte geçirdi?","Which club did Paolo Maldini spend his whole career at?",["Milan","Inter","Juventus","Roma"]),
 Q("pl",1,"Francesco Totti tüm kariyerini hangi kulüpte geçirdi?","Which club did Francesco Totti spend his whole career at?",["Roma","Lazio","Milan","Juventus"]),
 Q("pl",1,"Steven Gerrard kariyerinin büyük bölümünü hangi kulüpte geçirdi?","Which club did Steven Gerrard spend most of his career at?",["Liverpool","Everton","Chelsea","LA Galaxy"]),
 Q("pl",1,"Robert Lewandowski hangi ülkenin futbolcusudur?","Which country does Robert Lewandowski play for?",[C("Polonya","Poland"),C("Çekya","Czechia"),C("Ukrayna","Ukraine"),C("Slovakya","Slovakia")]),
 Q("pl",1,"Son Heung-min hangi ülkenin futbolcusudur?","Which country does Son Heung-min play for?",[C("Güney Kore","South Korea"),C("Japonya","Japan"),C("Çin","China"),C("Avustralya","Australia")]),
 Q("pl",2,"Premier Lig tarihinin en golcü oyuncusu kim?","Who is the Premier League's all-time top scorer?",["Alan Shearer","Harry Kane","Wayne Rooney","Thierry Henry"]),
 Q("pl",2,"Bir Premier Lig sezonunda 36 golle rekor kıran oyuncu kim?","Who set the Premier League record of 36 goals in a season?",["Erling Haaland","Mohamed Salah","Alan Shearer","Harry Kane"]),
 Q("pl",1,"La Liga tarihinin en golcü oyuncusu kim?","Who is LaLiga's all-time top scorer?",["Lionel Messi","Cristiano Ronaldo","Telmo Zarra","Hugo Sánchez"]),
 Q("pl",2,"Bundesliga tarihinin en golcü oyuncusu kim?","Who is the Bundesliga's all-time top scorer?",["Gerd Müller","Robert Lewandowski","Klaus Fischer","Jupp Heynckes"]),
 Q("pl",2,"Bir Bundesliga sezonunda 41 golle rekor kıran oyuncu kim?","Who set the Bundesliga record of 41 goals in a season?",["Robert Lewandowski","Gerd Müller","Harry Kane","Erling Haaland"]),
 // ---- Teknik direktörler ----
 Q("co",2,"Jürgen Klopp Liverpool'dan önce hangi kulübü çalıştırdı?","Which club did Jürgen Klopp manage before Liverpool?",["Borussia Dortmund","Mainz",C("Bayern Münih","Bayern Munich"),"Schalke 04"]),
 Q("co",1,"José Mourinho'nun meşhur lakabı nedir?","What is José Mourinho's famous nickname?",[C("Özel Biri (The Special One)","The Special One"),C("Profesör","The Professor"),C("Mimar","The Architect"),C("General","The General")]),
 Q("co",2,"Carlo Ancelotti 2025'te hangi milli takımın başına geçti?","Which national team did Carlo Ancelotti take charge of in 2025?",[C("Brezilya","Brazil"),C("İtalya","Italy"),C("Portekiz","Portugal"),C("Arjantin","Argentina")]),
 Q("co",2,"Zinedine Zidane Real Madrid ile üst üste kaç kez Şampiyonlar Ligi kazandı?","How many consecutive Champions League titles did Zidane win with Real Madrid?",["3","2","4","1"]),
 Q("co",2,"Pep Guardiola Manchester City'den önce hangi kulübü çalıştırdı?","Which club did Pep Guardiola manage before Manchester City?",[C("Bayern Münih","Bayern Munich"),"Barcelona","Borussia Dortmund","Juventus"]),
 Q("co",2,"Diego Simeone 2011'de hangi kulübün başına geçti?","Which club did Diego Simeone take over in 2011?",["Atlético Madrid","Inter","Lazio","Racing"]),
 Q("co",3,"Arsène Wenger Arsenal'de kaç yıl görev yaptı?","How many years did Arsène Wenger manage Arsenal?",["22","18","20","25"]),
 Q("co",3,"Sir Alex Ferguson Manchester United'la kaç lig şampiyonluğu kazandı?","How many league titles did Sir Alex Ferguson win with Manchester United?",["13","10","15","11"]),
 // ---- Milli takımlar ----
 Q("nt",1,"'La Roja' hangi milli takımın lakabıdır?","'La Roja' is the nickname of which national team?",[C("İspanya","Spain"),C("Portekiz","Portugal"),C("Meksika","Mexico"),C("Belçika","Belgium")]),
 Q("nt",1,"'Ay-Yıldızlılar' hangi milli takımın lakabıdır?","'The Crescent-Stars' is the nickname of which team?",[C("Türkiye","Türkiye"),C("Tunus","Tunisia"),C("Azerbaycan","Azerbaijan"),C("Fas","Morocco")]),
 Q("nt",2,"'Süper Kartallar' hangi milli takımın lakabıdır?","'Super Eagles' is the nickname of which national team?",[C("Nijerya","Nigeria"),C("Gana","Ghana"),C("Kamerun","Cameroon"),C("Senegal","Senegal")]),
 Q("nt",2,"'Atlas Aslanları' hangi milli takımın lakabıdır?","'Atlas Lions' is the nickname of which national team?",[C("Fas","Morocco"),C("Cezayir","Algeria"),C("Tunus","Tunisia"),C("Mısır","Egypt")]),
 Q("nt",2,"'Socceroos' hangi milli takımın lakabıdır?","'Socceroos' is the nickname of which national team?",[C("Avustralya","Australia"),C("Yeni Zelanda","New Zealand"),C("ABD","USA"),C("Kanada","Canada")]),
 Q("nt",2,"Copa América 2024'ü hangi ülke kazandı?","Who won the 2024 Copa América?",[C("Arjantin","Argentina"),C("Kolombiya","Colombia"),C("Uruguay","Uruguay"),C("Brezilya","Brazil")]),
 Q("nt",2,"2024'te oynanan Afrika Uluslar Kupası'nı hangi ülke kazandı?","Who won the Africa Cup of Nations played in 2024?",[C("Fildişi Sahili","Ivory Coast"),C("Nijerya","Nigeria"),C("Fas","Morocco"),C("Senegal","Senegal")]),
 // ---- Kurallar ----
 Q("ru",2,"Bir resmi maçta normal sürede en fazla kaç oyuncu değişikliği yapılabilir?","What's the maximum number of substitutions in normal time?",["5","3","4","6"]),
 Q("ru",1,"Savunan takım kendi ceza sahasında doğrudan serbest vuruşluk faul yaparsa ne verilir?","What is given for a direct free-kick foul by defenders inside their own penalty area?",[C("Penaltı","Penalty"),C("Endirekt serbest vuruş","Indirect free kick"),C("Korner","Corner kick"),C("Taç","Throw-in")]),
 Q("ru",2,"Serbest vuruşta baraj toptan en az kaç metre uzakta olmalıdır?","How far must the wall be from the ball at a free kick?",[C("9,15 metre","9.15 metres"),C("7 metre","7 metres"),C("11 metre","11 metres"),C("5,5 metre","5.5 metres")]),
 Q("ru",2,"Uzatma devreleri toplam kaç dakikadır?","How long is extra time in total?",[C("30 dakika","30 minutes"),C("20 dakika","20 minutes"),C("15 dakika","15 minutes"),C("45 dakika","45 minutes")]),
 // ---- Kuruluşlar ----
 Q("org",3,"Ballon d'Or ödülünü ilk olarak hangi dergi başlattı?","Which magazine created the Ballon d'Or?",["France Football","L'Équipe","Kicker","World Soccer"]),
 Q("org",1,"Dünya Kupası'nı hangi kuruluş düzenler?","Which organisation runs the World Cup?",["FIFA","UEFA","CONMEBOL","IOC"]),
 Q("org",1,"Şampiyonlar Ligi'ni hangi kuruluş düzenler?","Which organisation runs the Champions League?",["UEFA","FIFA","ECA","CAF"]),
 Q("org",3,"FIFA hangi yıl kuruldu?","In which year was FIFA founded?",["1904","1930","1920","1954"]),
 Q("org",3,"UEFA hangi yıl kuruldu?","In which year was UEFA founded?",["1954","1904","1960","1930"]),
 // ---- Kulüpler ----
 Q("cl2",1,"Camp Nou hangi kulübün stadyumudur?","Camp Nou is the home of which club?",["Barcelona","Espanyol","Valencia","Atlético Madrid"]),
 Q("cl2",1,"San Siro'yu hangi iki kulüp paylaşır?","Which two clubs share the San Siro?",["Inter - Milan","Juventus - Torino","Roma - Lazio","Napoli - Milan"]),
 Q("cl2",2,"Signal Iduna Park hangi kulübün stadyumudur?","Signal Iduna Park is the home of which club?",["Borussia Dortmund","Schalke 04","Bayer Leverkusen","Borussia Mönchengladbach"]),
 Q("cl2",2,"Ünlü 'The Kop' tribünü hangi stadyumdadır?","The famous 'Kop' stand is at which stadium?",["Anfield","Old Trafford","Goodison Park","Stamford Bridge"]),
 Q("cl2",2,"'Yaşlı Hanım' (La Vecchia Signora) hangi kulübün lakabıdır?","'The Old Lady' is the nickname of which club?",["Juventus","Milan","Roma","Napoli"]),
 Q("cl2",1,"'Kırmızı Şeytanlar' lakabı hangi İngiliz kulübüne aittir?","'The Red Devils' is the nickname of which English club?",["Manchester United","Liverpool","Arsenal","Nottingham Forest"]),
 Q("cl2",1,"'Topçular' (The Gunners) hangi kulübün lakabıdır?","'The Gunners' is the nickname of which club?",["Arsenal","West Ham","Chelsea","Tottenham"]),
 Q("cl2",1,"Ajax hangi şehrin kulübüdür?","Ajax is a club from which city?",[C("Amsterdam","Amsterdam"),C("Rotterdam","Rotterdam"),C("Eindhoven","Eindhoven"),C("Lahey","The Hague")]),
 Q("cl2",1,"Benfica hangi şehrin kulübüdür?","Benfica is a club from which city?",[C("Lizbon","Lisbon"),C("Porto","Porto"),C("Braga","Braga"),C("Madrid","Madrid")]),
 Q("cl2",2,"Celtic ile Rangers arasındaki derbinin adı nedir?","What is the derby between Celtic and Rangers called?",["Old Firm","Merseyside","Der Klassiker","Superclásico"]),
 Q("cl2",2,"Boca Juniors'ın ünlü stadyumunun adı nedir?","What is Boca Juniors' famous stadium called?",["La Bombonera","El Monumental","Maracanã","Centenario"]),
 Q("cl2",3,"Bayern Münih 2013-2023 arasında Bundesliga'yı üst üste kaç kez kazandı?","How many consecutive Bundesliga titles did Bayern win from 2013 to 2023?",["11","9","10","8"]),
 Q("cl2",2,"2023-24 Bundesliga'yı yenilgisiz kazanan takım hangisi?","Which team won the 2023-24 Bundesliga unbeaten?",["Bayer Leverkusen",C("Bayern Münih","Bayern Munich"),"Borussia Dortmund","RB Leipzig"]),
 Q("cl2",2,"Premier Lig'i üst üste 4 kez kazanan ilk takım hangisi?","Which was the first team to win four Premier League titles in a row?",["Manchester City","Manchester United","Chelsea","Liverpool"]),
 Q("cl2",3,"Napoli 2022-23'te Serie A'yı kaç yıl aradan sonra kazandı?","After how many years did Napoli win Serie A in 2022-23?",["33","25","30","40"]),
 Q("cl2",1,"2024-25 Premier Lig şampiyonu hangi takım?","Who won the 2024-25 Premier League?",["Liverpool","Arsenal","Manchester City","Chelsea"])
);

/* ---- otomatik üretilen sorular (sabit tohum → bütün cihazlarda aynı) ---- */
const r=FK.rng("qgen-v1"), sh=a=>FK.shuffle(a.slice(),r);
const ACT=new Set(window.FK_ACTIVE||[]);
const P=FK_GPLAYERS.map(x=>({name:x[0],by:x[1],nat:x[2],wc:x[5],fame:x[6],clubs:x[7].split(",").filter(c=>FK_GCLUBS[c])})).filter(p=>p.clubs.length);
const cn=c=>FK_GCLUBS[c][0], lg=c=>FK_GCLUBS[c][2];
const nm=cc=>[FK_COUNTRY_NAME(cc,"tr"),FK_COUNTRY_NAME(cc,"en")];
function FK_COUNTRY_NAME(cc,l){ const c=(window.FK_COUNTRIES||[]).find(x=>x[0]===cc); return c ? (l==="en"?(c[2]||c[1]):c[1]) : cc; }
const gen=[];
// A) şu anki kulüp
sh(P.filter(p=>ACT.has(p.name)&&p.fame<=2)).slice(0,60).forEach(p=>{ const cur=p.clubs[p.clubs.length-1];
  const w=sh(Object.keys(FK_GCLUBS).filter(c=>c!==cur&&lg(c)===lg(cur)&&p.clubs.indexOf(c)<0)).slice(0,3); if(w.length<3) return;
  gen.push(Q("pl",p.fame,p.name+" şu an hangi kulüpte oynuyor?","Which club does "+p.name+" currently play for?",[cn(cur)].concat(w.map(cn)))); });
// B) eski kulüp
sh(P.filter(p=>p.fame<=2&&p.clubs.length>=2)).slice(0,60).forEach(p=>{ const cur=p.clubs[p.clubs.length-1], past=p.clubs.filter(c=>c!==cur); if(!past.length) return; const ok=past[Math.floor(r()*past.length)];
  const lgs=new Set(p.clubs.map(lg)); const w=sh(Object.keys(FK_GCLUBS).filter(c=>p.clubs.indexOf(c)<0&&lgs.has(lg(c)))).slice(0,3); if(w.length<3) return;
  gen.push(Q("pl",p.fame+1,p.name+" kariyerinde hangi kulüpte forma giydi?","Which of these clubs has "+p.name+" played for?",[cn(ok)].concat(w.map(cn)))); });
// C) Dünya Kupası kazanan
const wcY=sh(P.filter(p=>p.wc&&p.fame<=2)), wcN=sh(P.filter(p=>!p.wc&&p.fame<=2));
for(let i=0;i<Math.min(25,wcY.length);i++){ const w=wcN.slice(i*3,i*3+3); if(w.length<3) break; gen.push(Q("wc",2,"Bu futbolculardan hangisi Dünya Kupası kazandı?","Which of these players won the World Cup?",[wcY[i].name].concat(w.map(x=>x.name)))); }
// D) ülke
sh(P.filter(p=>p.fame>=2)).slice(0,40).forEach(p=>{ const cont=FK_CONTINENT[p.nat]; const w=sh(Object.keys(FK_CONTINENT).filter(c=>c!==p.nat&&FK_CONTINENT[c]===cont&&(window.FK_COUNTRIES||[]).some(x=>x[0]===c))).slice(0,3); if(w.length<3) return;
  gen.push(Q("pl",p.fame,p.name+" hangi ülkenin futbolcusu?","Which country does "+p.name+" represent?",[nm(p.nat)].concat(w.map(nm)))); });
// E) doğum yılı
sh(P.filter(p=>p.fame===1)).slice(0,25).forEach(p=>{ const d=sh([-3,-2,-1,1,2,3]).slice(0,3); gen.push(Q("pl",3,p.name+" hangi yıl doğdu?","In which year was "+p.name+" born?",[String(p.by)].concat(d.map(x=>String(p.by+x))))); });
gen.forEach(q=>{ q.gen=1; window.FK_QUESTIONS.push(q); });
})();
