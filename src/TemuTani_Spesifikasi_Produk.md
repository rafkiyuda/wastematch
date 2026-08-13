# TemuTani — Spesifikasi Produk Lengkap

> Dokumen ini adalah brief teknis lengkap untuk membangun TemuTani, sebuah platform web B2B yang mempertemukan kelompok tani/gapoktan penghasil limbah pertanian dengan pembeli limbah di sektor pertanian, menggunakan AI untuk merekomendasikan pemanfaatan limbah bernilai ekonomi tertinggi.
>
> Dibuat untuk kompetisi GEMASTIK 2026, Divisi Pengembangan Bisnis TIK. Dokumen ini menggantikan versi sebelumnya yang bernama WasteMatch dengan generator UMKM F&B — scope sudah dipersempit khusus ke limbah pertanian.

---

## 1. Ringkasan Produk

**TemuTani** adalah marketplace dua sisi (two-sided marketplace) yang menghubungkan kelompok tani/gabungan kelompok tani (gapoktan) penghasil limbah hasil panen (sekam padi, jerami padi, limbah jagung, sabut kelapa, jerami kedelai) dengan pembeli di sektor pertanian yang membutuhkan bahan baku alternatif (produsen biofertilizer, kompos, media tanam jamur, biomassa/energi, dan peternak yang butuh pakan ternak).

Nilai inti produk: limbah hasil panen yang muncul rutin setiap musim panen sering menumpuk begitu saja di gapoktan karena tidak ada jaringan pembeli yang jelas — padahal limbah ini punya nilai ekonomi nyata. Di sisi lain, produsen input pertanian kesulitan mendapat pasokan bahan baku alternatif yang konsisten dan dalam volume besar. TemuTani menjembatani ini dengan sistem rekomendasi berbasis AI yang tidak hanya mencocokkan, tapi menyarankan pemanfaatan dengan nilai ekonomi tertinggi untuk tiap jenis limbah.

---

## 2. Masalah yang Diselesaikan

- Gapoktan/kelompok tani menghasilkan limbah hasil panen secara rutin setiap musim (sekam padi, jerami padi, limbah jagung, sabut kelapa, jerami kedelai), tapi limbah ini sering dibiarkan menumpuk atau dibakar begitu saja karena tidak ada jaringan pembeli yang terstruktur.
- Produsen input pertanian (biofertilizer, kompos, media tanam, biomassa, peternak yang butuh pakan) kesulitan menemukan pasokan bahan baku limbah pertanian yang konsisten dan terverifikasi kualitasnya, terutama di luar musim panen raya.
- Transaksi yang terjadi saat ini sifatnya informal dan sangat bergantung relasi personal antar pihak — tidak ada cara objektif untuk menentukan limbah tertentu paling menguntungkan dijual sebagai apa dan ke siapa.
- Solusi yang ada saat ini (pengepul informal) fokus ke barang recyclable (plastik, kertas, logam) atau beroperasi skala sangat lokal tanpa sistem pencocokan yang terstruktur.

---

## 3. Target Pengguna (Dua Sisi Marketplace)

### Sisi Generator (penghasil limbah — yang menjual)

Generator adalah **gapoktan/kelompok tani**, bukan petani perorangan. Ini keputusan desain yang disengaja: satu petani individu biasanya hanya punya limbah dalam jumlah kecil yang tidak layak jadi satu transaksi B2B, sementara gapoktan sudah mengagregasi hasil panen dari banyak anggota petani sekaligus sehingga volumenya cukup besar untuk ditransaksikan secara efisien. Perwakilan gapoktan (ketua/pengurus) yang menjadi pengguna aplikasi dan menginput data atas nama anggota.

Komoditas yang dicakup di Fase 1:
- Gapoktan padi → sekam padi (dari penggilingan yang menjadi bagian jaringan gapoktan) dan jerami padi
- Gapoktan jagung → limbah tongkol dan batang jagung
- Kelompok tani kelapa → sabut kelapa
- Kelompok tani kedelai → jerami kedelai

### Sisi Buyer (pembeli limbah — sektor pertanian)

