import { useState } from 'react';
import type {
  Category,
  LineId,
  PackageId,
  PricingSettings,
} from '../pricing/types';
import {
  CATEGORY_LABELS,
  LINE_LABELS,
  PACKAGE_LABELS,
  PACKAGE_SUBTITLES,
} from '../pricing/types';
import { DEFAULT_SETTINGS } from '../pricing/defaults';
import { formatBand, formatKRW } from '../pricing/pricing';

interface Props {
  settings: PricingSettings;
  onChange: (s: PricingSettings) => void;
  onReset: () => void;
}

const PACKAGES = Object.keys(PACKAGE_LABELS) as PackageId[];
const LINES = Object.keys(LINE_LABELS) as LineId[];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function SettingsPage({ settings, onChange, onReset }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const setBase = (pkg: PackageId, n: number) => {
    onChange({
      ...settings,
      packageBases: {
        ...settings.packageBases,
        [pkg]: Math.max(0, n),
      },
    });
  };

  const setBand = (pkg: PackageId, key: 'min' | 'max', n: number) => {
    onChange({
      ...settings,
      packageBands: {
        ...settings.packageBands,
        [pkg]: {
          ...settings.packageBands[pkg],
          [key]: Math.max(0, n),
        },
      },
    });
  };

  const setLine = (line: LineId, n: number) => {
    onChange({
      ...settings,
      lineMultipliers: {
        ...settings.lineMultipliers,
        [line]: Math.max(0, n),
      },
    });
  };

  const setCat = (cat: Category, n: number) => {
    onChange({
      ...settings,
      categoryMultipliers: {
        ...settings.categoryMultipliers,
        [cat]: Math.max(0, n),
      },
    });
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>기획 가정 단가 설정</h2>
        <span className="badge">{settings.label}</span>
      </div>

      <p className="hint">
        D&apos;MOTIVE WINDOW 패키지(ROOM / SUITE / HOME) 기본가·밴드·라인 배수를
        편집합니다. 변경은 이 기기 localStorage에 바로 저장됩니다.
      </p>

      <section className="card">
        <h3>패키지 기본가 (원 / 창 1식)</h3>
        <div className="settings-grid">
          {PACKAGES.map((pkg) => (
            <label key={pkg} className="field">
              <span>
                {PACKAGE_LABELS[pkg]} · {PACKAGE_SUBTITLES[pkg]}
              </span>
              <input
                type="number"
                min={0}
                step={10000}
                value={settings.packageBases[pkg]}
                onChange={(e) => setBase(pkg, Number(e.target.value) || 0)}
              />
              <span className="field-hint">
                {formatKRW(settings.packageBases[pkg])} · 참고 밴드{' '}
                {formatBand(
                  settings.packageBands[pkg].min,
                  settings.packageBands[pkg].max,
                )}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>패키지 참고 밴드 (표시용, 원)</h3>
        <div className="settings-grid band-grid">
          {PACKAGES.map((pkg) => (
            <div key={pkg} className="band-edit">
              <div className="band-edit-title">{PACKAGE_LABELS[pkg]}</div>
              <label className="field">
                <span>최소</span>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={settings.packageBands[pkg].min}
                  onChange={(e) =>
                    setBand(pkg, 'min', Number(e.target.value) || 0)
                  }
                />
              </label>
              <label className="field">
                <span>최대</span>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={settings.packageBands[pkg].max}
                  onChange={(e) =>
                    setBand(pkg, 'max', Number(e.target.value) || 0)
                  }
                />
              </label>
            </div>
          ))}
        </div>
        <p className="field-hint">
          아이디어 덱 기준: ROOM 45~120만 · SUITE 150~280만 · HOME 350~650만
          (마진 PPT HOME 280~450만은 참고, 기본은 아이디어 덱)
        </p>
      </section>

      <section className="card">
        <h3>라인(톤) 배수</h3>
        <div className="settings-grid">
          {LINES.map((line) => (
            <label key={line} className="field">
              <span>{LINE_LABELS[line]}</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={settings.lineMultipliers[line]}
                onChange={(e) => setLine(line, Number(e.target.value) || 0)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>품목 배수 (소폭)</h3>
        <div className="settings-grid">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="field">
              <span>{CATEGORY_LABELS[cat]}</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={settings.categoryMultipliers[cat]}
                onChange={(e) => setCat(cat, Number(e.target.value) || 0)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>옵션 · 추가 비용</h3>
        <div className="settings-grid">
          <label className="field">
            <span>ROOM 레이어드 가산 (원/식)</span>
            <input
              type="number"
              min={0}
              step={10000}
              value={settings.layeredFeeRoom}
              onChange={(e) =>
                onChange({
                  ...settings,
                  layeredFeeRoom: Math.max(0, Number(e.target.value) || 0),
                })
              }
            />
          </label>
          <label className="field">
            <span>전동 · 스마트허브 (원/식)</span>
            <input
              type="number"
              min={0}
              step={10000}
              value={settings.motorFeePerUnit}
              onChange={(e) =>
                onChange({
                  ...settings,
                  motorFeePerUnit: Math.max(0, Number(e.target.value) || 0),
                })
              }
            />
            <span className="field-hint">마진 PPT: SUITE+30~80만 → 기본 50만</span>
          </label>
          <label className="field">
            <span>설치비 (원/식)</span>
            <input
              type="number"
              min={0}
              step={10000}
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
            <span className="field-hint">
              {(settings.vatRate * 100).toFixed(0)}%
            </span>
          </label>
          <label className="field">
            <span>반올림 단위 (원)</span>
            <input
              type="number"
              min={1}
              step={100}
              value={settings.roundTo}
              onChange={(e) =>
                onChange({
                  ...settings,
                  roundTo: Math.max(1, Number(e.target.value) || 1000),
                })
              }
            />
          </label>
        </div>

        <div className="check-row-block">
          <label className="check-row">
            <input
              type="checkbox"
              checked={settings.layeredIncludedInSuite}
              onChange={(e) =>
                onChange({
                  ...settings,
                  layeredIncludedInSuite: e.target.checked,
                })
              }
            />
            <span>SUITE에 레이어드 기본 포함</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={settings.layeredIncludedInHome}
              onChange={(e) =>
                onChange({
                  ...settings,
                  layeredIncludedInHome: e.target.checked,
                })
              }
            />
            <span>HOME에 레이어드 기본 포함</span>
          </label>
        </div>
      </section>

      <section className="card">
        <h3>사이즈 가·감 (선택)</h3>
        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.sizeAdjustmentEnabled}
            onChange={(e) =>
              onChange({
                ...settings,
                sizeAdjustmentEnabled: e.target.checked,
              })
            }
          />
          <span>규격 면적으로 패키지 기본가에 배수 적용</span>
        </label>
        <p className="field-hint">
          sizeFactor = clamp(실면적 ÷ 기준면적, 하한, 상한). 기본은 꺼져 있어
          패키지 기본가가 그대로 쓰입니다.
        </p>
        {settings.sizeAdjustmentEnabled && (
          <div className="settings-grid">
            <label className="field">
              <span>기준 가로 (cm)</span>
              <input
                type="number"
                min={1}
                value={settings.sizeRefWidthCm}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    sizeRefWidthCm: Math.max(1, Number(e.target.value) || 1),
                  })
                }
              />
            </label>
            <label className="field">
              <span>기준 세로 (cm)</span>
              <input
                type="number"
                min={1}
                value={settings.sizeRefHeightCm}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    sizeRefHeightCm: Math.max(1, Number(e.target.value) || 1),
                  })
                }
              />
            </label>
            <label className="field">
              <span>배수 하한</span>
              <input
                type="number"
                min={0}
                step={0.05}
                value={settings.sizeFactorMin}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    sizeFactorMin: Math.max(0, Number(e.target.value) || 0),
                  })
                }
              />
            </label>
            <label className="field">
              <span>배수 상한</span>
              <input
                type="number"
                min={0}
                step={0.05}
                value={settings.sizeFactorMax}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    sizeFactorMax: Math.max(0, Number(e.target.value) || 0),
                  })
                }
              />
            </label>
          </div>
        )}
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
            if (confirm('기획 가정 단가 기본값으로 되돌릴까요?')) {
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
              ...DEFAULT_SETTINGS,
              packageBases: { ...DEFAULT_SETTINGS.packageBases },
              packageBands: {
                room: { ...DEFAULT_SETTINGS.packageBands.room },
                suite: { ...DEFAULT_SETTINGS.packageBands.suite },
                home: { ...DEFAULT_SETTINGS.packageBands.home },
              },
              lineMultipliers: { ...DEFAULT_SETTINGS.lineMultipliers },
              categoryMultipliers: { ...DEFAULT_SETTINGS.categoryMultipliers },
            });
            showToast('기획 가정 단가를 다시 불러왔습니다');
          }}
        >
          기획 가정 단가 다시 불러오기
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
