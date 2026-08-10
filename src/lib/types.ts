export type Role = 'generator' | 'buyer';

export type WasteCategory = 'ampas_kopi' | 'sekam_padi' | 'kulit_buah_sayur' | 'serbuk_kayu' | 'sisa_makanan';

export interface UserProfile {
  id: string;
  nama: string;
  email: string;
  role: Role;
  jenis_usaha?: string;
  alamat?: string;
  no_hp?: string;
  lokasi_lat?: number;
  lokasi_lng?: number;
  created_at?: string;
}

export interface WasteListing {
  id: string;
  generator_id: string;
  jenis_limbah: WasteCategory;
  jumlah_kg: number;
  foto_url?: string;
  lokasi_pickup: string;
  jadwal_tersedia: string;
  status: 'aktif' | 'terjual' | 'kadaluarsa';
  created_at: string;
  generator?: UserProfile;
}

export interface BuyerDemand {
  id: string;
  buyer_id: string;
  jenis_limbah_dicari: WasteCategory;
  jumlah_dibutuhkan_per_minggu: number;
  harga_ditawarkan_per_kg: number;
  tingkat_urgensi: 'rendah' | 'sedang' | 'tinggi';
  status: 'aktif' | 'tidak_aktif';
  created_at: string;
  buyer?: UserProfile;
}

export interface KnowledgeBaseItem {
  id: string;
  jenis_limbah: WasteCategory;
  kategori_pemanfaatan: string;
  estimasi_nilai_per_kg_min: number;
  estimasi_nilai_per_kg_max: number;
  catatan: string;
}

export interface MatchRecommendation {
  id: string;
  listing_id: string;
  buyer_id: string;
  ranking: number;
  kategori_pemanfaatan: string;
  skor: number;
  alasan_teks: string;
  generated_at: string;
  buyer?: UserProfile;
  demand?: BuyerDemand;
}

export interface WasteTransaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  generator_id: string;
  status: 'disepakati' | 'dijadwalkan' | 'selesai' | 'dibatalkan';
  jadwal_pickup?: string;
  konfirmasi_generator: boolean;
  konfirmasi_buyer: boolean;
  created_at: string;
  listing?: WasteListing;
  buyer?: UserProfile;
  generator?: UserProfile;
}

export const CATEGORY_LABELS: Record<WasteCategory, string> = {
  ampas_kopi: 'Ampas Kopi (Coffee Grounds)',
  sekam_padi: 'Sekam Padi (Rice Husk)',
  kulit_buah_sayur: 'Kulit Buah & Sayur (Fruit/Veg Waste)',
  serbuk_kayu: 'Serbuk Kayu / Gergaji (Sawdust)',
  sisa_makanan: 'Sisa Makanan (Food Scrap Non-B3)',
};
