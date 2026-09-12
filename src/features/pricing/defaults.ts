import type { PricingSettings, QuoteInput } from './types';

/** 샘플 단가 — 한국 시장 대략적 참고가 (실제 시세와 다를 수 있음) */
export const DEFAULT_SETTINGS: PricingSettings = {
  label: '샘플 단가',
  unitPrices: {
    curtain: 35_000, // 커튼 원/m²
    roll: 45_000, // 롤블라인드
    wood: 85_000, // 우드블라인드
    combi: 55_000, // 콤비블라인드
    blackout: 55_000, // 암막커튼
  },
  opacityMultipliers: {
    normal: 1.0,
    blackout: 1.3,
    sheer: 0.85,
  },
  installFeePerUnit: 30_000, // 설치비/개
  motorFeePerUnit: 120_000, // 전동화 추가비/개
  fullnessOptions: [1.5, 2],
  vatRate: 0.1,
};

export const DEFAULT_INPUT: QuoteInput = {
  category: 'curtain',
  width: 200,
  height: 230,
  unit: 'cm',
  quantity: 1,
  opacity: 'normal',
  install: 'included',
  motorized: false,
  fullness: 2,
  customerName: '',
  memo: '',
  vatMode: 'exclusive',
};

export const STORAGE_KEYS = {
  settings: 'curtain-blind-quote:settings',
  quotes: 'curtain-blind-quote:quotes',
} as const;
