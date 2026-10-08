import React, { useState } from 'react';
import { FractionDisplay } from './FractionDisplay';
import { BookOpen, X, Sparkles, ChevronRight, PieChart, Layers, Percent } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface RecipeBookModalProps {
  onClose: () => void;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'comparison' | 'equivalent' | 'decimal_percent'>('basics');
  const [interactiveSlice, setInteractiveSlice] = useState<number>(2); // for denominator demonstration
  const [interactiveJuice, setInteractiveJuice] = useState<number>(0.5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 select-none animate-fadeIn">
      <div className="w-full max-w-4xl bg-amber-50 rounded-3xl shadow-2xl border-4 border-amber-400 max-h-[94%] flex flex-col overflow-hidden">
        {/* Book Header */}
        <div className="bg-[#FFD166] px-4 py-2.5 sm:py-3 border-b-2 border-amber-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-950 leading-tight">
                Buku Resep &amp; Ensiklopedia Pecahan
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-800 font-semibold">
                Panduan Belajar Matematika Fase B (Kelas 3 &amp; 4 SD)
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
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-amber-100/70 px-4 py-2 flex items-center gap-2 overflow-x-auto border-b border-amber-200">
          {[
            { id: 'basics', label: '1. Mengenal Pecahan', icon: PieChart },
            { id: 'comparison', label: '2. Membandingkan', icon: ChevronRight },
            { id: 'equivalent', label: '3. Pecahan Senilai', icon: Layers },
            { id: 'decimal_percent', label: '4. Desimal & Persen', icon: Percent },
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-amber-900 hover:bg-amber-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: MENGENAL PECAHAN */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-xs">
                <h3 className="text-base font-extrabold text-amber-950 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Apa itu Pecahan?
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Pecahan adalah bagian dari suatu benda yang utuh jika dipotong menjadi bagian-bagian yang <strong>sama besar</strong>.
                </p>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-around gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-amber-800 mb-1">Struktur Pecahan:</span>
                    <div className="bg-white px-4 py-2 rounded-xl border-2 border-amber-300 shadow-xs flex items-center gap-3">
                      <FractionDisplay numerator={1} denominator={4} size="lg" />
                      <div className="text-xs font-bold text-slate-700 flex flex-col justify-center">
                        <span className="text-rose-600">Angka Atas: Pembilang (Bagian yang diambil)</span>
                        <div className="h-0.5 bg-gray-300 my-1" />
                        <span className="text-blue-600">Angka Bawah: Penyebut (Total semua potongan)</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Visual Pizza Demo */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-amber-800 mb-1">Coba Potong Pizza:</span>
                    <div className="flex gap-1.5 mb-2">
                      {[2, 4, 8].map((cuts) => (
                        <button
                          key={cuts}
                          onClick={() => {
                            sound.playBlop();
                            setInteractiveSlice(cuts);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            interactiveSlice === cuts
                              ? 'bg-amber-500 text-white'
                              : 'bg-white text-amber-900 border border-amber-200'
                          }`}
                        >
                          Bagi {cuts}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      1 potong bernilai: <FractionDisplay numerator={1} denominator={interactiveSlice} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBANDINGKAN PECAHAN */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-xs">
                <h3 className="text-base font-extrabold text-amber-950 mb-2 flex items-center gap-2">
                  <span className="text-xl">🍕</span>
                  Membandingkan: Mana yang Lebih Besar?
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Ingat rahasia koki cilik: <strong>Semakin sedikit potongan (penyebut lebih kecil), maka setiap potongannya justru semakin BESAR!</strong>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="bg-emerald-50 rounded-xl p-3 border-2 border-emerald-300 flex items-center gap-3">
                    <div className="text-3xl">🍕</div>
                    <div>
                      <div className="flex items-center gap-1 font-black text-emerald-900 text-sm">
                        <FractionDisplay numerator={1} denominator={2} size="md" textColor="text-emerald-900" />
                        <span>(Setengah Pizza)</span>
                      </div>
                      <p className="text-xs text-emerald-700 mt-1">
                        Pizza dipotong 2 saja, jadi potongannya <strong>SANGAT BESAR</strong>!
                      </p>
                    </div>
                  </div>

                  <div className="bg-rose-50 rounded-xl p-3 border-2 border-rose-300 flex items-center gap-3">
                    <div className="text-2xl">🍕</div>
                    <div>
                      <div className="flex items-center gap-1 font-black text-rose-900 text-sm">
                        <FractionDisplay numerator={1} denominator={4} size="md" textColor="text-rose-900" />
                        <span>(Seperempat Pizza)</span>
                      </div>
                      <p className="text-xs text-rose-700 mt-1">
                        Pizza dipotong 4 orang, jadi setiap potongan menjadi <strong>LEBIH KECIL</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-100 p-3 rounded-xl text-center text-xs sm:text-sm font-extrabold text-amber-950 border border-amber-300">
                  🏆 Kesimpulan: <FractionDisplay numerator={1} denominator={2} size="sm" /> &gt; <FractionDisplay numerator={1} denominator={4} size="sm" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PECAHAN SENILAI */}
          {activeTab === 'equivalent' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-xs">
                <h3 className="text-base font-extrabold text-amber-950 mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  Apa itu Pecahan Senilai?
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Pecahan senilai adalah pecahan yang bentuk angkanya berbeda, tetapi memiliki <strong>jumlah atau nilai porsi yang SAMA BESAR</strong>!
                </p>

                <div className="space-y-3">
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-around gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-amber-900">1 dari 2 potong</span>
                      <FractionDisplay numerator={1} denominator={2} size="md" />
                    </div>
                    <span className="text-xl font-black text-amber-700">= SAMA DENGAN =</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-amber-900">2 dari 4 potong</span>
                      <FractionDisplay numerator={2} denominator={4} size="md" />
                    </div>
                    <span className="text-xl font-black text-amber-700">= SAMA DENGAN =</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-amber-900">4 dari 8 potong</span>
                      <FractionDisplay numerator={4} denominator={8} size="md" />
                    </div>
                  </div>

                  <div className="bg-pink-50 p-3 rounded-xl border border-pink-200">
                    <span className="text-xs font-bold text-pink-900 block mb-1">
                      🍩 Contoh Pada Kotak Donat (Isi 6 donat):
                    </span>
                    <div className="flex items-center justify-around text-xs font-bold text-slate-700">
                      <div>
                        2 donat = <FractionDisplay numerator={2} denominator={6} size="sm" /> = <FractionDisplay numerator={1} denominator={3} size="sm" /> kotak
                      </div>
                      <div>
                        3 donat = <FractionDisplay numerator={3} denominator={6} size="sm" /> = <FractionDisplay numerator={1} denominator={2} size="sm" /> kotak
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DESIMAL & PERSEN */}
          {activeTab === 'decimal_percent' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-xs">
                <h3 className="text-base font-extrabold text-amber-950 mb-2 flex items-center gap-2">
                  <Percent className="w-5 h-5 text-cyan-600" />
                  Jembatan Pecahan, Desimal, dan Persen
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Pecahan, desimal, dan persen hanyalah tiga cara berbeda untuk menuliskan hal yang sama!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                  <div className="bg-sky-50 rounded-xl p-3 border-2 border-sky-300 text-center">
                    <span className="text-xs font-bold text-sky-800 block">Seperempat</span>
                    <div className="my-1">
                      <FractionDisplay numerator={1} denominator={4} size="md" textColor="text-sky-950" />
                    </div>
                    <div className="text-sm font-extrabold text-sky-900">0.25</div>
                    <div className="text-sm font-extrabold text-sky-700">25%</div>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-3 border-2 border-emerald-300 text-center">
                    <span className="text-xs font-bold text-emerald-800 block">Setengah</span>
                    <div className="my-1">
                      <FractionDisplay numerator={1} denominator={2} size="md" textColor="text-emerald-950" />
                    </div>
                    <div className="text-sm font-extrabold text-emerald-900">0.50 (atau 0.5)</div>
                    <div className="text-sm font-extrabold text-emerald-700">50%</div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-3 border-2 border-amber-300 text-center">
                    <span className="text-xs font-bold text-amber-800 block">Tiga Perempat</span>
                    <div className="my-1">
                      <FractionDisplay numerator={3} denominator={4} size="md" textColor="text-amber-950" />
                    </div>
                    <div className="text-sm font-extrabold text-amber-900">0.75</div>
                    <div className="text-sm font-extrabold text-amber-700">75%</div>
                  </div>
                </div>

                {/* Interactive Juice Slider Simulator */}
                <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-950 block">Simulator Mesin Jus:</span>
                    <span className="text-xs text-cyan-800">
                      Nilai Sekarang: <strong>{interactiveJuice.toFixed(2)}</strong> = <strong>{Math.round(interactiveJuice * 100)}%</strong>
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0.25, 0.5, 0.75, 1.0].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          sound.playGlug();
                          setInteractiveJuice(v);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          interactiveJuice === v
                            ? 'bg-cyan-600 text-white'
                            : 'bg-white text-cyan-900 border border-cyan-300'
                        }`}
                      >
                        {v} ({Math.round(v * 100)}%)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-amber-100 px-5 py-3 border-t border-amber-200 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition"
          >
            Tutup Buku
          </button>
        </div>
      </div>
    </div>
  );
};
