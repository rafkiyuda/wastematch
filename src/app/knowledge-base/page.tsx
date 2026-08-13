'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfflineBanner from '@/components/OfflineBanner';
import { BookOpen, Sparkles, Filter, ShieldAlert, CheckCircle2, TrendingUp, Search } from 'lucide-react';
import { CATEGORY_LABELS, WasteCategory } from '@/lib/types';

interface KBDetail {
  jenis_limbah: WasteCategory;
  kategori_pemanfaatan: string;
  estimasi_nilai_min: number;
  estimasi_nilai_max: number;
  skor_prioritas: number;
  alasan_ilmiah: string;
  rekomendasi_sektor: string;
}

const KB_DATA: KBDetail[] = [
  {
    jenis_limbah: 'sekam_padi',
    kategori_pemanfaatan: 'Media Tanam Arang Sekam & Biofertilizer',
    estimasi_nilai_min: 1500,
    estimasi_nilai_max: 2200,
    skor_prioritas: 98,
    alasan_ilmiah: 'Kandungan silika alami (SiO2 >80%) tinggi dan porositas sangat baik untuk memelihara aerasi akar & mikroba menguntungkan tanah.',
    rekomendasi_sektor: 'Produsen Media Tanam & Biofertilizer'
  },
  {
    jenis_limbah: 'sekam_padi',
    kategori_pemanfaatan: 'Bahan Bakar Biomassa Burner Pengeringan',
    estimasi_nilai_min: 700,
    estimasi_nilai_max: 1100,
    skor_prioritas: 82,
    alasan_ilmiah: 'Nilai kalor stabil (~4.200 kcal/kg) sangat efisien sebagai bahan bakar pembakaran burner pengering gabah & komoditas panen.',
    rekomendasi_sektor: 'Pabrik Biomassa & Burner Pengeringan'
  },
  {
    jenis_limbah: 'jerami_padi',
    kategori_pemanfaatan: 'Substrat Utama Media Tanam Jamur Merang & Tiram',
    estimasi_nilai_min: 1200,
    estimasi_nilai_max: 1800,
    skor_prioritas: 96,
    alasan_ilmiah: 'Kandungan selulosa dan hemi-selulosa ideal yang mudah diuraikan oleh miselium jamur merang & tiram.',
    rekomendasi_sektor: 'Pembudidaya Jamur Merang & Tiram'
  },
  {
    jenis_limbah: 'jerami_padi',
    kategori_pemanfaatan: 'Pakan Fermentasi Silase Ternak Ruminansia',
    estimasi_nilai_min: 1000,
    estimasi_nilai_max: 1500,
    skor_prioritas: 90,
    alasan_ilmiah: 'Serat kasar tinggi yang dapat difermentasi dengan starter probiotik menjadi pakan pengganti rumput saat musim kering.',
    rekomendasi_sektor: 'Peternak Sapi & Kerbau'
  },
  {
    jenis_limbah: 'limbah_jagung',
    kategori_pemanfaatan: 'Pakan Silase Batang & Tongkol Jagung',
    estimasi_nilai_min: 1100,
    estimasi_nilai_max: 1600,
    skor_prioritas: 94,
    alasan_ilmiah: 'Tongkol dan batang jagung memiliki energi tercerna tinggi (TDN ~60%) setelah diolah giling dan silase.',
    rekomendasi_sektor: 'Peternakan & Industri Pakan'
  },
  {
    jenis_limbah: 'limbah_jagung',
    kategori_pemanfaatan: 'Briket Energi Biomassa Padat',
    estimasi_nilai_min: 800,
    estimasi_nilai_max: 1300,
    skor_prioritas: 85,
    alasan_ilmiah: 'Tongkol jagung memiliki densitas dan nilai kalor tinggi (~4.500 kcal/kg) untuk briket industri.',
    rekomendasi_sektor: 'Produsen Briket Biomassa'
  },
  {
    jenis_limbah: 'sabut_kelapa',
    kategori_pemanfaatan: 'Cocopeat Substrat Media Tanam & Hidroponik',
    estimasi_nilai_min: 1800,
    estimasi_nilai_max: 2500,
    skor_prioritas: 97,
    alasan_ilmiah: 'Kapasitas menahan air sangat tinggi (hingga 8x beratnya) dan ramah lingkungan sebagai pengganti peat moss.',
    rekomendasi_sektor: 'Produsen Media Tanam & Pembibitan'
  },
  {
    jenis_limbah: 'sabut_kelapa',
    kategori_pemanfaatan: 'Cocofiber Serat Industri & Jok',
    estimasi_nilai_min: 2000,
    estimasi_nilai_max: 3000,
    skor_prioritas: 88,
    alasan_ilmiah: 'Serat kelapa yang kuat, elastis, dan tahan air laut diminati industri jok, matras, dan geotekstil.',
    rekomendasi_sektor: 'Industri Pengolahan Serat Sabut'
  },
  {
    jenis_limbah: 'jerami_kedelai',
    kategori_pemanfaatan: 'Pakan Konsentrat Tinggi Protein Ternak',
    estimasi_nilai_min: 1400,
    estimasi_nilai_max: 2000,
    skor_prioritas: 95,
    alasan_ilmiah: 'Kandungan protein kasar (PK ~12-15%) jauh lebih tinggi dibanding jerami padi, sangat disukai ternak kambing/domba.',
    rekomendasi_sektor: 'Peternak Kambing & Domba'
  },
  {
    jenis_limbah: 'jerami_kedelai',
    kategori_pemanfaatan: 'Pupuk Kompos Nitrogen Organik',
    estimasi_nilai_min: 1100,
    estimasi_nilai_max: 1600,
    skor_prioritas: 86,
    alasan_ilmiah: 'Sebagai leguminosa, jerami kedelai kaya akan fiksasi nitrogen alami untuk mempercepat pembentukan humus tanah.',
    rekomendasi_sektor: 'Produsen Kompos Organik'
  }
];

