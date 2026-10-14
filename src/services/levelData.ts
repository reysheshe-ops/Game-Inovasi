import { GameLevel, CustomerOrder } from '../types/game';

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: 'Kedai Pizza Pecahan Dasar',
    subtitle: 'Mengenali Pecahan Berpembilang Satu',
    areaName: 'Level 1: Kedai Pizza Dasar',
    cognitiveFocus: 'Unistructural',
    description: 'Kenali potongan visual pecahan berpembilang satu dan berpenyebut sama (1/2, 1/4, 1/8, 2/4, 3/8).',
    timeLimitSeconds: 120, // 2 Menit
    unlockedByDefault: true,
    dishTypes: ['pizza'],
    targetScore: 50,
    starThresholds: [40, 80, 120],
  },
  {
    id: 2,
    title: 'Kafe Cokelat Urutan',
    subtitle: 'Mengurutkan Pecahan Terkecil ke Terbesar',
    areaName: 'Level 2: Kafe Cokelat Urutan',
    cognitiveFocus: 'Multistructural',
    description: 'Urutkan potongan cokelat dari nilai terkecil ke terbesar (1/8 -> 1/4 -> 1/2) di atas piring saji!',
    timeLimitSeconds: 140, // 2 Menit 20 Detik
    unlockedByDefault: false,
    dishTypes: ['chocolate'],
    targetScore: 60,
    starThresholds: [50, 90, 130],
  },
  {
    id: 3,
    title: 'Kedai Donat Pecahan Senilai',
    subtitle: 'Menemukan Pasangan Pecahan Senilai',
    areaName: 'Level 3: Kedai Donat Senilai',
    cognitiveFocus: 'Multistructural',
    description: 'Penuhi pesanan dengan memilih donat dari Kotak Isi 6 atau Kotak Isi 8 (1/2 = 3/6 = 4/8)!',
    timeLimitSeconds: 150, // 2.5 Menit
    unlockedByDefault: false,
    dishTypes: ['donut'],
    targetScore: 70,
    starThresholds: [60, 100, 150],
  },
  {
    id: 4,
    title: 'Restoran Kue & Puding Banding',
    subtitle: 'Membandingkan Dua Pecahan (Lebih Besar & Kecil)',
    areaName: 'Level 4: Restoran Puding & Kue',
    cognitiveFocus: 'Relational',
    description: 'Bandingkan dua pecahan (pembilang satu atau penyebut sama) untuk menentukan potongan yang lebih besar/kecil!',
    timeLimitSeconds: 160, // 2 Menit 40 Detik
    unlockedByDefault: false,
    dishTypes: ['pudding'],
    targetScore: 80,
    starThresholds: [70, 110, 160],
  },
];

const CUSTOMER_NAMES = ['Budi', 'Siti', 'Doni', 'Kiki', 'Rani', 'Edo', 'Lina', 'Aris', 'Fajar', 'Maya'];

