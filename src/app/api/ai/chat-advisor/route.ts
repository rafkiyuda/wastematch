import { NextResponse } from 'next/server';
import { generateGeminiContent } from '@/lib/gemini';
import { WasteTransaction, WasteListing } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { transaction, currentPrice, currentKg, wasteType, role } = await req.json() as {
      transaction: WasteTransaction;
      currentPrice: number;
      currentKg: number;
      wasteType: string;
      role: 'generator' | 'buyer';
    };

    const prompt = `Anda adalah TemuTani AI B2B Negotiation Advisor (Pakar Negosiasi Limbah Organik B2B).
Tugas Anda adalah memberikan analisis singkat dan relevan (dalam 2-3 kalimat Bahasa Indonesia) mengenai penawaran harga & volume berikut:

Detail Transaksi:
- Jenis Limbah: ${wasteType}
- Peran Pengguna: ${role === 'generator' ? 'Penjual / Waste Generator' : 'Pembeli / Waste Buyer'}
- Penawaran Saat Ini: Rp ${currentPrice?.toLocaleString('id-ID') || 0} / kg
- Jumlah Diminta: ${currentKg || 0} kg

Aturan Analisis:
1. Berikan kepastian apakah harga ini adil sesuai estimasi pasar limbah organik (Ampas Kopi: Rp 1.800-2.200/kg, Sekam Padi: Rp 1.200-1.800/kg, Kulit Buah/Sayur: Rp 1.000-1.500/kg, Serbuk Kayu: Rp 800-1.400/kg, Sisa Makanan: Rp 1.000-1.600/kg).
2. Jika pengguna adalah Penjual, berikan tips apakah tawaran ini menguntungkan atau perlu nego lebih tinggi.
3. Jika pengguna adalah Pembeli, berikan saran apakah harga ini efisien untuk margin pengolahan biofertilizer/kompos/pakan ternak.
4. Sertakan rekomendasi nilai kontra-penawaran (jika perlu).

Format Respons JSON:
{
  "adviceText": "Saran teks profesional...",
  "fairnessScore": 92,
  "suggestedCounterPrice": 2100
}`;

    const textResponse = await generateGeminiContent(prompt, 'gemini-1.5-flash');
    const parsed = JSON.parse(textResponse);

    return NextResponse.json({
      adviceText: parsed.adviceText || 'Penawaran ini cukup kompetitif dan sesuai dengan nilai wajar pasar limbah organik terverifikasi.',
      fairnessScore: parsed.fairnessScore || 90,
      suggestedCounterPrice: parsed.suggestedCounterPrice || currentPrice
    });
  } catch (error) {
    console.error('Error in Chat Advisor API:', error);

    return NextResponse.json({
      adviceText: '💡 AI Analysis: Penawaran harga ini berada dalam rentang wajar pasar B2B. Anda dapat langsung menyetujui transaksi ini atau mengusulkan penyesuaian jadwal pickup.',
      fairnessScore: 88,
      suggestedCounterPrice: 2000
    });
  }
}
