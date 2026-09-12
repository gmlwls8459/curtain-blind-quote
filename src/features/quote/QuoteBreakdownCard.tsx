import type { QuoteBreakdown, QuoteInput, PricingSettings } from '../pricing/types';
import {
  CATEGORY_LABELS,
  FULLNESS_LABELS,
  INSTALL_LABELS,
  OPACITY_LABELS,
} from '../pricing/types';
import { formatKRW, formatNumber, supportsFullness, supportsMotor } from '../pricing/pricing';

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
          <dt>품목</dt>
          <dd>{CATEGORY_LABELS[input.category]}</dd>
        </div>
        <div>
          <dt>규격</dt>
          <dd>
            {formatNumber(input.width, 1)} × {formatNumber(input.height, 1)} {input.unit}
          </dd>
        </div>
        <div>
          <dt>면적</dt>
          <dd>{formatNumber(breakdown.areaM2, 4)} m² × {input.quantity}개</dd>
        </div>
        <div>
          <dt>불투명도</dt>
          <dd>{OPACITY_LABELS[input.opacity]} (×{breakdown.opacityMultiplier})</dd>
        </div>
        {supportsFullness(input.category) && (
          <div>
            <dt>주름배수</dt>
            <dd>{FULLNESS_LABELS[String(input.fullness)]} (×{breakdown.fullnessMultiplier})</dd>
          </div>
        )}
        <div>
          <dt>설치</dt>
          <dd>{INSTALL_LABELS[input.install]}</dd>
        </div>
        {supportsMotor(input.category) && (
          <div>
            <dt>전동화</dt>
            <dd>{input.motorized ? '포함' : '미포함'}</dd>
          </div>
        )}
      </dl>

      <ul className="line-items">
        <li>
          <span>
            기본 ({formatKRW(breakdown.unitPrice)}/m² × {formatNumber(breakdown.areaM2, 4)} m² × {input.quantity})
          </span>
          <strong>{formatKRW(breakdown.baseAmount)}</strong>
        </li>
        {(breakdown.fullnessMultiplier !== 1 || breakdown.opacityMultiplier !== 1) && (
          <li>
            <span>
              배수 적용 후 (주름 ×{breakdown.fullnessMultiplier} · 불투명도 ×{breakdown.opacityMultiplier})
            </span>
            <strong>{formatKRW(breakdown.afterMultipliers)}</strong>
          </li>
        )}
        {breakdown.installFee > 0 && (
          <li>
            <span>설치비</span>
            <strong>{formatKRW(breakdown.installFee)}</strong>
          </li>
        )}
        {breakdown.motorFee > 0 && (
          <li>
            <span>전동화</span>
            <strong>{formatKRW(breakdown.motorFee)}</strong>
          </li>
        )}
        <li>
          <span>공급가액</span>
          <strong>{formatKRW(breakdown.subtotal)}</strong>
        </li>
        <li>
          <span>
            부가세 (10%) {input.vatMode === 'exclusive' ? '· 별도' : '· 포함'}
          </span>
          <strong>{formatKRW(breakdown.vat)}</strong>
        </li>
      </ul>

      <div className="total-box">
        <div className="total-label">합계 (100원 단위)</div>
        <div className="total-value">{formatKRW(breakdown.roundedTotal)}</div>
      </div>

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