- Produsen biofertilizer/pupuk organik
- Petani/pembudidaya jamur (jerami padi adalah bahan utama media tanam jamur merang; sabut kelapa dan sekam padi juga dipakai sebagai campuran media tanam)
- Produsen kompos
- Produsen biomassa/briket energi
- Peternak sapi/kerbau (jerami padi dan jerami kedelai adalah pakan ternak yang sudah umum dipakai, terutama saat musim kering ketika rumput hijau langka)

---

## 4. Ruang Lingkup MVP (Fase 1 — PENTING, Batasi Scope Ini)

**HANYA limbah pertanian non-B3 dari empat komoditas berikut.** Ini keputusan sengaja untuk menghindari kompleksitas perizinan dan menjaga fokus di tahap awal, sesuai arahan dari sesi review dengan dosen pembimbing.

Kategori limbah yang MASUK scope Fase 1:
- Sekam padi
- Jerami padi
- Limbah jagung (tongkol dan batang)
- Sabut kelapa
- Jerami kedelai

Kategori yang **SENGAJA DIKECUALIKAN** dari Fase 1 (jadi roadmap masa depan):
- Limbah dari komoditas pertanian lain di luar 4 yang disebut di atas
- Limbah B3 apa pun (pestisida bekas kemasan, dan sejenisnya)
- Limbah dari petani perorangan yang tidak tergabung dalam gapoktan/kelompok tani terstruktur (di luar jangkauan model agregasi Fase 1)

Sistem harus dirancang agar jenis limbah yang bisa diinput generator **dibatasi dari daftar pilihan (dropdown/kategori tertutup)**, bukan free-text bebas.

---

## 5. Alur Pengguna Utama (User Journey)

### Alur Generator (Gapoktan menjual limbah)
1. Pengurus gapoktan daftar/login, lengkapi profil (nama gapoktan, wilayah, jumlah anggota petani, komoditas utama).
2. Pengurus gapoktan input listing limbah baru: pilih jenis limbah (dari kategori tertutup Fase 1), estimasi jumlah (kg atau ton), lokasi pengambilan, jadwal ketersediaan (biasanya terkait musim panen).
3. Sistem AI memproses listing ini → menghasilkan rekomendasi buyer terbaik (lihat Bagian 6).
4. Pengurus gapoktan melihat rekomendasi dalam bentuk ranking (Buyer A, B, C) lengkap dengan alasan.
5. Pengurus gapoktan pilih buyer, konfirmasi transaksi.
6. Gapoktan & buyer sepakati jadwal pickup di dalam sistem.
7. Setelah pickup selesai, kedua pihak konfirmasi status "selesai" di sistem.

### Alur Buyer (membeli limbah)
1. Buyer daftar/login, lengkapi profil (jenis usaha, kapasitas serap per jenis limbah, lokasi).
2. Buyer input "demand aktif": jenis limbah yang dicari, jumlah dibutuhkan per periode, harga yang ditawarkan per kg/ton, tingkat urgensi.
3. Buyer bisa browsing listing yang tersedia secara manual, ATAU menunggu sistem merekomendasikan listing yang cocok dengan demand mereka.
4. Buyer menerima notifikasi ketika ada listing baru yang match dengan demand mereka — penting karena listing dari gapoktan cenderung muncul musiman/berkala mengikuti masa panen, bukan tersebar rata sepanjang tahun.
5. Buyer konfirmasi ketertarikan, lanjut ke penjadwalan pickup dengan gapoktan.

---

## 6. Fitur Inti — AI Matching Engine (2 Lapis)

AI di sini **bukan filter pencarian biasa** — tugasnya adalah reasoning dua lapis untuk menjawab pertanyaan "limbah ini paling untung dijadikan APA, dan ke SIAPA".

### Lapis 1 — Knowledge Base Reasoning (jenis limbah → kandidat pemanfaatan)

Basis pengetahuan statis disusun dari riset literatur pertanian (BUKAN dari data transaksi, supaya tidak ada masalah cold-start):

