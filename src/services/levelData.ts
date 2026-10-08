import { GameLevel, CustomerOrder } from '../types/game';

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: 'Kedai Pizza & Cokelat Dasar',
    subtitle: 'Membandingkan & Mengenal Pecahan',
    areaName: 'Area 1: Kedai Pizza Dasar',
    description: 'Pahami pecahan 1/2, 1/4, 2/4, dan bandingkan potongan pizza mana yang lebih besar!',
    timeLimitSeconds: 120, // 2 Menit
    unlockedByDefault: true,
    dishTypes: ['pizza', 'chocolate'],
    targetScore: 50,
    starThresholds: [40, 80, 120],
  },
  {
    id: 2,
    title: 'Kafe Cokelat & Donat Senilai',
    subtitle: 'Pecahan Senilai',
    areaName: 'Area 2: Kafe Donat & Cokelat',
    description: 'Temukan pecahan senilai! 4 potong dari 8 sama dengan 1/2 pizza, 2 donat dari 6 sama dengan 1/3 kotak!',
    timeLimitSeconds: 150, // 2.5 Menit
    unlockedByDefault: false,
    dishTypes: ['pizza', 'donut'],
    targetScore: 70,
    starThresholds: [50, 90, 140],
  },
  {
    id: 3,
    title: 'Restoran Minuman & Persen',
    subtitle: 'Desimal & Persen Ceria',
    areaName: 'Area 3: Restoran Minuman & Persen',
    description: 'Takari jus dengan desimal 0.25, 0.50, 0.75 dan persen 25%, 50%, 75% serta pizza persen!',
    timeLimitSeconds: 180, // 3 Menit
    unlockedByDefault: false,
    dishTypes: ['juice', 'pizza'],
    targetScore: 90,
    starThresholds: [60, 110, 160],
  },
];

const CUSTOMER_NAMES = ['Budi', 'Siti', 'Doni', 'Kiki', 'Rani', 'Edo', 'Lina', 'Aris'];

