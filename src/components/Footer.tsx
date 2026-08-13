import Link from 'next/link';
import { Sprout, ShieldCheck, Award, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Col 1 */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white">Temu<span className="text-emerald-400">Tani</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Marketplace B2B limbah pertanian yang menghubungkan kelompok tani / gapoktan dengan pembeli bahan baku alternatif berbasis AI Recommendation Engine.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
            <Award className="w-3.5 h-3.5" /> GEMASTIK 2026 Divisi Bisnis TIK
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Limbah Pertanian (Fase 1)</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="hover:text-emerald-400 transition-colors">Sekam Padi (Rice Husk)</li>
            <li className="hover:text-emerald-400 transition-colors">Jerami Padi (Rice Straw)</li>
            <li className="hover:text-emerald-400 transition-colors">Limbah Jagung (Tongkol & Batang)</li>
            <li className="hover:text-emerald-400 transition-colors">Sabut Kelapa (Coconut Coir)</li>
            <li className="hover:text-emerald-400 transition-colors">Jerami Kedelai (Soybean Straw)</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Sektor Pembeli (Buyer)</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="hover:text-emerald-400 transition-colors">Produsen Biofertilizer & Pupuk</li>
            <li className="hover:text-emerald-400 transition-colors">Pembudidaya Jamur Merang & Tiram</li>
            <li className="hover:text-emerald-400 transition-colors">Produsen Media Tanam & Kompos</li>
            <li className="hover:text-emerald-400 transition-colors">Pabrik Biomassa / Briket Energi</li>
            <li className="hover:text-emerald-400 transition-colors">Peternak (Pakan Fermentasi Silase)</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Keamanan & Scope</h4>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Agri Non-B3 Waste Only
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sistem membatasi input khusus 5 limbah pertanian non-B3 dari agregasi Gapoktan / kelompok tani terstruktur.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 TemuTani. Dibuat untuk GEMASTIK 2026.</p>
        <p className="flex items-center gap-1">
          Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk keberlanjutan agribisnis Indonesia.
        </p>
      </div>
    </footer>
  );
}