export function generateCustomerOrder(levelId: number, orderIndex: number): CustomerOrder {
  const name = CUSTOMER_NAMES[(orderIndex + Math.floor(Math.random() * 4)) % CUSTOMER_NAMES.length];
  const avatarSeed = orderIndex % 4;
  const id = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // ==========================================
  // LEVEL 1: UNISTRUCTURAL - Mengenali Pecahan
  // Menu: Pizza (Dibagi 2, 4, 8)
  // ==========================================
  if (levelId === 1) {
    const templates = [
      {
        promptText: 'Beri aku 1/4 bagian pizza!',
        hintText: 'Pilih loyang potong 4, lalu ambil 1 potong (1/4)!',
        verticalFraction: { numerator: 1, denominator: 4 },
        targetNumericValue: 1 / 4,
        category: 'unistructural' as const,
      },
      {
        promptText: 'Tolong berikan aku 1/2 bagian pizza hangat!',
        hintText: 'Pilih loyang potong 2, ambil 1 potong (atau loyang 4 ambil 2 potong)!',
        verticalFraction: { numerator: 1, denominator: 2 },
        targetNumericValue: 1 / 2,
        category: 'unistructural' as const,
      },
      {
        promptText: 'Aku mau 1/8 bagian pizza renyah!',
        hintText: 'Pilih loyang potong 8, lalu ambil 1 potong (1/8)!',
        verticalFraction: { numerator: 1, denominator: 8 },
        targetNumericValue: 1 / 8,
        category: 'unistructural' as const,
      },
      {
        promptText: 'Beri aku 2/4 bagian pizza lezat!',
        hintText: 'Pilih loyang potong 4, lalu ambil 2 potong (2/4)!',
        verticalFraction: { numerator: 2, denominator: 4 },
        targetNumericValue: 2 / 4,
        category: 'unistructural' as const,
      },
      {
        promptText: 'Aku minta 3/8 bagian pizza gurih!',
        hintText: 'Pilih loyang potong 8, lalu ambil 3 potong (3/8)!',
        verticalFraction: { numerator: 3, denominator: 8 },
        targetNumericValue: 3 / 8,
        category: 'unistructural' as const,
      },
      {
        promptText: 'Tolong siapkan 3/4 bagian pizza!',
        hintText: 'Pilih loyang potong 4, lalu ambil 3 potong (3/4)!',
        verticalFraction: { numerator: 3, denominator: 4 },
        targetNumericValue: 3 / 4,
        category: 'unistructural' as const,
      },
    ];

    const chosen = templates[orderIndex % templates.length];
    return {
      id,
      customerName: name,
      avatarSeed,
      dishType: 'pizza',
      patience: 45,
      maxPatience: 45,
      failedAttempts: 0,
      ...chosen,
    };
  }

  // ==========================================
  // LEVEL 2: MULTISTRUCTURAL - Mengurutkan Pecahan
  // Menu: Cokelat Batang (1/8, 1/4, 1/2)
  // Mekanik: Mengisi slot piring berurutan dari terkecil ke terbesar
  // ==========================================
  if (levelId === 2) {
    const templates = [
      {
        promptText: 'Urutkan potongan cokelat dari nilai TERKECIL ke TERBESAR!',
        hintText: 'Ingat! Semakin besar penyebut, potongan semakin KECIL: 1/8 < 1/4 < 1/2. Letakkan 1/8 di Slot 1, 1/4 di Slot 2, dan 1/2 di Slot 3!',
        targetSequence: [
          { numerator: 1, denominator: 8 },
          { numerator: 1, denominator: 4 },
          { numerator: 1, denominator: 2 },
        ],
        verticalFraction: { numerator: 1, denominator: 8 },
        targetNumericValue: 1 / 8 + 1 / 4 + 1 / 2,
        category: 'multistructural_ordering' as const,
      },
      {
        promptText: 'Susun 3 cokelat dari yang paling KECIL: 1/8, lalu 1/4, lalu 1/2!',
        hintText: 'Urutan benar: Slot 1 = 1/8, Slot 2 = 1/4, Slot 3 = 1/2!',
        targetSequence: [
          { numerator: 1, denominator: 8 },
          { numerator: 1, denominator: 4 },
          { numerator: 1, denominator: 2 },
        ],
        verticalFraction: { numerator: 1, denominator: 4 },
        targetNumericValue: 1 / 8 + 1 / 4 + 1 / 2,
        category: 'multistructural_ordering' as const,
      },
      {
        promptText: 'Aku mau cokelat terurut dari porsi TERKECIL ke TERBESAR!',
        hintText: 'Susun berurutan: 1/8 (paling kecil), 1/4 (sedang), 1/2 (paling besar)!',
        targetSequence: [
          { numerator: 1, denominator: 8 },
          { numerator: 1, denominator: 4 },
          { numerator: 1, denominator: 2 },
        ],
        verticalFraction: { numerator: 1, denominator: 2 },
        targetNumericValue: 1 / 8 + 1 / 4 + 1 / 2,
        category: 'multistructural_ordering' as const,
      },
    ];

    const chosen = templates[orderIndex % templates.length];
    return {
      id,
      customerName: name,
      avatarSeed,
      dishType: 'chocolate',
      patience: 45,
      maxPatience: 45,
      failedAttempts: 0,
      ...chosen,
    };
  }

  // ==========================================
  // LEVEL 3: MULTISTRUCTURAL - Pecahan Senilai
  // Menu: Kotak Donat (Kotak Isi 6 & Kotak Isi 8)
  // Mekanik: Mengambil dari stok berpenyebut berbeda untuk mencapai nilai pesanan
  // ==========================================
  if (levelId === 3) {
    const templates = [
      {
        promptText: 'Aku pesan 1/2 kotak donat!',
        hintText: '1/2 kotak bisa kamu ambil 3 donat dari Kotak Isi 6 (3/6 = 1/2) ATAU 4 donat dari Kotak Isi 8 (4/8 = 1/2)! Keduanya bernilai sama!',
        verticalFraction: { numerator: 1, denominator: 2 },
        targetNumericValue: 0.5,
        acceptedValues: [3 / 6, 4 / 8],
        category: 'multistructural_equivalent' as const,
      },
      {
        promptText: 'Beri aku 1/4 kotak donat ceria!',
        hintText: 'Ambil 2 donat dari Kotak Isi 8, karena 2/8 senilai dengan 1/4!',
        verticalFraction: { numerator: 1, denominator: 4 },
        targetNumericValue: 0.25,
        acceptedValues: [2 / 8],
        category: 'multistructural_equivalent' as const,
      },
      {
        promptText: 'Tolong siapkan 1/3 kotak donat manis!',
        hintText: 'Ambil 2 donat dari Kotak Isi 6, karena 2/6 senilai dengan 1/3!',
        verticalFraction: { numerator: 1, denominator: 3 },
        targetNumericValue: 2 / 6,
        acceptedValues: [2 / 6],
        category: 'multistructural_equivalent' as const,
      },
      {
        promptText: 'Aku mau 3/4 kotak donat lezat!',
        hintText: 'Ambil 6 donat dari Kotak Isi 8, karena 6/8 senilai dengan 3/4!',
        verticalFraction: { numerator: 3, denominator: 4 },
        targetNumericValue: 0.75,
        acceptedValues: [6 / 8],
        category: 'multistructural_equivalent' as const,
      },
      {
        promptText: 'Pesan 2/3 kotak donat ya!',
        hintText: 'Ambil 4 donat dari Kotak Isi 6, karena 4/6 senilai dengan 2/3!',
        verticalFraction: { numerator: 2, denominator: 3 },
        targetNumericValue: 4 / 6,
        acceptedValues: [4 / 6],
        category: 'multistructural_equivalent' as const,
      },
    ];

    const chosen = templates[orderIndex % templates.length];
    return {
      id,
      customerName: name,
      avatarSeed,
      dishType: 'donut',
      patience: 42,
      maxPatience: 42,
      failedAttempts: 0,
      ...chosen,
    };
  }

  // ==========================================
  // LEVEL 4: RELATIONAL - Membandingkan Pecahan
  // Menu: Kue Tar / Puding Buah
  // Mekanik: Evaluasi dua pecahan (Lebih Besar / Lebih Kecil)
  // ==========================================
  const templatesLevel4 = [
    {
      promptText: 'Beri aku potongan yang LEBIH BESAR antara 1/4 atau 1/3 puding!',
      hintText: 'Pembilang sama (1), bandingkan penyebut: 3 lebih kecil dari 4, jadi potongan 1/3 LEBIH BESAR daripada 1/4! Sajikan 1/3.',
      verticalFraction: { numerator: 1, denominator: 3 },
      targetNumericValue: 1 / 3,
      comparisonDetails: {
        optionA: { fraction: { numerator: 1, denominator: 4 }, value: 1 / 4 },
        optionB: { fraction: { numerator: 1, denominator: 3 }, value: 1 / 3 },
        requirement: 'larger' as const,
        correctFraction: { numerator: 1, denominator: 3 },
      },
      category: 'relational_comparison' as const,
    },
    {
      promptText: 'Aku lapar! Tolong potongan yang LEBIH BESAR antara 1/2 atau 1/4 puding!',
      hintText: '1/2 puding (setengah) jelas LEBIH BESAR daripada 1/4 (seperempat)! Sajikan 1/2.',
      verticalFraction: { numerator: 1, denominator: 2 },
      targetNumericValue: 1 / 2,
      comparisonDetails: {
        optionA: { fraction: { numerator: 1, denominator: 2 }, value: 1 / 2 },
        optionB: { fraction: { numerator: 1, denominator: 4 }, value: 1 / 4 },
        requirement: 'larger' as const,
        correctFraction: { numerator: 1, denominator: 2 },
      },
      category: 'relational_comparison' as const,
    },
    {
      promptText: 'Aku ingin porsi yang LEBIH KECIL antara 1/4 atau 1/8 puding buah!',
      hintText: 'Penyebut 8 lebih besar dari 4, artinya kue dibagi 8 potongan kecil! Maka 1/8 LEBIH KECIL daripada 1/4. Sajikan 1/8.',
      verticalFraction: { numerator: 1, denominator: 8 },
      targetNumericValue: 1 / 8,
      comparisonDetails: {
        optionA: { fraction: { numerator: 1, denominator: 4 }, value: 1 / 4 },
        optionB: { fraction: { numerator: 1, denominator: 8 }, value: 1 / 8 },
        requirement: 'smaller' as const,
        correctFraction: { numerator: 1, denominator: 8 },
      },
      category: 'relational_comparison' as const,
    },
    {
      promptText: 'Beri aku potongan yang LEBIH BESAR antara 2/5 atau 4/5 kue tar!',
      hintText: 'Penyebutnya sama-sama 5! Bandingkan pembilangnya: 4 lebih besar dari 2, jadi 4/5 LEBIH BESAR daripada 2/5! Sajikan 4/5.',
      verticalFraction: { numerator: 4, denominator: 5 },
      targetNumericValue: 4 / 5,
      comparisonDetails: {
        optionA: { fraction: { numerator: 2, denominator: 5 }, value: 2 / 5 },
        optionB: { fraction: { numerator: 4, denominator: 5 }, value: 4 / 5 },
        requirement: 'larger' as const,
        correctFraction: { numerator: 4, denominator: 5 },
      },
      category: 'relational_comparison' as const,
    },
    {
      promptText: 'Tolong potongan yang LEBIH KECIL antara 3/6 atau 1/6 puding!',
      hintText: 'Penyebutnya sama (6)! Pembilang 1 lebih kecil dari 3, jadi 1/6 LEBIH KECIL daripada 3/6! Sajikan 1/6.',
      verticalFraction: { numerator: 1, denominator: 6 },
      targetNumericValue: 1 / 6,
      comparisonDetails: {
        optionA: { fraction: { numerator: 3, denominator: 6 }, value: 3 / 6 },
        optionB: { fraction: { numerator: 1, denominator: 6 }, value: 1 / 6 },
        requirement: 'smaller' as const,
        correctFraction: { numerator: 1, denominator: 6 },
      },
      category: 'relational_comparison' as const,
    },
    {
      promptText: 'Beri aku potongan yang LEBIH BESAR antara 1/6 atau 1/2 puding manis!',
      hintText: 'Setengah (1/2) jauh LEBIH BESAR daripada satu perenam (1/6)! Sajikan 1/2.',
      verticalFraction: { numerator: 1, denominator: 2 },
      targetNumericValue: 1 / 2,
      comparisonDetails: {
        optionA: { fraction: { numerator: 1, denominator: 6 }, value: 1 / 6 },
        optionB: { fraction: { numerator: 1, denominator: 2 }, value: 1 / 2 },
        requirement: 'larger' as const,
        correctFraction: { numerator: 1, denominator: 2 },
      },
      category: 'relational_comparison' as const,
    },
  ];

  const chosen = templatesLevel4[orderIndex % templatesLevel4.length];
  return {
    id,
    customerName: name,
    avatarSeed,
    dishType: 'pudding',
    patience: 40,
    maxPatience: 40,
    failedAttempts: 0,
    ...chosen,
  };
}
