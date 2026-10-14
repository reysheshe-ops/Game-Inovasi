/**
 * Game Types for "Toko Pecahan Ceria"
 * Designed according to SD Fase B Mathematics Learning Objectives (SOLO Taxonomy)
 */

export type DishType = 'pizza' | 'chocolate' | 'donut' | 'pudding';

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
  promptText: string; // Speech bubble text
  hintText: string; // Master Chef hint for correction pause
  verticalFraction?: FractionValue;
  // Target numeric value (0 to 1) for checking correctness
  targetNumericValue: number;
  // For Level 2 (Ordering): Target sequence of fractions in ascending order
  targetSequence?: FractionValue[];
  // For Level 3 (Equivalent Fractions): Accepted numerical values (e.g. 0.5 can be 3/6 or 4/8)
  acceptedValues?: number[];
  // For Level 4 (Comparison):
  comparisonDetails?: ComparisonDetail;
  // Category for pedagogical report
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
  // Level 1: Pizza
  pizzaSlices?: {
    fractionPerSlice: FractionValue;
    count: number;
  };
  // Level 2: Chocolate ordering (3 slots: [slot1, slot2, slot3])
  chocolateSlots?: (FractionValue | null)[];
  // Level 3: Donut boxes (box of 6 or box of 8)
  donutBox?: {
    boxType: 6 | 8;
    count: number;
  };
  // Level 4: Pudding comparison choice
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
  levelId: number;
  score: number;
  coins: number;
  stars: number;
  totalOrders: number;
  correctOrders: number;
  wrongOrders: number;
  level1Accuracy: number; // Mengenali Pecahan
  level2Accuracy: number; // Mengurutkan Pecahan
  level3Accuracy: number; // Pecahan Senilai
  level4Accuracy: number; // Membandingkan Pecahan
  averageTimeSeconds: number;
  date: string;
}

export interface StudentProfile {
  name: string;
  totalCoins: number;
  starsEarned: Record<number, number>; // levelId -> stars (1..4)
  highScores: Record<number, number>; // levelId -> score (1..4)
}
