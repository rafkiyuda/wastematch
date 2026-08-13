'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const pendingListings = useLiveQuery(() => db.offlineListings.filter((item) => !item.synced).toArray()) || [];
  const pendingDemands = useLiveQuery(() => db.offlineDemands.filter((item) => !item.synced).toArray()) || [];

  const totalPending = pendingListings.length + pendingDemands.length;

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    if (!isOnline || totalPending === 0) return;
    setIsSyncing(true);
    try {
      // Simulate sync or send pending items to server
      await new Promise((resolve) => setTimeout(resolve, 1200));
      for (const item of pendingListings) {
        if (item.id) await db.offlineListings.update(item.id, { synced: true });
      }
      for (const item of pendingDemands) {
        if (item.id) await db.offlineDemands.update(item.id, { synced: true });
      }
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isOnline && totalPending === 0) return null;

  return (
    <div className={`w-full py-2.5 px-4 text-xs md:text-sm font-medium flex items-center justify-between z-50 shadow-md ${
      !isOnline 
        ? 'bg-amber-100 text-amber-900 border-b border-amber-300' 
        : 'bg-emerald-100 text-emerald-900 border-b border-emerald-300'
    }`}>
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Mode Offline Resilience Aktif — Pengurus Gapoktan dapat menginput listing limbah tanpa terkendala sinyal lemah di pedesaan.</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>Koneksi Kembali Online — Ada <strong>{totalPending}</strong> draft data lokal yang siap disinkronkan.</span>
            </>
          )}
        </div>

        {isOnline && totalPending > 0 && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-full font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Menyingkronkan...' : 'Sinkronkan Sekarang'}
          </button>
        )}
      </div>
    </div>
  );
}