export function generateCustomerOrder(levelId: number, orderIndex: number): CustomerOrder {
  const name = CUSTOMER_NAMES[(orderIndex + Math.floor(Math.random() * 4)) % CUSTOMER_NAMES.length];
  const avatarSeed = orderIndex % 4;
  const id = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (levelId === 1) {
    // LEVEL 1: Dasar Pecahan & Perbandingan
    const templates = [
      {
        dishType: 'pizza' as const,
        promptText: 'Tolong 1/4 bagian pizza ya!',
        hintText: 'Pilih loyang potong 4, lalu ambil 1 potong pizza!',
        verticalFraction: { numerator: 1, denominator: 4 },
        targetNumericValue: 0.25,
        category: 'basic' as const,
      },
      {
        dishType: 'pizza' as const,
        promptText: 'Beri aku potongan yang LEBIH BESAR antara 1/4 atau 1/2!',
        hintText: 'Ingat: 1/2 potongannya jauh lebih besar daripada 1/4! Berikan 1/2 pizza.',
        verticalFraction: { numerator: 1, denominator: 2 },
        targetNumericValue: 0.5,
        category: 'basic' as const,
        isComparisonQuestion: true,
        comparisonOptions: [
          { label: '1/4', fraction: { numerator: 1, denominator: 4 }, value: 0.25 },
          { label: '1/2', fraction: { numerator: 1, denominator: 2 }, value: 0.5 },
        ],
      },
      {
        dishType: 'pizza' as const,
        promptText: 'Aku mau 1/2 loyang pizza lezat!',
        hintText: 'Bagi pizza menjadi 2, lalu ambil 1 potong (atau bagi 4 ambil 2 potong).',
        verticalFraction: { numerator: 1, denominator: 2 },
        targetNumericValue: 0.5,
        category: 'basic' as const,
      },
      {
        dishType: 'chocolate' as const,
        promptText: 'Aku mau 3/4 batang cokelat manis!',
        hintText: 'Ambil 3 potong dari 4 bagian cokelat (3/4 bagian).',
        verticalFraction: { numerator: 3, denominator: 4 },
        targetNumericValue: 0.75,
        category: 'basic' as const,
      },
      {
        dishType: 'chocolate' as const,
        promptText: 'Beri aku 2/4 potong cokelat!',
        hintText: 'Ambil 2 potong dari 4 bagian batang cokelat.',
        verticalFraction: { numerator: 2, denominator: 4 },
        targetNumericValue: 0.5,
        category: 'basic' as const,
      },
    ];

    const chosen = templates[orderIndex % templates.length];
    return {
      id,
      customerName: name,
      avatarSeed,
      patience: 45,
      maxPatience: 45,
      failedAttempts: 0,
      ...chosen,
    };
  }

  if (levelId === 2) {
    // LEVEL 2: Pecahan Senilai (Pizza potong 8, Donat 6 isi)
    const templates = [
      {
        dishType: 'pizza' as const,
        promptText: 'Aku mau 1/2 pizza! Tapi loyang terpotong 8, berapa potong ya?',
        hintText: 'Karena 4/8 senilai dengan 1/2, ambil 4 potong dari pizza potong 8!',
        verticalFraction: { numerator: 1, denominator: 2 },
        targetNumericValue: 0.5,
        category: 'equivalent' as const,
      },
      {
        dishType: 'donut' as const,
        promptText: 'Beri aku 1/3 kotak donat ceria!',
        hintText: 'Satu kotak ada 6 donat. 1/3 dari 6 donat adalah 2 buah donat (karena 2/6 = 1/3)! Ambil 2 donat.',
        verticalFraction: { numerator: 1, denominator: 3 },
        targetNumericValue: 2 / 6,
        category: 'equivalent' as const,
      },
      {
        dishType: 'donut' as const,
        promptText: 'Aku pesan 1/2 kotak donat!',
        hintText: 'Kotak donat berisi 6 donat. Setengah dari 6 donat adalah 3 donat (3/6 = 1/2)!',
        verticalFraction: { numerator: 1, denominator: 2 },
        targetNumericValue: 3 / 6,
        category: 'equivalent' as const,
      },
      {
        dishType: 'pizza' as const,
        promptText: 'Aku minta 1/4 pizza dari loyang potong 8!',
        hintText: '1/4 sama dengan 2/8. Ambil 2 potong dari loyang potong 8!',
        verticalFraction: { numerator: 1, denominator: 4 },
        targetNumericValue: 0.25,
        category: 'equivalent' as const,
      },
      {
        dishType: 'donut' as const,
        promptText: 'Aku pesan 2/3 kotak donat!',
        hintText: '2/3 dari 6 donat adalah 4 buah donat (karena 4/6 = 2/3)! Ambil 4 donat.',
        verticalFraction: { numerator: 2, denominator: 3 },
        targetNumericValue: 4 / 6,
        category: 'equivalent' as const,
      },
      {
        dishType: 'pizza' as const,
        promptText: 'Aku mau 3/4 pizza dari loyang potong 8!',
        hintText: '3/4 sama dengan 6/8. Ambil 6 potong dari loyang potong 8!',
        verticalFraction: { numerator: 3, denominator: 4 },
        targetNumericValue: 0.75,
        category: 'equivalent' as const,
      },
    ];

    const chosen = templates[orderIndex % templates.length];
    return {
      id,
      customerName: name,
      avatarSeed,
      patience: 40,
      maxPatience: 40,
      failedAttempts: 0,
      ...chosen,
    };
  }

  // LEVEL 3: Desimal dan Persen
  const templates = [
    {
      dishType: 'juice' as const,
      promptText: 'Tolong jus segar sebanyak 0.5 bagian ya!',
      hintText: '0.5 itu sama dengan 1/2 gelas. Tarik tuas atau tekan tombol 0.50 (garis tengah)!',
      decimalValue: 0.5,
      targetNumericValue: 0.5,
      category: 'decimal_percent' as const,
    },
    {
      dishType: 'juice' as const,
      promptText: 'Aku haus! Beri aku jus sebanyak 25% gelas.',
      hintText: '25% itu sama dengan 0.25 (seperempat gelas). Isi sampai garis 0.25 / 25%!',
      percentValue: 25,
      targetNumericValue: 0.25,
      category: 'decimal_percent' as const,
    },
    {
      dishType: 'pizza' as const,
      promptText: 'Aku mau 50% pizza hangat!',
      hintText: '50% itu sama dengan 1/2 bagian pizza (misal: 2 dari 4 potong, atau 4 dari 8 potong)!',
      percentValue: 50,
      targetNumericValue: 0.5,
      category: 'decimal_percent' as const,
    },
    {
      dishType: 'juice' as const,
      promptText: 'Tolong tuang jus sebanyak 0.75 bagian gelas!',
      hintText: '0.75 sama dengan 75% atau 3/4 gelas. Isi sampai garis 0.75!',
      decimalValue: 0.75,
      targetNumericValue: 0.75,
      category: 'decimal_percent' as const,
    },
    {
      dishType: 'juice' as const,
      promptText: 'Aku ingin segelas jus 100% PENUH!',
      hintText: '100% berarti 1.0 (satu gelas penuh)! Tarik tuas ke 1.0.',
      percentValue: 100,
      targetNumericValue: 1.0,
      category: 'decimal_percent' as const,
    },
    {
      dishType: 'pizza' as const,
      promptText: 'Beri aku 75% pizza!',
      hintText: '75% itu sama dengan 3/4 pizza (3 potong dari loyang 4, atau 6 potong dari loyang 8).',
      percentValue: 75,
      targetNumericValue: 0.75,
      category: 'decimal_percent' as const,
    },
  ];

  const chosen = templates[orderIndex % templates.length];
  return {
    id,
    customerName: name,
    avatarSeed,
    patience: 38,
    maxPatience: 38,
    failedAttempts: 0,
    ...chosen,
  };
}