```
{
  "sekam_padi": {
    "kemungkinan_pemanfaatan": [
      { "kategori": "media_tanam", "catatan": "diolah jadi arang sekam, campuran media tanam sangat umum untuk pembibitan dan hidroponik" },
      { "kategori": "biomassa", "catatan": "nilai kalor cukup untuk bahan bakar, termasuk untuk keperluan pengeringan gabah sendiri" },
      { "kategori": "kompos", "catatan": "terurai lebih lambat dibanding limbah organik lain karena kandungan silika tinggi" }
    ]
  },
  "jerami_padi": {
    "kemungkinan_pemanfaatan": [
      { "kategori": "pakan_ternak", "catatan": "pakan sapi/kerbau yang sudah umum dipakai, terutama saat musim kering" },
      { "kategori": "media_tanam_jamur", "catatan": "bahan utama media tanam jamur merang" },
      { "kategori": "kompos", "catatan": "alternatif kalau demand pakan ternak dan media jamur sedang rendah" }
    ]
  }
  // dst untuk limbah jagung, sabut kelapa, jerami kedelai
}
```

### Lapis 2 — Optimasi Buyer (dari kandidat kategori → buyer spesifik terbaik)

Setelah Lapis 1 menghasilkan kandidat kategori pemanfaatan, sistem mencari buyer AKTIF di platform yang cocok dengan tiap kandidat, lalu menghitung skor gabungan berdasarkan: kecocokan jenis material dengan demand buyer, harga yang ditawarkan buyer, jarak buyer dari lokasi gapoktan (karena buyer yang self-pickup), dan urgensi/kapasitas demand buyer.

### Output Akhir (Contoh Konkret)

Input: Pengurus gapoktan memasukkan listing "2 ton sekam padi" dari hasil penggilingan musim panen ini.

Proses: sistem cek knowledge base → 3 kandidat kategori (media tanam, biomassa, kompos) → cari buyer aktif untuk tiap kategori → hitung skor gabungan.

Output ke gapoktan:

```
1. Buyer A — Produsen Media Tanam "Tumbuh Subur"
   Kategori: Media Tanam (Arang Sekam) | Skor: 94%
   Alasan: Media tanam adalah pemanfaatan bernilai ekonomi tertinggi untuk sekam
   padi. Buyer A memiliki demand aktif 1,5 ton/bulan, harga ditawarkan kompetitif,
   jarak 8 km dari lokasi gapoktan.

2. Buyer B — Produsen Biomassa "EnergiHijau"
   Kategori: Biomassa | Skor: 81%
   Alasan: Kapasitas serap besar dan bisa menampung sisa volume yang tidak
   terserap Buyer A, tapi nilai ekonomi per kg lebih rendah.

3. Buyer C — Produsen Kompos "Suburtani"
   Kategori: Kompos | Skor: 70%
   Alasan: Cocok sebagai opsi cadangan, tapi sekam padi terurai lebih lambat
   dibanding bahan organik lain sehingga kurang jadi prioritas utama buyer kompos.
```

### Implementasi Teknis (Rekomendasi Pendekatan)

Jangan bangun model machine learning dari nol. Pendekatan yang direkomendasikan: **pola RAG (Retrieval-Augmented Generation)** — knowledge base (Lapis 1) disimpan sebagai data terstruktur di database (hasil riset manual tim), data demand buyer aktif (Lapis 2) diambil real-time dari database, keduanya dikirim sebagai konteks ke LLM API (Claude API atau sejenisnya) dengan prompt yang meminta ranking + alasan dalam format JSON terstruktur. LLM TIDAK dilatih ulang — cukup prompted dengan konteks relevan setiap kali ada listing baru.

**Fitur yang SENGAJA TIDAK dibangun di Fase 1**: prediksi harga pasar otomatis dari data historis, prediksi buyer paling potensial berdasarkan pola historis, AI computer vision untuk menilai kualitas limbah dari foto — semua ini butuh data historis yang belum ada di awal, masukkan sebagai roadmap masa depan.

---

## 7. Model Logistik: Self-Pickup

Platform **TIDAK mengurus transportasi/pengangkutan limbah sendiri**. Buyer yang bertanggung jawab menjemput limbah langsung dari lokasi gapoktan. Platform berperan sebagai fasilitator informasi & penjadwalan — bukan operator logistik.

Catatan penting untuk kategori limbah pertanian: volume per transaksi bisa jauh lebih besar dibanding limbah UMKM (bisa mencapai ton, bukan puluhan kilogram), sehingga buyer kemungkinan perlu kendaraan yang lebih besar (truk kecil/pick-up) dibanding sekadar mobil pribadi. Ini tidak mengubah model self-pickup itu sendiri — kendaraan tetap tanggung jawab buyer — tapi perlu dipastikan sistem penjadwalan memberi cukup informasi (perkiraan volume, akses jalan ke lokasi gapoktan) agar buyer bisa menyiapkan kendaraan yang sesuai.

