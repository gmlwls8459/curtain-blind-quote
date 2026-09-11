import { useState } from 'react';
import type { Category, Opacity, PricingSettings } from '../types';
import { CATEGORY_LABELS, OPACITY_LABELS } from '../types';
import { DEFAULT_SETTINGS } from '../lib/defaults';
import { formatKRW } from '../lib/pricing';

interface Props {
  settings: PricingSettings;
  onChange: (s: PricingSettings) => void;
  onReset: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const OPACITIES = Object.keys(OPACITY_LABELS) as Opacity[];

export function SettingsPage({ settings, onChange, onReset }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const setUnitPrice = (cat: Category, n: number) => {
    onChange({
      ...settings,
      unitPrices: { ...settings.unitPrices, [cat]: Math.max(0, n) },
    });
  };

  const setOpacity = (o: Opacity, n: number) => {
    onChange({
      ...settings,
      opacityMultipliers: {
        ...settings.opacityMultipliers,
        [o]: Math.max(0, n),
      },
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>단가 · 배수 설정</h2>
        <span className="badge">{settings.label}</span>
      </div>

      <p className="hint">
        변경 내용은 이 기기의 브라우저(localStorage)에 바로 저장됩니다.
        기본값은 한국 시장 대략 참고가인 「샘플 단가」입니다.
      </p>

      <section className="card">
        <h3>m²당 단가 (원)</h3>
        <div className="settings-grid">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="field">
              <span>{CATEGORY_LABELS[cat]}</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={settings.unitPrices[cat]}
                onChange={(e) => setUnitPrice(cat, Number(e.target.value) || 0)}
              />
              <span className="field-hint">{formatKRW(settings.unitPrices[cat])}/m²</span>
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>불투명도 배수</h3>
        <div className="settings-grid">
          {OPACITIES.map((o) => (
            <label key={o} className="field">
              <span>{OPACITY_LABELS[o]}</span>
              <input
                type="number"
                min={0}
                step={0.05}
                value={settings.opacityMultipliers[o]}
                onChange={(e) => setOpacity(o, Number(e.target.value) || 0)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>추가 비용</h3>
        <div className="settings-grid">
          <label className="field">
            <span>설치비 (개당)</span>
            <input
              type="number"
              min={0}
              step={1000}
              value={settings.installFeePerUnit}
              onChange={(e) =>
                onChange({
                  ...settings,
                  installFeePerUnit: Math.max(0, Number(e.target.value) || 0),
                })
              }
            />
          </label>
          <label className="field">
            <span>전동화 (개당)</span>
            <input
              type="number"
              min={0}
              step={1000}
              value={settings.motorFeePerUnit}
              onChange={(e) =>
                onChange({
                  ...settings,
                  motorFeePerUnit: Math.max(0, Number(e.target.value) || 0),
                })
              }
            />
          </label>
          <label className="field">
            <span>부가세율</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={settings.vatRate}
              onChange={(e) =>
                onChange({
                  ...settings,
                  vatRate: Math.max(0, Number(e.target.value) || 0),
                })
              }
            />
            <span className="field-hint">{(settings.vatRate * 100).toFixed(0)}%</span>
          </label>
        </div>
      </section>

      <section className="card">
        <label className="field">
          <span>단가 라벨</span>
          <input
            type="text"
            value={settings.label}
            onChange={(e) => onChange({ ...settings, label: e.target.value })}
          />
        </label>
      </section>

      <div className="action-bar">
        <button
          type="button"
          className="btn danger"
          onClick={() => {
            if (confirm('샘플 단가 기본값으로 되돌릴까요?')) {
              onReset();
              showToast('기본값으로 초기화했습니다');
            }
          }}
        >
          기본값 복원
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            onChange({
              ...settings,
              unitPrices: { ...DEFAULT_SETTINGS.unitPrices },
              opacityMultipliers: { ...DEFAULT_SETTINGS.opacityMultipliers },
              installFeePerUnit: DEFAULT_SETTINGS.installFeePerUnit,
              motorFeePerUnit: DEFAULT_SETTINGS.motorFeePerUnit,
              vatRate: DEFAULT_SETTINGS.vatRate,
              label: DEFAULT_SETTINGS.label,
            });
            showToast('샘플 단가를 다시 불러왔습니다');
          }}
        >
          샘플 단가 다시 불러오기
        </button>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
