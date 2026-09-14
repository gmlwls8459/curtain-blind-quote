import type { PricingSettings, QuoteInput } from './types';

/**
 * D'MOTIVE WINDOW 기획 가정 단가
 * — PPT 밴드 안 적정가 (ROOM 70 / SUITE 180 / HOME 400만). 라인·품목 배수는 1.0
 */
export const DEFAULT_SETTINGS: PricingSettings = {
  label: '적정 가정 단가',
  packageBases: {
    room: 700_000,
    suite: 1_800_000,
    home: 4_000_000,
  },
  packageBands: {
    room: { min: 450_000, max: 1_200_000 },
    suite: { min: 1_500_000, max: 2_800_000 },
    home: { min: 3_500_000, max: 6_500_000 },
  },
  lineMultipliers: {
    livingSoft: 1.0,
    sleepDark: 1.0,
    showLuxury: 1.0,
  },
  categoryMultipliers: {
    curtain: 1.0,
    roll: 1.0,
    wood: 1.0,
    combi: 1.0,
    blackout: 1.0,
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
  settings: 'curtain-blind-quote:settings:v3',
  quotes: 'curtain-blind-quote:quotes:v2',
} as const;
