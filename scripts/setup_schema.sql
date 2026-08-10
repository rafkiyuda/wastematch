-- WasteMatch Supabase Schema & Seed Script (Fase 0 - Fase 6)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS wm_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('generator', 'buyer')),
  jenis_usaha TEXT,
  alamat TEXT,
  no_hp TEXT,
  lokasi_lat NUMERIC DEFAULT -6.200000,
  lokasi_lng NUMERIC DEFAULT 106.816666,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jenis_limbah TEXT NOT NULL,
  kategori_pemanfaatan TEXT NOT NULL,
  estimasi_nilai_per_kg_min NUMERIC NOT NULL,
  estimasi_nilai_per_kg_max NUMERIC NOT NULL,
  catatan TEXT NOT NULL
);

-- 3. Waste Listings Table
CREATE TABLE IF NOT EXISTS waste_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generator_id UUID REFERENCES wm_users(id) ON DELETE CASCADE,
  jenis_limbah TEXT NOT NULL CHECK (jenis_limbah IN ('ampas_kopi', 'sekam_padi', 'kulit_buah_sayur', 'serbuk_kayu', 'sisa_makanan')),
  jumlah_kg NUMERIC NOT NULL,
  foto_url TEXT,
  lokasi_pickup TEXT NOT NULL,
  jadwal_tersedia TEXT NOT NULL,
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'terjual', 'kadaluarsa')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Buyer Demands Table
CREATE TABLE IF NOT EXISTS buyer_demands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES wm_users(id) ON DELETE CASCADE,
  jenis_limbah_dicari TEXT NOT NULL CHECK (jenis_limbah_dicari IN ('ampas_kopi', 'sekam_padi', 'kulit_buah_sayur', 'serbuk_kayu', 'sisa_makanan')),
  jumlah_dibutuhkan_per_minggu NUMERIC NOT NULL,
  harga_ditawarkan_per_kg NUMERIC NOT NULL,
  tingkat_urgensi TEXT DEFAULT 'sedang' CHECK (tingkat_urgensi IN ('rendah', 'sedang', 'tinggi')),
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'tidak_aktif')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Match Recommendations Table
CREATE TABLE IF NOT EXISTS match_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES waste_listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES wm_users(id) ON DELETE CASCADE,
  ranking INT NOT NULL,
  kategori_pemanfaatan TEXT NOT NULL,
  skor NUMERIC NOT NULL,
  alasan_teks TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Transactions Table
CREATE TABLE IF NOT EXISTS wm_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES waste_listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES wm_users(id) ON DELETE CASCADE,
  generator_id UUID REFERENCES wm_users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'disepakati' CHECK (status IN ('disepakati', 'dijadwalkan', 'selesai', 'dibatalkan')),
  jadwal_pickup TIMESTAMPTZ,
  konfirmasi_generator BOOLEAN DEFAULT FALSE,
  konfirmasi_buyer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Seed Knowledge Base
INSERT INTO knowledge_base (jenis_limbah, kategori_pemanfaatan, estimasi_nilai_per_kg_min, estimasi_nilai_per_kg_max, catatan) VALUES
('ampas_kopi', 'biofertilizer', 1800, 2200, 'Kandungan N (nitrogen) ~2.2% dan rasio C/N seimbang, sangat ideal untuk racikan biofertilizer organik.'),
('ampas_kopi', 'media_tanam_jamur', 1200, 1600, 'Struktur mikro pori tinggi sangat ramah untuk pertumbuhan miselium jamur tiram dan kuping.'),
('ampas_kopi', 'biomassa', 600, 900, 'Kadar minyak atsiri menyumbang nilai kalor ~5000 kcal/kg untuk pembuat briket energi.'),

('sekam_padi', 'media_tanam', 1500, 2000, 'Kandungan silika alami & pori sekam padi bakar/mentah memperbaiki porositas serta drainase tanah.'),
('sekam_padi', 'biomassa', 700, 1100, 'Kandungan karbon stabil cocok untuk burner pengeringan hasil pertanian dan pembuatan briket.'),

('kulit_buah_sayur', 'eco_enzyme', 1500, 2100, 'Tinggi gula alami dan mikroba menguntungkan, bahan utama cairan pembersih & bio-aktivator pertanian.'),
('kulit_buah_sayur', 'kompos', 1000, 1400, 'Mempercepat proses komposting bahan kering hijau serta melengkapi variasi asam amino.'),
('kulit_buah_sayur', 'pakan_ternak', 800, 1200, 'Dapat diolah menjadi pakan silase ternak ruminansia bernilai gizi tinggi.'),

('serbuk_kayu', 'media_tanam_jamur', 1400, 1900, 'Substrat utama (lignin & selulosa) favorit pembudidaya jamur tiram putih & jamur kayu.'),
('serbuk_kayu', 'kompos', 900, 1300, 'Menjaga kelembaban tanah dan menjadi mulsa pelindung permukaan lahan agribisnis.'),

('sisa_makanan', 'pakan_maggot_bsf', 1200, 1700, 'Kaya protein padat & lemak, menjadi pakan utama budidaya Maggot BSF berkualitas tinggi.'),
('sisa_makanan', 'kompos', 800, 1200, 'Dapat diolah menjadi kompos organik anaerobik padat hara.')
ON CONFLICT DO NOTHING;
