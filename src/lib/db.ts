import Dexie, { Table } from 'dexie';
import { WasteCategory } from './types';

export interface OfflineListing {
  id?: number;
  jenis_limbah: WasteCategory;
  jumlah_kg: number;
  foto_url?: string;
  lokasi_pickup: string;
  jadwal_tersedia: string;
  createdAt: string;
  synced: boolean;
}

export interface OfflineDemand {
  id?: number;
  jenis_limbah_dicari: WasteCategory;
  jumlah_dibutuhkan_per_minggu: number;
  harga_ditawarkan_per_kg: number;
  tingkat_urgensi: 'rendah' | 'sedang' | 'tinggi';
  createdAt: string;
  synced: boolean;
}

export class TemuTaniDatabase extends Dexie {
  offlineListings!: Table<OfflineListing>;
  offlineDemands!: Table<OfflineDemand>;

  constructor() {
    super('TemuTaniLocalDB');
    this.version(1).stores({
      offlineListings: '++id, jenis_limbah, createdAt',
      offlineDemands: '++id, jenis_limbah_dicari, createdAt',
    });
  }
}

export const db = new TemuTaniDatabase();
