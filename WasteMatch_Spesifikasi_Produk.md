# WasteMatch — Spesifikasi Produk Lengkap

> Dokumen ini adalah brief teknis lengkap untuk membangun WasteMatch, sebuah platform web B2B yang mempertemukan penghasil limbah organik (waste generator) dengan pembeli limbah di sektor pertanian (waste buyer), menggunakan AI untuk merekomendasikan pemanfaatan limbah bernilai ekonomi tertinggi.
>
> Dibuat untuk kompetisi GEMASTIK 2026, Divisi Pengembangan Bisnis TIK.

---

## 1. Ringkasan Produk

**WasteMatch** adalah marketplace dua sisi (two-sided marketplace) yang menghubungkan UMKM penghasil limbah organik (coffee shop, restoran, katering, industri pengolahan makanan skala kecil-menengah) dengan pembeli di sektor pertanian yang membutuhkan bahan baku alternatif (produsen biofertilizer, kompos, media tanam jamur, biomassa/energi, dan pakan ternak).

Nilai inti produk: banyak UMKM membuang limbah organik yang sebenarnya punya nilai ekonomi, karena tidak tahu ke mana harus menjualnya. Di sisi lain, produsen input pertanian kesulitan mendapat pasokan bahan baku alternatif yang konsisten. WasteMatch menjembatani ini dengan sistem rekomendasi berbasis AI yang tidak hanya mencocokkan, tapi menyarankan pemanfaatan dengan nilai ekonomi tertinggi untuk tiap jenis limbah.

---

## 2. Masalah yang Diselesaikan

- UMKM F&B (coffee shop, restoran, katering, pabrik pengolahan makanan kecil) menghasilkan limbah organik secara rutin, tapi tidak punya jaringan pembeli — limbah ini akhirnya dibuang begitu saja, padahal punya nilai ekonomi.
- Produsen input pertanian (biofertilizer, kompos, media tanam, biomassa, pakan ternak) kesulitan menemukan pasokan bahan baku limbah organik yang konsisten dan terverifikasi kualitasnya.
- Solusi yang ada saat ini (pengepul informal, bank sampah) fokus ke barang recyclable (plastik, kertas, logam) atau skala rumah tangga — tidak ada jalur khusus untuk transaksi B2B limbah organik menuju sektor pertanian.
- Ketika transaksi informal terjadi, tidak ada cara objektif untuk menentukan limbah tertentu paling menguntungkan dijual sebagai apa — keputusan biasanya asal atau berdasarkan siapa yang kebetulan kenal siapa.

---

## 3. Target Pengguna (Dua Sisi Marketplace)

### Sisi Generator (penghasil limbah — yang menjual)
- Coffee shop (ampas kopi)
- Restoran & katering (sisa makanan, kulit buah/sayur)
- Penggilingan padi kecil (sekam padi)
- Bengkel kayu/mebel kecil (serbuk gergaji)
- Pasar tradisional (limbah sayur/buah)

### Sisi Buyer (pembeli limbah — sektor pertanian)
- Produsen biofertilizer/pupuk organik
- Petani/pembudidaya jamur (butuh media tanam dari serbuk kayu, sekam)
- Produsen kompos
- Produsen biomassa/briket energi
- Peternak (pakan ternak dari sisa makanan/sayur)

---

## 4. Ruang Lingkup MVP (Fase 1 — PENTING, Batasi Scope Ini)

**HANYA limbah non-B3 yang statusnya jelas secara regulasi.** Ini keputusan sengaja untuk menghindari kompleksitas perizinan di tahap awal.

Kategori limbah yang MASUK scope Fase 1:
- Ampas kopi
- Sekam padi
- Kulit buah/sayur dari pasar/restoran
- Serbuk gergaji/serbuk kayu
- Sisa makanan dari katering/restoran (untuk kompos/pakan ternak)

Kategori yang **SENGAJA DIKECUALIKAN** dari Fase 1 (jadi roadmap masa depan, butuh izin tambahan):
- Minyak jelantah (status regulasinya ambigu — sebagian sumber menyebutnya limbah B3 dengan kode B105d di bawah PP 22/2021, sebagian sumber lain menyebut non-B3; sampai ada kejelasan, jangan masukkan ke sistem)
- Limbah B3 lain apa pun (oli bekas, limbah medis, limbah kimia, dll.)

