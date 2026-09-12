import type {
  Category,
  QuoteBreakdown,
  QuoteInput,
  PricingSettings,
} from './types';
import { CURTAIN_CATEGORIES, MOTOR_CATEGORIES } from './types';

/** Convert width/height to meters based on unit */
export function toMeters(value: number, unit: 'cm' | 'mm'): number {
  if (unit === 'mm') return value / 1000;
  return value / 100;
}

/** Area in m² for one panel */
export function calcAreaM2(width: number, height: number, unit: 'cm' | 'mm'): number {
  const w = toMeters(width, unit);
  const h = toMeters(height, unit);
  return Math.max(0, w * h);
}

/** Round to nearest 100 won */
export function roundTo100(n: number): number {
  return Math.round(n / 100) * 100;
}

export function supportsFullness(category: Category): boolean {
  return CURTAIN_CATEGORIES.includes(category);
}

export function supportsMotor(category: Category): boolean {
  return MOTOR_CATEGORIES.includes(category);
}

/**
 * 견적 공식:
 *   기본 = 단가(원/m²) × 면적(m²) × 수량 × 주름배수 × 불투명도배수
 *   + 설치비(포함 시) + 전동화비(해당 시)
 *   → 100원 단위 반올림
 *   VAT: 별도 = 합계×1.1 / 포함 = 합계가 이미 VAT 포함
 */
export function calculateQuote(
  input: QuoteInput,
  settings: PricingSettings
): QuoteBreakdown {
  const areaM2 = calcAreaM2(input.width, input.height, input.unit);
  const unitPrice = settings.unitPrices[input.category] ?? 0;
  const quantity = Math.max(0, Math.floor(Number(input.quantity)) || 0);

  const fullnessMultiplier = supportsFullness(input.category)
    ? input.fullness
    : 1;
  const opacityMultiplier =
    settings.opacityMultipliers[input.opacity] ?? 1;

  const baseAmount = unitPrice * areaM2 * quantity;
  const afterMultipliers =
    baseAmount * fullnessMultiplier * opacityMultiplier;

  const installFee =
    input.install === 'included'
      ? settings.installFeePerUnit * quantity
      : 0;

  const motorFee =
    supportsMotor(input.category) && input.motorized
      ? settings.motorFeePerUnit * quantity
      : 0;

  const rawTotal = afterMultipliers + installFee + motorFee;

  let subtotal: number;
  let vat: number;
  let total: number;

  if (input.vatMode === 'exclusive') {
    // 부가세 별도: raw가 공급가액
    subtotal = rawTotal;
    vat = rawTotal * settings.vatRate;
    total = rawTotal + vat;
  } else {
    // 부가세 포함: raw가 이미 VAT 포함 가격
    total = rawTotal;
    subtotal = rawTotal / (1 + settings.vatRate);
    vat = total - subtotal;
  }

  const roundedTotal = roundTo100(total);

  return {
    areaM2: Math.round(areaM2 * 10000) / 10000,
    unitPrice,
    baseAmount,
    fullnessMultiplier,
    opacityMultiplier,
    afterMultipliers,
    installFee,
    motorFee,
    subtotal,
    vat,
    total,
    roundedTotal,
  };
}

export function formatKRW(n: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatNumber(n: number, digits = 2): string {
  return new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(n);
}
