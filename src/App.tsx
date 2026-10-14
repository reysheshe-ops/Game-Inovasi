/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameLevel, SessionReportItem, StudentProfile, StudentRecord } from './types/game';
import { GAME_LEVELS } from './services/levelData';
import { LoadingScreen } from './components/LoadingScreen';
import { MainMenu } from './components/MainMenu';
import { LevelSelectMap } from './components/LevelSelectMap';
import { GameScreen } from './components/GameScreen';
import { RecipeBookModal } from './components/RecipeBookModal';
import { TeacherReportModal } from './components/TeacherReportModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { OfflineIndicator } from './components/PWAInstallButton';

const INITIAL_PROFILE: StudentProfile = {
  name: 'Koki Cilik',
  teamName: 'Tim Merah',
  avatarEmoji: '👨‍🍳',
  totalCoins: 0,
  starsEarned: { 1: 0, 2: 0, 3: 0, 4: 0 },
  highScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
};

// Initial realistic class ledger data for teachers
const DEFAULT_CLASS_RECORDS: StudentRecord[] = [
  {
    id: 'std_1',
    studentName: 'Budi Pratama',
    teamName: 'Tim Merah',
    avatarEmoji: '👨‍🍳',
    scoreL1: 120,
    scoreL2: 130,
    scoreL3: 140,
    scoreL4: 150,
    totalMistakes: 1,
    totalTimeSeconds: 145,
    status: 'Mahir',
    lastActive: 'Hari ini, 09:15',
  },
  {
    id: 'std_2',
    studentName: 'Siti Rahma',
    teamName: 'Tim Biru',
    avatarEmoji: '👩‍🍳',
    scoreL1: 100,
    scoreL2: 110,
    scoreL3: 90,
    scoreL4: 120,
    totalMistakes: 2,
    totalTimeSeconds: 160,
    status: 'Mahir',
    lastActive: 'Hari ini, 09:22',
  },
  {
    id: 'std_3',
    studentName: 'Doni Saputra',
    teamName: 'Tim Kuning',
    avatarEmoji: '🦁',
    scoreL1: 80,
    scoreL2: 70,
    scoreL3: 60,
    scoreL4: 80,
    totalMistakes: 4,
    totalTimeSeconds: 190,
    status: 'Butuh Bimbingan',
    lastActive: 'Hari ini, 09:30',
  },
  {
    id: 'std_4',
    studentName: 'Rani Maharani',
    teamName: 'Tim Hijau',
    avatarEmoji: '⭐',
    scoreL1: 110,
    scoreL2: 120,
    scoreL3: 130,
    scoreL4: 140,
    totalMistakes: 1,
    totalTimeSeconds: 155,
    status: 'Mahir',
    lastActive: 'Hari ini, 09:35',
  },
  {
    id: 'std_5',
    studentName: 'Edo Firmansyah',
    teamName: 'Tim Ungu',
    avatarEmoji: '🦊',
    scoreL1: 50,
    scoreL2: 40,
    scoreL3: 30,
    scoreL4: 40,
    totalMistakes: 6,
    totalTimeSeconds: 220,
    status: 'Remedial',
    lastActive: 'Hari ini, 09:40',
  },
  {
    id: 'std_6',
    studentName: 'Maya Kusuma',
    teamName: 'Tim Oranye',
    avatarEmoji: '🐱',
    scoreL1: 90,
    scoreL2: 85,
    scoreL3: 75,
    scoreL4: 95,
    totalMistakes: 3,
    totalTimeSeconds: 175,
    status: 'Butuh Bimbingan',
    lastActive: 'Hari ini, 09:45',
  },
];