Sistem harus dirancang agar jenis limbah yang bisa diinput generator **dibatasi dari daftar pilihan (dropdown/kategori tertutup)**, bukan free-text bebas — supaya tidak ada yang tidak sengaja input limbah B3 ke sistem.

---

## 5. Alur Pengguna Utama (User Journey)

### Alur Generator (menjual limbah)
1. Generator daftar/login, lengkapi profil (nama usaha, lokasi, jenis usaha).
2. Generator input listing limbah baru: pilih jenis limbah (dari kategori tertutup Fase 1), jumlah (kg), foto (opsional untuk MVP, bukan untuk AI vision — cukup sebagai bukti visual), lokasi pickup, jadwal ketersediaan.
3. Sistem AI memproses listing ini → menghasilkan rekomendasi buyer terbaik (lihat Bagian 6).
4. Generator melihat rekomendasi dalam bentuk ranking (Buyer A, B, C) lengkap dengan alasan.
5. Generator pilih buyer, konfirmasi transaksi.
6. Generator & buyer sepakati jadwal pickup di dalam sistem.
7. Setelah pickup selesai, generator & buyer sama-sama konfirmasi "transaksi selesai" di sistem.

### Alur Buyer (membeli limbah)
1. Buyer daftar/login, lengkapi profil (jenis usaha, kapasitas serap per jenis limbah, lokasi).
2. Buyer input "demand aktif": jenis limbah yang dicari, jumlah dibutuhkan per periode (misal per minggu), harga yang ditawarkan per kg, tingkat urgensi.
3. Buyer bisa browsing listing yang tersedia secara manual, ATAU menunggu sistem merekomendasikan listing yang cocok dengan demand mereka.
4. Buyer menerima notifikasi ketika ada listing baru yang match dengan demand mereka.
5. Buyer konfirmasi ketertarikan, lanjut ke penjadwalan pickup dengan generator.

---

## 6. Fitur Inti — AI Matching Engine (2 Lapis)

Ini adalah fitur paling penting dan paling harus dikerjakan dengan benar. AI di sini **bukan filter pencarian biasa** — tugasnya adalah reasoning dua lapis untuk menjawab pertanyaan "limbah ini paling untung dijadikan APA, dan ke SIAPA".

### Lapis 1 — Knowledge Base Reasoning (jenis limbah → kandidat pemanfaatan)

Sebelum sistem jalan, perlu disiapkan **basis pengetahuan statis** (disusun dari riset literatur pertanian/circular economy, BUKAN dari data transaksi — supaya tidak ada masalah cold-start). Basis pengetahuan ini berbentuk data terstruktur, contoh:

```
{
  "ampas_kopi": {
    "kemungkinan_pemanfaatan": [
      { "kategori": "biofertilizer", "estimasi_nilai_per_kg": "Rp1.800 - Rp2.200", "catatan": "kandungan nitrogen tinggi, cocok untuk kompos/pupuk organik" },
      { "kategori": "media_tanam_jamur", "estimasi_nilai_per_kg": "Rp1.200 - Rp1.600", "catatan": "struktur berpori cocok untuk substrat jamur tiram" },
      { "kategori": "biomassa", "estimasi_nilai_per_kg": "Rp600 - Rp900", "catatan": "nilai kalor cukup untuk briket, tapi nilai ekonomi lebih rendah" }
    ]
  },
  "sekam_padi": {
    "kemungkinan_pemanfaatan": [
      { "kategori": "media_tanam", "estimasi_nilai_per_kg": "...", "catatan": "..." },
      { "kategori": "biomassa", "estimasi_nilai_per_kg": "...", "catatan": "..." }
    ]
  }
  // dst untuk tiap jenis limbah dalam scope Fase 1
}
```

Data awal ini WAJIB disiapkan manual/riset sebelum sistem punya nilai — ini adalah "seed data", bukan sesuatu yang di-generate otomatis.

### Lapis 2 — Optimasi Buyer (dari kandidat kategori → buyer spesifik terbaik)

Setelah Lapis 1 menghasilkan kandidat kategori pemanfaatan, sistem mencari buyer AKTIF di platform yang cocok dengan tiap kandidat kategori, lalu menghitung skor gabungan berdasarkan:
- Kecocokan jenis material dengan demand buyer
- Harga yang ditawarkan buyer (lebih tinggi = skor lebih baik)
- Jarak buyer dari lokasi generator (lebih dekat = skor lebih baik, karena buyer yang self-pickup)
- Urgensi/kapasitas demand buyer (buyer yang butuh banyak & mendesak diprioritaskan dibanding yang kapasitas serapnya kecil)

