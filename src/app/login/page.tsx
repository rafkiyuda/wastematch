'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, ArrowRight, Building2, Store, Lock, Mail, ShieldCheck, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'generator' | 'buyer'>('generator');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const mockUser = {
        id: role === 'generator' ? 'gen-demo-1' : 'buy-demo-1',
        nama: role === 'generator' ? 'Pengurus Gapoktan Sukamaju' : 'PT Suburtani Agro Media',
        nama_gapoktan: role === 'generator' ? 'Gapoktan Sukamaju Karawang' : undefined,
        email: email || (role === 'generator' ? 'gapoktan@sukamaju.id' : 'buyer@agromedia.id'),
        role: role,
        jenis_usaha: role === 'generator' ? 'Gabungan Kelompok Tani Padi' : 'Produsen Media Tanam & Biofertilizer',
        alamat: role === 'generator' ? 'Desa Sukamaju, Kec. Rawamerta, Karawang' : 'Kawasan Agribisnis Karawang, Jawa Barat',
        no_hp: '081299887766'
      };

      localStorage.setItem('temutani_user', JSON.stringify(mockUser));
      localStorage.setItem('wastematch_user', JSON.stringify(mockUser));
      setLoading(false);
      
      if (role === 'generator') {
        router.push('/generator/dashboard');
      } else {
        router.push('/buyer/dashboard');
      }
    }, 600);
  };

  const handleQuickDemo = (demoRole: 'generator' | 'buyer') => {
    const mockUser = demoRole === 'generator' ? {
      id: 'gen-demo-1',
      nama: 'Pengurus Gapoktan Sukamaju',
      nama_gapoktan: 'Gapoktan Sukamaju Karawang',
      email: 'gapoktan@sukamaju.id',
      role: 'generator',
      jenis_usaha: 'Gabungan Kelompok Tani Padi',
      alamat: 'Desa Sukamaju, Kec. Rawamerta, Karawang',
      no_hp: '081299887766'
    } : {
      id: 'buy-demo-1',
      nama: 'PT Suburtani Agro Media',
      email: 'buyer@agromedia.id',
      role: 'buyer',
      jenis_usaha: 'Produsen Media Tanam & Biofertilizer',
      alamat: 'Kawasan Agribisnis Karawang, Jawa Barat',
      no_hp: '081122334455'
    };

    localStorage.setItem('temutani_user', JSON.stringify(mockUser));
    localStorage.setItem('wastematch_user', JSON.stringify(mockUser));
    router.push(demoRole === 'generator' ? '/generator/dashboard' : '/buyer/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-emerald-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center p-2 mx-auto mb-3 shadow-md">
              <img src="/logo.png" alt="TemuTani Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Masuk ke TemuTani</h1>
            <p className="text-xs text-slate-600 font-medium">Marketplace B2B Limbah Pertanian Gapoktan & Pembeli Agribisnis</p>
          </div>

          {/* Role selector tab */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setRole('generator')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'generator'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Gapoktan
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'buyer'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Pembeli (Pabrik/Industri)
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Bisnis / Usaha</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'generator' ? 'gapoktan@sukamaju.id' : 'procurement@suburtani.com'}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : 'Masuk Dashboard'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Presets */}
          <div className="pt-4 border-t border-slate-200 text-center space-y-3">
            <span className="text-xs font-semibold text-slate-500">Atau Uji Coba Cepat (Akun Demo):</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('generator')}
                className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-emerald-600" /> Demo Penjual (Petani)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('buyer')}
                className="py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-teal-600" /> Demo Pembeli (Pabrik)
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 font-medium">
            Belum punya akun?{' '}
            <Link href="/register" className="text-emerald-700 font-bold hover:underline">
              Daftar akun gratis
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
