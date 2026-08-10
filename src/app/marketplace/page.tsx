'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OfflineBanner from '@/components/OfflineBanner';
import { Store, Filter, MapPin, Calendar, Scale, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { WasteListing, CATEGORY_LABELS, WasteCategory } from '@/lib/types';
import Link from 'next/link';

// Seed Listings for Live Competition Demo
const MOCK_LISTINGS: WasteListing[] = [
  {
    id: 'lst-101',
    generator_id: 'gen-demo-1',
    jenis_limbah: 'ampas_kopi',
    jumlah_kg: 500,
    lokasi_pickup: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
    jadwal_tersedia: 'Setiap Hari Kerja (09.00 - 17.00 WIB)',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    generator: {
      id: 'gen-demo-1',
      nama: 'Kopi Kencana Espresso & Roastery',
      email: 'generator@demo.com',
      role: 'generator',
      jenis_usaha: 'Coffee Shop & Cafe',
      no_hp: '081299887766'
    }
  },
  {
    id: 'lst-102',
    generator_id: 'gen-demo-2',
    jenis_limbah: 'sekam_padi',
    jumlah_kg: 1200,
    lokasi_pickup: 'Penggilingan Padi Makmur, Karawang, Jawa Barat',
    jadwal_tersedia: 'Senin - Jumat (08.00 - 16.00 WIB)',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    generator: {
      id: 'gen-demo-2',
      nama: 'Penggilingan Padi Makmur Karawang',
      email: 'padi@makmur.id',
      role: 'generator',
      jenis_usaha: 'Penggilingan Padi',
      no_hp: '081388776655'
    }
  },
  {
    id: 'lst-103',
    generator_id: 'gen-demo-3',
    jenis_limbah: 'kulit_buah_sayur',
    jumlah_kg: 350,
    lokasi_pickup: 'Katering Sehat Berkah, Pasar Minggu, Jakarta Selatan',
    jadwal_tersedia: 'Setiap Sore Jam 16.00 - 19.00 WIB',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    generator: {
      id: 'gen-demo-3',
      nama: 'Katering Sehat Berkah',
      email: 'katering@berkah.com',
      role: 'generator',
      jenis_usaha: 'Industri Katering & Resto',
      no_hp: '081577665544'
    }
  },
  {
    id: 'lst-104',
    generator_id: 'gen-demo-4',
    jenis_limbah: 'serbuk_kayu',
    jumlah_kg: 800,
    lokasi_pickup: 'Workshop Mebel Meubelia, Jepara / Bekasi',
    jadwal_tersedia: 'Sabtu & Minggu Pickup',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    generator: {
      id: 'gen-demo-4',
      nama: 'Workshop Meubelia Kayu',
      email: 'mebel@kayu.id',
      role: 'generator',
      jenis_usaha: 'Pengolahan Kayu & Furniture',
      no_hp: '081666554433'
    }
  },
  {
    id: 'lst-105',
    generator_id: 'gen-demo-5',
    jenis_limbah: 'sisa_makanan',
    jumlah_kg: 600,
    lokasi_pickup: 'Restoran Sunda Nikmat, Bogor Barat',
    jadwal_tersedia: 'Setiap Malam Jam 21.00 WIB',
    status: 'aktif',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    generator: {
      id: 'gen-demo-5',
      nama: 'Restoran Sunda Nikmat',
      email: 'sunda@nikmat.id',
      role: 'generator',
      jenis_usaha: 'Restoran Makanan',
      no_hp: '081755443322'
    }
  }
];

export default function MarketplacePage() {
  const [listings, setListings] = useState<WasteListing[]>(MOCK_LISTINGS);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
            Pasokan Limbah Organik <span className="text-gradient">Terverifikasi Non-B3</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Jelajahi listing pasokan bahan baku limbah organik dari UMKM generator terverifikasi. Transaksi mandiri dengan skema Self-Pickup.
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
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {item.generator?.jenis_usaha}
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

                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  Ajukan Penawaran <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
