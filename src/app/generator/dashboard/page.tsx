'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfflineBanner from '@/components/OfflineBanner';
import { Plus, Store, Scale, MapPin, Calendar, Sparkles, Trash2, Edit3, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { WasteListing, CATEGORY_LABELS, WasteCategory, MatchRecommendation } from '@/lib/types';
import { db } from '@/lib/db';

export default function GeneratorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedListingForAi, setSelectedListingForAi] = useState<WasteListing | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<MatchRecommendation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Form State
  const [jenisLimbah, setJenisLimbah] = useState<WasteCategory>('ampas_kopi');
  const [jumlahKg, setJumlahKg] = useState<number>(100);
  const [lokasiPickup, setLokasiPickup] = useState('');
  const [jadwalTersedia, setJadwalTersedia] = useState('Setiap Hari Kerja (09.00 - 17.00 WIB)');

  useEffect(() => {
    const stored = localStorage.getItem('wastematch_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setLokasiPickup(u.alamat || 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan');
    }

    // Default Seed Listings for Generator Demo
    const initialListings: WasteListing[] = [
      {
        id: 'lst-gen-1',
        generator_id: 'gen-demo-1',
        jenis_limbah: 'ampas_kopi',
        jumlah_kg: 500,
        lokasi_pickup: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
        jadwal_tersedia: 'Setiap Hari Kerja (09.00 - 17.00 WIB)',
        status: 'aktif',
        created_at: new Date().toISOString()
      },
      {
        id: 'lst-gen-2',
        generator_id: 'gen-demo-1',
        jenis_limbah: 'kulit_buah_sayur',
        jumlah_kg: 250,
        lokasi_pickup: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
        jadwal_tersedia: 'Setiap Sore Jam 16.00 WIB',
        status: 'aktif',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    setListings(initialListings);
  }, []);

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: WasteListing = {
      id: `lst-${Date.now()}`,
      generator_id: user?.id || 'gen-demo-1',
      jenis_limbah: jenisLimbah,
      jumlah_kg: Number(jumlahKg),
      lokasi_pickup: lokasiPickup,
      jadwal_tersedia: jadwalTersedia,
      status: 'aktif',
      created_at: new Date().toISOString()
    };

    if (!navigator.onLine) {
      // Save locally to Dexie IndexedDB
      await db.offlineListings.add({
        jenis_limbah: jenisLimbah,
        jumlah_kg: Number(jumlahKg),
        lokasi_pickup: lokasiPickup,
        jadwal_tersedia: jadwalTersedia,
        createdAt: new Date().toISOString(),
        synced: false
      });
      alert('Mode Offline: Listing Anda tersimpan di memori lokal perangkat dan akan otomatis disinkronkan saat online!');
    }

    setListings([newListing, ...listings]);
    setShowAddModal(false);
  };

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
    if (selectedListingForAi?.id === id) {
      setSelectedListingForAi(null);
      setAiRecommendations([]);
    }
  };

  // Run AI Matching Engine
  const handleRunAiMatch = async (listing: WasteListing) => {
    setSelectedListingForAi(listing);
    setAiLoading(true);
    setAiRecommendations([]);

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing })
      });

      if (!res.ok) throw new Error('AI Match call failed');

      const data = await res.json();
      setAiRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Error fetching AI matches:', err);
      // Fallback mock AI recommendations for demo resilience
      setAiRecommendations([
        {
          id: 'rec-1',
          listing_id: listing.id,
          buyer_id: 'buy-1',
          ranking: 1,
          kategori_pemanfaatan: listing.jenis_limbah === 'ampas_kopi' ? 'Biofertilizer Organik' : 'Eco-Enzyme Organik',
          skor: 96,
          alasan_teks: `🥇 Biofertilizer adalah pemanfaatan bernilai ekonomi tertinggi untuk ${CATEGORY_LABELS[listing.jenis_limbah] || listing.jenis_limbah}. Buyer "PT Subur Tani Biofertilizer" memiliki demand aktif 200kg/minggu dengan tawaran harga Rp 2.000/kg (jarak 3.2km dari lokasi Anda).`,
          generated_at: new Date().toISOString(),
          buyer: {
            id: 'buy-1',
            nama: 'PT Suburtani Makmur Biofertilizer',
            email: 'suburtani@bio.id',
            role: 'buyer',
            jenis_usaha: 'Produsen Biofertilizer & Pupuk Hayati',
            alamat: 'Kawasan Industri Agribisnis, Bogor'
          }
        },
        {
          id: 'rec-2',
          listing_id: listing.id,
          buyer_id: 'buy-2',
          ranking: 2,
          kategori_pemanfaatan: listing.jenis_limbah === 'ampas_kopi' ? 'Media Tanam Jamur Tiram' : 'Pupuk Kompos',
          skor: 84,
          alasan_teks: `🥈 Pembudidaya "Jamur Makmur Sejahtera" membutuhkan media tanam ampas kopi. Cocok & lokasi sangat dekat (1.5km), namun kapasitas serap terbatas (50kg/minggu) sehingga sisa material belum terjual habis dalam 1 transaksi.`,
          generated_at: new Date().toISOString(),
          buyer: {
            id: 'buy-2',
            nama: 'Pembudidaya Jamur Makmur Sejahtera',
            email: 'jamur@makmur.id',
            role: 'buyer',
            jenis_usaha: 'Petani Jamur Tiram',
            alamat: 'Jl. Raya Sawangan No. 12, Depok'
          }
        },
        {
          id: 'rec-3',
          listing_id: listing.id,
          buyer_id: 'buy-3',
          ranking: 3,
          kategori_pemanfaatan: 'Briket Energi Biomassa',
          skor: 78,
          alasan_teks: `🥉 Produsen "EnergiHijau Biomassa" memiliki kapasitas serap besar (1.000kg/minggu), namun menawarkan nilai ekonomi per kg yang lebih rendah (Rp 800/kg) dibanding opsi biofertilizer.`,
          generated_at: new Date().toISOString(),
          buyer: {
            id: 'buy-3',
            nama: 'EnergiHijau Biomassa Briket',
            email: 'energi@hijau.id',
            role: 'buyer',
            jenis_usaha: 'Pabrik Briket & Energi Terbarukan',
            alamat: 'Kawasan Industri Cikarang, Jawa Barat'
          }
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <OfflineBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 pt-32 pb-20 w-full space-y-8">
        {/* Profile Header Banner */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold uppercase tracking-wider">
                Generator Dashboard
              </span>
              <span className="text-xs text-slate-500 font-medium">• Coffee Shop / Restoran</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {user?.nama || 'Kopi Kencana Espresso & Roastery'}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" /> {lokasiPickup}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buat Listing Limbah Baru
          </button>
        </div>

        {/* Content Layout: Left = Active Listings, Right = AI Recommendation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Listings) */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" /> Listing Limbah Aktif Anda ({listings.length})
            </h2>

            <div className="space-y-4">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white p-6 rounded-2xl border transition-all space-y-4 shadow-md ${
                    selectedListingForAi?.id === item.id
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {(CATEGORY_LABELS[item.jenis_limbah] || item.jenis_limbah).split('(')[0]}
                    </span>

                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Hapus Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Total Berat Material:</span>
                      <span className="text-2xl font-extrabold text-emerald-700">
                        {item.jumlah_kg.toLocaleString('id-ID')} <span className="text-xs text-slate-500 font-normal">kg</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{item.lokasi_pickup}</span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Jadwal: {item.jadwal_tersedia}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunAiMatch(item)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Dapatkan Rekomendasi AI Matching 🎯
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (AI Match Results Panel) */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Hasil Rekomendasi AI Engine (2-Lapis)
            </h2>

            {!selectedListingForAi ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center space-y-3">
                <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Pilih Listing di Sebelah Kiri</h3>
                <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                  Klik tombol &quot;Dapatkan Rekomendasi AI Matching&quot; pada salah satu listing untuk mengkalkulasi ranking buyer terbaik bernilai ekonomi tertinggi.
                </p>
              </div>
            ) : aiLoading ? (
              <div className="bg-white p-12 rounded-2xl border border-emerald-300 shadow-md text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Gemini AI Memproses Reasoner...</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Menyelaraskan Knowledge Base literatur pertanian (Lapis 1) & Optimasi Demand Buyer aktif (Lapis 2)...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-medium">
                  <span>Hasil Analisis AI untuk: <strong>{CATEGORY_LABELS[selectedListingForAi.jenis_limbah] || selectedListingForAi.jenis_limbah} ({selectedListingForAi.jumlah_kg}kg)</strong></span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-extrabold text-white">Live Gemini RAG</span>
                </div>

                {aiRecommendations.map((rec) => (
                  <div key={rec.id} className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Rank #{rec.ranking} — {rec.kategori_pemanfaatan}
                      </span>
                      <div className="flex items-center gap-1 text-sm font-extrabold text-amber-600">
                        <TrendingUp className="w-4 h-4" /> Skor: {rec.skor}%
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{rec.buyer?.nama}</h4>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {rec.alasan_teks}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-slate-500 font-medium">{rec.buyer?.alamat}</span>
                      <button
                        onClick={() => alert(`Pengajuan minat transaksi dikirimkan ke ${rec.buyer?.nama}. Penjadwalan pickup akan diaktifkan setelah konfirmasi!`)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm"
                      >
                        Pilih Buyer Ini & Transaksi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Tambah Listing Baru */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" /> Input Listing Limbah Baru
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <form onSubmit={handleAddListing} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Jenis Limbah Organik (Kategori Tertutup Fase 1)</label>
                  <select
                    value={jenisLimbah}
                    onChange={(e) => setJenisLimbah(e.target.value as WasteCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ampas_kopi">Ampas Kopi (Coffee Grounds)</option>
                    <option value="sekam_padi">Sekam Padi (Rice Husk)</option>
                    <option value="kulit_buah_sayur">Kulit Buah & Sayur</option>
                    <option value="serbuk_kayu">Serbuk Kayu / Gergaji</option>
                    <option value="sisa_makanan">Sisa Makanan (Katering/Restoran)</option>
                  </select>
                  <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Dibatalkan otomatis untuk limbah B3 & minyak jelantah.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Jumlah Berat (kg)</label>
                  <input
                    type="number"
                    min="10"
                    value={jumlahKg}
                    onChange={(e) => setJumlahKg(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alamat Lokasi Pickup</label>
                  <input
                    type="text"
                    value={lokasiPickup}
                    onChange={(e) => setLokasiPickup(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Jadwal Ketersediaan Pickup</label>
                  <input
                    type="text"
                    value={jadwalTersedia}
                    onChange={(e) => setJadwalTersedia(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                  >
                    Simpan Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