export default function KnowledgeBasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = KB_DATA.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.jenis_limbah === selectedCategory;
    const matchesSearch = item.kategori_pemanfaatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.alasan_ilmiah.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.rekomendasi_sektor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <OfflineBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 pt-32 pb-20 w-full space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
            <BookOpen className="w-4 h-4 text-emerald-600" /> Seed Knowledge Base (RAG Layer 1)
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Potensi Ekonomi Limbah Organik <span className="text-gradient">Sektor Agribisnis</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Basis pengetahuan terstruktur dari literatur pertanian dan sirkularitas ekonomi untuk merekomendasikan pemanfaatan limbah bernilai paling tinggi untuk setiap jenis limbah non-B3.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci pemanfaatan..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Semua Limbah (Fase 1)
              </button>
              {(Object.keys(CATEGORY_LABELS) as WasteCategory[]).map(catKey => (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === catKey
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {catKey.replace(/_/g, ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Knowledge Base Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {(CATEGORY_LABELS[item.jenis_limbah] || item.jenis_limbah).split('(')[0]}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Skor Prioritas: {item.skor_prioritas}%
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{item.kategori_pemanfaatan}</h3>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 block font-medium">Estimasi Nilai Ekonomi Pasar:</span>
                  <span className="text-base font-extrabold text-emerald-700">
                    Rp {item.estimasi_nilai_min.toLocaleString('id-ID')} - Rp {item.estimasi_nilai_max.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed pt-1">
                  {item.alasan_ilmiah}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Target Pembeli:</span>
                <span className="font-bold text-slate-900">{item.rekomendasi_sektor}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Note */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
          <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
            <h4 className="font-bold text-sm text-amber-900">Catatan Regulasi Limbah Non-B3 (Fase 1 Scope)</h4>
            <p className="font-medium">
              Knowledge Base ini **khusus menangani limbah organik non-B3** yang terverifikasi aman bagi rantai pasok pertanian. Limbah dengan status regulasi ambigu (seperti minyak jelantah) atau limbah B3 sengaja dikecualikan untuk memastikan kepatuhan regulasi lingkungan hidup.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
