/**
 * Game Types for "Toko Pecahan Ceria"
 */

export type DishType = 'pizza' | 'chocolate' | 'donut' | 'juice';

export interface FractionValue {
  numerator: number;
  denominator: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  avatarSeed: number;
  dishType: DishType;
  promptText: string; // Text on speech bubble
  hintText: string; // Explanatory text for correction modal
  verticalFraction?: FractionValue;
  decimalValue?: number; // e.g. 0.5, 0.25, 0.75, 1.0
  percentValue?: number; // e.g. 25, 50, 75, 100
  // Target numeric value (0 to 1) for checking correctness
  targetNumericValue: number;
  // Category for teacher report accuracy
  category: 'basic' | 'equivalent' | 'decimal_percent';
  // Extra comparison info if applicable
  isComparisonQuestion?: boolean;
  comparisonOptions?: { label: string; fraction: FractionValue; value: number }[];
  patience: number; // Current patience in seconds
  maxPatience: number; // Max patience
  failedAttempts: number; // Counter for correction pause trigger (>= 2)
}

export interface PlatedItem {
  dishType: DishType;
  pizzaSlices?: {
    fractionPerSlice: FractionValue; // e.g. 1/2, 1/4, 1/8
    count: number;
  };
  chocolatePieces?: number; // out of 4 (e.g. 1/4 each)
  donutCount?: number; // out of 6 (e.g. 1/6 each)
  juiceVolume?: number; // 0.0 to 1.0
}

export interface GameLevel {
  id: number;
  title: string;
  subtitle: string;
  areaName: string;
  description: string;
  timeLimitSeconds: number;
  unlockedByDefault: boolean;
  dishTypes: DishType[];
  targetScore: number;
  starThresholds: [number, number, number]; // e.g. [30, 60, 90]
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
  basicAccuracy: number;
  equivalentAccuracy: number;
  decimalPercentAccuracy: number;
  averageTimeSeconds: number;
  date: string;
}

export interface StudentProfile {
  name: string;
  totalCoins: number;
  starsEarned: Record<number, number>; // levelId -> stars
  highScores: Record<number, number>; // levelId -> score
}
