import type { Category, Fullness, Opacity, QuoteInput, Unit, VatMode } from '../pricing/types';
import {
  CATEGORY_LABELS,
  CURTAIN_CATEGORIES,
  FULLNESS_LABELS,
  INSTALL_LABELS,
  MOTOR_CATEGORIES,
  OPACITY_LABELS,
} from '../pricing/types';

interface Props {
  value: QuoteInput;
  onChange: (next: QuoteInput) => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function QuoteForm({ value, onChange }: Props) {
  const set = <K extends keyof QuoteInput>(key: K, v: QuoteInput[K]) => {
    const next = { ...value, [key]: v };
    // Reset motor when switching away from motor categories
    if (key === 'category') {
      const cat = v as Category;
      if (!MOTOR_CATEGORIES.includes(cat)) next.motorized = false;
      if (!CURTAIN_CATEGORIES.includes(cat)) next.fullness = 2;
    }
    onChange(next);
  };

  const showFullness = CURTAIN_CATEGORIES.includes(value.category);
  const showMotor = MOTOR_CATEGORIES.includes(value.category);

  return (
    <section className="card form-card">
      <div className="card-head">
        <h2>견적 입력</h2>
      </div>

      <fieldset className="field-group">
        <legend>품목</legend>
        <div className="chip-row" role="radiogroup" aria-label="품목 카테고리">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="radio"
              aria-checked={value.category === cat}
              className={`chip ${value.category === cat ? 'selected' : ''}`}
              onClick={() => set('category', cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="field-row dims">
        <label className="field">
          <span>가로 (폭)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={value.width || ''}
            onChange={(e) => set('width', Number(e.target.value) || 0)}
            inputMode="decimal"
          />
        </label>
        <span className="times" aria-hidden>
          ×
        </span>
        <label className="field">
          <span>세로 (높이)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={value.height || ''}
            onChange={(e) => set('height', Number(e.target.value) || 0)}
            inputMode="decimal"
          />
        </label>
        <div className="unit-toggle" role="group" aria-label="단위">
          {(['cm', 'mm'] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              className={`unit-btn ${value.unit === u ? 'selected' : ''}`}
              onClick={() => {
                if (u === value.unit) return;
                // Convert values when toggling
                const next = { ...value, unit: u };
                if (u === 'mm') {
                  next.width = Math.round(value.width * 10);
                  next.height = Math.round(value.height * 10);
                } else {
                  next.width = Math.round(value.width / 10);
                  next.height = Math.round(value.height / 10);
                }
                onChange(next);
              }}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>수량</span>
        <input
          type="number"
          min={1}
          step={1}
          value={value.quantity || ''}
          onChange={(e) => set('quantity', Math.max(1, Math.floor(Number(e.target.value) || 1)))}
          inputMode="numeric"
        />
      </label>

      <fieldset className="field-group">
        <legend>불투명도</legend>
        <div className="chip-row">
          {(Object.keys(OPACITY_LABELS) as Opacity[]).map((o) => (
            <button
              key={o}
              type="button"
              className={`chip ${value.opacity === o ? 'selected' : ''}`}
              onClick={() => set('opacity', o)}
            >
              {OPACITY_LABELS[o]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field-group">
        <legend>설치</legend>
        <div className="chip-row">
          {(['included', 'excluded'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              className={`chip ${value.install === opt ? 'selected' : ''}`}
              onClick={() => set('install', opt)}
            >
              {INSTALL_LABELS[opt]}
            </button>
          ))}
        </div>
      </fieldset>

      {showFullness && (
        <fieldset className="field-group">
          <legend>주름배수 (커튼)</legend>
          <div className="chip-row">
            {([1.5, 2] as Fullness[]).map((f) => (
              <button
                key={f}
                type="button"
                className={`chip ${value.fullness === f ? 'selected' : ''}`}
                onClick={() => set('fullness', f)}
              >
                {FULLNESS_LABELS[String(f)]}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {showMotor && (
        <label className="check-row">
          <input
            type="checkbox"
            checked={value.motorized}
            onChange={(e) => set('motorized', e.target.checked)}
          />
          <span>전동화 포함</span>
        </label>
      )}

      <fieldset className="field-group">
        <legend>부가세</legend>
        <div className="chip-row">
          {(
            [
              ['exclusive', '부가세 별도'],
              ['inclusive', '부가세 포함'],
            ] as [VatMode, string][]
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              className={`chip ${value.vatMode === mode ? 'selected' : ''}`}
              onClick={() => set('vatMode', mode)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>고객명 (선택)</span>
        <input
          type="text"
          value={value.customerName}
          onChange={(e) => set('customerName', e.target.value)}
          placeholder="홍길동"
          autoComplete="name"
        />
      </label>

      <label className="field">
        <span>메모 (선택)</span>
        <textarea
          value={value.memo}
          onChange={(e) => set('memo', e.target.value)}
          placeholder="배송지, 원단 색상 등"
          rows={3}
        />
      </label>
    </section>
  );
}
