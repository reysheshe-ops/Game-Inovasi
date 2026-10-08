import React, { useState } from 'react';
import { SessionReportItem, StudentProfile } from '../types/game';
import { Award, Clock, Target, CheckCircle2, Trash2, Printer, X, User } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface TeacherReportModalProps {
  currentProfile: StudentProfile;
  sessionReports: SessionReportItem[];
  onUpdateProfileName: (newName: string) => void;
  onClearReports: () => void;
  onClose: () => void;
}

export const TeacherReportModal: React.FC<TeacherReportModalProps> = ({
  currentProfile,
  sessionReports,
  onUpdateProfileName,
  onClearReports,
  onClose,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentProfile.name);

  // Compute aggregate statistics
  const totalSessions = sessionReports.length;
  const totalOrders = sessionReports.reduce((acc, curr) => acc + curr.totalOrders, 0);
  const totalCorrect = sessionReports.reduce((acc, curr) => acc + curr.correctOrders, 0);

  // Filter category accuracies
  const basicScores = sessionReports.map((s) => s.basicAccuracy).filter((a) => a > 0);
  const equivScores = sessionReports.map((s) => s.equivalentAccuracy).filter((a) => a > 0);
  const decScores = sessionReports.map((s) => s.decimalPercentAccuracy).filter((a) => a > 0);

  const avgBasic = basicScores.length > 0 ? Math.round(basicScores.reduce((a, b) => a + b, 0) / basicScores.length) : 85;
  const avgEquiv = equivScores.length > 0 ? Math.round(equivScores.reduce((a, b) => a + b, 0) / equivScores.length) : 75;
  const avgDec = decScores.length > 0 ? Math.round(decScores.reduce((a, b) => a + b, 0) / decScores.length) : 80;

  const totalTimeSeconds = sessionReports.reduce((acc, curr) => acc + curr.averageTimeSeconds * curr.totalOrders, 0);
  const avgTimePerOrder = totalOrders > 0 ? (totalTimeSeconds / totalOrders).toFixed(1) : '8.5';

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateProfileName(tempName.trim());
      setEditingName(false);
      sound.playClick();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate automated pedagogical advice for the teacher
  const getTeacherRecommendations = () => {
    const recommendations = [];
    if (avgEquiv < 70) {
      recommendations.push(
        'Siswa memerlukan penguatan pada materi Pecahan Senilai (misal memotong pizza 4/8 menjadi setara 1/2, atau 2 donat dari 6 sebagai 1/3).'
      );
    }
    if (avgDec < 70) {
      recommendations.push(
        'Siswa memerlukan latihan tambahan pada konversi Desimal & Persen (khususnya 0.25 = 25% dan 0.75 = 75%).'
      );
    }
    if (avgBasic >= 85 && avgEquiv >= 85 && avgDec >= 85) {
      recommendations.push(
        'Luar biasa! Pemahaman konsep pecahan, perbandingan, dan representasi senilai siswa sudah sangat matang dan siap untuk materi lanjutan.'
      );
    } else if (recommendations.length === 0) {
      recommendations.push(
        'Pemahaman siswa berkembang dengan baik. Terus dorong eksplorasi mandiri melalui Buku Resep.'
      );
    }
    return recommendations;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 select-none print:p-0 print:bg-white animate-fadeIn">
      <div className="w-full max-w-4xl bg-amber-50 rounded-3xl shadow-2xl border-4 border-amber-400 max-h-[94%] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-h-full">
        {/* Header */}
        <div className="bg-[#118AB2] text-white px-4 py-2.5 sm:py-3 flex items-center justify-between border-b-2 border-sky-600 shrink-0 print:bg-sky-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">
                Rapor Koki: Dasbor Guru &amp; Evaluasi Siswa
              </h2>
              <p className="text-[10px] sm:text-xs text-sky-200">
                Laporan Hasil Belajar Fase B Matematika SD
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 print:hidden">
            <button
              onClick={handlePrint}
              className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl transition text-white"
              title="Cetak Laporan"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl transition text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: 2-Column Horizontal Widescreen Grid */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* LEFT COLUMN: Profile & Key Metrics Bento (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-2">
            {/* Student Profile Card */}
            <div className="bg-white rounded-2xl p-2.5 sm:p-3 border-2 border-amber-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">
                    Nama Siswa / Koki:
                  </span>
                  {editingName ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="px-2 py-0.5 text-xs border border-amber-400 rounded-lg font-bold text-amber-950 focus:outline-none"
                        maxLength={20}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-2 py-0.5 bg-amber-500 text-white rounded-lg text-[10px] font-bold hover:bg-amber-600"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm sm:text-base font-black text-amber-950">
                        {currentProfile.name}
                      </h3>
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-[10px] text-sky-600 hover:underline font-bold print:hidden"
                      >
                        (Ganti Nama)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-center">
                <div>
                  <span className="text-[9px] text-amber-700 font-bold block">Total Koin</span>
                  <span className="text-xs font-black text-amber-900">🪙 {currentProfile.totalCoins}</span>
                </div>
                <div className="h-5 w-px bg-amber-200" />
                <div>
                  <span className="text-[9px] text-amber-700 font-bold block">Sesi</span>
                  <span className="text-xs font-black text-amber-900">{totalSessions}x</span>
                </div>
              </div>
            </div>

            {/* 4 Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl p-2 border-2 border-emerald-200 text-center shadow-xs">
                <Target className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
                <span className="text-[10px] font-bold text-slate-600 block">Pecahan Dasar</span>
                <span className="text-lg font-black text-emerald-700">{avgBasic}%</span>
                <span className="text-[9px] text-emerald-600 font-semibold block">Tepat</span>
              </div>

              <div className="bg-white rounded-xl p-2 border-2 border-amber-200 text-center shadow-xs">
                <Award className="w-4 h-4 text-amber-600 mx-auto mb-0.5" />
                <span className="text-[10px] font-bold text-slate-600 block">Pecahan Senilai</span>
                <span className="text-lg font-black text-amber-700">{avgEquiv}%</span>
                <span className="text-[9px] text-amber-600 font-semibold block">Tepat</span>
              </div>

              <div className="bg-white rounded-xl p-2 border-2 border-cyan-200 text-center shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 mx-auto mb-0.5" />
                <span className="text-[10px] font-bold text-slate-600 block">Desimal &amp; Persen</span>
                <span className="text-lg font-black text-cyan-700">{avgDec}%</span>
                <span className="text-[9px] text-cyan-600 font-semibold block">Tepat</span>
              </div>

              <div className="bg-white rounded-xl p-2 border-2 border-violet-200 text-center shadow-xs">
                <Clock className="w-4 h-4 text-violet-600 mx-auto mb-0.5" />
                <span className="text-[10px] font-bold text-slate-600 block">Rata-rata Waktu</span>
                <span className="text-lg font-black text-violet-700">{avgTimePerOrder} dtk</span>
                <span className="text-[9px] text-violet-600 font-semibold block">Per Pesanan</span>
              </div>
            </div>

            {/* Pedagogical Advice Box */}
            <div className="bg-emerald-50 rounded-2xl p-2.5 border-2 border-emerald-300">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 mb-1 block">
                📋 Catatan &amp; Rekomendasi Guru:
              </span>
              <ul className="space-y-1 text-[11px] text-emerald-950 font-medium">
                {getTeacherRecommendations().map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-tight">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Session History Table (6 cols) */}
          <div className="md:col-span-6 bg-white rounded-2xl p-3 border-2 border-amber-200 shadow-xs flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-1.5 border-b border-amber-100 pb-1.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                Riwayat Sesi Bermain Siswa
              </h4>
              {sessionReports.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Yakin ingin mereset seluruh data riwayat siswa?')) {
                      onClearReports();
                    }
                  }}
                  className="flex items-center gap-1 text-[10px] text-rose-600 hover:text-rose-700 font-bold print:hidden"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset Data</span>
                </button>
              )}
            </div>

            {sessionReports.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic py-6 text-center my-auto">
                Belum ada sesi bermain yang tercatat. Selesaikan pesanan di restoran untuk melihat evaluasi siswa!
              </p>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1">
                <table className="w-full text-[10px] sm:text-xs text-left">
                  <thead>
                    <tr className="border-b border-amber-200 text-amber-900 font-bold">
                      <th className="py-1 px-1.5">Tanggal</th>
                      <th className="py-1 px-1.5">Level</th>
                      <th className="py-1 px-1.5">Benar</th>
                      <th className="py-1 px-1.5">Bintang</th>
                      <th className="py-1 px-1.5">Skor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {sessionReports.slice(0, 6).map((rpt) => (
                      <tr key={rpt.id} className="hover:bg-amber-50/50">
                        <td className="py-1 px-1.5 font-medium text-slate-600">{rpt.date}</td>
                        <td className="py-1 px-1.5 font-bold text-slate-800">Lv. {rpt.levelId}</td>
                        <td className="py-1 px-1.5 font-semibold text-slate-700">
                          {rpt.correctOrders}/{rpt.totalOrders}
                        </td>
                        <td className="py-1 px-1.5 font-bold text-amber-500">
                          {'★'.repeat(rpt.stars)}{'☆'.repeat(3 - rpt.stars)}
                        </td>
                        <td className="py-1 px-1.5 font-black text-amber-900">{rpt.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Quick summary footer */}
            <div className="pt-2 border-t border-amber-100 flex justify-between items-center text-[10px] text-amber-800 font-semibold">
              <span>Total Pesanan Selesai: {totalOrders}</span>
              <span>Akurasi Keseluruhan: {totalOrders > 0 ? Math.round((totalCorrect / totalOrders) * 100) : 100}%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-amber-100 px-4 py-2 border-t border-amber-200 flex justify-between items-center shrink-0 print:hidden">
          <span className="text-[10px] text-amber-800 font-medium">
            Tersimpan otomatis di memori perangkat guru/sekolah.
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition"
          >
            Tutup Rapor
          </button>
        </div>
      </div>
    </div>
  );
};
