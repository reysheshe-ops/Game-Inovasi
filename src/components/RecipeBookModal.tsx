import React, { useState } from 'react';
import { FractionDisplay } from './FractionDisplay';
import { BookOpen, X, ChevronRight, PieChart, Layers, ArrowUpDown, Scale } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface RecipeBookModalProps {
  onClose: () => void;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'ordering' | 'equivalent' | 'comparison'>('basics');
  const [interactiveSlice, setInteractiveSlice] = useState<number>(4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 select-none animate-fadeIn">
      <div className="w-full max-w-4xl bg-amber-50 rounded-3xl shadow-2xl border-4 border-amber-400 max-h-[94%] flex flex-col overflow-hidden">
        {/* Book Header */}
        <div className="bg-[#FFD166] px-4 py-2 border-b-2 border-amber-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-950" />
            <div>
              <h2 className="text-sm sm:text-base font-black text-amber-950 leading-tight">
                Buku Resep &amp; Ensiklopedia Pecahan
              </h2>
              <p className="text-[10px] text-amber-800 font-semibold">
                Panduan Belajar 4 Tujuan Pembelajaran Fase B (Kelas 3 &amp; 4 SD)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-amber-100/70 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto border-b border-amber-200 shrink-0">
          {[
            { id: 'basics', label: '1. Mengenal Pecahan', icon: PieChart },
            { id: 'ordering', label: '2. Mengurutkan Pecahan', icon: ArrowUpDown },
            { id: 'equivalent', label: '3. Pecahan Senilai', icon: Layers },
            { id: 'comparison', label: '4. Membandingkan', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3">
          {/* TAB 1: MENGENAL PECAHAN (UNISTRUCTURAL) */}
          {activeTab === 'basics' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-amber-200 shadow-xs">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950 mb-1 flex items-center gap-1.5">
                  <span className="text-lg">🍕</span>
                  Mengenali Pecahan Berpembilang Satu &amp; Penyebut Sama
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Pecahan dinyatakan dalam bentuk <strong>Pembilang (atas)</strong> per <strong>Penyebut (bawah)</strong>.
                </p>

                {/* Visual Concept Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3">
                  <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-center">
                    <span className="text-2xl block mb-1">🍕</span>
                    <span className="text-xs font-black text-amber-950 block">1/2 Bagian</span>
                    <span className="text-[10px] text-amber-800">1 potong dari 2 bagian sama besar</span>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-center">
                    <span className="text-2xl block mb-1">🍕</span>
                    <span className="text-xs font-black text-amber-950 block">1/4 Bagian</span>
                    <span className="text-[10px] text-amber-800">1 potong dari 4 bagian sama besar</span>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-center">
                    <span className="text-2xl block mb-1">🍕</span>
                    <span className="text-xs font-black text-amber-950 block">1/8 Bagian</span>
                    <span className="text-[10px] text-amber-800">1 potong dari 8 bagian sama besar</span>
                  </div>
                </div>

                {/* Interactive Simulator */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="font-black text-xs sm:text-sm">Simulator Pemotong Pizza:</h4>
                    <p className="text-[10px] sm:text-xs text-amber-100">Coba ubah jumlah potongan loyang pizza!</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {([2, 4, 8] as const).map((cut) => (
                      <button
                        key={cut}
                        onClick={() => setInteractiveSlice(cut)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                          interactiveSlice === cut
                            ? 'bg-white text-amber-950 shadow-md font-black'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        Bagi {cut}
                      </button>
                    ))}
                  </div>
                  <div className="bg-white/90 text-amber-950 px-3 py-1 rounded-xl flex items-center gap-2">
                    <span className="text-xs font-bold">1 potong =</span>
                    <FractionDisplay numerator={1} denominator={interactiveSlice} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MENGURUTKAN PECAHAN (MULTISTRUCTURAL) */}
          {activeTab === 'ordering' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-amber-200 shadow-xs">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950 mb-1 flex items-center gap-1.5">
                  <span className="text-lg">🍫</span>
                  Mengurutkan Pecahan dari Terkecil ke Terbesar
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Untuk pecahan dengan <strong>pembilang sama (angka 1 di atas)</strong>, perhatikan aturan emas ini:
                  <br />
                  <strong className="text-amber-900">
                    &ldquo;Semakin BESAR angka penyebutnya (bawah), semakin KECIL ukuran potongannya!&rdquo;
                  </strong>
                </p>

                {/* Visual Order Stairs */}
                <div className="space-y-2 bg-amber-50/70 p-3 rounded-2xl border border-amber-200 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-amber-900 w-16">1/8 Cokelat:</span>
                    <div className="w-16 h-6 bg-[#9C6644] rounded text-white text-[10px] font-bold flex items-center justify-center">
                      1/8
                    </div>
                    <span className="text-[10px] text-slate-600">(Paling Kecil - 1 bagian dibagi 8 orang)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-amber-900 w-16">1/4 Cokelat:</span>
                    <div className="w-32 h-6 bg-[#7F4F24] rounded text-white text-[10px] font-bold flex items-center justify-center">
                      1/4
                    </div>
                    <span className="text-[10px] text-slate-600">(Ukuran Sedang - 1 bagian dibagi 4 orang)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-amber-900 w-16">1/2 Cokelat:</span>
                    <div className="w-56 h-6 bg-[#582F0E] rounded text-white text-[10px] font-bold flex items-center justify-center">
                      1/2
                    </div>
                    <span className="text-[10px] text-slate-600">(Paling Besar - 1 bagian dibagi 2 orang)</span>
                  </div>
                </div>

                <div className="bg-amber-100 p-2.5 rounded-xl text-center text-xs font-black text-amber-950 border border-amber-300">
                  Urutan Terkecil ke Terbesar: 1/8 &lt; 1/4 &lt; 1/2
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PECAHAN SENILAI (MULTISTRUCTURAL) */}
          {activeTab === 'equivalent' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-amber-200 shadow-xs">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950 mb-1 flex items-center gap-1.5">
                  <span className="text-lg">🍩</span>
                  Menemukan Pasangan Pecahan Senilai
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Pecahan senilai adalah pecahan yang bentuk angkanya berbeda, tetapi memiliki <strong>porsi nilai yang SAMA</strong>!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                  <div className="bg-pink-50 p-3 rounded-xl border border-pink-200">
                    <span className="text-xs font-black text-pink-950 block mb-1">
                      🍩 Kotak Donat A (Isi 6):
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• 2 donat = 2/6 = <strong>1/3 kotak</strong></li>
                      <li>• 3 donat = 3/6 = <strong>1/2 kotak</strong></li>
                      <li>• 4 donat = 4/6 = <strong>2/3 kotak</strong></li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span className="text-xs font-black text-amber-950 block mb-1">
                      🍩 Kotak Donat B (Isi 8):
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• 2 donat = 2/8 = <strong>1/4 kotak</strong></li>
                      <li>• 4 donat = 4/8 = <strong>1/2 kotak</strong></li>
                      <li>• 6 donat = 6/8 = <strong>3/4 kotak</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-emerald-100 p-2.5 rounded-xl text-center text-xs font-black text-emerald-950 border border-emerald-300">
                  🎯 Pembuktian Senilai: 1/2 Kotak Donat = 3/6 (Kotak 6) = 4/8 (Kotak 8)!
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEMBANDINGKAN PECAHAN (RELATIONAL) */}
          {activeTab === 'comparison' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-amber-200 shadow-xs">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950 mb-1 flex items-center gap-1.5">
                  <span className="text-lg">🍮</span>
                  Membandingkan Dua Pecahan (Lebih Besar &amp; Kecil)
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Ada dua kondisi utama saat membandingkan dua pecahan di restoran:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <span className="text-xs font-black text-purple-950 block mb-1">
                      Kondisi 1: Pembilang Sama (1/a vs 1/b)
                    </span>
                    <p className="text-[11px] text-purple-900 mb-1.5">
                      Penyebut lebih kecil menghasilkan porsi <strong>LEBIH BESAR</strong>.
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-purple-200 text-xs font-bold text-center">
                      1/3 &gt; 1/4 (Karena puding dibagi 3 lebih besar daripada dibagi 4)
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <span className="text-xs font-black text-purple-950 block mb-1">
                      Kondisi 2: Penyebut Sama (a/n vs b/n)
                    </span>
                    <p className="text-[11px] text-purple-900 mb-1.5">
                      Pembilang lebih besar menghasilkan porsi <strong>LEBIH BESAR</strong>.
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-purple-200 text-xs font-bold text-center">
                      4/5 &gt; 2/5 (Karena 4 potong lebih banyak daripada 2 potong)
                    </div>
                  </div>
                </div>

                <div className="bg-purple-100 p-2.5 rounded-xl text-center text-xs font-black text-purple-950 border border-purple-300">
                  🏆 Dengan menganalisis pembilang dan penyebut, kita selalu dapat menentukan potongan mana yang lebih besar atau kecil!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
