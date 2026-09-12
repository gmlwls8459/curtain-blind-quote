export type Category =
  | 'curtain'
  | 'roll'
  | 'wood'
  | 'combi'
  | 'blackout';

export type Opacity = 'normal' | 'blackout' | 'sheer';
export type InstallOption = 'included' | 'excluded';
export type Fullness = 1.5 | 2;
export type Unit = 'cm' | 'mm';
export type VatMode = 'exclusive' | 'inclusive';

export interface PricingSettings {
  unitPrices: Record<Category, number>; // 원/m²
  opacityMultipliers: Record<Opacity, number>;
  installFeePerUnit: number; // 원 (설치비/개)
  motorFeePerUnit: number; // 원 (전동화 추가비/개)
  fullnessOptions: Fullness[];
  vatRate: number; // 0.1 = 10%
  label: string;
}

export interface QuoteInput {
  category: Category;
  width: number;
  height: number;
  unit: Unit;
  quantity: number;
  opacity: Opacity;
  install: InstallOption;
  motorized: boolean;
  fullness: Fullness;
  customerName: string;
  memo: string;
  vatMode: VatMode;
}

export interface QuoteBreakdown {
  areaM2: number;
  unitPrice: number;
  baseAmount: number;
  fullnessMultiplier: number;
  opacityMultiplier: number;
  afterMultipliers: number;
  installFee: number;
  motorFee: number;
  subtotal: number; // VAT 전 (별도 모드) 또는 VAT 포함 가격의 공급가액
  vat: number;
  total: number;
  roundedTotal: number;
}

export interface SavedQuote {
  id: string;
  createdAt: string;
  updatedAt: string;
  input: QuoteInput;
  breakdown: QuoteBreakdown;
  label: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  curtain: '커튼',
  roll: '롤블라인드',
  wood: '우드블라인드',
  combi: '콤비블라인드',
  blackout: '암막커튼',
};

export const OPACITY_LABELS: Record<Opacity, string> = {
  normal: '일반',
  blackout: '암막',
  sheer: '쉬어',
};

export const INSTALL_LABELS: Record<InstallOption, string> = {
  included: '포함',
  excluded: '미포함',
};

export const FULLNESS_LABELS: Record<string, string> = {
  '1.5': '1.5배',
  '2': '2배',
};

/** Categories that support curtain fullness (주름배수) */
export const CURTAIN_CATEGORIES: Category[] = ['curtain', 'blackout'];

/** Categories that support motorization */
export const MOTOR_CATEGORIES: Category[] = ['roll', 'wood', 'combi'];
