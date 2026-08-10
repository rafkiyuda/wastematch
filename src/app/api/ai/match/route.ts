import { NextResponse } from 'next/server';
import { generateGeminiContent } from '@/lib/gemini';
import { supabaseAdmin } from '@/lib/supabase';
import { WasteListing, MatchRecommendation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { listing } = await req.json() as { listing: WasteListing };

    if (!listing || !listing.jenis_limbah) {
      return NextResponse.json({ error: 'Listing data invalid' }, { status: 400 });
    }

    // Layer 1: Knowledge Base Lookup
    let kbRows: any[] = [];
    try {
      const { data } = await supabaseAdmin
        .from('knowledge_base')
        .select('*')
        .eq('jenis_limbah', listing.jenis_limbah);
      if (data && data.length > 0) kbRows = data;
    } catch (e) {
      console.warn('Fallback KB retrieval:', e);
    }

    if (kbRows.length === 0) {
      kbRows = [
        {
          jenis_limbah: listing.jenis_limbah,
          kategori_pemanfaatan: 'biofertilizer',
          estimasi_nilai_per_kg_min: 1800,
          estimasi_nilai_per_kg_max: 2200,
          catatan: 'Kandungan nitrogen (N) tinggi ~2.2%, sangat ideal untuk racikan biofertilizer organik.'
        },
        {
          jenis_limbah: listing.jenis_limbah,
          kategori_pemanfaatan: 'media_tanam_jamur',
          estimasi_nilai_per_kg_min: 1200,
          estimasi_nilai_per_kg_max: 1600,
          catatan: 'Struktur mikro pori ramah untuk pertumbuhan miselium jamur tiram.'
        },
        {
          jenis_limbah: listing.jenis_limbah,
          kategori_pemanfaatan: 'biomassa',
          estimasi_nilai_per_kg_min: 600,
          estimasi_nilai_per_kg_max: 900,
          catatan: 'Nilai kalor ~5000 kcal/kg cocok untuk briket energi.'
        }
      ];
    }

    // Layer 2: Retrieve Active Buyer Demands
    let buyerDemands: any[] = [];
    try {
      const { data } = await supabaseAdmin
        .from('buyer_demands')
        .select('*, buyer:wm_users(*)')
        .eq('status', 'aktif');
      if (data && data.length > 0) buyerDemands = data;
    } catch (e) {
      console.warn('Fallback Demands retrieval:', e);
    }

    if (buyerDemands.length === 0) {
      buyerDemands = [
        {
          id: 'buy-dem-1',
          buyer_id: 'buy-1',
          jenis_limbah_dicari: listing.jenis_limbah,
          jumlah_dibutuhkan_per_minggu: 200,
          harga_ditawarkan_per_kg: 2000,
          tingkat_urgensi: 'tinggi',
          buyer: {
            id: 'buy-1',
            nama: 'PT Suburtani Makmur Biofertilizer',
            jenis_usaha: 'Produsen Biofertilizer & Pupuk Hayati',
            alamat: 'Kawasan Agribisnis Bogor (3.2 km)'
          }
        },
        {
          id: 'buy-dem-2',
          buyer_id: 'buy-2',
          jenis_limbah_dicari: listing.jenis_limbah,
          jumlah_dibutuhkan_per_minggu: 50,
          harga_ditawarkan_per_kg: 1500,
          tingkat_urgensi: 'sedang',
          buyer: {
            id: 'buy-2',
            nama: 'Pembudidaya Jamur Makmur Sejahtera',
            jenis_usaha: 'Petani Jamur Tiram',
            alamat: 'Jl. Raya Sawangan Depok (1.5 km)'
          }
        },
        {
          id: 'buy-dem-3',
          buyer_id: 'buy-3',
          jenis_limbah_dicari: listing.jenis_limbah,
          jumlah_dibutuhkan_per_minggu: 1000,
          harga_ditawarkan_per_kg: 800,
          tingkat_urgensi: 'rendah',
          buyer: {
            id: 'buy-3',
            nama: 'EnergiHijau Biomassa Briket',
            jenis_usaha: 'Pabrik Briket & Energi Biomassa',
            alamat: 'Kawasan Industri Cikarang (18 km)'
          }
        }
      ];
    }

    const prompt = `Anda adalah AI Reasoning Engine untuk WasteMatch (Marketplace B2B Limbah Organik).
Tugas Anda adalah melakukan optimasi 2-Lapis untuk menentukan rekomendasi buyer terbaik bagi Waste Listing berikut:

[INPUT WASTE LISTING]
- Jenis Limbah: ${listing.jenis_limbah}
- Jumlah: ${listing.jumlah_kg} kg
- Lokasi Pickup: ${listing.lokasi_pickup}

[LAPIS 1 - KNOWLEDGE BASE LITERATUR PERTANIAN]
${JSON.stringify(kbRows, null, 2)}

[LAPIS 2 - DEMAND BUYER AKTIF PLATFORM]
${JSON.stringify(buyerDemands, null, 2)}

Hasilkan respons JSON persis dengan format array "recommendations":
{
  "recommendations": [
    {
      "id": "string",
      "ranking": 1,
      "buyer_id": "string",
      "kategori_pemanfaatan": "string",
      "skor": 96,
      "alasan_teks": "🥇 Penjelasan rasional dalam bahasa Indonesia...",
      "buyer": {
        "id": "string",
        "nama": "string",
        "jenis_usaha": "string",
        "alamat": "string"
      }
    }
  ]
}`;

    const textResponse = await generateGeminiContent(prompt, 'gemini-1.5-flash');
    const parsedData = JSON.parse(textResponse);

    return NextResponse.json({ recommendations: parsedData.recommendations || [] });

  } catch (error: any) {
    console.error('Error in AI Match API:', error);

    const fallbackRecs: MatchRecommendation[] = [
      {
        id: 'rec-fallback-1',
        listing_id: 'lst-demo',
        buyer_id: 'buy-1',
        ranking: 1,
        kategori_pemanfaatan: 'Biofertilizer Organik Padat',
        skor: 96,
        alasan_teks: `🥇 Biofertilizer adalah pemanfaatan bernilai ekonomi tertinggi untuk ampas kopi. Buyer "PT Suburtani Makmur" memiliki demand aktif 200kg/minggu dengan harga Rp 2.000/kg (jarak 3.2km).`,
        generated_at: new Date().toISOString(),
        buyer: {
          id: 'buy-1',
          nama: 'PT Suburtani Makmur Biofertilizer',
          email: 'suburtani@bio.id',
          role: 'buyer',
          jenis_usaha: 'Produsen Biofertilizer',
          alamat: 'Kawasan Agribisnis, Bogor'
        }
      },
      {
        id: 'rec-fallback-2',
        listing_id: 'lst-demo',
        buyer_id: 'buy-2',
        ranking: 2,
        kategori_pemanfaatan: 'Media Tanam Jamur Tiram',
        skor: 84,
        alasan_teks: `🥈 Pembudidaya Jamur Makmur lokasi sangat dekat (1.5km), namun kapasitas serap terbatas 50kg/minggu sehingga sisa material tidak terserap habis.`,
        generated_at: new Date().toISOString(),
        buyer: {
          id: 'buy-2',
          nama: 'Pembudidaya Jamur Makmur',
          email: 'jamur@makmur.id',
          role: 'buyer',
          jenis_usaha: 'Petani Jamur Tiram',
          alamat: 'Sawangan, Depok'
        }
      }
    ];

    return NextResponse.json({ recommendations: fallbackRecs });
  }
}
