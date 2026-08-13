import { NextResponse } from 'next/server';
import { generateGeminiContent } from '@/lib/gemini';
import { supabaseAdmin } from '@/lib/supabase';
import { WasteListing, MatchRecommendation } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let listing: WasteListing | undefined;
  try {
    const body = await req.json() as { listing: WasteListing };
    listing = body?.listing;

    if (!listing || !listing.jenis_limbah) {
      return NextResponse.json({ error: 'Listing data invalid' }, { status: 400 });
    }

    // Layer 1: Agricultural Knowledge Base Lookup
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
          kategori_pemanfaatan: 'media_tanam_arang_sekam',
          estimasi_nilai_per_kg_min: 1500,
          estimasi_nilai_per_kg_max: 2200,
          catatan: 'Diolah jadi arang sekam / media tanam bernilai ekonomi tinggi untuk hidroponik & bibit tanaman.'
        },
        {
          jenis_limbah: listing.jenis_limbah,
          kategori_pemanfaatan: 'media_tanam_jamur',
          estimasi_nilai_per_kg_min: 1200,
          estimasi_nilai_per_kg_max: 1800,
          catatan: 'Bahan baku utama media tanam jamur merang & tiram dengan daya serap miselium optimal.'
        },
        {
          jenis_limbah: listing.jenis_limbah,
          kategori_pemanfaatan: 'pakan_ternak',
          estimasi_nilai_per_kg_min: 1000,
          estimasi_nilai_per_kg_max: 1500,
          catatan: 'Serat mentah ideal untuk pakan fermentasi (silase) ternak sapi/kerbau saat musim kering.'
        },
        {
          jenis_limbah: listing.jenis_limbah,
          kategori_pemanfaatan: 'biomassa_briket',
          estimasi_nilai_per_kg_min: 700,
          estimasi_nilai_per_kg_max: 1100,
          catatan: 'Daya kalor tinggi ~4.200 kcal/kg cocok untuk bahan bakar biomassa & pengeringan gabah.'
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
          jumlah_dibutuhkan_per_minggu: 1500,
          harga_ditawarkan_per_kg: 2000,
          tingkat_urgensi: 'tinggi',
          buyer: {
            id: 'buy-1',
            nama: 'PT Suburtani Agro Media',
            jenis_usaha: 'Produsen Media Tanam Arang Sekam & Biofertilizer',
            alamat: 'Kawasan Agribisnis Karawang (8 km dari lokasi Gapoktan)'
          }
        },
        {
          id: 'buy-dem-2',
          buyer_id: 'buy-2',
          jenis_limbah_dicari: listing.jenis_limbah,
          jumlah_dibutuhkan_per_minggu: 800,
          harga_ditawarkan_per_kg: 1600,
          tingkat_urgensi: 'sedang',
          buyer: {
            id: 'buy-2',
            nama: 'Pembudidaya Jamur Merang Makmur',
            jenis_usaha: 'Kelompok Pembudidaya Jamur',
            alamat: 'Kec. Majalaya, Karawang (4.5 km dari lokasi Gapoktan)'
          }
        },
        {
          id: 'buy-dem-3',
          buyer_id: 'buy-3',
          jenis_limbah_dicari: listing.jenis_limbah,
          jumlah_dibutuhkan_per_minggu: 3000,
          harga_ditawarkan_per_kg: 900,
          tingkat_urgensi: 'rendah',
          buyer: {
            id: 'buy-3',
            nama: 'Biomassa Nusantara Briket',
            jenis_usaha: 'Pabrik Briket & Energi Biomassa',
            alamat: 'Kawasan Industri Subang (22 km)'
          }
        }
      ];
    }

    const prompt = `Anda adalah AI Reasoning Engine untuk TemuTani (B2B Agricultural Waste Marketplace).
Tugas Anda adalah melakukan optimasi 2-Lapis untuk menentukan rekomendasi buyer sektor pertanian terbaik bagi Waste Listing dari Gapoktan/Kelompok Tani berikut:

[INPUT LISTING GAPOKTAN]
- Jenis Limbah Pertanian: ${listing.jenis_limbah}
- Jumlah: ${listing.jumlah_kg} kg
- Lokasi Pickup Gapoktan: ${listing.lokasi_pickup}

[LAPIS 1 - KNOWLEDGE BASE LITERATUR PERTANIAN]
${JSON.stringify(kbRows, null, 2)}

[LAPIS 2 - DEMAND BUYER AKTIF PLATFORM SEKTOR PERTANIAN]
${JSON.stringify(buyerDemands, null, 2)}

Hasilkan respons JSON persis dengan format array "recommendations":
{
  "recommendations": [
    {
      "id": "string",
      "ranking": 1,
      "buyer_id": "string",
      "kategori_pemanfaatan": "string",
      "skor": 94,
      "alasan_teks": "🥇 Penjelasan rasional pemanfaatan limbah bernilai ekonomi tertinggi dalam bahasa Indonesia...",
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
    console.error('Error in TemuTani AI Match API:', error);

    const fallbackRecs: MatchRecommendation[] = [
      {
        id: 'rec-fallback-1',
        listing_id: listing?.id || 'lst-demo',
        buyer_id: 'buy-1',
        ranking: 1,
        kategori_pemanfaatan: 'Media Tanam Arang Sekam & Biofertilizer',
        skor: 94,
        alasan_teks: `🥇 Media tanam / arang sekam adalah pemanfaatan bernilai ekonomi tertinggi untuk ${listing?.jenis_limbah || 'Sekam Padi'}. Buyer "PT Suburtani Agro Media" memiliki demand aktif 1,5 ton/minggu dengan harga Rp 2.000/kg (jarak 8 km dari Gapoktan).`,
        generated_at: new Date().toISOString(),
        buyer: {
          id: 'buy-1',
          nama: 'PT Suburtani Agro Media',
          email: 'suburtani@agromedia.id',
          role: 'buyer',
          jenis_usaha: 'Produsen Media Tanam & Biofertilizer',
          alamat: 'Kawasan Agribisnis Karawang'
        }
      },
      {
        id: 'rec-fallback-2',
        listing_id: listing?.id || 'lst-demo',
        buyer_id: 'buy-2',
        ranking: 2,
        kategori_pemanfaatan: 'Media Tanam Jamur Merang',
        skor: 82,
        alasan_teks: `🥈 Pembudidaya Jamur Merang Makmur berlokasi dekat (4.5 km), memiliki demand 800 kg/minggu dengan harga Rp 1.600/kg.`,
        generated_at: new Date().toISOString(),
        buyer: {
          id: 'buy-2',
          nama: 'Pembudidaya Jamur Merang Makmur',
          email: 'jamur@makmur.id',
          role: 'buyer',
          jenis_usaha: 'Petani Jamur Merang',
          alamat: 'Kec. Majalaya, Karawang'
        }
      }
    ];

    return NextResponse.json({ recommendations: fallbackRecs });
  }
}
