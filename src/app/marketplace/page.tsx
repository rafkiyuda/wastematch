'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfflineBanner from '@/components/OfflineBanner';
import { Store, Filter, MapPin, Calendar, Scale, Sparkles, Building2, CheckCircle2, ArrowRight, DollarSign, Send, FileText, X, Check, Clock, MessageSquare } from 'lucide-react';
import ChatNegotiationModal from '@/components/ChatNegotiationModal';
import { WasteListing, CATEGORY_LABELS, WasteCategory, WasteTransaction, UserProfile, ChatMessage } from '@/lib/types';
import Link from 'next/link';

const MOCK_LISTINGS: WasteListing[] = [
  {
    id: 'lst-101',
    generator_id: 'gen-demo-1',
    jenis_limbah: 'sekam_padi',
    jumlah_kg: 2000,
    lokasi_pickup: 'Penggilingan Padi Gapoktan Sukamaju, Karawang',
    jadwal_tersedia: 'Setiap Musim Panen (08.00 - 17.00 WIB)',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    generator: {
      id: 'gen-demo-1',
      nama: 'Gapoktan Sukamaju Karawang',
      email: 'gapoktan@sukamaju.id',
      role: 'generator',
      jenis_usaha: 'Gabungan Kelompok Tani Padi',
      no_hp: '081299887766'
    }
  },
  {
    id: 'lst-102',
    generator_id: 'gen-demo-2',
    jenis_limbah: 'jerami_padi',
    jumlah_kg: 3500,
    lokasi_pickup: 'Lahan Sawah Anggota Gapoktan Tani Makmur, Kudus',
    jadwal_tersedia: 'Pasca Panen Raya (07.00 - 16.00 WIB)',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    generator: {
      id: 'gen-demo-2',
      nama: 'Gapoktan Tani Makmur Kudus',
      email: 'tanimakmur@kudus.id',
      role: 'generator',
      jenis_usaha: 'Gabungan Kelompok Tani Padi',
      no_hp: '081388776655'
    }
  },
  {
    id: 'lst-103',
    generator_id: 'gen-demo-3',
    jenis_limbah: 'limbah_jagung',
    jumlah_kg: 1800,
    lokasi_pickup: 'Sentra Jagung Kelompok Tani Sejahtera, Grobogan',
    jadwal_tersedia: 'Setiap Hari Kerja (08.00 - 17.00 WIB)',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    generator: {
      id: 'gen-demo-3',
      nama: 'Kelompok Tani Jagung Sejahtera',
      email: 'jagung@grobogan.id',
      role: 'generator',
      jenis_usaha: 'Kelompok Tani Jagung',
      no_hp: '081577665544'
    }
  },
  {
    id: 'lst-104',
    generator_id: 'gen-demo-4',
    jenis_limbah: 'sabut_kelapa',
    jumlah_kg: 2500,
    lokasi_pickup: 'Gudang Agregasi Kelompok Tani Nyiur, Kebumen',
    jadwal_tersedia: 'Senin - Sabtu (08.00 - 16.00 WIB)',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    generator: {
      id: 'gen-demo-4',
      nama: 'Kelompok Tani Kelapa Nyiur',
      email: 'kelapa@kebumen.id',
      role: 'generator',
      jenis_usaha: 'Kelompok Tani Kelapa',
      no_hp: '081666554433'
    }
  },
  {
    id: 'lst-105',
    generator_id: 'gen-demo-5',
    jenis_limbah: 'jerami_kedelai',
    jumlah_kg: 1200,
    lokasi_pickup: 'Lahan Sawah Kelompok Tani Kedelai Subur, Boyolali',
    jadwal_tersedia: 'Setiap Jam Kerja (08.00 - 16.00 WIB)',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    generator: {
      id: 'gen-demo-5',
      nama: 'Kelompok Tani Kedelai Subur',
      email: 'kedelai@boyolali.id',
      role: 'generator',
      jenis_usaha: 'Kelompok Tani Kedelai',
      no_hp: '081755443322'
    }
  }
];

