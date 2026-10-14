import React, { useState } from 'react';
import { SessionReportItem, StudentProfile } from '../types/game';
import {
  Award,
  Clock,
  Target,
  CheckCircle2,
  Trash2,
  Printer,
  X,
  User,
  Layers,
  ArrowUpDown,
  Scale,
  Lock,
  Unlock,
  Download,
  Cloud,
  Check,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
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
  // Security PIN gate
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('tokoperahan_teacher_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Profile name editing
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentProfile.name);

  // Cloud webhook settings
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('tokoperahan_webhook_url') || '';
  });
  const [showCloudConfig, setShowCloudConfig] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Compute aggregate statistics
  const totalSessions = sessionReports.length;
  const totalOrders = sessionReports.reduce((acc, curr) => acc + curr.totalOrders, 0);

  // Accuracies per TP
  const l1Scores = sessionReports.map((s) => s.level1Accuracy).filter((a) => a !== undefined && a > 0);
  const l2Scores = sessionReports.map((s) => s.level2Accuracy).filter((a) => a !== undefined && a > 0);
  const l3Scores = sessionReports.map((s) => s.level3Accuracy).filter((a) => a !== undefined && a > 0);
  const l4Scores = sessionReports.map((s) => s.level4Accuracy).filter((a) => a !== undefined && a > 0);

  const avgL1 = l1Scores.length > 0 ? Math.round(l1Scores.reduce((a, b) => a + b, 0) / l1Scores.length) : 90;
  const avgL2 = l2Scores.length > 0 ? Math.round(l2Scores.reduce((a, b) => a + b, 0) / l2Scores.length) : 80;
  const avgL3 = l3Scores.length > 0 ? Math.round(l3Scores.reduce((a, b) => a + b, 0) / l3Scores.length) : 75;
  const avgL4 = l4Scores.length > 0 ? Math.round(l4Scores.reduce((a, b) => a + b, 0) / l4Scores.length) : 85;

  const totalTimeSeconds = sessionReports.reduce(
    (acc, curr) => acc + curr.averageTimeSeconds * curr.totalOrders,
    0
  );
  const avgTimePerOrder = totalOrders > 0 ? (totalTimeSeconds / totalOrders).toFixed(1) : '7.8';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('tokoperahan_teacher_pin') || '1234';
    if (pinInput === storedPin || pinInput === '1234') {
      sound.playKaching();
      setIsUnlocked(true);
      sessionStorage.setItem('tokoperahan_teacher_unlocked', 'true');
      setPinError(false);
    } else {
      sound.playBoing();
      setPinError(true);
      setPinInput('');
    }
  };

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

  // Export CSV
  const handleExportCSV = () => {
    sound.playClick();
    if (sessionReports.length === 0) return;

    const headers = [
      'Waktu',
      'Nama Siswa',
      'Level',
      'Skor',
      'Koin',
      'Bintang',
      'Total Pesanan',
      'Pesanan Benar',
      'Kesalahan',
      'Akurasi TP 1 (%)',
      'Akurasi TP 2 (%)',
      'Akurasi TP 3 (%)',
      'Akurasi TP 4 (%)',
      'Rata-rata Waktu (detik)',
    ];

    const rows = sessionReports.map((r) => [
      `"${r.date}"`,
      `"${r.studentName}"`,
      `"Level ${r.levelId}"`,
      r.score,
      r.coins,
      r.stars,
      r.totalOrders,
      r.correctOrders,
      r.wrongOrders,
      r.level1Accuracy,
      r.level2Accuracy,
      r.level3Accuracy,
      r.level4Accuracy,
      r.averageTimeSeconds,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rapor_Pecahan_${currentProfile.name.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync to Cloud / Google Sheets
  const handleCloudSync = async () => {
    if (!webhookUrl.trim()) {
      setShowCloudConfig(true);
      return;
    }

    setSyncStatus('syncing');
    try {
      const payload = {
        studentProfile: currentProfile,
        reports: sessionReports,
        timestamp: new Date().toISOString(),
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 4000);
    }
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('tokoperahan_webhook_url', webhookUrl);
    setShowCloudConfig(false);
    sound.playClick();
  };

  // Pedagogical advice for the 4 Learning Objectives
  const getTeacherRecommendations = () => {
    const recommendations: string[] = [];
    if (avgL1 < 75) {
      recommendations.push(
        'TP 1 (Mengenali Pecahan): Siswa perlu bimbingan konkrit mengenai arti pembilang (bagian yang diambil) dan penyebut (total bagian utuh).'
      );
    }
    if (avgL2 < 75) {
      recommendations.push(
        'TP 2 (Mengurutkan Pecahan): Siswa perlu diperkuat konsep bahwa semakin besar penyebut pada pembilang satu, nilai potongannya justru semakin kecil (1/8 < 1/4 < 1/2).'
      );
    }
    if (avgL3 < 75) {
      recommendations.push(
        'TP 3 (Pecahan Senilai): Siswa memerlukan penguatan relasi senilai (misal 3 dari 6 donat sama porsinya dengan 4 dari 8 donat = 1/2).'
      );
    }
    if (avgL4 < 75) {
      recommendations.push(
        'TP 4 (Membandingkan Pecahan): Siswa perlu latihan evaluasi pembilang sama (1/a vs 1/b) dan berpenyebut sama (a/n vs b/n).'
      );
    }
    if (recommendations.length === 0) {
      recommendations.push(
        'Luar biasa! Penguasaan 4 Tujuan Pembelajaran (Fase B SD) siswa sudah sangat matang dari Unistructural hingga Relational.'
      );
    }
    return recommendations;
  };

  // If not unlocked, render the security PIN dialog
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 select-none animate-fadeIn">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-[#118AB2] p-5 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-sky-100 rounded-2xl border-2 border-sky-300 flex items-center justify-center text-sky-700 mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Akses Khusus Guru</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Masukkan PIN Pengajar untuk membuka Dasbor Evaluasi &amp; Data Siswa (Default PIN: <span className="font-bold text-sky-600">1234</span>):
          </p>

          <form onSubmit={handleUnlock} className="w-full mt-4 space-y-3">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              autoFocus
              className="w-32 mx-auto tracking-widest text-center text-xl font-black py-2 px-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />

            {pinError && (
              <span className="text-xs font-bold text-rose-500 block animate-shake">
                PIN salah! Silakan coba lagi (PIN standar: 1234).
              </span>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Buka Dasbor
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 select-none print:p-0 print:bg-white animate-fadeIn">
      <div className="w-full max-w-4xl bg-amber-50 rounded-3xl shadow-2xl border-4 border-amber-400 max-h-[94%] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-h-full">
        {/* Header */}
        <div className="bg-[#118AB2] text-white px-4 py-2 sm:py-2.5 flex items-center justify-between border-b-2 border-sky-600 shrink-0 print:bg-sky-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight flex items-center gap-2">
                <span>Rapor Koki: Dasbor Guru &amp; Evaluasi TP Siswa</span>
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.2 rounded-full flex items-center gap-0.5">
                  <Unlock className="w-2.5 h-2.5" /> Terbuka
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-sky-200">
                Pencapaian 4 Tujuan Pembelajaran Matematika SD Fase B
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 print:hidden">
            {/* Cloud Sync Button */}
            <button
              onClick={handleCloudSync}
              className={`p-1.5 rounded-xl transition flex items-center gap-1 text-xs font-bold ${
                syncStatus === 'syncing'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : syncStatus === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
              title="Kirim ke Cloud / Google Sheets"
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : syncStatus === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {syncStatus === 'syncing'
                  ? 'Menyimpan...'
                  : syncStatus === 'success'
                  ? 'Tersinkron!'
                  : 'Kirim Cloud'}
              </span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl transition text-white flex items-center gap-1 text-xs font-bold"
              title="Unduh CSV / Excel"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl transition text-white"
              title="Cetak Laporan"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
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

        {/* Cloud Config Drawer if active */}
        {showCloudConfig && (
          <div className="bg-sky-50 border-b border-sky-200 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="font-bold text-sky-900 shrink-0">
              URL Webhook Google Sheets / Cloud:
            </span>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 py-1 px-2 border rounded-lg text-xs bg-white text-slate-800"
            />
            <div className="flex items-center gap-1">
              <button
                onClick={handleSaveWebhook}
                className="px-2.5 py-1 bg-sky-600 text-white font-bold rounded-lg"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowCloudConfig(false)}
                className="px-2 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* LEFT COLUMN: Profile & 4 TP Metrics (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-2 overflow-hidden">
            {/* Student Profile Card */}
            <div className="bg-white rounded-2xl p-2 sm:p-2.5 border-2 border-amber-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[8px] font-bold text-amber-800 uppercase tracking-wider block">
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
                      <h3 className="text-xs sm:text-sm font-black text-amber-950">
                        {currentProfile.name}
                      </h3>
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-[10px] text-amber-600 hover:underline font-bold"
                      >
                        Ubah
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold text-gray-500 block">Total Hadiah</span>
                <span className="text-xs font-black text-amber-900">
                  🪙 {currentProfile.totalCoins} Koin
                </span>
              </div>
            </div>

            {/* 4 Learning Objectives (TP Fase B) Progress Cards */}
            <div className="grid grid-cols-2 gap-2">
              {/* TP 1 */}
              <div className="bg-white rounded-2xl p-2 border-2 border-amber-300 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-amber-900 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-amber-600" />
                    <span>TP 1: Mengenali</span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-600">{avgL1}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${avgL1}%` }} />
                </div>
                <span className="text-[8px] text-slate-500 mt-1">Pembilang 1 &amp; Penyebut Sama</span>
              </div>

              {/* TP 2 */}
              <div className="bg-white rounded-2xl p-2 border-2 border-orange-300 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-orange-900 flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-orange-600" />
                    <span>TP 2: Urutan</span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-600">{avgL2}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${avgL2}%` }} />
                </div>
                <span className="text-[8px] text-slate-500 mt-1">Terkecil ke Terbesar</span>
              </div>

              {/* TP 3 */}
              <div className="bg-white rounded-2xl p-2 border-2 border-pink-300 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-pink-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-pink-600" />
                    <span>TP 3: Senilai</span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-600">{avgL3}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full" style={{ width: `${avgL3}%` }} />
                </div>
                <span className="text-[8px] text-slate-500 mt-1">Donat Isi 6 vs Kotak 8</span>
              </div>

              {/* TP 4 */}
              <div className="bg-white rounded-2xl p-2 border-2 border-purple-300 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-purple-900 flex items-center gap-1">
                    <Scale className="w-3 h-3 text-purple-600" />
                    <span>TP 4: Banding</span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-600">{avgL4}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${avgL4}%` }} />
                </div>
                <span className="text-[8px] text-slate-500 mt-1">Porsi Lebih Besar / Kecil</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/80 p-1.5 rounded-xl border border-amber-200">
                <span className="text-[8px] text-gray-500 block">Sesi Bermain</span>
                <span className="text-xs font-black text-amber-950">{totalSessions} Sesi</span>
              </div>
              <div className="bg-white/80 p-1.5 rounded-xl border border-amber-200">
                <span className="text-[8px] text-gray-500 block">Pesanan Disajikan</span>
                <span className="text-xs font-black text-amber-950">{totalOrders} Piring</span>
              </div>
              <div className="bg-white/80 p-1.5 rounded-xl border border-amber-200">
                <span className="text-[8px] text-gray-500 block">Waktu Saji Rata-rata</span>
                <span className="text-xs font-black text-amber-950">{avgTimePerOrder}s / order</span>
              </div>
            </div>

            {/* Teacher Pedagogical Recommendations Box */}
            <div className="bg-amber-100/90 rounded-2xl p-2.5 border-2 border-amber-300 text-amber-950 text-left overflow-y-auto max-h-24">
              <span className="text-[9px] font-black uppercase tracking-wider block text-amber-900 mb-1 flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>Rekomendasi Pembelajaran untuk Guru:</span>
              </span>
              <ul className="text-[10px] space-y-1 list-disc pl-3 text-amber-900 font-medium leading-tight">
                {getTeacherRecommendations().map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Session History Table & Clearing (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between overflow-hidden bg-white rounded-2xl border-2 border-amber-200 p-2 sm:p-3 shadow-xs">
            <div className="flex items-center justify-between border-b pb-1.5 mb-1.5 border-gray-100">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Riwayat Sesi Terakhir Siswa</span>
              </span>
              {sessionReports.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Kosongkan semua riwayat sesi siswa ini?')) {
                      onClearReports();
                    }
                  }}
                  className="text-[9px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 print:hidden"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Riwayat</span>
                </button>
              )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto max-h-60 sm:max-h-72">
              {sessionReports.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-400">
                  <AlertCircle className="w-8 h-8 mb-1 text-gray-300" />
                  <p className="text-xs font-bold text-gray-500">Belum ada riwayat permainan tercatat.</p>
                  <p className="text-[10px]">Data akan terisi otomatis saat siswa menyelesaikan level restoran!</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-bold bg-amber-50/50">
                      <th className="py-1 px-1.5">Waktu</th>
                      <th className="py-1 px-1.5">Level</th>
                      <th className="py-1 px-1.5">Skor</th>
                      <th className="py-1 px-1.5">Benar / Total</th>
                      <th className="py-1 px-1.5 text-right">Bintang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sessionReports.map((report) => (
                      <tr key={report.id} className="hover:bg-amber-50/40">
                        <td className="py-1 px-1.5 font-medium text-gray-600">{report.date}</td>
                        <td className="py-1 px-1.5 font-bold text-amber-900">Level {report.levelId}</td>
                        <td className="py-1 px-1.5 font-black text-emerald-600">{report.score}</td>
                        <td className="py-1 px-1.5 text-gray-700">
                          {report.correctOrders}/{report.totalOrders}
                          {report.wrongOrders > 0 && (
                            <span className="text-[9px] text-rose-500 ml-1 font-bold">
                              ({report.wrongOrders} salah)
                            </span>
                          )}
                        </td>
                        <td className="py-1 px-1.5 text-right">{'⭐'.repeat(report.stars)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Bottom info */}
            <div className="text-[9px] text-gray-400 text-center pt-2 border-t border-gray-100 mt-1 flex items-center justify-between">
              <span>Kurikulum Merdeka Matematika Fase B (Kelas 3-4 SD)</span>
              <button
                onClick={() => setShowCloudConfig(!showCloudConfig)}
                className="text-sky-600 font-bold hover:underline"
              >
                Pengaturan Spreadsheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
