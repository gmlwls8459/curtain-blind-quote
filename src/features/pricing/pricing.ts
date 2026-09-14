import type {
  PackageId,
  QuoteBreakdown,
  QuoteInput,
  PricingSettings,
} from './types';

/** Convert width/height to meters based on unit */
export function toMeters(value: number, unit: 'cm' | 'mm'): number {
  if (unit === 'mm') return value / 1000;
  return value / 100;
}

/** Area in m² for one panel */
export function calcAreaM2(
  width: number,
  height: number,
  unit: 'cm' | 'mm',
): number {
  const w = toMeters(width, unit);
  const h = toMeters(height, unit);
  return Math.max(0, w * h);
}

/** Round to nearest `step` won (default 1000) */
export function roundToStep(n: number, step: number): number {
  const s = step > 0 ? step : 1000;
  return Math.round(n / s) * s;
}

export function isLayeredIncluded(
  packageId: PackageId,
  settings: PricingSettings,
): boolean {
  if (packageId === 'suite') return settings.layeredIncludedInSuite;
  if (packageId === 'home') return settings.layeredIncludedInHome;
  return false;
}

/**
 * 사이즈 배수:
 *   refArea = (기준가로cm/100)×(기준세로cm/100)
 *   sizeFactor = clamp(실면적/기준면적, min, max)
 * sizeAdjustmentEnabled=false 이면 1
 */
export function calcSizeFactor(
  areaM2: number,
  settings: PricingSettings,
): number {
  if (!settings.sizeAdjustmentEnabled) return 1;
  const ref =
    (settings.sizeRefWidthCm / 100) * (settings.sizeRefHeightCm / 100);
  if (ref <= 0) return 1;
  const raw = areaM2 / ref;
  const min = settings.sizeFactorMin;
  const max = settings.sizeFactorMax;
  return Math.min(max, Math.max(min, raw));
}

/**
 * D'MOTIVE WINDOW 패키지 견적 공식 (기획 가정):
 *
 *   창 1식 =
 *     packageBase[package]
 *     × lineMultiplier
 *     × categoryMultiplier
 *     × sizeFactor
 *     + layeredFee (선택·미포함 패키지만)
 *     + motorFee (선택 시)
 *     + installFee (설치 포함 시)
 *
 *   합계원금 = 창1식 × 수량
 *   → roundTo 단위 반올림
 *   VAT: 별도 = 합계×(1+vat) / 포함 = 합계가 이미 VAT 포함
 */
export function calculateQuote(
  input: QuoteInput,
  settings: PricingSettings,
): QuoteBreakdown {
  const areaM2 = calcAreaM2(input.width, input.height, input.unit);
  const quantity = Math.max(0, Math.floor(Number(input.quantity)) || 0);

  const packageBase = settings.packageBases[input.packageId] ?? 0;
  const band = settings.packageBands[input.packageId] ?? {
    min: packageBase,
    max: packageBase,
  };
  const lineMultiplier = settings.lineMultipliers[input.lineId] ?? 1;
  const categoryMultiplier =
    settings.categoryMultipliers[input.category] ?? 1;
  const sizeFactor = calcSizeFactor(areaM2, settings);

  const afterMultipliers =
    packageBase * lineMultiplier * categoryMultiplier * sizeFactor;

  const layeredIncluded = isLayeredIncluded(input.packageId, settings);
  const layeredFee =
    input.layered && !layeredIncluded
      ? settings.layeredFeeRoom
      : 0;

  const motorFee = input.motorized ? settings.motorFeePerUnit : 0;
  const installFee =
    input.install === 'included' ? settings.installFeePerUnit : 0;

  const perWindow = afterMultipliers + layeredFee + motorFee + installFee;
  const rawTotal = perWindow * quantity;

  let subtotal: number;
  let vat: number;
  let total: number;

  if (input.vatMode === 'exclusive') {
    subtotal = rawTotal;
    vat = rawTotal * settings.vatRate;
    total = rawTotal + vat;
  } else {
    total = rawTotal;
    subtotal = settings.vatRate > 0 ? rawTotal / (1 + settings.vatRate) : rawTotal;
    vat = total - subtotal;
  }

  const roundedTotal = roundToStep(total, settings.roundTo);

  return {
    areaM2: Math.round(areaM2 * 10000) / 10000,
    packageBase,
    bandMin: band.min,
    bandMax: band.max,
    lineMultiplier,
    categoryMultiplier,
    sizeFactor: Math.round(sizeFactor * 1000) / 1000,
    afterMultipliers,
    layeredFee,
    layeredIncluded,
    motorFee,
    installFee,
    perWindow,
    quantity,
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

export function formatMan(n: number): string {
  const man = n / 10_000;
  const formatted = new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: man % 1 === 0 ? 0 : 1,
  }).format(man);
  return `${formatted}만`;
}

export function formatBand(min: number, max: number): string {
  return `${formatMan(min)}~${formatMan(max)}`;
}

export function formatNumber(n: number, digits = 2): string {
  return new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(n);
}
