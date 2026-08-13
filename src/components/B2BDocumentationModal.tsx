'use client';

import { useState } from 'react';
import { X, FileText, Truck, Scale, ShieldCheck, CheckCircle2, DollarSign, Printer } from 'lucide-react';
import { WasteTransaction, CATEGORY_LABELS, WasteCategory } from '@/lib/types';

interface B2BDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: WasteTransaction;
  onUpdateTransaction: (updatedTx: WasteTransaction) => void;
}

export default function B2BDocumentationModal({
  isOpen,
  onClose,
  transaction,
  onUpdateTransaction,
}: B2BDocumentationModalProps) {
  const [activeTab, setActiveTab] = useState<'spk' | 'po' | 'surat_jalan' | 'bast_timbangan' | 'invoice'>('spk');

  // Form states for editable document fields
  const [maxKadarAir, setMaxKadarAir] = useState<number>(transaction.b2b_docs?.spesifikasi_kadar_air_max_persen || 15);
  const [platNomor, setPlatNomor] = useState<string>(transaction.b2b_docs?.plat_nomor_armada || 'B 9842 KRA');
  const [namaDriver, setNamaDriver] = useState<string>(transaction.b2b_docs?.nama_driver || 'Pak Supriadi');
  const [noHpDriver, setNoHpDriver] = useState<string>(transaction.b2b_docs?.no_hp_driver || '0813-8899-7766');

  // Timbangan states
  const [beratBruto, setBeratBruto] = useState<number>(transaction.b2b_docs?.berat_bruto_kg || 6500);
  const [beratTara, setBeratTara] = useState<number>(transaction.b2b_docs?.berat_tara_kg || 4500);
  const [kadarAirActual, setKadarAirActual] = useState<number>(14);

  if (!isOpen || !transaction) return null;

  const wasteLabel = transaction.listing?.jenis_limbah 
    ? CATEGORY_LABELS[transaction.listing.jenis_limbah as WasteCategory] 
    : 'Sekam Padi (Rice Husk)';

  const buyerName = transaction.buyer?.nama || 'PT Suburtani Agro Media';
  const gapoktanName = transaction.generator?.nama_gapoktan || transaction.generator?.nama || 'Gapoktan Sukamaju Karawang';

  const hargaPerKg = transaction.harga_penawaran_per_kg || 2000;
  const beratNetto = beratBruto - beratTara;
  
  // Deduction if moisture > maxKadarAir
  const excessMoisturePercent = Math.max(0, kadarAirActual - maxKadarAir);
  const potonganKg = Math.round((beratNetto * excessMoisturePercent) / 100);
  const beratNettoFinal = Math.max(0, beratNetto - potonganKg);
  const totalBayar = beratNettoFinal * hargaPerKg;

  const poNumber = transaction.b2b_docs?.no_po || `PO/TT-${transaction.id.replace('tx-', '').substring(0, 8).toUpperCase()}`;
  const spkNumber = transaction.b2b_docs?.no_spk || `SPK/AGRI/${new Date().getFullYear()}/${transaction.id.replace('tx-', '').substring(0, 6).toUpperCase()}`;
  const sjNumber = transaction.b2b_docs?.no_surat_jalan || `SJ/TT/${transaction.id.replace('tx-', '').substring(0, 6).toUpperCase()}`;
  const bastNumber = transaction.b2b_docs?.no_bast || `BAST/TT/${transaction.id.replace('tx-', '').substring(0, 6).toUpperCase()}`;
  const invoiceNumber = transaction.b2b_docs?.no_invoice || `INV/TT/${transaction.id.replace('tx-', '').substring(0, 6).toUpperCase()}`;

  const handleSaveDocs = () => {
    const updatedTx: WasteTransaction = {
      ...transaction,
      b2b_docs: {
        no_po: poNumber,
        no_spk: spkNumber,
        no_surat_jalan: sjNumber,
        no_bast: bastNumber,
        no_invoice: invoiceNumber,
        spesifikasi_kadar_air_max_persen: maxKadarAir,
        plat_nomor_armada: platNomor,
        nama_driver: namaDriver,
        no_hp_driver: noHpDriver,
        berat_bruto_kg: beratBruto,
        berat_tara_kg: beratTara,
        berat_netto_kg: beratNettoFinal,
        potongan_kadar_air_kg: potonganKg,
        total_bayar_final: totalBayar,
        status_pembayaran: transaction.b2b_docs?.status_pembayaran || 'belum_dibayar'
      }
    };
    onUpdateTransaction(updatedTx);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base md:text-lg">Dokumen & Perjanjian B2B TemuTani</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LEGAL & PROCUREMENT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">No. Ref: {spkNumber} • {gapoktanName} ↔ {buyerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Dokumen
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 grid grid-cols-5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('spk')}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'spk' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 1. SPK B2B
          </button>
          <button
            onClick={() => setActiveTab('po')}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'po' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" /> 2. Purchase Order
          </button>
          <button
            onClick={() => setActiveTab('surat_jalan')}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'surat_jalan' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-600" /> 3. Surat Jalan
          </button>
          <button
            onClick={() => setActiveTab('bast_timbangan')}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bast_timbangan' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Scale className="w-4 h-4 text-teal-600" /> 4. BAST & Timbangan
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'invoice' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-4 h-4 text-purple-600" /> 5. Invoice
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50 text-slate-900">
          
          {/* TAB 1: SPK B2B (Surat Perjanjian Kerjasama) */}
          {activeTab === 'spk' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 max-w-3xl mx-auto">
              <div className="text-center border-b border-slate-200 pb-4 space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wide">Surat Perjanjian Kerjasama (SPK) B2B</h2>
                <p className="text-xs text-slate-500 font-mono">No. Dokumen: {spkNumber}</p>
                <p className="text-xs text-emerald-700 font-bold">Pengadaan Bahan Baku Limbah Pertanian Terverifikasi</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">PIHAK PERTAMA (PENJUAL PASOKAN)</span>
                  <p className="font-bold text-slate-900 text-sm">{gapoktanName}</p>
                  <p className="text-slate-600">{transaction.generator?.alamat || 'Karawang, Jawa Barat'}</p>
                  <p className="text-slate-600">Kontak: {transaction.generator?.no_hp || '0812-9988-7766'}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">PIHAK KEDUA (PEMBELI AGRIBISNIS)</span>
                  <p className="font-bold text-slate-900 text-sm">{buyerName}</p>
                  <p className="text-slate-600">{transaction.buyer?.alamat || 'Kawasan Industri Agribisnis'}</p>
                  <p className="text-slate-600">Kontak: {transaction.buyer?.no_hp || '0811-2233-4455'}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">Pasal 1: Objek Transaksi & Mutu Standar</h4>
                <p>
                  Pihak Pertama sepakat menyediakan dan Pihak Kedua sepakat membeli material komoditas <strong>{wasteLabel}</strong> dengan kuota disepakati sebesar <strong>{(transaction.jumlah_kg_diminta || 2000).toLocaleString('id-ID')} kg</strong> pada harga dasar <strong>Rp {hargaPerKg.toLocaleString('id-ID')}/kg</strong>.
                </p>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Batas Maksimum Kadar Air Disepakati:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={maxKadarAir}
                      onChange={(e) => setMaxKadarAir(Number(e.target.value))}
                      className="w-16 bg-white border border-emerald-300 rounded-lg px-2 py-1 text-center font-bold text-slate-900"
                    />
                    <span className="font-bold text-emerald-900">%</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">Pasal 2: Model Logistik & Pengangkutan</h4>
                <p>
                  Pengangkutan dilakukan dengan model <strong>Self-Pickup</strong> di mana Pihak Kedua bertanggung jawab penuh mengerahkan armada transportasi yang sesuai (truk engkel/fuso) ke lokasi penggilingan Pihak Pertama pada jadwal disepakati: <strong>{transaction.jadwal_pickup || 'Setiap Musim Panen (08.00 - 17.00 WIB)'}</strong>.
                </p>

                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">Pasal 3: Ketentuan Penimbangan & Pembayaran</h4>
                <p>
                  Penimbangan dilakukan menggunakan Timbangan Jembatan / Digital di lokasi penggilingan Pihak Pertama dengan rumus: <code>Netto = Bruto - Tara</code>. Pembayaran dilakukan via transfer bank resmi sesuai hasil slip timbangan yang disahkan kedua belah pihak.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="space-y-12">
                  <p className="font-bold text-slate-700">Pihak Pertama (Gapoktan)</p>
                  <div className="border-b border-slate-300 w-3/4 mx-auto pb-1 font-bold text-slate-900">
                    {transaction.generator?.nama || 'Pengurus Gapoktan Sukamaju'}
                  </div>
                </div>
                <div className="space-y-12">
                  <p className="font-bold text-slate-700">Pihak Kedua (Buyer)</p>
                  <div className="border-b border-slate-300 w-3/4 mx-auto pb-1 font-bold text-slate-900">
                    {transaction.buyer?.nama || 'Procurement Officer'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Purchase Order (PO) */}
          {activeTab === 'po' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">PURCHASE ORDER (PO)</h2>
                  <p className="text-xs text-slate-500 font-mono">No. PO: {poNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Tanggal Terbit:</span>
                  <p className="text-xs font-extrabold text-slate-900">{new Date(transaction.created_at || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">VENDOR / GAPOKTAN:</span>
                  <p className="font-extrabold text-slate-900 text-sm">{gapoktanName}</p>
                  <p className="text-slate-600">{transaction.listing?.lokasi_pickup || 'Karawang, Jawa Barat'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">TAGIHAN KEPADA (BUYER):</span>
                  <p className="font-extrabold text-slate-900 text-sm">{buyerName}</p>
                  <p className="text-slate-600">NPWP / Reg: 01.984.772.1-402.000</p>
                </div>
              </div>

              {/* Table item PO */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-extrabold">Item Komoditas Limbah</th>
                    <th className="p-3 font-extrabold text-right">Volume (Kg)</th>
                    <th className="p-3 font-extrabold text-right">Harga / Kg</th>
                    <th className="p-3 font-extrabold text-right">Total Nilai Est.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">
                      {wasteLabel}
                      <p className="text-[10px] text-slate-500 font-normal">Spesifikasi: Non-B3 Organic Waste (Kadar Air Max {maxKadarAir}%)</p>
                    </td>
                    <td className="p-3 text-right font-semibold">{(transaction.jumlah_kg_diminta || 2000).toLocaleString('id-ID')} kg</td>
                    <td className="p-3 text-right font-semibold">Rp {hargaPerKg.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">
                      Rp {((transaction.jumlah_kg_diminta || 2000) * hargaPerKg).toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold">Model Pengangkutan:</span>
                  <p className="text-xs font-bold text-emerald-400">Self-Pickup Armada Pembeli (Karawang Mill)</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-semibold">Total Nilai PO:</span>
                  <p className="text-xl font-extrabold text-emerald-400">
                    Rp {((transaction.jumlah_kg_diminta || 2000) * hargaPerKg).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Surat Jalan (Delivery Permit) */}
          {activeTab === 'surat_jalan' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">SURAT JALAN & IZIN MASUK ARMADA</h2>
                  <p className="text-xs text-slate-500 font-mono">No. Surat Jalan: {sjNumber}</p>
                </div>
                <div className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-xs border border-amber-200 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> SELF-PICKUP VERIFIED
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-amber-900 text-[10px] uppercase">PLAT NOMOR TRUK</span>
                  <input
                    type="text"
                    value={platNomor}
                    onChange={(e) => setPlatNomor(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 font-extrabold text-slate-900 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-amber-900 text-[10px] uppercase">NAMA PENGEMUDI / DRIVER</span>
                  <input
                    type="text"
                    value={namaDriver}
                    onChange={(e) => setNamaDriver(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 font-extrabold text-slate-900 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-amber-900 text-[10px] uppercase">NO. HP DRIVER</span>
                  <input
                    type="text"
                    value={noHpDriver}
                    onChange={(e) => setNoHpDriver(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 font-extrabold text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold text-slate-500 uppercase text-[10px]">ALAMAT LOKASI TITIK JEMPUT (GAPOKTAN):</span>
                <p className="font-bold text-slate-900 text-sm">{gapoktanName}</p>
                <p className="text-slate-700">{transaction.listing?.lokasi_pickup || 'Penggilingan Padi Gapoktan Sukamaju, Jl. Raya Karawang No. 45'}</p>
                <p className="text-emerald-700 font-semibold">Jadwal Tiba Armada: {transaction.jadwal_pickup || 'Setiap Musim Panen (08.00 - 17.00 WIB)'}</p>
              </div>

              <div className="p-4 rounded-2xl border border-dashed border-slate-300 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-900">Verifikasi Barcode Akses Timbangan</span>
                  <p className="text-slate-500">Tunjukkan Surat Jalan Digital ini kepada Petugas Timbangan Gapoktan saat memasuki gerbang penggilingan.</p>
                </div>
                <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono font-bold text-[10px] tracking-tighter">
                  QR-VERIFIED
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BAST & Timbangan */}
          {activeTab === 'bast_timbangan' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">BERITA ACARA SERAH TERIMA & SLIP TIMBANGAN</h2>
                  <p className="text-xs text-slate-500 font-mono">No. BAST: {bastNumber}</p>
                </div>
                <div className="bg-teal-100 text-teal-900 font-extrabold px-3 py-1 rounded-full text-xs border border-teal-200">
                  SLIP TIMBANGAN NETTO VERIFIED
                </div>
              </div>

              <div className="bg-teal-50/70 p-5 rounded-2xl border border-teal-200 space-y-4">
                <h4 className="font-extrabold text-teal-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-teal-600" /> Input Hasil Timbangan Jembatan (Digital Scale)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">1. Berat Bruto Truk + Limbah (kg)</label>
                    <input
                      type="number"
                      value={beratBruto}
                      onChange={(e) => setBeratBruto(Number(e.target.value))}
                      className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 font-extrabold text-slate-900 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">2. Berat Tara Truk Kosong (kg)</label>
                    <input
                      type="number"
                      value={beratTara}
                      onChange={(e) => setBeratTara(Number(e.target.value))}
                      className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 font-extrabold text-slate-900 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">3. Kadar Air Uji Sampel (%)</label>
                    <input
                      type="number"
                      value={kadarAirActual}
                      onChange={(e) => setKadarAirActual(Number(e.target.value))}
                      className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 font-extrabold text-slate-900 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-teal-200">
                    <span className="text-slate-500 font-semibold">Berat Netto Kotor:</span>
                    <p className="text-base font-extrabold text-slate-900">{beratNetto.toLocaleString('id-ID')} kg</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200">
                    <span className="text-amber-700 font-semibold">Potongan Kadar Air ({excessMoisturePercent}%):</span>
                    <p className="text-base font-extrabold text-amber-600">-{potonganKg.toLocaleString('id-ID')} kg</p>
                  </div>
                  <div className="p-3 bg-slate-900 text-white rounded-xl">
                    <span className="text-slate-300 font-semibold">Netto Bersih Diterima:</span>
                    <p className="text-base font-extrabold text-emerald-400">{beratNettoFinal.toLocaleString('id-ID')} kg</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs leading-relaxed space-y-1">
                <span className="font-bold text-slate-900">Pernyataan Berita Acara Serah Terima (BAST):</span>
                <p className="text-slate-600">
                  Dengan ini Pengurus {gapoktanName} dan Pengemudi Driver {buyerName} mengonfirmasi bahwa penimbangan material {wasteLabel} telah dilaksanakan sesuai angka di atas dalam kondisi baik.
                </p>
              </div>

              <button
                onClick={handleSaveDocs}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Sahkan BAST & Hasil Timbangan Netto
              </button>
            </div>
          )}

          {/* TAB 5: Invoice & Tagihan */}
          {activeTab === 'invoice' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">FAKTUR INVOICE TAGIHAN B2B</h2>
                  <p className="text-xs text-slate-500 font-mono">No. Invoice: {invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                    transaction.b2b_docs?.status_pembayaran === 'terbayar'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-900 border-amber-200'
                  }`}>
                    {transaction.b2b_docs?.status_pembayaran === 'terbayar' ? 'LUNAS TERBAYAR' : 'MENUNGGU PEMBAYARAN'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">REKENING PENERIMA (GAPOKTAN):</span>
                  <p className="font-extrabold text-slate-900 text-sm">Bank BRI - Gapoktan Sukamaju Karawang</p>
                  <p className="text-slate-600 font-mono">No. Rek: 0149-01-008492-50-3</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">TAGIHAN DIBAYAR OLEH:</span>
                  <p className="font-extrabold text-slate-900 text-sm">{buyerName}</p>
                  <p className="text-slate-600">Jatuh Tempo: 7 Hari Kerja (TOP 7)</p>
                </div>
              </div>

              {/* Rincian Tagihan */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-3 font-extrabold">Uraian Tagihan Netto</th>
                      <th className="p-3 font-extrabold text-right">Netto (Kg)</th>
                      <th className="p-3 font-extrabold text-right">Harga / Kg</th>
                      <th className="p-3 font-extrabold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">
                        Pasokan {wasteLabel}
                        <p className="text-[10px] text-slate-500 font-normal">Ref BAST: {bastNumber} (Potongan Kadar Air: {potonganKg} kg)</p>
                      </td>
                      <td className="p-3 text-right font-semibold">{beratNettoFinal.toLocaleString('id-ID')} kg</td>
                      <td className="p-3 text-right font-semibold">Rp {hargaPerKg.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right font-extrabold text-slate-900">
                        Rp {totalBayar.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold">Total Tagihan Final BAST:</span>
                  <p className="text-2xl font-extrabold text-emerald-400">Rp {totalBayar.toLocaleString('id-ID')}</p>
                </div>

                <button
                  onClick={() => {
                    const updatedTx: WasteTransaction = {
                      ...transaction,
                      b2b_docs: {
                        ...transaction.b2b_docs,
                        total_bayar_final: totalBayar,
                        status_pembayaran: 'terbayar'
                      }
                    };
                    onUpdateTransaction(updatedTx);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md"
                >
                  Konfirmasi Pembayaran Lunas
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
