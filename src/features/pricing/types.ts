export type PackageId = 'room' | 'suite' | 'home';
export type LineId = 'livingSoft' | 'sleepDark' | 'showLuxury';
export type Category =
  | 'curtain'
  | 'roll'
  | 'wood'
  | 'combi'
  | 'blackout';

export type InstallOption = 'included' | 'excluded';
export type Unit = 'cm' | 'mm';
export type VatMode = 'exclusive' | 'inclusive';

export interface PackageBand {
  min: number;
  max: number;
}

export interface PricingSettings {
  /** 단가 라벨 — UI에 「기획 가정 단가」 등으로 표시 */
  label: string;
  /** 패키지 기본가 (원, 창 1식 기준) */
  packageBases: Record<PackageId, number>;
  /** 패키지 가격대 (표시용 참고 밴드) */
  packageBands: Record<PackageId, PackageBand>;
  /** 라인(톤) 배수 */
  lineMultipliers: Record<LineId, number>;
  /** 품목 배수 (소폭, 기본 1.0) */
  categoryMultipliers: Record<Category, number>;
  /** ROOM 패키지에서 레이어드(쉬어+암막) 선택 시 가산 (원/식) */
  layeredFeeRoom: number;
  /** SUITE에 레이어드 기본 포함 여부 */
  layeredIncludedInSuite: boolean;
  /** HOME에 레이어드 기본 포함 여부 */
  layeredIncludedInHome: boolean;
  /** 전동·스마트허브 가산 (원/식) */
  motorFeePerUnit: number;
  /** 설치비 (원/식, 별도 포함 선택 시) */
  installFeePerUnit: number;
  /** 규격(면적)에 따른 패키지 가·감 적용 여부 */
  sizeAdjustmentEnabled: boolean;
  /** 기준 가로(cm) — 패키지 기본가 가정 규격 */
  sizeRefWidthCm: number;
  /** 기준 세로(cm) */
  sizeRefHeightCm: number;
  /** 사이즈 배수 하한 */
  sizeFactorMin: number;
  /** 사이즈 배수 상한 */
  sizeFactorMax: number;
  /** 부가세율 (0.1 = 10%) */
  vatRate: number;
  /** 반올림 단위 (원) */
  roundTo: number;
}

export interface QuoteInput {
  packageId: PackageId;
  lineId: LineId;
  category: Category;
  width: number;
  height: number;
  unit: Unit;
  quantity: number;
  layered: boolean;
  motorized: boolean;
  install: InstallOption;
  customerName: string;
  memo: string;
  vatMode: VatMode;
}

export interface QuoteBreakdown {
  areaM2: number;
  packageBase: number;
  bandMin: number;
  bandMax: number;
  lineMultiplier: number;
  categoryMultiplier: number;
  sizeFactor: number;
  afterMultipliers: number;
  layeredFee: number;
  layeredIncluded: boolean;
  motorFee: number;
  installFee: number;
  perWindow: number;
  quantity: number;
  subtotal: number;
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

export const PACKAGE_LABELS: Record<PackageId, string> = {
  room: 'ROOM',
  suite: 'SUITE',
  home: 'HOME',
};

export const PACKAGE_SUBTITLES: Record<PackageId, string> = {
  room: '단창·부분 공간',
  suite: '안방 완성 표준',
  home: '전 주택 윈도우',
};

export const LINE_LABELS: Record<LineId, string> = {
  livingSoft: 'Living Soft',
  sleepDark: 'Sleep Dark',
  showLuxury: 'Show Luxury',
};

export const LINE_HINTS: Record<LineId, string> = {
  livingSoft: '주간 채광 · 부드러운 분위기',
  sleepDark: '암막 · 숙면 · 프라이버시',
  showLuxury: '쇼룸급 연출 · 하이엔드 원단',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  curtain: '커튼',
  roll: '롤블라인드',
  wood: '우드블라인드',
  combi: '콤비블라인드',
  blackout: '암막커튼',
};

export const INSTALL_LABELS: Record<InstallOption, string> = {
  included: '포함',
  excluded: '미포함',
};
