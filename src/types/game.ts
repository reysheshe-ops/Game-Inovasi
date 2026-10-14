/**
 * Game Types for "Toko Pecahan Ceria"
 * Designed according to SD Fase B Mathematics Learning Objectives (SOLO Taxonomy)
 */

export type DishType = 'pizza' | 'chocolate' | 'donut' | 'pudding';

export const TEAM_OPTIONS = [
  { id: 'merah', name: 'Tim Merah', color: 'bg-rose-500', textColor: 'text-rose-600', badgeColor: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'biru', name: 'Tim Biru', color: 'bg-sky-500', textColor: 'text-sky-600', badgeColor: 'bg-sky-100 border-sky-300 text-sky-800' },
  { id: 'kuning', name: 'Tim Kuning', color: 'bg-amber-400', textColor: 'text-amber-600', badgeColor: 'bg-amber-100 border-amber-300 text-amber-900' },
  { id: 'hijau', name: 'Tim Hijau', color: 'bg-emerald-500', textColor: 'text-emerald-600', badgeColor: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
  { id: 'ungu', name: 'Tim Ungu', color: 'bg-purple-500', textColor: 'text-purple-600', badgeColor: 'bg-purple-100 border-purple-300 text-purple-800' },
  { id: 'oranye', name: 'Tim Oranye', color: 'bg-orange-500', textColor: 'text-orange-600', badgeColor: 'bg-orange-100 border-orange-300 text-orange-800' },
];

export interface FractionValue {
  numerator: number;
  denominator: number;
}

export interface ComparisonDetail {
  optionA: { fraction: FractionValue; value: number };
  optionB: { fraction: FractionValue; value: number };
  requirement: 'larger' | 'smaller';
  correctFraction: FractionValue;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  avatarSeed: number;
  dishType: DishType;
  promptText: string;
  hintText: string;
  verticalFraction?: FractionValue;
  targetNumericValue: number;
  targetSequence?: FractionValue[];
  acceptedValues?: number[];
  comparisonDetails?: ComparisonDetail;
  category:
    | 'unistructural'
    | 'multistructural_ordering'
    | 'multistructural_equivalent'
    | 'relational_comparison';
  patience: number;
  maxPatience: number;
  failedAttempts: number;
}

export interface PlatedItem {
  dishType: DishType;
  pizzaSlices?: {
    fractionPerSlice: FractionValue;
    count: number;
  };
  chocolateSlots?: (FractionValue | null)[];
  donutBox?: {
    boxType: 6 | 8;
    count: number;
  };
  puddingChoice?: {
    fraction: FractionValue;
    value: number;
  };
}

export interface GameLevel {
  id: number;
  title: string;
  subtitle: string;
  areaName: string;
  cognitiveFocus: 'Unistructural' | 'Multistructural' | 'Relational';
  description: string;
  timeLimitSeconds: number;
  unlockedByDefault: boolean;
  dishTypes: DishType[];
  targetScore: number;
  starThresholds: [number, number, number];
}

export interface SessionReportItem {
  id: string;
  studentName: string;
  teamName: string;
  levelId: number;
  score: number;
  coins: number;
  stars: number;
  totalOrders: number;
  correctOrders: number;
  wrongOrders: number;
  level1Accuracy: number;
  level2Accuracy: number;
  level3Accuracy: number;
  level4Accuracy: number;
  averageTimeSeconds: number;
  date: string;
}

export interface StudentProfile {
  name: string;
  teamName: string;
  avatarEmoji?: string;
  totalCoins: number;
  starsEarned: Record<number, number>; // levelId -> stars (1..4)
  highScores: Record<number, number>; // levelId -> score (1..4)
}

export interface StudentRecord {
  id: string;
  studentName: string;
  teamName: string;
  avatarEmoji: string;
  scoreL1: number;
  scoreL2: number;
  scoreL3: number;
  scoreL4: number;
  totalMistakes: number;
  totalTimeSeconds: number;
  status: 'Mahir' | 'Butuh Bimbingan' | 'Remedial';
  lastActive: string;
}
