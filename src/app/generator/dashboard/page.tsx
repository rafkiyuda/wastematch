'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfflineBanner from '@/components/OfflineBanner';
import { Plus, Store, Scale, MapPin, Calendar, Sparkles, Trash2, Edit3, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw, DollarSign, MessageSquare, Check, X, Layers, Inbox } from 'lucide-react';
import { WasteListing, CATEGORY_LABELS, WasteCategory, MatchRecommendation, WasteTransaction } from '@/lib/types';
import { db } from '@/lib/db';

export default function GeneratorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [incomingOffers, setIncomingOffers] = useState<WasteTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'offers' | 'listings' | 'ai_match'>('offers');
  
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

    // Seed Incoming Offers
    const savedTxs: WasteTransaction[] = JSON.parse(localStorage.getItem('wastematch_transactions') || '[]');
    const defaultIncomingOffers: WasteTransaction[] = [
      {
        id: 'tx-seed-1',
        listing_id: 'lst-gen-1',
        buyer_id: 'buy-demo-1',
        generator_id: 'gen-demo-1',
        status: 'penawaran_diajukan',
        harga_penawaran_per_kg: 2000,
        jumlah_kg_diminta: 500,
        catatan_penawaran: 'Halo Kopi Kencana, kami ingin membeli seluruh pasokan 500kg ampas kopi ini untuk bahan dasar biofertilizer pabrik kami di Bogor.',
        jadwal_pickup: 'Besok Jam 10.00 WIB',
        konfirmasi_generator: false,
        konfirmasi_buyer: true,
        created_at: new Date().toISOString(),
        buyer: {
          id: 'buy-demo-1',
          nama: 'PT Suburtani Makmur Biofertilizer',
          email: 'buyer@demo.com',
          role: 'buyer',
          jenis_usaha: 'Produsen Biofertilizer & Pupuk Organik',
          alamat: 'Kawasan Agribisnis, Bogor'
        }
      }
    ];

    setListings(initialListings);
    setIncomingOffers([...savedTxs, ...defaultIncomingOffers]);
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
    setActiveTab('listings');
  };

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
    if (selectedListingForAi?.id === id) {
      setSelectedListingForAi(null);
      setAiRecommendations([]);
    }
  };

  const handleAcceptOffer = (txId: string) => {
    const updated = incomingOffers.map(tx => {
      if (tx.id === txId) {
        return {
          ...tx,
          status: 'disepakati' as const,
          konfirmasi_generator: true
        };
      }
      return tx;
    });
    setIncomingOffers(updated);
    localStorage.setItem('wastematch_transactions', JSON.stringify(updated));
    alert('Penawaran Berhasil Disetujui! Status transaksi diperbarui menjadi Disepakati & Pembeli dapat menjadwalkan Self-Pickup.');
  };

  const handleDeclineOffer = (txId: string) => {
    const updated = incomingOffers.filter(tx => tx.id !== txId);
    setIncomingOffers(updated);
    localStorage.setItem('wastematch_transactions', JSON.stringify(updated));
  };

  // Run AI Matching Engine
  const handleRunAiMatch = async (listing: WasteListing) => {
    setSelectedListingForAi(listing);
    setActiveTab('ai_match');
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
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const pendingOffersCount = incomingOffers.filter(tx => tx.status === 'penawaran_diajukan').length;

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

        {/* TAB NAVIGATION BAR */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'offers'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4" /> Penawaran Masuk
            {pendingOffersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                {pendingOffersCount} Baru
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'listings'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" /> Pasokan Limbah Saya ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('ai_match')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'ai_match'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" /> AI Matching Engine
          </button>
        </div>

        {/* TAB 1: PENAWARAN MASUK */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" /> Penawaran Masuk dari Buyer ({incomingOffers.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">Real-Time B2B Offer Review</span>
            </div>

            {incomingOffers.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
                <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Belum Ada Penawaran Baru</h3>
                <p className="text-xs text-slate-500 font-medium">Penawaran yang diajukan oleh pembeli agribisnis dari Marketplace akan muncul di tab ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingOffers.map((tx) => (
                  <div key={tx.id} className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase ${
                        tx.status === 'penawaran_diajukan' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                        tx.status === 'disepakati' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tx.status === 'penawaran_diajukan' ? 'Penawaran Baru Diajukan' : tx.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-900">{tx.buyer?.nama}</h3>
                      <p className="text-xs text-slate-500 font-medium">{tx.buyer?.jenis_usaha}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Volume Pasokan Diminta:</span>
                        <strong className="text-slate-900">{tx.jumlah_kg_diminta || 500} kg</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Harga Tawaran:</span>
                        <strong className="text-emerald-700">Rp {(tx.harga_penawaran_per_kg || 2000).toLocaleString('id-ID')} / kg</strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-emerald-200">
                        <span className="text-slate-800 font-bold">Total Nilai Penawaran:</span>
                        <strong className="text-base font-extrabold text-emerald-800">
                          Rp {((tx.jumlah_kg_diminta || 500) * (tx.harga_penawaran_per_kg || 2000)).toLocaleString('id-ID')}
                        </strong>
                      </div>
                    </div>

                    {tx.catatan_penawaran && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Catatan Buyer:
                        </span>
                        <p className="text-slate-700 italic font-medium">&quot;{tx.catatan_penawaran}&quot;</p>
                      </div>
                    )}

                    <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Usulan Pickup: <strong>{tx.jadwal_pickup || 'Sesuai kesepakatan'}</strong></span>
                    </div>

                    {tx.status === 'penawaran_diajukan' ? (
                      <div className="pt-2 flex gap-3">
                        <button
                          onClick={() => handleDeclineOffer(tx.id)}
                          className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => handleAcceptOffer(tx.id)}
                          className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Setujui Penawaran
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Penawaran Disetujui! Menunggu Penjadwalan Pickup Buyer.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PASOKAN LIMBAH SAYA */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" /> Listing Limbah Aktif Anda ({listings.length})
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tambah Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        )}

        {/* TAB 3: AI MATCHING ENGINE */}
        {activeTab === 'ai_match' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" /> Hasil Rekomendasi AI Engine (2-Lapis)
              </h2>
              {selectedListingForAi && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Target: {CATEGORY_LABELS[selectedListingForAi.jenis_limbah]} ({selectedListingForAi.jumlah_kg}kg)
                </span>
              )}
            </div>

            {!selectedListingForAi ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
                <Sparkles className="w-12 h-12 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Belum Ada Listing Terpilih</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                    Buka tab <strong>&quot;Pasokan Limbah Saya&quot;</strong> lalu klik tombol <strong>&quot;Dapatkan Rekomendasi AI Matching&quot;</strong> untuk menganalisis pemanfaatan bernilai ekonomi tertinggi.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm"
                >
                  Pilih dari Listing Saya
                </button>
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
        )}

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