### Output Akhir (Contoh Konkret)

Input: Generator memasukkan listing "500kg ampas kopi".

Proses:
1. Lapis 1: sistem cek knowledge base → ampas kopi punya 3 kandidat kategori (biofertilizer, media tanam jamur, biomassa).
2. Lapis 2: sistem cari buyer aktif untuk tiap kategori, hitung skor gabungan.

Output ke generator:

```
🥇 Buyer A — Produsen Biofertilizer "Suburtani"
   Kategori: Biofertilizer | Skor: 96%
   Alasan: Biofertilizer adalah pemanfaatan bernilai ekonomi tertinggi untuk ampas 
   kopi. Buyer A memiliki demand aktif 200kg/minggu, harga ditawarkan Rp2.000/kg, 
   jarak 3.2km dari lokasi Anda.

🥈 Buyer B — Petani Jamur "Jamur Makmur"
   Kategori: Media Tanam Jamur | Skor: 84%
   Alasan: Cocok, tapi kapasitas serap terbatas (50kg/minggu) sehingga sisa 
   material tidak akan terjual habis ke buyer ini saja.

🥉 Buyer C — Produsen Biomassa "EnergiHijau"
   Kategori: Biomassa | Skor: 78%
   Alasan: Kapasitas serap besar, tapi nilai ekonomi per kg lebih rendah 
   dibanding dua opsi di atas.
```

### Implementasi Teknis (Rekomendasi Pendekatan)

Jangan bangun model machine learning dari nol — tidak realistis untuk timeline kompetisi dan butuh data historis yang belum ada. Pendekatan yang direkomendasikan: **pola RAG (Retrieval-Augmented Generation)**.

1. Knowledge base (Lapis 1) disimpan sebagai data terstruktur di database (bukan di-generate AI — ini hasil riset manual tim).
2. Data demand buyer aktif (Lapis 2) diambil real-time dari database.
3. Kedua data ini di-retrieve, lalu dikirim sebagai konteks ke LLM (via API — OpenAI, Anthropic Claude API, atau sejenisnya) dengan prompt yang meminta LLM menghasilkan ranking + alasan dalam format terstruktur (JSON) yang bisa dirender di UI.
4. LLM TIDAK dilatih ulang (no fine-tuning) — cukup prompted dengan konteks yang relevan setiap kali ada listing baru. Ini pendekatan yang achievable dalam waktu pengembangan kompetisi.

**Fitur yang SENGAJA TIDAK dibangun di Fase 1** (masukkan sebagai roadmap masa depan di pitch, jangan coba dibangun sekarang):
- Prediksi harga pasar otomatis dari data historis (butuh volume transaksi yang belum ada)
- Prediksi buyer paling potensial berdasarkan pola historis (sama, butuh data historis)
- AI computer vision untuk menilai kualitas limbah dari foto

---

## 7. Model Logistik: Self-Pickup

Platform **TIDAK mengurus transportasi/pengangkutan limbah sendiri**. Model yang dipakai:

- Buyer yang bertanggung jawab menjemput limbah langsung dari lokasi generator.
- Platform berperan sebagai fasilitator informasi & penjadwalan — bukan operator logistik.
- Setelah generator & buyer sepakat transaksi, sistem menyediakan fitur penjadwalan sederhana: buyer & generator sepakati tanggal/jam pickup, alamat lengkap muncul otomatis setelah kesepakatan terjadi (bukan terlihat publik sebelum ada kesepakatan, untuk alasan privasi/keamanan).
- Setelah pickup, kedua pihak konfirmasi status "selesai" di sistem masing-masing (semacam two-way confirmation, mirip sistem rating di aplikasi ride-hailing).

Ini keputusan desain yang disengaja: model asset-light, tidak butuh armada atau partnership logistik pihak ketiga di Fase 1.

---

## 8. Arsitektur Teknis & Kebutuhan Offline

### Kenapa butuh offline-resilient (bukan "sepenuhnya offline")

Target pengguna (UMKM kecil) sering punya koneksi internet yang tidak stabil (lag, putus-putus). Sistem harus tahan terhadap kondisi ini — **tapi penting dipahami: tidak semua fitur bisa benar-benar berjalan tanpa internet sama sekali.**