Setelah gapoktan & buyer sepakat transaksi, sistem menyediakan fitur penjadwalan: kedua pihak sepakati tanggal/jam pickup, alamat lengkap muncul otomatis setelah kesepakatan terjadi. Setelah pickup, kedua pihak konfirmasi status "selesai" di sistem (two-way confirmation).

---

## 8. Arsitektur Teknis & Kebutuhan Offline

### Kenapa butuh offline-resilient (bukan "sepenuhnya offline")

Ini menjadi **semakin penting** setelah fokus generator bergeser ke gapoktan di wilayah pedesaan, yang secara umum punya akses internet lebih terbatas dan tidak stabil dibanding target awal di area perkotaan. Sistem harus tahan terhadap koneksi lambat/putus-putus.

Yang **BISA** berjalan offline/resilient terhadap koneksi buruk:
- Mengisi form listing limbah baru (data tersimpan lokal dulu di perangkat, baru dikirim ke server begitu koneksi kembali) — ini krusial karena pengurus gapoktan mungkin mengisi data dari lokasi dengan sinyal lemah.
- Melihat/browsing data yang sudah pernah dimuat sebelumnya (listing yang sudah dilihat, knowledge base referensi jenis limbah, riwayat transaksi).
- Draft form tidak hilang meskipun koneksi putus di tengah proses input.

Yang **TIDAK BISA** berjalan offline (butuh koneksi ke server):
- Proses AI Matching Engine (butuh data demand buyer real-time + panggilan ke LLM API).
- Melihat listing/demand terbaru yang belum pernah dimuat sebelumnya.
- Konfirmasi transaksi final.

**Jelaskan ini secara jujur di pitch** — bukan mengklaim "100% offline", tapi "resilient terhadap koneksi lambat/putus-putus di wilayah pedesaan, sehingga data tidak hilang".

### Arsitektur yang Direkomendasikan

- **Frontend:** Progressive Web App (PWA) — bisa diinstall di HP seperti aplikasi native.
- **Service Worker:** cache assets dan data yang sudah pernah diakses.
- **Local Storage (IndexedDB via Dexie.js):** menyimpan draft input & data yang sudah dimuat sebelumnya di sisi client.
- **Sync Queue / Background Sync:** data yang diisi offline disimpan dengan status "pending sync", otomatis terkirim begitu koneksi kembali.
- **Backend:** REST API (Node.js/Express) + database (PostgreSQL).
- **AI Layer:** panggilan ke LLM API dari backend, bukan dari frontend langsung.

---

## 9. Model Data (Skema Utama)

```
User
- id, nama, email, password_hash, role (gapoktan/buyer), lokasi (lat, lng), alamat, no_hp

GapoktanProfile
- id, user_id, nama_gapoktan, wilayah, jumlah_anggota_petani, komoditas_utama

WasteListing
- id, gapoktan_id, jenis_limbah (enum: sekam_padi/jerami_padi/limbah_jagung/sabut_kelapa/jerami_kedelai),
  jumlah_kg, lokasi_pickup, jadwal_tersedia, status (aktif/terjual/kadaluarsa), created_at

BuyerDemand
- id, buyer_id, jenis_limbah_dicari, jumlah_dibutuhkan_per_periode, harga_ditawarkan_per_kg,
  tingkat_urgensi (rendah/sedang/tinggi), status (aktif/tidak aktif)

KnowledgeBase (data seed, jarang berubah)
- jenis_limbah, kategori_pemanfaatan, catatan

MatchRecommendation
- id, listing_id, ranking (1,2,3...), buyer_id, kategori_pemanfaatan, skor, alasan_teks, generated_at

Transaction
- id, listing_id, buyer_id, gapoktan_id, status (disepakati/dijadwalkan/selesai/dibatalkan),
  jadwal_pickup, konfirmasi_gapoktan (bool), konfirmasi_buyer (bool)
```

---

## 10. Rencana Pengembangan Bertahap (WAJIB DIIKUTI URUTANNYA)

