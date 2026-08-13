'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, Menu, X, User, LogOut, Sparkles, Building2, Store, Sprout } from 'lucide-react';
import { UserProfile } from '@/lib/types';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('temutani_user') || localStorage.getItem('wastematch_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed parsing stored user profile:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('temutani_user');
    localStorage.removeItem('wastematch_user');
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 z-50 px-6 h-16 flex items-center justify-between shadow-lg shadow-slate-200/50 transition-all duration-300">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
          <Sprout className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
            Temu<span className="text-emerald-600">Tani</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">B2B AGRI-AI</span>
          </span>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <Link href="/marketplace" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
          <Store className="w-4 h-4 text-emerald-600" />
          Marketplace Pasokan
        </Link>
        <Link href="/knowledge-base" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-emerald-600" />
          Knowledge Base
        </Link>
        <Link href="/#features" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          AI Matching Engine
        </Link>
      </nav>

      {/* Auth / Profile Actions */}
      <div className="hidden md:flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <Link
              href={currentUser.role === 'generator' ? '/generator/dashboard' : '/buyer/dashboard'}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentUser.nama_gapoktan || currentUser.nama}</span>
              <span className="capitalize px-2 py-0.5 rounded bg-emerald-600 text-[10px] text-white font-semibold">
                {currentUser.role === 'generator' ? 'Gapoktan / Kelompok Tani' : 'Pembeli Limbah'}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              Daftar Akun
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-slate-700 hover:text-emerald-600 p-2"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-md rounded-3xl p-6 flex flex-col gap-4 shadow-xl border border-slate-200 z-50">
          <Link
            href="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-slate-700 hover:text-emerald-600 font-semibold py-2 border-b border-slate-100"
          >
            <Store className="w-5 h-5 text-emerald-600" />
            Marketplace Pasokan
          </Link>
          <Link
            href="/knowledge-base"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-slate-700 hover:text-emerald-600 font-semibold py-2 border-b border-slate-100"
          >
            <Leaf className="w-5 h-5 text-emerald-600" />
            Knowledge Base Literatur
          </Link>
          {currentUser ? (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={currentUser.role === 'generator' ? '/generator/dashboard' : '/buyer/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-center border border-emerald-200"
              >
                Dashboard {currentUser.role === 'generator' ? 'Gapoktan' : 'Pembeli Limbah'}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 text-rose-600 font-bold text-center flex items-center justify-center gap-2 border border-rose-200"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-center font-bold text-slate-700"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-center font-bold"
              >
                Daftar Akun Baru
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