Yang **BISA** berjalan offline/resilient terhadap koneksi buruk:
- Mengisi form listing limbah baru (data tersimpan lokal dulu di perangkat, baru dikirim ke server begitu koneksi kembali).
- Melihat/browsing data yang sudah pernah dimuat sebelumnya (listing yang sudah dilihat, knowledge base referensi jenis limbah, riwayat transaksi) — di-cache di perangkat.
- Draft form tidak hilang meskipun koneksi putus di tengah proses input.

Yang **TIDAK BISA** berjalan offline (butuh koneksi ke server):
- Proses AI Matching Engine (karena butuh data demand buyer real-time + panggilan ke LLM API — keduanya butuh internet).
- Melihat listing/demand terbaru yang belum pernah dimuat sebelumnya.
- Konfirmasi transaksi final (harus tersinkron ke kedua pihak).

**Jelaskan ini secara jujur di pitch** — bukan mengklaim "100% offline", tapi "resilient terhadap koneksi lambat/putus-putus, sehingga data tidak hilang".

### Arsitektur yang Direkomendasikan

- **Frontend:** Progressive Web App (PWA) — bisa diinstall di HP seperti aplikasi native, tapi tetap berbasis web.
- **Service Worker:** untuk cache assets (HTML/CSS/JS) dan data yang sudah pernah diakses, supaya app tetap bisa dibuka meski koneksi sedang buruk.
- **Local Storage (IndexedDB):** untuk menyimpan draft input & data yang sudah dimuat sebelumnya di sisi client. Gunakan library seperti Dexie.js untuk mempermudah kerja dengan IndexedDB di React/JS.
- **Sync Queue / Background Sync:** ketika user mengisi form saat offline/koneksi buruk, data disimpan dulu ke IndexedDB dengan status "pending sync", lalu otomatis dikirim ke server begitu koneksi terdeteksi kembali (bisa pakai Background Sync API, atau polling sederhana untuk versi awal).
- **Backend:** REST API atau sejenisnya (Node.js/Express, atau framework lain sesuai preferensi tim) + database (PostgreSQL direkomendasikan untuk data relasional seperti listing, user, transaksi).
- **AI Layer:** panggilan ke LLM API (misal Claude API atau OpenAI API) dari backend — JANGAN dari frontend langsung (supaya API key aman, dan supaya logika RAG/retrieval bisa dikontrol di server).

---

## 9. Model Data (Skema Utama)

```
User
- id, nama, email, password_hash, role (generator/buyer), lokasi (lat, lng), alamat, no_hp, jenis_usaha

WasteListing
- id, generator_id, jenis_limbah (enum dari kategori tertutup Fase 1), jumlah_kg, 
  foto_url (opsional), lokasi_pickup, jadwal_tersedia, status (aktif/terjual/kadaluarsa), 
  created_at

BuyerDemand
- id, buyer_id, jenis_limbah_dicari, jumlah_dibutuhkan_per_minggu, harga_ditawarkan_per_kg, 
  tingkat_urgensi (rendah/sedang/tinggi), status (aktif/tidak aktif)

KnowledgeBase (data seed, jarang berubah)
- jenis_limbah, kategori_pemanfaatan, estimasi_nilai_per_kg_min, estimasi_nilai_per_kg_max, catatan

MatchRecommendation
- id, listing_id, ranking (1,2,3...), buyer_id, kategori_pemanfaatan, skor, alasan_teks, generated_at

Transaction
- id, listing_id, buyer_id, generator_id, status (disepakati/dijadwalkan/selesai/dibatalkan), 
  jadwal_pickup, konfirmasi_generator (bool), konfirmasi_buyer (bool)
```

---

## 10. Rencana Pengembangan Bertahap (WAJIB DIIKUTI URUTANNYA)

### Fase 0 — Setup Proyek
- Setup project (frontend PWA + backend + database).
- Setup autentikasi dasar (register/login untuk role generator & buyer).
- Setup struktur database sesuai skema di Bagian 9.

### Fase 1 — CRUD Dasar (Tanpa AI Dulu)
- Generator bisa membuat, melihat, mengedit, menghapus listing limbah miliknya.
- Buyer bisa membuat, melihat, mengedit demand miliknya.
- Buyer bisa browsing semua listing yang tersedia secara manual (tanpa AI matching dulu — cukup daftar/list biasa dengan filter jenis limbah).
- **Target di akhir fase ini:** aplikasi sudah bisa didemokan sebagai marketplace sederhana, meskipun belum "pintar".

