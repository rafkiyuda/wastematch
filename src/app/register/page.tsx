'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, ArrowRight, Building2, Store, Lock, Mail, User, MapPin, Phone, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'generator' | 'buyer'>('generator');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jenisUsaha, setJenisUsaha] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newUser = {
        id: `user-${Date.now()}`,
        nama,
        nama_gapoktan: role === 'generator' ? nama : undefined,
        email,
        role,
        jenis_usaha: jenisUsaha,
        alamat,
        no_hp: noHp
      };

      localStorage.setItem('temutani_user', JSON.stringify(newUser));
      localStorage.setItem('wastematch_user', JSON.stringify(newUser));
      setLoading(false);

      if (role === 'generator') {
        router.push('/generator/dashboard');
      } else {
        router.push('/buyer/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-lg bg-white p-8 rounded-3xl border border-emerald-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center p-2 mx-auto mb-3 shadow-md">
              <img src="/logo.png" alt="TemuTani Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Daftar Akun TemuTani</h1>
            <p className="text-xs text-slate-600 font-medium">Pilih Peran Akun Anda dalam Ekosistem Limbah Pertanian</p>
          </div>

          {/* Role selector tab */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setRole('generator')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl text-xs font-bold transition-all ${
                role === 'generator'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-5 h-5 mb-1" />
              <span>Gapoktan / Kelompok Tani</span>
              <span className="text-[10px] opacity-90 font-medium">Penjual Limbah Hasil Panen</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl text-xs font-bold transition-all ${
                role === 'buyer'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-5 h-5 mb-1" />
              <span>Pembeli Agribisnis</span>
              <span className="text-[10px] opacity-90 font-medium">Pabrik Biofertilizer & Peternak</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Usaha / Perusahaan / Kelompok Tani</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder={role === 'generator' ? 'Contoh: Gapoktan Sukamaju / Kelompok Tani Makmur' : 'Contoh: PT Suburtani Agro Media'}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Bisnis</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@usaha.com"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">No. WhatsApp / HP</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="08123456789"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jenis Usaha / Kategori</label>
                <input
                  type="text"
                  value={jenisUsaha}
                  onChange={(e) => setJenisUsaha(e.target.value)}
                  placeholder={role === 'generator' ? 'misal: Penggilingan Padi, Coffee Shop' : 'misal: Pabrik Biofertilizer, Budidaya Jamur'}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Lokasi Pickup / Pabrik</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. Agribisnis Raya No. 123, Kelurahan..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun Sekarang'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 font-medium border-t border-slate-200 pt-4">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-emerald-700 font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
