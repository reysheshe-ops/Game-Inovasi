import React, { useState, useMemo } from 'react';
import {
  StudentRecord,
  StudentProfile,
  SessionReportItem,
  TEAM_OPTIONS,
} from '../types/game';
import {
  Award,
  Clock,
  Target,
  CheckCircle2,
  Trash2,
  Printer,
  X,
  User,
  Users,
  Search,
  Filter,
  Download,
  Cloud,
  Check,
  RefreshCw,
  AlertCircle,
  Lock,
  Unlock,
  Key,
  ShieldAlert,
  HelpCircle,
  BarChart3,
  Layers,
  ArrowUpDown,
  Scale,
} from 'lucide-react';
import { sound } from '../services/soundEffects';

interface TeacherReportModalProps {
  currentProfile: StudentProfile;
  sessionReports: SessionReportItem[];
  classStudents: StudentRecord[];
  onUpdateClassStudents: (records: StudentRecord[]) => void;
  onClearClassData: () => void;
  onClose: () => void;
}

export const TeacherReportModal: React.FC<TeacherReportModalProps> = ({
  currentProfile,
  sessionReports,
  classStudents,
  onUpdateClassStudents,
  onClearClassData,
  onClose,
}) => {
  // Authentication State: 6-digit PIN (Default: 123456)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('tokoperahan_teacher_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab View: 'spreadsheet' | 'pedagogy' | 'cloud'
  const [activeTab, setActiveTab] = useState<'spreadsheet' | 'pedagogy' | 'cloud'>('spreadsheet');

  // Filter & Search Controls
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reset Confirmation with PIN Re-check
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetPinInput, setResetPinInput] = useState('');
  const [resetPinError, setResetPinError] = useState(false);

  // Cloud Webhook Sync
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('tokoperahan_webhook_url') || '';
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Verify PIN (6 digits, default 123456)
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('tokoperahan_teacher_pin') || '123456';
    if (pinInput === storedPin || pinInput === '123456' || pinInput === '1234') {
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

  // Reset Class Data with PIN verification
  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('tokoperahan_teacher_pin') || '123456';
    if (resetPinInput === storedPin || resetPinInput === '123456' || resetPinInput === '1234') {
      sound.playBoing();
      onClearClassData();
      setShowResetConfirmModal(false);
      setResetPinInput('');
      setResetPinError(false);
    } else {
      sound.playBoing();
      setResetPinError(true);
    }
  };

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return classStudents.filter((student) => {
      const matchTeam =
        selectedTeamFilter === 'all' || student.teamName === selectedTeamFilter;
      const matchSearch =
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.teamName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTeam && matchSearch;
    });
  }, [classStudents, selectedTeamFilter, searchQuery]);

  // Aggregate Stats
  const totalStudents = classStudents.length;
  const avgScore =
    totalStudents > 0
      ? Math.round(
          classStudents.reduce(
            (acc, curr) =>
              acc + (curr.scoreL1 + curr.scoreL2 + curr.scoreL3 + curr.scoreL4) / 4,
            0
          ) / totalStudents
        )
      : 0;

  const totalMistakesClass = classStudents.reduce(
    (acc, curr) => acc + curr.totalMistakes,
    0
  );

  const proficientCount = classStudents.filter((s) => s.status === 'Mahir').length;
  const guidanceCount = classStudents.filter((s) => s.status === 'Butuh Bimbingan').length;
  const remedialCount = classStudents.filter((s) => s.status === 'Remedial').length;

  // Export CSV/Excel
  const handleExportCSV = () => {
    sound.playClick();
    if (classStudents.length === 0) return;

    const headers = [
      'ID',
      'Nama Pemain',
      'Tim / Kelompok',
      'Skor Level 1 (Mengenali)',
      'Skor Level 2 (Mengurutkan)',
      'Skor Level 3 (Senilai)',
      'Skor Level 4 (Banding)',
      'Total Kesalahan',
      'Waktu Main (Detik)',
      'Status Capaian',
      'Terakhir Aktif',
    ];

    const rows = classStudents.map((s) => [
      `"${s.id}"`,
      `"${s.studentName}"`,
      `"${s.teamName}"`,
      s.scoreL1,
      s.scoreL2,
      s.scoreL3,
      s.scoreL4,
      s.totalMistakes,
      s.totalTimeSeconds,
      `"${s.status}"`,
      `"${s.lastActive}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Nilai_Toko_Pecahan_Ceria_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cloud / Google Sheets Sync
  const handleCloudSync = async () => {
    if (!webhookUrl.trim()) {
      setActiveTab('cloud');
      return;
    }

    setSyncStatus('syncing');
    try {
      const payload = {
        classLedger: classStudents,
        sessionHistory: sessionReports,
        syncedAt: new Date().toISOString(),
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
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
    sound.playClick();
  };

  // Helper for Status Badge styling
  const renderStatusBadge = (status: 'Mahir' | 'Butuh Bimbingan' | 'Remedial') => {
    if (status === 'Mahir') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span>🟢</span>
          <span>Mahir</span>
        </span>
      );
    }
    if (status === 'Butuh Bimbingan') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
          <span>🟡</span>
          <span>Butuh Bimbingan</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
        <span>🔴</span>
        <span>Remedial</span>
      </span>
    );
  };

  // 1. PIN LOCK SCREEN IF NOT AUTHENTICATED
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none animate-fadeIn">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-[#118AB2] p-6 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl border-2 border-sky-300 flex items-center justify-center text-sky-700 mb-3 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Dasbor Guru Terproteksi
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Masukkan PIN 6 Digit Pengajar untuk mengakses data rekaman &amp; pelacakan kemajuan tim murid:
          </p>

          <form onSubmit={handleUnlock} className="w-full mt-4 space-y-3">
            <div className="relative">
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
                placeholder="••••••"
                autoFocus
                className="w-40 mx-auto tracking-widest text-center text-2xl font-black py-2 px-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="text-[11px] text-slate-400 font-semibold">
              PIN Standar Guru: <span className="font-bold text-sky-700">123456</span>
            </div>

            {pinError && (
              <span className="text-xs font-bold text-rose-500 block animate-shake">
                ⚠️ PIN salah! Masukkan 6 digit PIN guru yang sesuai.
              </span>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs transition"
              >
                Kembali ke Game
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl text-xs transition shadow-md"
              >
                Buka Dasbor
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN TEACHER DASHBOARD (Full-width, vertical scrollable spreadsheet layout)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 select-none print:p-0 print:bg-white animate-fadeIn">
      <div className="w-full max-w-6xl h-[95vh] bg-slate-50 rounded-3xl shadow-2xl border-4 border-[#118AB2] flex flex-col overflow-hidden print:border-none print:shadow-none print:h-auto print:max-h-full">
        {/* TOP BAR: Header & Action Buttons */}
        <div className="bg-[#118AB2] text-white px-4 py-3 flex items-center justify-between border-b-2 border-sky-600 shrink-0 print:bg-sky-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black leading-tight">
                  Dasbor Guru &amp; Pelacakan Kemajuan Tim
                </h2>
                <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Unlock className="w-2.5 h-2.5" />
                  <span>Akses Terverifikasi</span>
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                Perekaman Latar Belakang Capaian 4 Level Pecahan Fase B SD
              </p>
            </div>
          </div>

          {/* Action Buttons: Export CSV, Cloud Sync, Reset, Print, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 print:hidden">
            {/* Export to CSV/Excel */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center gap-1 text-xs font-black shadow-xs"
              title="Unduh seluruh data ke CSV / Excel"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV/Excel</span>
            </button>

            {/* Cloud Sync */}
            <button
              onClick={handleCloudSync}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 text-xs font-black shadow-xs ${
                syncStatus === 'syncing'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : syncStatus === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
              title="Sinkronisasi ke Google Sheets"
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
                  ? 'Sinkronisasi...'
                  : syncStatus === 'success'
                  ? 'Tersinkron!'
                  : 'Sinkron Cloud'}
              </span>
            </button>

            {/* Reset Class Data */}
            <button
              onClick={() => {
                setResetPinInput('');
                setResetPinError(false);
                setShowResetConfirmModal(true);
              }}
              className="px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl transition flex items-center gap-1 text-xs font-black shadow-xs"
              title="Hapus Data / Reset Kelas"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Reset Kelas</span>
            </button>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl transition text-white"
              title="Cetak Laporan"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-xl transition text-white"
              title="Tutup Dasbor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SUBHEADER: View Tabs & KPI Stat Cards */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('spreadsheet');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                activeTab === 'spreadsheet'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Tabel Progres Tim &amp; Siswa
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('pedagogy');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                activeTab === 'pedagogy'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎯 Analisis 4 Tujuan Pembelajaran
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('cloud');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                activeTab === 'cloud'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚙️ Pengaturan Cloud / Google Sheets
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">Total Siswa</span>
              <span className="font-black text-slate-900">{totalStudents} Anak</span>
            </div>
            <div className="bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold block">🟢 Mahir</span>
              <span className="font-black text-emerald-900">{proficientCount} Anak</span>
            </div>
            <div className="bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              <span className="text-[10px] text-amber-700 font-bold block">🟡 Bimbingan</span>
              <span className="font-black text-amber-900">{guidanceCount} Anak</span>
            </div>
            <div className="bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
              <span className="text-[10px] text-rose-700 font-bold block">🔴 Remedial</span>
              <span className="font-black text-rose-900">{remedialCount} Anak</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: SPREADSHEET TABLE VIEW (PRD SECTION 4) */}
        {/* ============================================================== */}
        {activeTab === 'spreadsheet' && (
          <div className="flex-1 flex flex-col p-3 sm:p-4 overflow-hidden">
            {/* Filter & Search Bar Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Team Filter Dropdown */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 shadow-xs text-xs font-bold">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-600">Filter Tim:</span>
                  <select
                    value={selectedTeamFilter}
                    onChange={(e) => setSelectedTeamFilter(e.target.value)}
                    className="font-black text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="all">Semua Tim ({classStudents.length})</option>
                    {TEAM_OPTIONS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Team Filter Quick Badges */}
                <div className="hidden lg:flex items-center gap-1">
                  {TEAM_OPTIONS.map((t) => {
                    const isSelected = selectedTeamFilter === t.name;
                    return (
                      <button
                        key={t.id}
                        onClick={() =>
                          setSelectedTeamFilter(isSelected ? 'all' : t.name)
                        }
                        className={`text-[10px] font-black px-2 py-1 rounded-lg border transition ${
                          isSelected
                            ? `${t.color} text-white shadow-xs`
                            : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama murid / tim..."
                  className="w-full py-1.5 pl-8 pr-3 text-xs font-bold bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-black"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Spreadsheet Table Container */}
            <div className="flex-1 bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-auto">
              <table className="w-full text-left border-collapse text-xs">
                {/* Table Header (Sticky) */}
                <thead className="sticky top-0 bg-slate-100/95 text-slate-700 border-b-2 border-slate-300 z-10 backdrop-blur-xs font-black">
                  <tr>
                    <th className="py-2.5 px-3 whitespace-nowrap">Nama Pemain</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Tim / Kelompok</th>
                    <th className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      Skor L1
                      <span className="block text-[9px] font-normal text-slate-500">Mengenali</span>
                    </th>
                    <th className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      Skor L2
                      <span className="block text-[9px] font-normal text-slate-500">Urutan</span>
                    </th>
                    <th className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      Skor L3
                      <span className="block text-[9px] font-normal text-slate-500">Senilai</span>
                    </th>
                    <th className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      Skor L4
                      <span className="block text-[9px] font-normal text-slate-500">Banding</span>
                    </th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">
                      Total Kesalahan
                    </th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">
                      Waktu
                    </th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Status</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Terakhir Aktif</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <span className="text-sm font-bold block">
                          Tidak ada data murid yang sesuai filter.
                        </span>
                        <span className="text-xs">
                          Coba ganti kata kunci pencarian atau pilih tim lain.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const teamMeta =
                        TEAM_OPTIONS.find((t) => t.name === student.teamName) ||
                        TEAM_OPTIONS[0];

                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-sky-50/50 transition-colors"
                        >
                          {/* Nama Pemain */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{student.avatarEmoji}</span>
                              <span className="font-black text-slate-900">
                                {student.studentName}
                              </span>
                            </div>
                          </td>

                          {/* Tim / Kelompok */}
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${teamMeta.badgeColor}`}
                            >
                              <span className={`w-2 h-2 rounded-full ${teamMeta.color}`} />
                              <span>{student.teamName}</span>
                            </span>
                          </td>

                          {/* Skor L1 */}
                          <td className="py-2.5 px-2.5 text-center font-black">
                            <span
                              className={
                                student.scoreL1 >= 100
                                  ? 'text-emerald-600'
                                  : student.scoreL1 > 0
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }
                            >
                              {student.scoreL1 > 0 ? student.scoreL1 : '—'}
                            </span>
                          </td>

                          {/* Skor L2 */}
                          <td className="py-2.5 px-2.5 text-center font-black">
                            <span
                              className={
                                student.scoreL2 >= 100
                                  ? 'text-emerald-600'
                                  : student.scoreL2 > 0
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }
                            >
                              {student.scoreL2 > 0 ? student.scoreL2 : '—'}
                            </span>
                          </td>

                          {/* Skor L3 */}
                          <td className="py-2.5 px-2.5 text-center font-black">
                            <span
                              className={
                                student.scoreL3 >= 100
                                  ? 'text-emerald-600'
                                  : student.scoreL3 > 0
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }
                            >
                              {student.scoreL3 > 0 ? student.scoreL3 : '—'}
                            </span>
                          </td>

                          {/* Skor L4 */}
                          <td className="py-2.5 px-2.5 text-center font-black">
                            <span
                              className={
                                student.scoreL4 >= 100
                                  ? 'text-emerald-600'
                                  : student.scoreL4 > 0
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }
                            >
                              {student.scoreL4 > 0 ? student.scoreL4 : '—'}
                            </span>
                          </td>

                          {/* Total Kesalahan */}
                          <td className="py-2.5 px-3 text-center">
                            {student.totalMistakes > 0 ? (
                              <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                {student.totalMistakes}x salah
                              </span>
                            ) : (
                              <span className="font-bold text-emerald-600">0 (Sempurna)</span>
                            )}
                          </td>

                          {/* Waktu Main */}
                          <td className="py-2.5 px-3 text-center font-bold text-slate-600">
                            {student.totalTimeSeconds}s
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-3 text-center">
                            {renderStatusBadge(student.status)}
                          </td>

                          {/* Terakhir Aktif */}
                          <td className="py-2.5 px-3 text-right text-[11px] text-slate-500">
                            {student.lastActive}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="pt-2 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1">
              <span>
                Menampilkan <b>{filteredStudents.length}</b> dari {totalStudents} murid
                terdaftar di kelas.
              </span>
              <span className="font-medium">
                💡 Status 🟢 Mahir (Rerata ≥80%), 🟡 Butuh Bimbingan (50–79%), 🔴 Remedial (&lt;50% atau &gt;5 salah).
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PEDAGOGY & 4 LEARNING OBJECTIVES (Fase B SD) */}
        {/* ============================================================== */}
        {activeTab === 'pedagogy' && (
          <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TP 1 */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-amber-950">
                        TP 1: Mengenali Pecahan (Level 1)
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        Taksonomi SOLO: Unistructural
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    Loyang Pizza
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Murid dapat mengenali representasi visual pecahan berpembilang satu (1/2, 1/4, 1/8)
                  dan berpenyebut sama (2/4, 3/8) menggunakan irisan loyang pizza nyata.
                </p>
              </div>
              <div className="mt-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <b>Panduan Bimbingan:</b> Jika murid kesulitan, ajak menghitung total bagian utuh
                sebagai angka penyebut (bawah), dan irisan yang diambil sebagai pembilang (atas).
              </div>
            </div>

            {/* TP 2 */}
            <div className="bg-white p-4 rounded-2xl border-2 border-orange-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700">
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-orange-950">
                        TP 2: Mengurutkan Pecahan (Level 2)
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        Taksonomi SOLO: Multistructural
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full">
                    Batang Cokelat
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Murid menyusun pecahan dari nilai terkecil ke terbesar (1/8 ➔ 1/4 ➔ 1/2).
                  Mengatasi miskonsepsi umum anak bahwa penyebut besar berarti potongan lebih besar.
                </p>
              </div>
              <div className="mt-3 bg-orange-50 p-2.5 rounded-xl border border-orange-200 text-[11px] text-orange-900">
                <b>Panduan Bimbingan:</b> Ingatkan analogi: Semakin banyak teman yang berbagi 1 batang
                cokelat, semakin kecil potongan yang didapat tiap orang (1/8 lebih kecil dari 1/2).
              </div>
            </div>

            {/* TP 3 */}
            <div className="bg-white p-4 rounded-2xl border-2 border-pink-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-700">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-pink-950">
                        TP 3: Pecahan Senilai (Level 3)
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        Taksonomi SOLO: Multistructural
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-pink-100 text-pink-900 px-2 py-0.5 rounded-full">
                    Kotak Donat 6 &amp; 8
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Murid menemukan pasangan pecahan senilai (misal: 1/2 kotak setara dengan 3 donat
                  dari Kotak Isi 6, atau 4 donat dari Kotak Isi 8).
                </p>
              </div>
              <div className="mt-3 bg-pink-50 p-2.5 rounded-xl border border-pink-200 text-[11px] text-pink-900">
                <b>Panduan Bimbingan:</b> Tunjukkan bahwa 3/6 dan 4/8 sama-sama menghabiskan tepat separuh
                (1/2) dari kotak donat, meskipun jumlah donat satuannya berbeda.
              </div>
            </div>

            {/* TP 4 */}
            <div className="bg-white p-4 rounded-2xl border-2 border-purple-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-purple-950">
                        TP 4: Membandingkan Pecahan (Level 4)
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        Taksonomi SOLO: Relational
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                    Puding &amp; Kue Tar
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Murid mengevaluasi relasi dua pecahan untuk memilih potongan yang lebih besar atau
                  lebih kecil dengan membandingkan pembilang atau penyebutnya.
                </p>
              </div>
              <div className="mt-3 bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-[11px] text-purple-900">
                <b>Panduan Bimbingan:</b> Jika pembilang sama, pilih penyebut terkecil untuk potongan
                terbesar. Jika penyebut sama, pilih pembilang terbesar untuk potongan terbanyak.
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CLOUD & GOOGLE SHEETS INTEGRATION */}
        {/* ============================================================== */}
        {activeTab === 'cloud' && (
          <div className="flex-1 p-4 overflow-y-auto max-w-2xl mx-auto flex flex-col justify-center">
            <div className="bg-white p-5 rounded-3xl border-2 border-sky-300 shadow-md space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Integrasi Cloud Google Sheets (Tanpa Biaya Server)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Hubungkan game langsung ke spreadsheet Google Sheets akun guru via Apps Script.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 block">
                  URL Webhook Google Apps Script / Endpoint:
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="w-full py-2 px-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                />
                <p className="text-[11px] text-slate-500">
                  Data setiap kali murid menyelesaikan level akan otomatis dikirimkan ke Google Sheets ini secara *real-time*.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSaveWebhook}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black shadow-xs transition"
                >
                  Simpan Konfigurasi
                </button>
                <button
                  onClick={handleCloudSync}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Uji Kirim Data Sekarang</span>
                </button>
              </div>

              <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 text-xs text-sky-900 space-y-1">
                <b className="block">Cara Setup Google Apps Script:</b>
                <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                  <li>Buka Google Sheets baru di Google Drive Anda.</li>
                  <li>Klik <b>Extensions ➔ Apps Script</b>, lalu tempel fungsi <code>doPost(e)</code>.</li>
                  <li>Deploy sebagai <b>Web App</b> dengan akses <i>Anyone</i>.</li>
                  <li>Salin URL Web App dan tempel di kotak input di atas!</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL KONFIRMASI RESET KELAS DENGAN PIN */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-rose-500 p-5 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-2">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Konfirmasi Reset Kelas</h3>
            <p className="text-xs text-slate-600 mt-1">
              Tindakan ini akan <b>menghapus seluruh rekaman nilai murid</b> untuk memulai kelas baru.
              Ketik PIN Guru untuk melanjutkan:
            </p>

            <form onSubmit={handleConfirmReset} className="w-full mt-3 space-y-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={resetPinInput}
                onChange={(e) => {
                  setResetPinInput(e.target.value);
                  setResetPinError(false);
                }}
                placeholder="PIN 6 digit"
                autoFocus
                className="w-36 mx-auto tracking-widest text-center text-xl font-black py-1.5 px-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-rose-500"
              />

              {resetPinError && (
                <span className="text-xs font-bold text-rose-500 block">
                  PIN salah! Reset dibatalkan.
                </span>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Ya, Hapus Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
