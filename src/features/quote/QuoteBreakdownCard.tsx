import type { QuoteBreakdown, QuoteInput, PricingSettings } from '../pricing/types';
import {
  CATEGORY_LABELS,
  INSTALL_LABELS,
  LINE_LABELS,
  PACKAGE_LABELS,
} from '../pricing/types';
import { formatBand, formatKRW, formatNumber } from '../pricing/pricing';

interface Props {
  input: QuoteInput;
  breakdown: QuoteBreakdown;
  settings: PricingSettings;
}

export function QuoteBreakdownCard({ input, breakdown, settings }: Props) {
  return (
    <section className="card breakdown-card" aria-live="polite">
      <div className="card-head">
        <h2>견적 내역</h2>
        <span className="badge">{settings.label}</span>
      </div>

      <dl className="meta-grid">
        <div>
          <dt>패키지</dt>
          <dd>
            {PACKAGE_LABELS[input.packageId]}
            <span className="band-ref">
              {' '}
              (참고 {formatBand(breakdown.bandMin, breakdown.bandMax)})
            </span>
          </dd>
        </div>
        <div>
          <dt>라인</dt>
          <dd>
            {LINE_LABELS[input.lineId]} (×{breakdown.lineMultiplier})
          </dd>
        </div>
        <div>
          <dt>품목</dt>
          <dd>
            {CATEGORY_LABELS[input.category]}
            {breakdown.categoryMultiplier !== 1
              ? ` (×${breakdown.categoryMultiplier})`
              : ''}
          </dd>
        </div>
        <div>
          <dt>규격</dt>
          <dd>
            {formatNumber(input.width, 1)} × {formatNumber(input.height, 1)}{' '}
            {input.unit}
            {breakdown.areaM2 > 0
              ? ` · ${formatNumber(breakdown.areaM2, 4)} m²`
              : ''}
          </dd>
        </div>
        <div>
          <dt>수량</dt>
          <dd>{input.quantity}식</dd>
        </div>
        <div>
          <dt>레이어드</dt>
          <dd>
            {input.layered
              ? breakdown.layeredIncluded
                ? '포함 (패키지 기본)'
                : '가산'
              : '미적용'}
          </dd>
        </div>
        <div>
          <dt>전동·허브</dt>
          <dd>{input.motorized ? '포함' : '미포함'}</dd>
        </div>
        <div>
          <dt>설치</dt>
          <dd>{INSTALL_LABELS[input.install]}</dd>
        </div>
      </dl>

      <ul className="line-items">
        <li>
          <span>
            패키지 기본가 ({PACKAGE_LABELS[input.packageId]})
          </span>
          <strong>{formatKRW(breakdown.packageBase)}</strong>
        </li>
        <li>
          <span>
            배수 적용 후 (라인 ×{breakdown.lineMultiplier}
            {breakdown.categoryMultiplier !== 1
              ? ` · 품목 ×${breakdown.categoryMultiplier}`
              : ''}
            {settings.sizeAdjustmentEnabled
              ? ` · 사이즈 ×${breakdown.sizeFactor}`
              : ''}
            )
          </span>
          <strong>{formatKRW(breakdown.afterMultipliers)}</strong>
        </li>
        {breakdown.layeredFee > 0 && (
          <li>
            <span>레이어드 가산</span>
            <strong>{formatKRW(breakdown.layeredFee)}</strong>
          </li>
        )}
        {breakdown.motorFee > 0 && (
          <li>
            <span>전동 · 스마트허브</span>
            <strong>{formatKRW(breakdown.motorFee)}</strong>
          </li>
        )}
        {breakdown.installFee > 0 && (
          <li>
            <span>설치비</span>
            <strong>{formatKRW(breakdown.installFee)}</strong>
          </li>
        )}
        <li>
          <span>창 1식 소계</span>
          <strong>{formatKRW(breakdown.perWindow)}</strong>
        </li>
        {breakdown.quantity > 1 && (
          <li>
            <span>× 수량 {breakdown.quantity}</span>
            <strong>
              {formatKRW(breakdown.perWindow * breakdown.quantity)}
            </strong>
          </li>
        )}
        <li>
          <span>공급가액</span>
          <strong>{formatKRW(breakdown.subtotal)}</strong>
        </li>
        <li>
          <span>
            부가세 ({(settings.vatRate * 100).toFixed(0)}%){' '}
            {input.vatMode === 'exclusive' ? '· 별도' : '· 포함'}
          </span>
          <strong>{formatKRW(breakdown.vat)}</strong>
        </li>
      </ul>

      <div className="total-box">
        <div className="total-label">
          합계 ({settings.roundTo.toLocaleString('ko-KR')}원 단위)
        </div>
        <div className="total-value">{formatKRW(breakdown.roundedTotal)}</div>
      </div>

      <p className="band-footnote">
        패키지 참고 밴드:{' '}
        {formatBand(breakdown.bandMin, breakdown.bandMax)} · 위 금액은 「
        {settings.label}」입니다.
      </p>

      {(input.customerName || input.memo) && (
        <div className="extra-notes">
          {input.customerName && (
            <p>
              <strong>고객명</strong> {input.customerName}
            </p>
          )}
          {input.memo && (
            <p>
              <strong>메모</strong> {input.memo}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
