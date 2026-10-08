import React, { useState, useEffect, useRef } from 'react';
import { GameLevel, CustomerOrder, PlatedItem, SessionReportItem, StudentProfile } from '../types/game';
import { CustomerQueue } from './CustomerQueue';
import { ServingCounter } from './ServingCounter';
import { KitchenStation } from './KitchenStation';
import { CorrectionModal } from './CorrectionModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { RecipeBookModal } from './RecipeBookModal';
import { SuccessBurstVFX } from './SuccessBurstVFX';
import { generateCustomerOrder } from '../services/levelData';
import { sound } from '../services/soundEffects';
import { Clock, Coins, Award, BookOpen, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

interface GameScreenProps {
  level: GameLevel;
  profile: StudentProfile;
  onUpdateProfile: (newProfile: StudentProfile) => void;
  onSaveSessionReport: (report: SessionReportItem) => void;
  onBackToMap: () => void;
  onNextLevel?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  level,
  profile,
  onUpdateProfile,
  onSaveSessionReport,
  onBackToMap,
  onNextLevel,
}) => {
  // Game states
  const [timeLeft, setTimeLeft] = useState<number>(level.timeLimitSeconds);
  const [score, setScore] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [isPaused] = useState<boolean>(false);
  const [isLevelFinished, setIsLevelFinished] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());

  // Customer queue (up to 3 customers)
  const [customers, setCustomers] = useState<CustomerOrder[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const orderCountRef = useRef<number>(0);

  // Plated item
  const [plated, setPlated] = useState<PlatedItem>({ dishType: 'pizza' });

  // Modals & VFX
  const [correctionCustomer, setCorrectionCustomer] = useState<CustomerOrder | null>(null);
  const [showRecipeBook, setShowRecipeBook] = useState<boolean>(false);
  const [showSuccessBurst, setShowSuccessBurst] = useState<boolean>(false);

  // Guard to ensure VFX is always destroyed and cannot block clicks
  useEffect(() => {
    if (showSuccessBurst) {
      const timer = setTimeout(() => setShowSuccessBurst(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [showSuccessBurst]);

  // Statistics for teacher report
  const [sessionStats, setSessionStats] = useState({
    totalOrders: 0,
    correctOrders: 0,
    wrongOrders: 0,
    basicCorrect: 0,
    basicTotal: 0,
    equivCorrect: 0,
    equivTotal: 0,
    decCorrect: 0,
    decTotal: 0,
    orderTimes: [] as number[],
  });

  const lastOrderStartTimeRef = useRef<number>(Date.now());

  // Initialize customers and BGM on start
  useEffect(() => {
    sound.startBGM(false);

    // Initial 2 customers
    const initial1 = generateCustomerOrder(level.id, 0);
    const initial2 = generateCustomerOrder(level.id, 1);
    orderCountRef.current = 2;
    setCustomers([initial1, initial2]);
    setSelectedCustomerId(initial1.id);
    lastOrderStartTimeRef.current = Date.now();

    return () => {
      sound.stopBGM();
    };
  }, [level.id]);

  // Timer loop
  useEffect(() => {
    if (isPaused || isLevelFinished || correctionCustomer !== null || showRecipeBook) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishLevel();
          return 0;
        }

        // Trigger rush hour tempo when less than 30s left
        if (prev <= 31) {
          sound.setRushHour(true);
        }

        return prev - 1;
      });

      // Update customers patience
      setCustomers((prevCusts) => {
        return prevCusts.map((c) => {
          const nextPatience = Math.max(0, c.patience - 1);
          // If customer patience runs out, renew customer gently
          if (nextPatience === 0) {
            sound.playBoing();
            orderCountRef.current += 1;
            return generateCustomerOrder(level.id, orderCountRef.current);
          }
          return { ...c, patience: nextPatience };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isLevelFinished, correctionCustomer, showRecipeBook, level.id]);

  // Finish level and calculate stars & report
  const finishLevel = () => {
    sound.playWhistle();
    sound.stopBGM();
    setIsLevelFinished(true);

    // Calculate stars
    let stars = 1;
    if (score >= level.starThresholds[2]) {
      stars = 3;
    } else if (score >= level.starThresholds[1]) {
      stars = 2;
    }

    // Save session report for teacher
    const avgTime =
      sessionStats.orderTimes.length > 0
        ? sessionStats.orderTimes.reduce((a, b) => a + b, 0) / sessionStats.orderTimes.length
        : 7.5;

    const basicAcc =
      sessionStats.basicTotal > 0
        ? Math.round((sessionStats.basicCorrect / sessionStats.basicTotal) * 100)
        : 100;
    const equivAcc =
      sessionStats.equivTotal > 0
        ? Math.round((sessionStats.equivCorrect / sessionStats.equivTotal) * 100)
        : 100;
    const decAcc =
      sessionStats.decTotal > 0
        ? Math.round((sessionStats.decCorrect / sessionStats.decTotal) * 100)
        : 100;

    const report: SessionReportItem = {
      id: `session_${Date.now()}`,
      studentName: profile.name,
      levelId: level.id,
      score,
      coins: coinsEarned,
      stars,
      totalOrders: sessionStats.totalOrders,
      correctOrders: sessionStats.correctOrders,
      wrongOrders: sessionStats.wrongOrders,
      basicAccuracy: basicAcc,
      equivalentAccuracy: equivAcc,
      decimalPercentAccuracy: decAcc,
      averageTimeSeconds: parseFloat(avgTime.toFixed(1)),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onSaveSessionReport(report);

    // Update student high scores and stars
    const currentStars = profile.starsEarned[level.id] || 0;
    const currentHigh = profile.highScores[level.id] || 0;

    onUpdateProfile({
      ...profile,
      totalCoins: profile.totalCoins + coinsEarned,
      starsEarned: {
        ...profile.starsEarned,
        [level.id]: Math.max(currentStars, stars),
      },
      highScores: {
        ...profile.highScores,
        [level.id]: Math.max(currentHigh, score),
      },
    });
  };

  // Check correctness of currently plated dish against customer order
  const handleServeDish = () => {
    const targetCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
    if (!targetCustomer) return;

    let platedNumericValue = 0;
    let isCorrectDishType = false;

    if (targetCustomer.dishType === 'pizza' && plated.pizzaSlices && plated.pizzaSlices.count > 0) {
      isCorrectDishType = true;
      platedNumericValue =
        (plated.pizzaSlices.count * plated.pizzaSlices.fractionPerSlice.numerator) /
        plated.pizzaSlices.fractionPerSlice.denominator;
    } else if (targetCustomer.dishType === 'chocolate' && plated.chocolatePieces && plated.chocolatePieces > 0) {
      isCorrectDishType = true;
      platedNumericValue = plated.chocolatePieces / 4;
    } else if (targetCustomer.dishType === 'donut' && plated.donutCount && plated.donutCount > 0) {
      isCorrectDishType = true;
      platedNumericValue = plated.donutCount / 6;
    } else if (targetCustomer.dishType === 'juice' && plated.juiceVolume !== undefined && plated.juiceVolume > 0) {
      isCorrectDishType = true;
      platedNumericValue = plated.juiceVolume;
    }

    // Compare with small floating point tolerance (e.g. 0.03)
    const isValueEqual = Math.abs(platedNumericValue - targetCustomer.targetNumericValue) < 0.03;
    const isCorrect = isCorrectDishType && isValueEqual;

    const timeSpent = (Date.now() - lastOrderStartTimeRef.current) / 1000;
    lastOrderStartTimeRef.current = Date.now();

    // Update stats
    setSessionStats((prev) => {
      const nextTimes = [...prev.orderTimes, timeSpent];
      return {
        ...prev,
        totalOrders: prev.totalOrders + 1,
        correctOrders: prev.correctOrders + (isCorrect ? 1 : 0),
        wrongOrders: prev.wrongOrders + (isCorrect ? 0 : 1),
        basicCorrect: prev.basicCorrect + (isCorrect && targetCustomer.category === 'basic' ? 1 : 0),
        basicTotal: prev.basicTotal + (targetCustomer.category === 'basic' ? 1 : 0),
        equivCorrect: prev.equivCorrect + (isCorrect && targetCustomer.category === 'equivalent' ? 1 : 0),
        equivTotal: prev.equivTotal + (targetCustomer.category === 'equivalent' ? 1 : 0),
        decCorrect: prev.decCorrect + (isCorrect && targetCustomer.category === 'decimal_percent' ? 1 : 0),
        decTotal: prev.decTotal + (targetCustomer.category === 'decimal_percent' ? 1 : 0),
        orderTimes: nextTimes,
      };
    });

    if (isCorrect) {
      // SUCCESS!
      sound.playKaching();
      sound.playYay();
      setShowSuccessBurst(true);

      const orderCoins = 10;
      const orderPoints = 20;

      setCoinsEarned((prev) => prev + orderCoins);
      setScore((prev) => prev + orderPoints);

      // Clear plate
      setPlated({ dishType: 'pizza' });

      // Remove served customer and introduce next customer
      orderCountRef.current += 1;
      const nextCustomer = generateCustomerOrder(level.id, orderCountRef.current);

      setCustomers((prev) => {
        const remaining = prev.filter((c) => c.id !== targetCustomer.id);
        const updated = [...remaining, nextCustomer];
        // Select next customer
        setSelectedCustomerId(updated[0]?.id || null);
        return updated;
      });
    } else {
      // MISTAKE
      sound.playBoing();
      const updatedFailed = targetCustomer.failedAttempts + 1;

      // Update customer failed attempts
      setCustomers((prev) =>
        prev.map((c) => (c.id === targetCustomer.id ? { ...c, failedAttempts: updatedFailed } : c))
      );

      // If failed >= 2 times on this customer, trigger Correction Pause!
      if (updatedFailed >= 2) {
        setCorrectionCustomer(targetCustomer);
      }
    }
  };

  const handleClearPlate = () => {
    sound.playClick();
    setPlated({ dishType: 'pizza' });
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0] || null;

  return (
    <div className="w-full h-full bg-[#118AB2]/15 flex flex-col overflow-hidden select-none relative">
      {/* 1. TOP HEADER STATUS BAR (Compact 5.5% height, z-10) */}
      <div className="h-[5.5%] min-h-[28px] max-h-[32px] shrink-0 bg-white/95 border-b-2 border-amber-300 px-2 sm:px-4 flex items-center justify-between shadow-xs z-10">
        {/* Left: Back Button & Currency */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={() => {
              if (window.confirm('Keluar dari sesi memasak ini dan kembali ke peta level?')) {
                sound.playClick();
                onBackToMap();
              }
            }}
            className="p-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg transition active:scale-95"
            title="Kembali ke Peta"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-[10px] sm:text-xs font-black text-amber-950 hidden md:inline">
              {level.areaName}
            </span>
            <div className="flex items-center gap-1 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-300">
              <Coins className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] sm:text-[11px] font-black text-amber-900">{coinsEarned}</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-300">
              <Award className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] sm:text-[11px] font-black text-emerald-900">{score}</span>
            </div>
          </div>
        </div>

        {/* Center: Student Name */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-extrabold text-amber-900">
          <span>👨‍🍳 {profile.name}</span>
        </div>

        {/* Right: Recipe Book Helper & Level Timer */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setShowRecipeBook(true);
            }}
            className="flex items-center gap-1 px-2 py-0.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-lg text-[10px] font-black transition shadow-xs"
            title="Buku Resep Pecahan"
          >
            <BookOpen className="w-3 h-3" />
            <span className="hidden sm:inline">Buku Resep</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            title="Suara"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          {/* Level Timer */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-black text-[10px] sm:text-[11px] border-2 ${
              timeLeft <= 30
                ? 'bg-rose-500 text-white border-rose-300 animate-pulse'
                : 'bg-sky-100 text-sky-950 border-sky-300'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ZONA ATAS (40% LAYAR): AREA ANTREAN PELANGGAN & BALON PESANAN (PRD Spec: Kendala A) */}
      {/* Dedicated 40% area with highest Z-index so order bubbles are never overlapped or cut off */}
      <div className="h-[40%] shrink-0 w-full bg-gradient-to-b from-sky-100/90 via-sky-50 to-amber-50/70 px-2 pt-1 pb-2 sm:pb-3 relative flex items-center justify-center overflow-hidden z-20">
        <CustomerQueue
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={(id) => {
            sound.playClick();
            setSelectedCustomerId(id);
          }}
          onOpenHelpForCustomer={(cust) => setCorrectionCustomer(cust)}
        />
      </div>

      {/* 3. ZONA BAWAH (54.5% LAYAR): MEJA SAJI (~15.3%) + AREA DAPUR (~39.2%) */}
      <div className="h-[54.5%] shrink-0 w-full flex flex-col overflow-hidden z-10">
        {/* A. Meja Saji (Konter) - 28% of Zona Bawah (~15.3% of total screen) */}
        <div className="h-[28%] shrink-0 w-full overflow-hidden">
          <ServingCounter
            plated={plated}
            selectedCustomer={activeCustomer}
            onClearPlate={handleClearPlate}
            onServeDish={handleServeDish}
          />
        </div>

        {/* B. Area Dapur Interaktif - 72% of Zona Bawah (~39.2% of total screen) */}
        <div className="h-[72%] shrink-0 w-full overflow-hidden">
          <KitchenStation
            levelId={level.id}
            plated={plated}
            onUpdatePlated={(newPlated) => setPlated(newPlated)}
          />
        </div>
      </div>

      {/* MODALS */}
      {/* Correction Pause (Koki Master) */}
      {correctionCustomer && (
        <CorrectionModal
          customer={correctionCustomer}
          onClose={() => setCorrectionCustomer(null)}
        />
      )}

      {/* Recipe Book Encyclopedia */}
      {showRecipeBook && <RecipeBookModal onClose={() => setShowRecipeBook(false)} />}

      {/* Success Burst VFX on correct serving (100% pointer-events-none, never blocks clicks) */}
      {showSuccessBurst && (
        <SuccessBurstVFX onComplete={() => setShowSuccessBurst(false)} />
      )}

      {/* Level Finished Modal */}
      {isLevelFinished && (
        <LevelCompleteModal
          level={level}
          score={score}
          coinsEarned={coinsEarned}
          correctOrders={sessionStats.correctOrders}
          totalOrders={sessionStats.totalOrders}
          stars={
            score >= level.starThresholds[2]
              ? 3
              : score >= level.starThresholds[1]
              ? 2
              : 1
          }
          onReplay={() => {
            setTimeLeft(level.timeLimitSeconds);
            setScore(0);
            setCoinsEarned(0);
            setCustomers([]);
            setIsLevelFinished(false);
            setPlated({ dishType: 'pizza' });
            // re-init
            const c1 = generateCustomerOrder(level.id, 0);
            const c2 = generateCustomerOrder(level.id, 1);
            orderCountRef.current = 2;
            setCustomers([c1, c2]);
            setSelectedCustomerId(c1.id);
            sound.startBGM(false);
          }}
          onNextLevel={onNextLevel}
          onBackToMap={onBackToMap}
        />
      )}
    </div>
  );
};
