export type Role = 'generator' | 'buyer';

export type WasteCategory = 'sekam_padi' | 'jerami_padi' | 'limbah_jagung' | 'sabut_kelapa' | 'jerami_kedelai';

export interface UserProfile {
  id: string;
  nama: string;
  email: string;
  role: Role;
  nama_gapoktan?: string;
  wilayah?: string;
  jumlah_anggota_petani?: number;
  komoditas_utama?: string;
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

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: Role | 'system' | 'ai';
  text: string;
  timestamp: string;
  offer_proposal?: {
    harga_per_kg: number;
    jumlah_kg: number;
    jadwal_pickup: string;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface B2BDocumentation {
  no_po?: string;
  no_spk?: string;
  no_surat_jalan?: string;
  no_bast?: string;
  no_invoice?: string;
  spesifikasi_kadar_air_max_persen?: number;
  plat_nomor_armada?: string;
  nama_driver?: string;
  no_hp_driver?: string;
  berat_bruto_kg?: number;
  berat_tara_kg?: number;
  berat_netto_kg?: number;
  potongan_kadar_air_kg?: number;
  total_bayar_final?: number;
  status_pembayaran?: 'belum_dibayar' | 'terbayar';
}

export interface WasteTransaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  generator_id: string;
  status: 'penawaran_diajukan' | 'negosiasi_berjalan' | 'kontra_penawaran' | 'disepakati' | 'dijadwalkan' | 'selesai' | 'dibatalkan';
  harga_penawaran_per_kg?: number;
  jumlah_kg_diminta?: number;
  catatan_penawaran?: string;
  jadwal_pickup?: string;
  konfirmasi_generator: boolean;
  konfirmasi_buyer: boolean;
  messages?: ChatMessage[];
  b2b_docs?: B2BDocumentation;
  created_at: string;
  updated_at?: string;
  listing?: WasteListing;
  buyer?: UserProfile;
  generator?: UserProfile;
}

export const CATEGORY_LABELS: Record<WasteCategory, string> = {
  sekam_padi: 'Sekam Padi (Rice Husk)',
  jerami_padi: 'Jerami Padi (Rice Straw)',
  limbah_jagung: 'Limbah Jagung (Tongkol & Batang)',
  sabut_kelapa: 'Sabut Kelapa (Coconut Coir)',
  jerami_kedelai: 'Jerami Kedelai (Soybean Straw)',
};
