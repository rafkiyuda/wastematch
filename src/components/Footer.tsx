import Link from 'next/link';
import { Recycle, ShieldCheck, Award, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Col 1 */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Recycle className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white">Waste<span className="text-emerald-400">Match</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Marketplace B2B limbah organik yang menghubungkan UMKM penghasil limbah dengan sektor pertanian berbasis AI Recommendation Engine.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
            <Award className="w-3.5 h-3.5" /> GEMASTIK 2026 Divisi Bisnis TIK
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Kategori Limbah (Fase 1)</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="hover:text-emerald-400 transition-colors">Ampas Kopi (Coffee Grounds)</li>
            <li className="hover:text-emerald-400 transition-colors">Sekam Padi (Rice Husk)</li>
            <li className="hover:text-emerald-400 transition-colors">Kulit Buah & Sayur</li>
            <li className="hover:text-emerald-400 transition-colors">Serbuk Kayu / Gergaji</li>
            <li className="hover:text-emerald-400 transition-colors">Sisa Makanan Non-B3</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Sektor Pembeli (Buyer)</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="hover:text-emerald-400 transition-colors">Produsen Biofertilizer & Pupuk</li>
            <li className="hover:text-emerald-400 transition-colors">Pembudidaya Jamur Tiram</li>
            <li className="hover:text-emerald-400 transition-colors">Produsen Bio-Enzyme & Kompos</li>
            <li className="hover:text-emerald-400 transition-colors">Pabrik Biomassa / Briket Energi</li>
            <li className="hover:text-emerald-400 transition-colors">Peternak & Industri Maggot BSF</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Keamanan & Regulasi</h4>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Strictly Non-B3 Waste
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sistem membatasi kategori limbah dari pilihan tertutup untuk mencegah paparan limbah B3 (seperti minyak jelantah & oli).
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 WasteMatch. Dikembangkan untuk GEMASTIK 2026.</p>
        <p className="flex items-center gap-1">
          Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk keberlanjutan ekonomi sirkular Indonesia.
        </p>
      </div>
    </footer>
  );
}
