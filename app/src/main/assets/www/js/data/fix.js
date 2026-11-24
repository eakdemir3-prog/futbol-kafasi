/* v1.6 veri düzeltmeleri — kaynakla doğrulanmış kayıtlar ve otomatik tutarlılık işaretleri.
   Kurallar: ana kulüp listesi (r[7]) A takım kariyeri, oynama sırasıyla; son eleman oyuncunun şu an oynadığı kulüp.
   Şu an kiralıkta oynayanlar FK_LOANNOW ile işaretlenir: güncel kulüp/lig sorularında kiralık kulüp, Transfer Rotası'nda gösterilmez (kiralıklar hariç).
   Kaynaklar (erişim 2026-11-25):
   - Robert Sánchez: Brighton → Chelsea (Ağu 2023), Como'ya 2026/27 kiralık — chelseafc.com/en/news/article/robert-sanchez-departs-on-loan, comofootball.com
   - Marc-André ter Stegen: Mönchengladbach → Barcelona; Girona kiralık (Oca 2026), Ajax kiralık 2026/27 — english.ajax.nl/teams/ajax-1/marc-ter-stegen, goal.com
   - Mohamed Salah: Liverpool → Trabzonspor (Ağu 2026, serbest) — liverpoolfc.com/news/mohamed-salah-signs-trabzonspor */
(function(){
const FIX={ "Robert Sánchez":"BHA,CHE,COM", "Marc-André ter Stegen":"MGL,BAR,AJA" };
window.FK_LOANNOW=Object.assign({ "Robert Sánchez":"COM", "Marc-André ter Stegen":"AJA" }, window.FK_LOANNOW||{});
const ST=window.FK_FIXSTATS={fixed:0, autoLoan:0, yearsDropped:0, scanned:0};
const rows=(window.FK_GPLAYERS||[]).concat(window.FK_XPLAYERS||[]);
rows.forEach(r=>{ if(FIX[r[0]]&&r[7]!==FIX[r[0]]){ r[7]=FIX[r[0]]; ST.fixed++; } });
/* otomatik: ana listenin son kulübü aynı oyuncunun kiralık kaydında da varsa, güncel kiralık say */
const LO=window.FK_LOANS||{};
rows.forEach(r=>{ ST.scanned++; const cl=String(r[7]).split(","), last=cl[cl.length-1]; if(!last||window.FK_LOANNOW[r[0]]) return;
  const ls=new Set(String(r[8]||"").split(",").concat(String(LO[r[0]]||"").split(",")).filter(Boolean));
  if(cl.length>=2 && ls.has(last) && cl.indexOf(last)===cl.length-1){ window.FK_LOANNOW[r[0]]=last; ST.autoLoan++; } });
})();
