'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfflineBanner from '@/components/OfflineBanner';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Store,
  WifiOff,
  Leaf,
  CheckCircle2,
  Scale,
  Award,
  BarChart3,
  Globe2,
  RefreshCw
} from 'lucide-react';
import { MatchRecommendation } from '@/lib/types';

export default function HomePage() {
  const [demoWasteType, setDemoWasteType] = useState('ampas_kopi');
  const [demoKg, setDemoKg] = useState(500);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResults, setDemoResults] = useState<MatchRecommendation[] | null>(null);

  const handleRunDemoMatch = async () => {
    setDemoLoading(true);
    setDemoResults(null);

    const mockListing = {
      id: 'demo-lst-1',
      generator_id: 'gen-demo-1',
      jenis_limbah: demoWasteType as any,
      jumlah_kg: demoKg,
      lokasi_pickup: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
      jadwal_tersedia: 'Setiap Hari Kerja (09.00 - 17.00 WIB)',
      status: 'aktif' as const,
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing: mockListing })
      });
      const data = await res.json();
      setDemoResults(data.recommendations || []);
    } catch (e) {
      console.error(e);
      // Fallback
      setDemoResults([
        {
          id: 'rec-1',
          listing_id: 'demo-lst-1',
          buyer_id: 'buy-1',
          ranking: 1,
          kategori_pemanfaatan: 'Biofertilizer Organik Padat',
          skor: 96,
          alasan_teks: `🥇 Biofertilizer adalah pemanfaatan bernilai ekonomi tertinggi untuk Ampas Kopi. Buyer "PT Suburtani Makmur" membutuhkan 200kg/minggu dengan harga Rp 2.000/kg (jarak 3.2km).`,
          generated_at: new Date().toISOString(),
          buyer: {
            id: 'buy-1',
            nama: 'PT Suburtani Makmur Biofertilizer',
            email: 'suburtani@bio.id',
            role: 'buyer',
            jenis_usaha: 'Produsen Biofertilizer',
            alamat: 'Kawasan Agribisnis, Bogor'
          }
        },
        {
          id: 'rec-2',
          listing_id: 'demo-lst-1',
          buyer_id: 'buy-2',
          ranking: 2,
          kategori_pemanfaatan: 'Media Tanam Jamur Tiram',
          skor: 84,
          alasan_teks: `🥈 Pembudidaya Jamur Makmur lokasi sangat dekat (1.5km), namun kapasitas serap terbatas 50kg/minggu sehingga sisa material tidak terserap habis.`,
          generated_at: new Date().toISOString(),
          buyer: {
            id: 'buy-2',
            nama: 'Pembudidaya Jamur Makmur',
            email: 'jamur@makmur.id',
            role: 'buyer',
            jenis_usaha: 'Petani Jamur Tiram',
            alamat: 'Sawangan, Depok'
          }
        }
      ]);
    } finally {
      demoLoading && setDemoLoading(false);
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <OfflineBanner />

      {/* Background Subtle Radial Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-200/40 via-teal-100/20 to-transparent rounded-full blur-3xl pointer-events-none z-0 glow-bg" />

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-20 px-4 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>B2B Organic Waste Marketplace Powered by Gemini AI</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Ubah Limbah Organik UMKM Menjadi <span className="text-gradient">Komoditas Bernilai Tinggi</span>
        </h1>

        <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
          WasteMatch menghubungkan penghasil limbah organik (coffee shop, restoran, katering) dengan pembeli sektor pertanian menggunakan AI Reasoning 2-Lapis untuk merekomendasikan pemanfaatan bernilai ekonomi tertinggi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            Mulai Gabung Marketplace <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/marketplace"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            Jelajahi Pasokan Limbah <Store className="w-5 h-5 text-emerald-600" />
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600">5 Kategori</span>
            <p className="text-xs text-slate-500 font-medium">Limbah Organik Non-B3</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-2xl md:text-3xl font-extrabold text-teal-600">2-Lapis</span>
            <p className="text-xs text-slate-500 font-medium">AI Matching Engine</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600">Self-Pickup</span>
            <p className="text-xs text-slate-500 font-medium">Model Logistik Asset-Light</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-2xl md:text-3xl font-extrabold text-teal-600">100% PWA</span>
            <p className="text-xs text-slate-500 font-medium">Offline Resilient Storage</p>
          </div>
        </div>
      </section>

      {/* Interactive AI Matching Simulator */}
      <section id="demo" className="relative z-10 py-16 px-4 bg-emerald-50/50 border-y border-emerald-100">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              Simulasi Langsung Gemini RAG Engine
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Uji Coba Rekomendasi AI Matching Engine</h2>
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              Pilih jenis limbah dan jumlah berat untuk menyaksikan AI merekomendasikan pemanfaatan bernilai ekonomi tertinggi.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-200 shadow-lg shadow-emerald-500/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pilih Jenis Limbah Organik</label>
                <select
                  value={demoWasteType}
                  onChange={(e) => setDemoWasteType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ampas_kopi">Ampas Kopi (Coffee Grounds)</option>
                  <option value="sekam_padi">Sekam Padi (Rice Husk)</option>
                  <option value="kulit_buah_sayur">Kulit Buah & Sayur</option>
                  <option value="serbuk_kayu">Serbuk Kayu / Gergaji</option>
                  <option value="sisa_makanan">Sisa Makanan Non-B3</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jumlah Berat (kg)</label>
                <input
                  type="number"
                  value={demoKg}
                  onChange={(e) => setDemoKg(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunDemoMatch}
                  disabled={demoLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {demoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {demoLoading ? 'AI Menganalisis...' : 'Jalankan AI Matching 🎯'}
                </button>
              </div>
            </div>

            {demoResults && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hasil Ranking Rekomendasi Buyer Terbaik:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demoResults.map((rec) => (
                    <div key={rec.id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Rank #{rec.ranking} — {rec.kategori_pemanfaatan}
                        </span>
                        <span className="text-xs font-extrabold text-amber-600">Skor: {rec.skor}%</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{rec.buyer?.nama}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                        {rec.alasan_teks}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillar Section */}
      <section id="features" className="relative z-10 py-24 px-4 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">4 Pilar Keunggulan Solusi WasteMatch</h2>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            Dirancang khusus untuk memecahkan hambatan transaksi B2B limbah organik skala UMKM secara efektif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2-Lapis AI Matching Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengkombinasikan basis pengetahuan literatur pertanian (Lapis 1) dengan optimasi demand real-time buyer (Lapis 2) via Gemini RAG API.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Batasan Kategori Non-B3</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilihan limbah tertutup untuk mencegah paparan limbah B3 (seperti minyak jelantah & kimia), menjamin keamanan perizinan awal.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Model Self-Pickup Asset-Light</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buyer bertanggung jawab mengangkut limbah langsung dari lokasi generator, membebaskan platform dari beban armada logistik.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-600">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Offline-Resilient PWA</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Draft input listing & demand tersimpan otomatis ke IndexedDB lokal saat koneksi buruk dan disinkronkan saat online kembali.
            </p>
          </div>
        </div>
      </section>

      {/* Impact & ESG Metrics */}
      <section className="relative z-10 py-20 px-4 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-emerald-950/60 p-8 rounded-3xl border border-emerald-800 space-y-2">
            <Globe2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <span className="text-3xl md:text-4xl font-extrabold text-white">50.000+ kg</span>
            <p className="text-xs text-emerald-200">Limbah Organik Dialihkan dari TPA</p>
          </div>

          <div className="bg-emerald-950/60 p-8 rounded-3xl border border-emerald-800 space-y-2">
            <BarChart3 className="w-8 h-8 text-teal-400 mx-auto" />
            <span className="text-3xl md:text-4xl font-extrabold text-white">Rp 125.000.000+</span>
            <p className="text-xs text-emerald-200">Estimasi Nilai Ekonomi Baru Tercipta</p>
          </div>

          <div className="bg-emerald-950/60 p-8 rounded-3xl border border-emerald-800 space-y-2">
            <Leaf className="w-8 h-8 text-emerald-400 mx-auto" />
            <span className="text-3xl md:text-4xl font-extrabold text-white">12.500 kg</span>
            <p className="text-xs text-emerald-200">Estimasi Pengurangan Potensi Emisi CH4 (Metana)</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
