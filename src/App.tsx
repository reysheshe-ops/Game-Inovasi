/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameLevel, SessionReportItem, StudentProfile } from './types/game';
import { GAME_LEVELS } from './services/levelData';
import { LoadingScreen } from './components/LoadingScreen';
import { MainMenu } from './components/MainMenu';
import { LevelSelectMap } from './components/LevelSelectMap';
import { GameScreen } from './components/GameScreen';
import { RecipeBookModal } from './components/RecipeBookModal';
import { TeacherReportModal } from './components/TeacherReportModal';
import { OfflineIndicator } from './components/PWAInstallButton';

const INITIAL_PROFILE: StudentProfile = {
  name: 'Koki Budi',
  totalCoins: 0,
  starsEarned: { 1: 0, 2: 0, 3: 0 },
  highScores: { 1: 0, 2: 0, 3: 0 },
};

export default function App() {
  const [screen, setScreen] = useState<'loading' | 'main_menu' | 'level_map' | 'in_game'>('loading');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [showRecipeBook, setShowRecipeBook] = useState<boolean>(false);
  const [showTeacherReport, setShowTeacherReport] = useState<boolean>(false);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('tokoperahan_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
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
    } catch {
      // storage unavailable or full
    }
  }, [profile]);

  // Save reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tokoperahan_reports', JSON.stringify(sessionReports));
    } catch {
      // storage unavailable or full
    }
  }, [sessionReports]);

  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
  };

  const handleUpdateProfileName = (newName: string) => {
    setProfile((prev) => ({ ...prev, name: newName }));
  };

  const handleSaveSessionReport = (newReport: SessionReportItem) => {
    setSessionReports((prev) => [newReport, ...prev]);
  };

  const handleClearReports = () => {
    setSessionReports([]);
    try {
      localStorage.removeItem('tokoperahan_reports');
    } catch {
      // ignore
    }
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
          <LoadingScreen onComplete={() => setScreen('main_menu')} />
        )}

        {/* 2. Main Menu */}
        {screen === 'main_menu' && (
          <MainMenu
            profile={profile}
            onStartGame={() => setScreen('level_map')}
            onOpenRecipeBook={() => setShowRecipeBook(true)}
            onOpenTeacherReport={() => setShowTeacherReport(true)}
            onUpdateProfileName={handleUpdateProfileName}
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
              activeLevel.id < 3
                ? () => {
                    setActiveLevelId(activeLevel.id + 1);
                  }
                : undefined
            }
          />
        )}

        {/* Shared Modals accessible from everywhere */}
        {showRecipeBook && (
          <RecipeBookModal onClose={() => setShowRecipeBook(false)} />
        )}

        {showTeacherReport && (
          <TeacherReportModal
            currentProfile={profile}
            sessionReports={sessionReports}
            onUpdateProfileName={handleUpdateProfileName}
            onClearReports={handleClearReports}
            onClose={() => setShowTeacherReport(false)}
          />
        )}

        {/* Non-intrusive offline indicator for PWA */}
        <OfflineIndicator />
      </div>
    </div>
  );
}