export default function MarketplacePage() {
  const [listings, setListings] = useState<WasteListing[]>(MOCK_LISTINGS);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Offer Modal States
  const [selectedListingForOffer, setSelectedListingForOffer] = useState<WasteListing | null>(null);
  const [offerKg, setOfferKg] = useState<number>(500);
  const [offerPricePerKg, setOfferPricePerKg] = useState<number>(2000);
  const [offerNotes, setOfferNotes] = useState<string>('');
  const [offerPickupSchedule, setOfferPickupSchedule] = useState<string>('Besok Jam 10.00 WIB');
  const [offerSuccessMsg, setOfferSuccessMsg] = useState<string | null>(null);

  // Chat modal state
  const [selectedTxForChat, setSelectedTxForChat] = useState<WasteTransaction | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('wastematch_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user profile:', e);
      }
    }
  }, []);

  const handleOpenOfferModal = (listing: WasteListing) => {
    setSelectedListingForOffer(listing);
    setOfferKg(listing.jumlah_kg);
    setOfferPricePerKg(
      listing.jenis_limbah === 'sekam_padi' ? 2000 :
      listing.jenis_limbah === 'jerami_padi' ? 1600 :
      listing.jenis_limbah === 'limbah_jagung' ? 1400 :
      listing.jenis_limbah === 'sabut_kelapa' ? 2200 : 1800
    );
    setOfferNotes(`Halo ${listing.generator?.nama}, kami dari pabrik/industri tertarik membeli pasokan material ini untuk pengolahan agribisnis kami.`);
    setOfferPickupSchedule(listing.jadwal_tersedia || 'Setiap Hari Kerja');
    setOfferSuccessMsg(null);
  };

  const handleQuickLoginAsBuyer = () => {
    const mockBuyer: UserProfile = {
      id: 'buy-demo-1',
      nama: 'PT Suburtani Makmur Biofertilizer',
      email: 'buyer@demo.com',
      role: 'buyer',
      jenis_usaha: 'Produsen Biofertilizer & Pupuk Hayati',
      alamat: 'Kawasan Industri Agribisnis, Bogor',
      no_hp: '081122334455'
    };
    localStorage.setItem('wastematch_user', JSON.stringify(mockBuyer));
    setCurrentUser(mockBuyer);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForOffer) return;

    const buyerUser = currentUser || {
      id: 'buy-demo-1',
      nama: 'PT Suburtani Makmur Biofertilizer',
      email: 'buyer@demo.com',
      role: 'buyer',
      jenis_usaha: 'Produsen Biofertilizer & Organik',
      alamat: 'Kawasan Agribisnis, Bogor',
      no_hp: '081122334455'
    };

    const initialMessages: ChatMessage[] = [
      {
        id: `msg-sys-1`,
        sender_id: 'system',
        sender_name: 'Sistem WasteMatch',
        sender_role: 'system',
        text: `Thread negosiasi diajukan oleh pembeli ${buyerUser.nama}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: `msg-offer-${Date.now()}`,
        sender_id: buyerUser.id,
        sender_name: buyerUser.nama,
        sender_role: 'buyer',
        text: offerNotes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        offer_proposal: {
          harga_per_kg: Number(offerPricePerKg),
          jumlah_kg: Number(offerKg),
          jadwal_pickup: offerPickupSchedule,
          status: 'pending'
        }
      }
    ];

    const newTx: WasteTransaction = {
      id: `tx-${Date.now()}`,
      listing_id: selectedListingForOffer.id,
      buyer_id: buyerUser.id,
      generator_id: selectedListingForOffer.generator_id,
      status: 'penawaran_diajukan',
      harga_penawaran_per_kg: Number(offerPricePerKg),
      jumlah_kg_diminta: Number(offerKg),
      catatan_penawaran: offerNotes,
      jadwal_pickup: offerPickupSchedule,
      konfirmasi_generator: false,
      konfirmasi_buyer: true,
      messages: initialMessages,
      created_at: new Date().toISOString(),
      listing: selectedListingForOffer,
      buyer: buyerUser,
      generator: selectedListingForOffer.generator
    };

    // Store transaction locally in localStorage
    const existingTxs = JSON.parse(localStorage.getItem('wastematch_transactions') || '[]');
    const updatedTxs = [newTx, ...existingTxs];
    localStorage.setItem('wastematch_transactions', JSON.stringify(updatedTxs));

    const totalVal = (Number(offerKg) * Number(offerPricePerKg)).toLocaleString('id-ID');
    setOfferSuccessMsg(`Penawaran Resmi Sebesar Rp ${totalVal} (${offerKg}kg @ Rp ${offerPricePerKg}/kg) Berhasil Dikirimkan ke Penjual (${selectedListingForOffer.generator?.nama})!`);

    // Open Chat Modal immediately
    setSelectedTxForChat(newTx);
    setIsChatOpen(true);
    setSelectedListingForOffer(null);
  };

  const handleUpdateTxFromChat = (updatedTx: WasteTransaction) => {
    const existingTxs: WasteTransaction[] = JSON.parse(localStorage.getItem('wastematch_transactions') || '[]');
    const updated = existingTxs.map(tx => tx.id === updatedTx.id ? updatedTx : tx);
    setSelectedTxForChat(updatedTx);
    localStorage.setItem('wastematch_transactions', JSON.stringify(updated));
  };

  const filteredListings = listings.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.jenis_limbah === filterCategory;
    const matchesSearch = item.generator?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.lokasi_pickup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <OfflineBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 pt-32 pb-20 w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
            <Store className="w-4 h-4 text-emerald-600" /> B2B Organic Waste Marketplace
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Pasokan Limbah Organik & Sisa Panen <span className="text-gradient">Terverifikasi Non-B3</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Jelajahi listing pasokan bahan baku limbah organik dari Petani & Penggilingan Padi terverifikasi. Pembeli (Pabrik/Industri) dapat mengajukan penawaran harga & menentukan jadwal Self-Pickup.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filterCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Semua Pasokan
            </button>
            {(Object.keys(CATEGORY_LABELS) as WasteCategory[]).map(catKey => (
              <button
                key={catKey}
                onClick={() => setFilterCategory(catKey)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filterCategory === catKey
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {catKey.replace(/_/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-600 font-medium">
            Menampilkan <strong className="text-emerald-700 font-bold">{filteredListings.length}</strong> listing aktif
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {(CATEGORY_LABELS[item.jenis_limbah] || item.jenis_limbah).split('(')[0]}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                    {item.generator?.nama}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Penjual: {item.generator?.jenis_usaha}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                      <Scale className="w-4 h-4 text-emerald-600" /> Jumlah Pasokan:
                    </span>
                    <span className="text-lg font-extrabold text-emerald-700">
                      {item.jumlah_kg.toLocaleString('id-ID')} <span className="text-xs text-slate-500 font-normal">kg</span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 font-medium flex items-start gap-1.5 pt-1 border-t border-slate-200">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{item.lokasi_pickup}</span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 pt-1">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Jadwal: {item.jadwal_tersedia}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Self-Pickup Buyer
                </span>

                {currentUser?.role === 'generator' ? (
                  <Link
                    href="/generator/dashboard"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Store className="w-4 h-4 text-emerald-400" /> Kelola Pasokan Limbah 🌾
                  </Link>
                ) : (
                  <button
                    onClick={() => handleOpenOfferModal(item)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4" /> Ajukan Penawaran <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail & Ajukan Penawaran Resmi */}
        {selectedListingForOffer && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl p-6 md:p-8 rounded-3xl border border-emerald-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-600" /> Form Ajukan Penawaran Resmi B2B
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Kirimkan penawaran harga & spesifikasi jumlah pasokan ke pihak Penjual (Petani/Penggilingan Padi)
                  </p>
                </div>
                <button
                  onClick={() => setSelectedListingForOffer(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status banner jika pengguna belum login sebagai buyer */}
              {!currentUser && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>Anda belum login sebagai Pembeli (Pabrik). Gunakan preset Demo Pembeli untuk langsung mencoba!</span>
                  <button
                    onClick={handleQuickLoginAsBuyer}
                    className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-500 transition-colors"
                  >
                    Masuk Akun Pembeli
                  </button>
                </div>
              )}

              {offerSuccessMsg ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-emerald-900">Penawaran Pembelian Berhasil Terkirim!</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {offerSuccessMsg}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                    <Link
                      href="/buyer/dashboard"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                    >
                      Pantau di Dashboard Pembeli
                    </Link>
                    <button
                      onClick={() => setSelectedListingForOffer(null)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Tutup Modal
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitOffer} className="space-y-5">
                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Penjual: {selectedListingForOffer.generator?.nama}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px]">
                        {(CATEGORY_LABELS[selectedListingForOffer.jenis_limbah] || selectedListingForOffer.jenis_limbah).split('(')[0]}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedListingForOffer.lokasi_pickup}
                    </p>
                    <p className="text-slate-500 font-medium">
                      Pasokan Tersedia: <strong>{selectedListingForOffer.jumlah_kg} kg</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Jumlah Diminta Pembeli (kg)</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedListingForOffer.jumlah_kg}
                        value={offerKg}
                        onChange={(e) => setOfferKg(Number(e.target.value))}
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Tawaran Harga Beli per kg (Rp)</label>
                      <input
                        type="number"
                        min="100"
                        step="100"
                        value={offerPricePerKg}
                        onChange={(e) => setOfferPricePerKg(Number(e.target.value))}
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Calculated Value Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                    <span className="text-slate-700 font-bold">Total Nilai Penawaran Pembelian:</span>
                    <span className="text-lg font-extrabold text-emerald-800">
                      Rp {(offerKg * offerPricePerKg).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Usulan Tanggal & Jam Self-Pickup</label>
                    <input
                      type="text"
                      value={offerPickupSchedule}
                      onChange={(e) => setOfferPickupSchedule(e.target.value)}
                      required
                      placeholder="Contoh: Besok Jam 10.00 WIB"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Catatan / Pesan untuk Penjual (Petani)</label>
                    <textarea
                      rows={3}
                      value={offerNotes}
                      onChange={(e) => setOfferNotes(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedListingForOffer(null)}
                      className="w-1/2 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-4 h-4" /> Kirim Penawaran Resmi
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Chat & Negotiation Modal */}
        {selectedTxForChat && (
          <ChatNegotiationModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            transaction={selectedTxForChat}
            currentUser={currentUser || {
              id: 'buy-demo-1',
              nama: 'PT Suburtani Makmur Biofertilizer',
              email: 'buyer@demo.com',
              role: 'buyer',
              jenis_usaha: 'Produsen Biofertilizer & Pupuk Hayati'
            }}
            onUpdateTransaction={handleUpdateTxFromChat}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
