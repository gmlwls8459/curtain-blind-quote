import type { PricingSettings, QuoteInput } from './types';

/**
 * D'MOTIVE WINDOW 기획 가정 단가
 * — 사업아이디어 PPT 패키지 밴드 + 마진 PPT SUITE 예시(220만) 기준
 */
export const DEFAULT_SETTINGS: PricingSettings = {
  label: '기획 가정 단가',
  packageBases: {
    room: 800_000,
    suite: 2_200_000,
    home: 5_000_000,
  },
  packageBands: {
    room: { min: 450_000, max: 1_200_000 },
    suite: { min: 1_500_000, max: 2_800_000 },
    home: { min: 3_500_000, max: 6_500_000 },
  },
  lineMultipliers: {
    livingSoft: 1.0,
    sleepDark: 1.08,
    showLuxury: 1.15,
  },
  categoryMultipliers: {
    curtain: 1.0,
    roll: 1.0,
    wood: 1.05,
    combi: 1.0,
    blackout: 1.02,
  },
  layeredFeeRoom: 100_000,
  layeredIncludedInSuite: true,
  layeredIncludedInHome: true,
  motorFeePerUnit: 500_000,
  installFeePerUnit: 0,
  sizeAdjustmentEnabled: false,
  sizeRefWidthCm: 200,
  sizeRefHeightCm: 230,
  sizeFactorMin: 0.7,
  sizeFactorMax: 1.4,
  vatRate: 0.1,
  roundTo: 1000,
};

export const DEFAULT_INPUT: QuoteInput = {
  packageId: 'suite',
  lineId: 'livingSoft',
  category: 'curtain',
  width: 200,
  height: 230,
  unit: 'cm',
  quantity: 1,
  layered: true,
  motorized: false,
  install: 'excluded',
  customerName: '',
  memo: '',
  vatMode: 'exclusive',
};

export const STORAGE_KEYS = {
  settings: 'curtain-blind-quote:settings:v2',
  quotes: 'curtain-blind-quote:quotes:v2',
} as const;
