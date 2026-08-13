'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfflineBanner from '@/components/OfflineBanner';
import { Plus, Building2, Scale, DollarSign, AlertCircle, CheckCircle2, Calendar, MapPin, Trash2, ArrowRight, ShieldCheck, Clock, MessageSquare, Truck, Layers, Inbox } from 'lucide-react';
import ChatNegotiationModal from '@/components/ChatNegotiationModal';
import { BuyerDemand, CATEGORY_LABELS, WasteCategory, WasteTransaction, UserProfile } from '@/lib/types';
import { db } from '@/lib/db';

export default function BuyerDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [demands, setDemands] = useState<BuyerDemand[]>([]);
  const [transactions, setTransactions] = useState<WasteTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'offers' | 'demands' | 'logistics'>('offers');

  const [showAddDemandModal, setShowAddDemandModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTxForSchedule, setSelectedTxForSchedule] = useState<WasteTransaction | null>(null);
  const [pickupDate, setPickupDate] = useState('');

  // Chat modal state
  const [selectedTxForChat, setSelectedTxForChat] = useState<WasteTransaction | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form State
  const [jenisLimbahDicari, setJenisLimbahDicari] = useState<WasteCategory>('sekam_padi');
  const [jumlahDibutuhkan, setJumlahDibutuhkan] = useState<number>(1500);
  const [hargaDitawarkan, setHargaDitawarkan] = useState<number>(2000);
  const [tingkatUrgensi, setTingkatUrgensi] = useState<'rendah' | 'sedang' | 'tinggi'>('tinggi');

  useEffect(() => {
    const stored = localStorage.getItem('temutani_user') || localStorage.getItem('wastematch_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
    }

    // Default Seed Demands for Buyer Demo
    const initialDemands: BuyerDemand[] = [
      {
        id: 'dem-buy-1',
        buyer_id: 'buy-demo-1',
        jenis_limbah_dicari: 'sekam_padi',
        jumlah_dibutuhkan_per_minggu: 1500,
        harga_ditawarkan_per_kg: 2000,
        tingkat_urgensi: 'tinggi',
        status: 'aktif',
        created_at: new Date().toISOString()
      },
      {
        id: 'dem-buy-2',
        buyer_id: 'buy-demo-1',
        jenis_limbah_dicari: 'jerami_padi',
        jumlah_dibutuhkan_per_minggu: 2500,
        harga_ditawarkan_per_kg: 1600,
        tingkat_urgensi: 'sedang',
        status: 'aktif',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    // Seed Active Transactions & Submitted Offers
    const savedTxs: WasteTransaction[] = JSON.parse(localStorage.getItem('temutani_transactions') || localStorage.getItem('wastematch_transactions') || '[]');
    const initialTransactions: WasteTransaction[] = [
      {
        id: 'tx-1001',
        listing_id: 'lst-101',
        buyer_id: 'buy-demo-1',
        generator_id: 'gen-demo-1',
        status: 'disepakati',
        harga_penawaran_per_kg: 2000,
        jumlah_kg_diminta: 2000,
        catatan_penawaran: 'Pengambilan bahan baku arang sekam & biofertilizer.',
        konfirmasi_generator: true,
        konfirmasi_buyer: false,
        created_at: new Date().toISOString(),
        listing: {
          id: 'lst-101',
          generator_id: 'gen-demo-1',
          jenis_limbah: 'sekam_padi',
          jumlah_kg: 2000,
          lokasi_pickup: 'Penggilingan Padi Gapoktan Sukamaju, Karawang',
          jadwal_tersedia: 'Setiap Musim Panen (08.00 - 17.00 WIB)',
          status: 'aktif',
          created_at: new Date().toISOString()
        },
        generator: {
          id: 'gen-demo-1',
          nama: 'Gapoktan Sukamaju',
          email: 'gapoktan@sukamaju.id',
          role: 'generator',
          no_hp: '081299887766'
        }
      }
    ];

    setDemands(initialDemands);
    const combinedTxs = [...savedTxs, ...initialTransactions];
    const uniqueTxs = Array.from(new Map(combinedTxs.map(tx => [tx.id, tx])).values());
    setTransactions(uniqueTxs);
  }, []);

  const handleAddDemand = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDemand: BuyerDemand = {
      id: `dem-${Date.now()}`,
      buyer_id: user?.id || 'buy-demo-1',
      jenis_limbah_dicari: jenisLimbahDicari,
      jumlah_dibutuhkan_per_minggu: Number(jumlahDibutuhkan),
      harga_ditawarkan_per_kg: Number(hargaDitawarkan),
      tingkat_urgensi: tingkatUrgensi,
      status: 'aktif',
      created_at: new Date().toISOString()
    };

    if (!navigator.onLine) {
      await db.offlineDemands.add({
        jenis_limbah_dicari: jenisLimbahDicari,
        jumlah_dibutuhkan_per_minggu: Number(jumlahDibutuhkan),
        harga_ditawarkan_per_kg: Number(hargaDitawarkan),
        tingkat_urgensi: tingkatUrgensi,
        createdAt: new Date().toISOString(),
        synced: false
      });
      alert('Mode Offline: Kebutuhan demand Anda tersimpan secara lokal dan akan tersinkron saat internet kembali!');
    }

    setDemands([newDemand, ...demands]);
    setShowAddDemandModal(false);
    setActiveTab('demands');
  };

  const handleDeleteDemand = (id: string) => {
    setDemands(demands.filter(d => d.id !== id));
  };

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxForSchedule) return;

    const updated = transactions.map(tx => {
      if (tx.id === selectedTxForSchedule.id) {
        return {
          ...tx,
          status: 'dijadwalkan' as const,
          jadwal_pickup: pickupDate
        };
      }
      return tx;
    });

    setTransactions(updated);
    localStorage.setItem('wastematch_transactions', JSON.stringify(updated));
    setShowScheduleModal(false);
    setSelectedTxForSchedule(null);
    setActiveTab('logistics');
  };

  const handleTwoWayConfirm = (txId: string) => {
    const updated = transactions.map(tx => {
      if (tx.id === txId) {
        return {
          ...tx,
          konfirmasi_buyer: true,
          status: 'selesai' as const
        };
      }
      return tx;
    });
    setTransactions(updated);
    localStorage.setItem('wastematch_transactions', JSON.stringify(updated));
  };

  const handleUpdateTxFromChat = (updatedTx: WasteTransaction) => {
    const updated = transactions.map(tx => tx.id === updatedTx.id ? updatedTx : tx);
    setTransactions(updated);
    setSelectedTxForChat(updatedTx);
    localStorage.setItem('wastematch_transactions', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      <Navbar />
      <OfflineBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 pt-32 pb-20 w-full space-y-8">
        {/* Profile Header Banner */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-teal-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-extrabold uppercase tracking-wider">
                Buyer Dashboard (Sektor Pertanian)
              </span>
              <span className="text-xs text-slate-500 font-medium">• Biofertilizer & Pupuk Hayati</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {user?.nama || 'PT Suburtani Makmur Biofertilizer'}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 font-medium flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-600 shrink-0" /> Kawasan Agribisnis Terpadu, Bogor
            </p>
          </div>

          <button
            onClick={() => setShowAddDemandModal(true)}
            className="w-full md:w-auto px-6 py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Input Kebutuhan Demand Aktif
          </button>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'offers'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Penawaran Diajukan ({transactions.length})
          </button>

          <button
            onClick={() => setActiveTab('demands')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'demands'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" /> Target Kebutuhan Pasokan ({demands.length})
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'logistics'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" /> Logistik & Self-Pickup
          </button>
        </div>

        {/* TAB 1: PENAWARAN DIAJUKAN */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" /> Penawaran Diajukan & Status Respons ({transactions.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">B2B Offers & Transactions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transactions.map((tx, idx) => (
                <div key={`${tx.id}-${idx}`} className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      tx.status === 'penawaran_diajukan' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      tx.status === 'disepakati' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                      tx.status === 'dijadwalkan' ? 'bg-teal-100 text-teal-900 border border-teal-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      STATUS: {tx.status === 'penawaran_diajukan' ? 'PENAWARAN MENUNGGU RESPONS' : tx.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Self-Pickup Model</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Penjual: {tx.generator?.nama_gapoktan || tx.generator?.nama || tx.listing?.generator?.nama || 'Gapoktan Sukamaju Karawang'}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-600" /> Pasokan Material: <strong>{tx.jumlah_kg_diminta || tx.listing?.jumlah_kg || 500}kg</strong>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Harga Penawaran Anda:</span>
                      <strong className="text-emerald-700">Rp {(tx.harga_penawaran_per_kg || 2000).toLocaleString('id-ID')} / kg</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-200">
                      <span className="text-slate-800 font-bold">Total Nilai Penawaran:</span>
                      <strong className="text-base font-extrabold text-emerald-800">
                        Rp {((tx.jumlah_kg_diminta || 500) * (tx.harga_penawaran_per_kg || 2000)).toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </div>

                  {/* Privacy Alamat Pickup (Hanya Muncul Setelah Kesepakatan) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Alamat Pickup Lokasi Generator:
                    </span>
                    <p className="text-xs text-slate-800 font-semibold">{tx.listing?.lokasi_pickup || 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan'}</p>
                    <p className="text-[11px] text-slate-500 font-medium">WhatsApp Penjual: {tx.generator?.no_hp || '081299887766'}</p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedTxForChat(tx);
                        setIsChatOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" /> Buka Chat & Negosiasi 💬
                    </button>

                    {tx.status === 'penawaran_diajukan' ? (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                        Penawaran resmi telah terkirim. Menunggu konfirmasi persetujuan dari pihak Generator.
                      </div>
                    ) : tx.status === 'disepakati' ? (
                      <button
                        onClick={() => {
                          setSelectedTxForSchedule(tx);
                          setShowScheduleModal(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" /> Atur Tanggal & Jam Self-Pickup
                      </button>
                    ) : tx.status === 'dijadwalkan' ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-medium">
                          <span>Jadwal Pickup Kesepakatan:</span>
                          <strong className="text-slate-900">{tx.jadwal_pickup ? new Date(tx.jadwal_pickup).toLocaleString('id-ID') : 'Besok, 10.00 WIB'}</strong>
                        </div>

                        <button
                          onClick={() => handleTwoWayConfirm(tx.id)}
                          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Konfirmasi Pickup Selesai (Two-Way)
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transaksi Selesai & Limbah Berhasil Diserap!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TARGET KEBUTUHAN PASOKAN */}
        {activeTab === 'demands' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-600" /> Target Kebutuhan Pasokan Anda ({demands.length})
              </h2>
              <button
                onClick={() => setShowAddDemandModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Input Kebutuhan Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demands.map((dem) => (
                <div key={dem.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {(CATEGORY_LABELS[dem.jenis_limbah_dicari] || dem.jenis_limbah_dicari).split('(')[0]}
                    </span>

                    <button
                      onClick={() => handleDeleteDemand(dem.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Hapus Demand"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[11px] text-slate-500 block font-medium">Target per Minggu:</span>
                      <span className="text-lg font-extrabold text-teal-700">
                        {dem.jumlah_dibutuhkan_per_minggu.toLocaleString('id-ID')} <span className="text-xs text-slate-500 font-normal">kg</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[11px] text-slate-500 block font-medium">Tawaran Harga Beli:</span>
                      <span className="text-lg font-extrabold text-emerald-700">
                        Rp {dem.harga_ditawarkan_per_kg.toLocaleString('id-ID')} <span className="text-xs text-slate-500 font-normal">/ kg</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 font-medium">Tingkat Urgensi:</span>
                    <span className={`font-bold capitalize px-2.5 py-0.5 rounded-full ${
                      dem.tingkat_urgensi === 'tinggi' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {dem.tingkat_urgensi}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LOGISTIK & SELF-PICKUP */}
        {activeTab === 'logistics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-600" /> Penjadwalan & Status Armada Self-Pickup
              </h2>
              <span className="text-xs text-slate-500 font-medium">Asset-Light Logistics Facilitator</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 leading-relaxed font-medium">
                <strong>Catatan Model Self-Pickup:</strong> Platform WasteMatch bertindak sebagai fasilitator informasi. Pembeli (Buyer) bertanggung jawab menyiapkan armada pengangkutan langsung ke titik lokasi penjemputan Generator sesuai tanggal yang disepakati.
              </div>

              {transactions.filter(t => t.status === 'dijadwalkan' || t.status === 'selesai').length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-medium">
                  Belum ada penjemputan yang sedang dijadwalkan.
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.filter(t => t.status === 'dijadwalkan' || t.status === 'selesai').map(tx => (
                    <div key={tx.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-900">{tx.generator?.nama_gapoktan || tx.generator?.nama || 'Gapoktan Sukamaju Karawang'}</span>
                        <p className="text-slate-600">{tx.listing?.lokasi_pickup || 'Penggilingan Padi Gapoktan Sukamaju, Karawang'}</p>
                        <p className="text-emerald-700 font-bold">Material: {tx.jumlah_kg_diminta || 2000}kg Sekam Padi</p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 font-extrabold text-[10px]">
                          JADWAL: {tx.jadwal_pickup || 'Besok, 10.00 WIB'}
                        </span>
                        {tx.status === 'selesai' ? (
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTwoWayConfirm(tx.id)}
                            className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px]"
                          >
                            Konfirmasi Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Input Demand Baru */}
        {showAddDemandModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-teal-600" /> Input Kebutuhan Demand Pasokan Baru
                </h3>
                <button onClick={() => setShowAddDemandModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <form onSubmit={handleAddDemand} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Jenis Limbah Dicari (Fase 1 - 5 Komoditas Pertanian)</label>
                  <select
                    value={jenisLimbahDicari}
                    onChange={(e) => setJenisLimbahDicari(e.target.value as WasteCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-teal-500 focus:outline-none"
                  >
                    <option value="sekam_padi">Sekam Padi (Rice Husk)</option>
                    <option value="jerami_padi">Jerami Padi (Rice Straw)</option>
                    <option value="limbah_jagung">Limbah Jagung (Tongkol & Batang)</option>
                    <option value="sabut_kelapa">Sabut Kelapa (Coconut Coir)</option>
                    <option value="jerami_kedelai">Jerami Kedelai (Soybean Straw)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Jumlah per Minggu (kg)</label>
                    <input
                      type="number"
                      value={jumlahDibutuhkan}
                      onChange={(e) => setJumlahDibutuhkan(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tawaran Harga (Rp/kg)</label>
                    <input
                      type="number"
                      value={hargaDitawarkan}
                      onChange={(e) => setHargaDitawarkan(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tingkat Urgensi Demand</label>
                  <select
                    value={tingkatUrgensi}
                    onChange={(e) => setTingkatUrgensi(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-teal-500 focus:outline-none"
                  >
                    <option value="rendah">Rendah (Fleksibel)</option>
                    <option value="sedang">Sedang (Rutin Mingguan)</option>
                    <option value="tinggi">Tinggi (Mendesak / Butuh Segera)</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddDemandModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                  >
                    Simpan Kebutuhan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Penjadwalan Self-Pickup */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" /> Penjadwalan Self-Pickup
                </h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <form onSubmit={handleConfirmSchedule} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Pilih Tanggal & Waktu Pickup</label>
                  <input
                    type="datetime-local"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium space-y-1">
                  <span className="text-slate-900 font-bold">Model Logistik:</span>
                  <p>Buyer bertanggung jawab melakukan armada pickup langsung ke alamat generator sesuai kesepakatan.</p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                  >
                    Simpan Jadwal Pickup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Chat & Negotiation Modal */}
        {selectedTxForChat && (
          <ChatNegotiationModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            transaction={selectedTxForChat}
            currentUser={user || {
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
