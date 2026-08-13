'use client';

import { useState, useEffect, useRef } from 'react';
import B2BDocumentationModal from '@/components/B2BDocumentationModal';
import { X, Send, Sparkles, DollarSign, Scale, Calendar, CheckCircle2, AlertCircle, RefreshCw, MessageSquare, ArrowRight, ShieldCheck, User, Building2, FileText } from 'lucide-react';
import { WasteTransaction, ChatMessage, CATEGORY_LABELS, WasteCategory, UserProfile } from '@/lib/types';

interface ChatNegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: WasteTransaction;
  currentUser: UserProfile;
  onUpdateTransaction: (updatedTx: WasteTransaction) => void;
}

export default function ChatNegotiationModal({
  isOpen,
  onClose,
  transaction,
  currentUser,
  onUpdateTransaction,
}: ChatNegotiationModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Counter-offer form states
  const [counterPrice, setCounterPrice] = useState<number>(transaction.harga_penawaran_per_kg || 2000);
  const [counterKg, setCounterKg] = useState<number>(transaction.jumlah_kg_diminta || 500);
  const [counterSchedule, setCounterSchedule] = useState<string>(transaction.jadwal_pickup || 'Setiap Hari Kerja (09.00 - 17.00 WIB)');
  const [counterNote, setCounterNote] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const isGenerator = currentUser.role === 'generator';
  const counterpartyName = isGenerator 
    ? (transaction.buyer?.nama || 'PT Suburtani Agro Media') 
    : (transaction.generator?.nama || 'Gapoktan Sukamaju Karawang');

  const counterpartyBusiness = isGenerator 
    ? (transaction.buyer?.jenis_usaha || 'Produsen Media Tanam & Biofertilizer') 
    : (transaction.generator?.jenis_usaha || 'Gabungan Kelompok Tani Padi');

  const wasteCategoryLabel = transaction.listing?.jenis_limbah 
    ? CATEGORY_LABELS[transaction.listing.jenis_limbah as WasteCategory] 
    : 'Limbah Organik';

  useEffect(() => {
    if (!transaction) return;

    // Load initial messages or seed if empty
    if (transaction.messages && transaction.messages.length > 0) {
      setMessages(transaction.messages);
    } else {
      const initialSeedMessages: ChatMessage[] = [
        {
          id: `msg-sys-1`,
          sender_id: 'system',
          sender_name: 'Sistem TemuTani',
          sender_role: 'system',
          text: `Thread negosiasi resmi dibuka untuk listing ${wasteCategoryLabel}.`,
          timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: `msg-offer-1`,
          sender_id: transaction.buyer_id,
          sender_name: transaction.buyer?.nama || 'Buyer Demond',
          sender_role: 'buyer',
          text: transaction.catatan_penawaran || 'Halo, kami mengajukan penawaran untuk mengambil pasokan limbah organik ini.',
          timestamp: new Date(Date.now() - 3000000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          offer_proposal: {
            harga_per_kg: transaction.harga_penawaran_per_kg || 2000,
            jumlah_kg: transaction.jumlah_kg_diminta || 500,
            jadwal_pickup: transaction.jadwal_pickup || 'Besok Jam 10.00 WIB',
            status: 'pending'
          }
        }
      ];
      setMessages(initialSeedMessages);
    }

    setCounterPrice(transaction.harga_penawaran_per_kg || 2000);
    setCounterKg(transaction.jumlah_kg_diminta || 500);
    setCounterSchedule(transaction.jadwal_pickup || 'Setiap Hari Kerja');
  }, [transaction]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showCounterForm]);

  if (!isOpen || !transaction) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender_id: currentUser.id,
      sender_name: currentUser.nama,
      sender_role: currentUser.role,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputText('');

    const updatedTx: WasteTransaction = {
      ...transaction,
      messages: updatedMessages,
      status: transaction.status === 'penawaran_diajukan' ? 'negosiasi_berjalan' : transaction.status
    };

    onUpdateTransaction(updatedTx);
  };

  const handleSendCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();

    const proposalMsgText = counterNote.trim() 
      ? `Kontra-Penawaran: ${counterNote}` 
      : `Mengajukan kontra-penawaran baru: Rp ${counterPrice.toLocaleString('id-ID')}/kg untuk ${counterKg}kg.`;

    const newMsg: ChatMessage = {
      id: `msg-counter-${Date.now()}`,
      sender_id: currentUser.id,
      sender_name: currentUser.nama,
      sender_role: currentUser.role,
      text: proposalMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      offer_proposal: {
        harga_per_kg: Number(counterPrice),
        jumlah_kg: Number(counterKg),
        jadwal_pickup: counterSchedule,
        status: 'pending'
      }
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setShowCounterForm(false);
    setCounterNote('');

    const updatedTx: WasteTransaction = {
      ...transaction,
      harga_penawaran_per_kg: Number(counterPrice),
      jumlah_kg_diminta: Number(counterKg),
      jadwal_pickup: counterSchedule,
      status: 'kontra_penawaran',
      messages: updatedMessages
    };

    onUpdateTransaction(updatedTx);
  };

  const handleAcceptDeal = () => {
    const sysMsg: ChatMessage = {
      id: `msg-sys-accept-${Date.now()}`,
      sender_id: 'system',
      sender_name: 'Sistem TemuTani',
      sender_role: 'system',
      text: `🎉 Kesepakatan transaksi berhasil disetujui oleh ${currentUser.nama}! Nilai Total: Rp ${((transaction.harga_penawaran_per_kg || 2000) * (transaction.jumlah_kg_diminta || 500)).toLocaleString('id-ID')}. Status diperbarui ke DISEPAKATI.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = messages.map(m => {
      if (m.offer_proposal && m.offer_proposal.status === 'pending') {
        return {
          ...m,
          offer_proposal: { ...m.offer_proposal, status: 'accepted' as const }
        };
      }
      return m;
    });

    const finalMessages = [...updatedMessages, sysMsg];
    setMessages(finalMessages);

    const updatedTx: WasteTransaction = {
      ...transaction,
      status: 'disepakati',
      konfirmasi_generator: true,
      konfirmasi_buyer: true,
      messages: finalMessages
    };

    onUpdateTransaction(updatedTx);
  };

  const handleRequestAiAdvice = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction,
          currentPrice: transaction.harga_penawaran_per_kg || 2000,
          currentKg: transaction.jumlah_kg_diminta || 500,
          wasteType: wasteCategoryLabel,
          role: currentUser.role
        })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender_id: 'ai-advisor',
        sender_name: 'TemuTani Negotiator AI',
        sender_role: 'ai',
        text: `🤖 **Analisis Nilai Wajar AI (Skor Keadilan: ${data.fairnessScore}%)**:\n\n${data.adviceText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedMessages = [...messages, aiMsg];
      setMessages(updatedMessages);

      onUpdateTransaction({
        ...transaction,
        messages: updatedMessages
      });
    } catch (e) {
      console.error('Error fetching AI chat advice:', e);
    } finally {
      setAiLoading(false);
    }
  };

  const latestPrice = transaction.harga_penawaran_per_kg || 2000;
  const latestKg = transaction.jumlah_kg_diminta || 500;
  const totalDealAmount = latestPrice * latestKg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold text-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base md:text-lg">{counterpartyName}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                  transaction.status === 'disepakati' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  transaction.status === 'kontra_penawaran' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                }`}>
                  {transaction.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-2">
                <span>{counterpartyBusiness}</span>
                <span>•</span>
                <span className="text-teal-400 font-semibold">{wasteCategoryLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDocsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold hover:bg-blue-500/30 transition-all"
            >
              <FileText className="w-3.5 h-3.5" /> Dokumen B2B & SPK
            </button>
            <button
              onClick={handleRequestAiAdvice}
              disabled={aiLoading}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
              {aiLoading ? 'Menganalisis...' : 'Saran AI'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Active Deal Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 block">Harga/Kg</span>
              <span className="font-extrabold text-slate-900 text-sm md:text-base">
                Rp {latestPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 block">Volume</span>
              <span className="font-extrabold text-slate-900 text-sm md:text-base">{latestKg} kg</span>
            </div>
            <div className="border-l border-slate-200 pl-6 hidden sm:block">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 block">Nilai Total</span>
              <span className="font-extrabold text-emerald-600 text-sm md:text-base">
                Rp {totalDealAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {transaction.status !== 'disepakati' && transaction.status !== 'selesai' && (
              <>
                <button
                  onClick={() => setShowCounterForm(!showCounterForm)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-extrabold transition-all"
                >
                  {showCounterForm ? 'Batal Nego' : 'Nego / Kontra-Penawaran'}
                </button>
                <button
                  onClick={handleAcceptDeal}
                  className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Setujui Kesepakatan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Counter-Offer Form Drawer */}
        {showCounterForm && (
          <form onSubmit={handleSendCounterOffer} className="bg-emerald-50/80 border-b border-emerald-200 p-4 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-700" /> Ajukan Kontra-Penawaran Baru
              </h4>
              <span className="text-[11px] text-emerald-700 font-medium">Ubah parameter nego sesuai kebutuhan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Harga Ditawarkan (Rp/kg)</label>
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Volume (kg)</label>
                <input
                  type="number"
                  value={counterKg}
                  onChange={(e) => setCounterKg(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Jadwal Pickup</label>
                <input
                  type="text"
                  value={counterSchedule}
                  onChange={(e) => setCounterSchedule(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Tambahkan catatan pendukung nego (opsional)..."
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCounterForm(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
              >
                Kirim Kontra-Penawaran
              </button>
            </div>
          </form>
        )}

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8fafc]">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            const isSystem = msg.sender_role === 'system';
            const isAi = msg.sender_role === 'ai';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="px-4 py-1.5 rounded-full bg-slate-200/80 border border-slate-300 text-[11px] font-bold text-slate-600 text-center max-w-md">
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (isAi) {
              return (
                <div key={msg.id} className="flex justify-start my-2">
                  <div className="max-w-md bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-500/40 shadow-lg space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>{msg.sender_name}</span>
                    </div>
                    <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-extrabold text-slate-600">{msg.sender_name}</span>
                  <span className="text-[9px] text-slate-400 font-mono">• {msg.timestamp}</span>
                </div>

                <div className={`max-w-md p-4 rounded-2xl space-y-2 shadow-sm ${
                  isMe 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                }`}>
                  <p className="text-xs leading-relaxed font-medium">{msg.text}</p>

                  {/* Proposal Card Embedded in Chat */}
                  {msg.offer_proposal && (
                    <div className={`p-3 rounded-xl text-xs font-medium space-y-2 border ${
                      isMe 
                        ? 'bg-teal-700/60 border-teal-500/40 text-white' 
                        : 'bg-emerald-50 border-emerald-200 text-slate-900'
                    }`}>
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-bold">
                        <span className="text-[10px] uppercase tracking-wider opacity-90">Rincian Penawaran</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          msg.offer_proposal.status === 'accepted' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {msg.offer_proposal.status === 'accepted' ? 'Disetujui' : 'Menunggu Respons'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="block text-[10px] opacity-75">Harga</span>
                          <span className="font-extrabold">Rp {msg.offer_proposal.harga_per_kg.toLocaleString('id-ID')}/kg</span>
                        </div>
                        <div>
                          <span className="block text-[10px] opacity-75">Volume</span>
                          <span className="font-extrabold">{msg.offer_proposal.jumlah_kg} kg</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] opacity-75">Jadwal Pickup</span>
                          <span className="font-bold">{msg.offer_proposal.jadwal_pickup}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tulis pesan negosiasi Anda di sini..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none font-medium"
          />

          <button
            type="button"
            onClick={handleRequestAiAdvice}
            disabled={aiLoading}
            className="sm:hidden p-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
            title="Tanyakan AI Advice"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {showDocsModal && (
          <B2BDocumentationModal
            isOpen={showDocsModal}
            onClose={() => setShowDocsModal(false)}
            transaction={transaction}
            onUpdateTransaction={onUpdateTransaction}
          />
        )}

      </div>
    </div>
  );
}