### Fase 2 — Infrastruktur Offline (PWA)
- Implementasi service worker untuk caching.
- Implementasi IndexedDB (via Dexie.js atau sejenisnya) untuk menyimpan draft listing/demand yang diisi saat koneksi buruk.
- Implementasi sync queue: data yang diisi offline otomatis terkirim ke server ketika online kembali.
- Testing: simulasikan kondisi offline (matikan koneksi di browser dev tools), pastikan draft tidak hilang dan tersinkron begitu online lagi.

### Fase 3 — Knowledge Base & AI Matching Engine (Inti Produk)
- Isi data knowledge base (Lapis 1) ke database — ini kerja riset manual, bukan coding, tapi harus selesai sebelum lanjut.
- Bangun endpoint backend yang melakukan proses matching: terima listing baru → retrieve knowledge base relevan → retrieve buyer demand aktif → kirim ke LLM API dengan prompt terstruktur → terima output JSON (ranking + alasan) → simpan ke tabel MatchRecommendation.
- Tampilkan hasil rekomendasi di UI generator (lihat format contoh di Bagian 6).

### Fase 4 — Alur Transaksi & Penjadwalan
- Generator bisa memilih salah satu buyer dari rekomendasi, mengirim "minat transaksi".
- Buyer menerima notifikasi, bisa konfirmasi/tolak.
- Setelah disepakati, kedua pihak input jadwal pickup.
- Setelah pickup, kedua pihak konfirmasi "transaksi selesai" (two-way confirmation).

### Fase 5 — Dashboard & Metrik Dampak
- Dashboard sederhana untuk generator: riwayat listing, total limbah terjual, estimasi pendapatan tambahan.
- Dashboard sederhana untuk buyer: riwayat pembelian, total limbah diserap.
- Metrik dampak lingkungan (untuk kebutuhan pitch/ESG): total kg limbah yang berhasil dialihkan dari pembuangan, estimasi nilai ekonomi yang tercipta.

### Fase 6 — Polish & Demo Prep
- Perbaikan UI/UX, responsive untuk mobile (karena target user UMKM kemungkinan besar akses dari HP).
- Siapkan data dummy/seed yang realistis untuk demo ke juri (beberapa listing, beberapa buyer dengan demand berbeda, supaya AI matching terlihat jalan dengan baik saat demo).

---

## 11. Rekomendasi Tech Stack

| Layer | Rekomendasi | Alasan |
|---|---|---|
| Frontend | React / Next.js (dengan PWA plugin) | Ekosistem besar, banyak contoh implementasi PWA & offline-first |
| Offline Storage | IndexedDB via Dexie.js | Mempermudah kerja dengan IndexedDB dibanding native API |
| Backend | Node.js + Express (atau framework lain sesuai kenyamanan tim) | Konsisten dengan JS di frontend, mempercepat development |
| Database | PostgreSQL | Data relasional (user, listing, transaksi) cocok di database relasional |
| AI Layer | LLM API (Claude API / OpenAI API) dengan pola RAG manual | Tidak perlu training model sendiri, achievable dalam timeline kompetisi |
| Hosting (untuk demo) | Vercel/Render/Railway (tier gratis cukup untuk demo) | Cepat deploy, cocok untuk keperluan kompetisi |

---

## 12. Catatan Penting untuk AI Coding Tool

- **Ikuti urutan fase di Bagian 10 secara berurutan.** Jangan mulai dari AI Matching Engine sebelum CRUD dasar (Fase 1) selesai dan bisa didemokan.
- **Jangan bangun fitur di luar scope Fase 1** yang disebutkan di Bagian 4 dan catatan di akhir Bagian 6 (jangan bangun prediksi harga otomatis, jangan bangun AI vision untuk foto, jangan tambahkan kategori limbah B3).
- **AI Matching Engine menggunakan LLM API dengan prompting (RAG), bukan model ML yang di-training sendiri.** Jangan mencoba membangun/melatih model machine learning dari nol.
- **Data knowledge base (Lapis 1) adalah data seed manual**, bukan sesuatu yang perlu di-generate otomatis oleh sistem — ini akan diisi oleh tim berdasarkan riset literatur pertanian.
- **Offline capability terbatas pada input/browsing data yang sudah di-cache**, bukan seluruh sistem termasuk AI matching (yang butuh koneksi server).
- Prioritaskan tampilan mobile-responsive karena target pengguna kemungkinan besar mengakses lewat HP.