### Fase 0 — Setup Proyek
Setup project (frontend PWA + backend + database), autentikasi dasar (register/login untuk role gapoktan & buyer), struktur database sesuai Bagian 9.

### Fase 1 — CRUD Dasar (Tanpa AI Dulu)
Gapoktan bisa membuat/melihat/mengedit/menghapus listing limbah. Buyer bisa membuat/melihat/mengedit demand. Buyer bisa browsing semua listing secara manual (filter jenis limbah). **Target di akhir fase ini:** aplikasi sudah bisa didemokan sebagai marketplace sederhana.

### Fase 2 — Infrastruktur Offline (PWA)
Service worker untuk caching, IndexedDB untuk draft listing/demand, sync queue otomatis. Testing simulasi offline untuk memastikan draft tidak hilang.

### Fase 3 — Knowledge Base & AI Matching Engine (Inti Produk)
Isi data knowledge base (5 jenis limbah x kandidat pemanfaatan) ke database. Bangun endpoint matching: listing baru → retrieve knowledge base → retrieve buyer demand aktif → kirim ke LLM API → simpan hasil ke MatchRecommendation. Tampilkan hasil di UI gapoktan.

### Fase 4 — Alur Transaksi & Penjadwalan
Gapoktan pilih buyer dari rekomendasi, buyer konfirmasi, kedua pihak input jadwal pickup, konfirmasi dua arah setelah pickup selesai.

### Fase 5 — Dashboard & Metrik Dampak
Dashboard gapoktan: riwayat listing, total limbah terjual, estimasi pendapatan tambahan bagi anggota petani. Dashboard buyer: riwayat pembelian. Metrik dampak: total kg limbah teralihkan dari dibakar/dibuang, estimasi nilai ekonomi tercipta.

### Fase 6 — Polish & Demo Prep
Perbaikan UI/UX, responsive untuk mobile, siapkan data dummy realistis untuk demo (termasuk simulasi kondisi offline saat presentasi ke juri, untuk menunjukkan fitur ini benar-benar berfungsi).

---

## 11. Rekomendasi Tech Stack

| Layer | Rekomendasi | Alasan |
|---|---|---|
| Frontend | React / Next.js (dengan PWA plugin) | Ekosistem besar untuk implementasi PWA & offline-first |
| Offline Storage | IndexedDB via Dexie.js | Mempermudah kerja dengan IndexedDB |
| Backend | Node.js + Express | Konsisten dengan JS di frontend |
| Database | PostgreSQL (disarankan Supabase untuk kemudahan setup) | Data relasional, sudah terbukti mendukung skala hingga 100.000 pengguna aktif bulanan pada paket Pro |
| AI Layer | Claude API (Haiku 4.5) dengan pola RAG manual | Model paling cost-efficient untuk tugas klasifikasi/rekomendasi terstruktur, tidak perlu training model sendiri |
| Hosting (demo) | Vercel/Railway (tier sesuai kebutuhan) | Cepat deploy untuk keperluan kompetisi |

---

## 12. Catatan Penting untuk AI Coding Tool

- **Ikuti urutan fase di Bagian 10 secara berurutan.** Jangan mulai dari AI Matching Engine sebelum CRUD dasar (Fase 1) selesai dan bisa didemokan.
- **Generator HANYA gapoktan/kelompok tani, BUKAN petani perorangan, BUKAN UMKM F&B.** Jangan tambahkan role generator lain di luar ini.
- **Jenis limbah dibatasi ke 5 kategori** yang disebut di Bagian 4 — jangan buat input jenis limbah bebas/free-text.
- **AI Matching Engine menggunakan LLM API dengan prompting (RAG), bukan model ML yang di-training sendiri.**
- **Data knowledge base (Lapis 1) adalah data seed manual**, diisi tim berdasarkan riset literatur pertanian, bukan digenerate otomatis oleh sistem.
- **Offline capability terbatas pada input/browsing data yang sudah di-cache**, bukan seluruh sistem termasuk AI matching.
- Prioritaskan tampilan mobile-responsive dan pertimbangkan bahwa sebagian pengguna gapoktan mungkin mengakses dari kondisi sinyal terbatas — uji fitur offline-nya secara nyata, bukan asumsi.