export default function App() {
  const [screen, setScreen] = useState<'loading' | 'main_menu' | 'level_map' | 'in_game'>('loading');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [showRecipeBook, setShowRecipeBook] = useState<boolean>(false);
  const [showTeacherReport, setShowTeacherReport] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('tokoperahan_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  // Class Ledger Records state
  const [classStudents, setClassStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tokoperahan_class_students');
      return saved ? JSON.parse(saved) : DEFAULT_CLASS_RECORDS;
    } catch {
      return DEFAULT_CLASS_RECORDS;
    }
  });

  // Session Reports state
  const [sessionReports, setSessionReports] = useState<SessionReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('tokoperahan_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tokoperahan_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Save class students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tokoperahan_class_students', JSON.stringify(classStudents));
    } catch {}
  }, [classStudents]);

  // Save reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tokoperahan_reports', JSON.stringify(sessionReports));
    } catch {}
  }, [sessionReports]);

  // Check URL parameters for direct teacher access (?mode=guru or #guru)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      if (search.includes('guru') || hash.includes('guru')) {
        setShowTeacherReport(true);
      }
    }
  }, []);

  // Check if student has registered their name and team
  const handleLoadingComplete = () => {
    setScreen('main_menu');
    const hasNamed = localStorage.getItem('tokoperahan_has_named');
    if (!hasNamed) {
      setShowLoginModal(true);
    }
  };

  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
  };

  const handleSaveStudentRegistration = (data: {
    name: string;
    teamName: string;
    avatarEmoji: string;
  }) => {
    setProfile((prev) => ({
      ...prev,
      name: data.name,
      teamName: data.teamName,
      avatarEmoji: data.avatarEmoji,
    }));
    localStorage.setItem('tokoperahan_has_named', 'true');

    // Register or update student in the class roster
    setClassStudents((prev) => {
      const existingIdx = prev.findIndex((s) => s.studentName.toLowerCase() === data.name.toLowerCase());
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          teamName: data.teamName,
          avatarEmoji: data.avatarEmoji,
          lastActive: 'Baru saja',
        };
        return updated;
      }

      const newStudent: StudentRecord = {
        id: `std_${Date.now()}`,
        studentName: data.name,
        teamName: data.teamName,
        avatarEmoji: data.avatarEmoji,
        scoreL1: 0,
        scoreL2: 0,
        scoreL3: 0,
        scoreL4: 0,
        totalMistakes: 0,
        totalTimeSeconds: 0,
        status: 'Butuh Bimbingan',
        lastActive: 'Baru saja',
      };
      return [newStudent, ...prev];
    });
  };

  // Background Tracker: Record session & update class student metrics
  const handleSaveSessionReport = (newReport: SessionReportItem) => {
    setSessionReports((prev) => [newReport, ...prev]);

    // Update class roster for this student
    setClassStudents((prev) => {
      const existingIdx = prev.findIndex(
        (s) => s.studentName.toLowerCase() === newReport.studentName.toLowerCase()
      );

      const levelScoreKey = `scoreL${newReport.levelId}` as 'scoreL1' | 'scoreL2' | 'scoreL3' | 'scoreL4';

      if (existingIdx !== -1) {
        const student = prev[existingIdx];
        const updatedScores = {
          scoreL1: newReport.levelId === 1 ? Math.max(student.scoreL1, newReport.score) : student.scoreL1,
          scoreL2: newReport.levelId === 2 ? Math.max(student.scoreL2, newReport.score) : student.scoreL2,
          scoreL3: newReport.levelId === 3 ? Math.max(student.scoreL3, newReport.score) : student.scoreL3,
          scoreL4: newReport.levelId === 4 ? Math.max(student.scoreL4, newReport.score) : student.scoreL4,
        };

        const totalMistakes = student.totalMistakes + newReport.wrongOrders;
        const totalTime = student.totalTimeSeconds + Math.round(newReport.averageTimeSeconds * newReport.totalOrders);

        // Calculate mastery status
        const avgScores =
          (updatedScores.scoreL1 + updatedScores.scoreL2 + updatedScores.scoreL3 + updatedScores.scoreL4) / 4;
        let status: 'Mahir' | 'Butuh Bimbingan' | 'Remedial' = 'Mahir';
        if (totalMistakes > 5 || avgScores < 50) {
          status = 'Remedial';
        } else if (totalMistakes >= 3 || avgScores < 80) {
          status = 'Butuh Bimbingan';
        }

        const updatedStudent: StudentRecord = {
          ...student,
          ...updatedScores,
          totalMistakes,
          totalTimeSeconds: totalTime,
          status,
          lastActive: 'Hari ini',
        };

        const copy = [...prev];
        copy[existingIdx] = updatedStudent;
        return copy;
      } else {
        const newStudent: StudentRecord = {
          id: `std_${Date.now()}`,
          studentName: newReport.studentName,
          teamName: profile.teamName,
          avatarEmoji: profile.avatarEmoji || '👨‍🍳',
          scoreL1: newReport.levelId === 1 ? newReport.score : 0,
          scoreL2: newReport.levelId === 2 ? newReport.score : 0,
          scoreL3: newReport.levelId === 3 ? newReport.score : 0,
          scoreL4: newReport.levelId === 4 ? newReport.score : 0,
          totalMistakes: newReport.wrongOrders,
          totalTimeSeconds: Math.round(newReport.averageTimeSeconds * newReport.totalOrders),
          status: newReport.wrongOrders <= 1 ? 'Mahir' : 'Butuh Bimbingan',
          lastActive: 'Hari ini',
        };
        return [newStudent, ...prev];
      }
    });

    // Optional background auto-sync to cloud if configured
    try {
      const webhookUrl = localStorage.getItem('tokoperahan_webhook_url');
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: profile.name,
            teamName: profile.teamName,
            report: newReport,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      }
    } catch {}
  };

  const handleClearClassData = () => {
    setClassStudents([]);
    setSessionReports([]);
    try {
      localStorage.removeItem('tokoperahan_class_students');
      localStorage.removeItem('tokoperahan_reports');
    } catch {}
  };

  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const activeLevel = GAME_LEVELS.find((l) => l.id === activeLevelId) || GAME_LEVELS[0];

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900 flex items-center justify-center select-none font-['Fredoka',sans-serif] text-slate-800 relative">
      {/* Portrait Notice if device is held vertically */}
      {isPortrait && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-amber-500/95 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-lg border border-amber-300 flex items-center gap-1.5 animate-bounce pointer-events-none">
          <span>🔄</span>
          <span>Putar perangkat ke mode Mendatar (Landscape 16:9)</span>
        </div>
      )}

      {/* Strict 16:9 Landscape Aspect Ratio Container to fit 100% of the game in 1 single page */}
      <div className="w-full max-w-[calc(100vh*16/9)] h-full max-h-[calc(100vw*9/16)] aspect-[16/9] bg-amber-50 relative overflow-hidden shadow-2xl flex flex-col">
        {/* 1. Loading Screen */}
        {screen === 'loading' && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}

        {/* 2. Main Menu */}
        {screen === 'main_menu' && (
          <MainMenu
            profile={profile}
            onStartGame={() => setScreen('level_map')}
            onOpenRecipeBook={() => setShowRecipeBook(true)}
            onOpenTeacherReport={() => setShowTeacherReport(true)}
            onUpdateProfileName={(name) => handleSaveStudentRegistration({ name, teamName: profile.teamName, avatarEmoji: profile.avatarEmoji || '👨‍🍳' })}
            onPromptLogin={() => setShowLoginModal(true)}
          />
        )}

        {/* 3. Level Selection Map */}
        {screen === 'level_map' && (
          <LevelSelectMap
            levels={GAME_LEVELS}
            profile={profile}
            onSelectLevel={(lvlId) => {
              setActiveLevelId(lvlId);
              setScreen('in_game');
            }}
            onOpenRecipeBook={() => setShowRecipeBook(true)}
            onOpenTeacherReport={() => setShowTeacherReport(true)}
            onBackToMenu={() => setScreen('main_menu')}
          />
        )}

        {/* 4. Active Gameplay Screen */}
        {screen === 'in_game' && (
          <GameScreen
            level={activeLevel}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onSaveSessionReport={handleSaveSessionReport}
            onBackToMap={() => setScreen('level_map')}
            onNextLevel={
              activeLevel.id < 4
                ? () => {
                    setActiveLevelId(activeLevel.id + 1);
                  }
                : undefined
            }
          />
        )}

        {/* Student Name & Team Login Pop-up (Mandatory registration per PRD 3.A) */}
        {showLoginModal && (
          <StudentLoginModal
            currentName={profile.name}
            currentTeam={profile.teamName}
            currentAvatar={profile.avatarEmoji}
            onSaveProfile={(data) => {
              handleSaveStudentRegistration(data);
              setShowLoginModal(false);
            }}
            onClose={() => setShowLoginModal(false)}
            isFirstLogin={!localStorage.getItem('tokoperahan_has_named')}
          />
        )}

        {/* Shared Modals */}
        {showRecipeBook && (
          <RecipeBookModal onClose={() => setShowRecipeBook(false)} />
        )}

        {/* Full-featured Teacher Dashboard with Team Tracking & 6-digit PIN */}
        {showTeacherReport && (
          <TeacherReportModal
            currentProfile={profile}
            sessionReports={sessionReports}
            classStudents={classStudents}
            onUpdateClassStudents={setClassStudents}
            onClearClassData={handleClearClassData}
            onClose={() => setShowTeacherReport(false)}
          />
        )}

        {/* Non-intrusive offline indicator for PWA */}
        <OfflineIndicator />
      </div>
    </div>
  );
}
