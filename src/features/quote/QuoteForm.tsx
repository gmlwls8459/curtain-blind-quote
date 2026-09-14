import { useEffect, useState } from 'react'
import type {
  Category,
  LineId,
  PackageId,
  QuoteInput,
  Unit,
  VatMode,
} from '../pricing/types'
import {
  CATEGORY_LABELS,
  INSTALL_LABELS,
  LINE_HINTS,
  LINE_LABELS,
  PACKAGE_LABELS,
  PACKAGE_SUBTITLES,
} from '../pricing/types'
import { isLayeredIncluded } from '../pricing/pricing'
import type { PricingSettings } from '../pricing/types'

interface Props {
  value: QuoteInput
  onChange: (next: QuoteInput) => void
  settings: PricingSettings
}

const PACKAGES = Object.keys(PACKAGE_LABELS) as PackageId[]
const LINES = Object.keys(LINE_LABELS) as LineId[]
const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

function parseNonNegInt(raw: string): number {
  if (raw.trim() === '') return 0
  const n = Math.floor(Number(raw))
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function parseNonNegNumber(raw: string): number {
  if (raw.trim() === '') return 0
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function QuoteForm({ value, onChange, settings }: Props) {
  const [widthText, setWidthText] = useState(() =>
    value.width === 0 ? '' : String(value.width),
  )
  const [heightText, setHeightText] = useState(() =>
    value.height === 0 ? '' : String(value.height),
  )
  const [quantityText, setQuantityText] = useState(() =>
    value.quantity === 0 ? '' : String(value.quantity),
  )

  useEffect(() => {
    setWidthText((prev) =>
      parseNonNegNumber(prev) === value.width ? prev : String(value.width),
    )
  }, [value.width])

  useEffect(() => {
    setHeightText((prev) =>
      parseNonNegNumber(prev) === value.height ? prev : String(value.height),
    )
  }, [value.height])

  useEffect(() => {
    setQuantityText((prev) =>
      parseNonNegInt(prev) === value.quantity ? prev : String(value.quantity),
    )
  }, [value.quantity])

  const set = <K extends keyof QuoteInput>(key: K, v: QuoteInput[K]) => {
    const next = { ...value, [key]: v }
    if (key === 'packageId') {
      const pkg = v as PackageId
      // SUITE/HOME은 레이어드 기본 ON, ROOM은 유지(선택)
      if (isLayeredIncluded(pkg, settings)) {
        next.layered = true
      }
    }
    onChange(next)
  }

  const layeredIncluded = isLayeredIncluded(value.packageId, settings)

  return (
    <section className="card form-card">
      <div className="card-head">
        <h2>견적 입력</h2>
      </div>

      <fieldset className="field-group">
        <legend>패키지</legend>
        <div className="chip-row" role="radiogroup" aria-label="패키지">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg}
              type="button"
              role="radio"
              aria-checked={value.packageId === pkg}
              className={`chip chip-stack ${value.packageId === pkg ? 'selected' : ''}`}
              onClick={() => set('packageId', pkg)}
            >
              <strong>{PACKAGE_LABELS[pkg]}</strong>
              <small>{PACKAGE_SUBTITLES[pkg]}</small>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field-group">
        <legend>라인 (톤)</legend>
        <div className="chip-row" role="radiogroup" aria-label="라인">
          {LINES.map((line) => (
            <button
              key={line}
              type="button"
              role="radio"
              aria-checked={value.lineId === line}
              className={`chip ${value.lineId === line ? 'selected' : ''}`}
              onClick={() => set('lineId', line)}
              title={LINE_HINTS[line]}
            >
              {LINE_LABELS[line]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field-group">
        <legend>품목 유형</legend>
        <div className="chip-row" role="radiogroup" aria-label="품목">
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
            type="text"
            inputMode="decimal"
            value={widthText}
            onChange={(e) => {
              const raw = e.target.value
              if (raw !== '' && !/^\d*\.?\d*$/.test(raw)) return
              setWidthText(raw)
              set('width', parseNonNegNumber(raw))
            }}
          />
        </label>
        <span className="times" aria-hidden>
          ×
        </span>
        <label className="field">
          <span>세로 (높이)</span>
          <input
            type="text"
            inputMode="decimal"
            value={heightText}
            onChange={(e) => {
              const raw = e.target.value
              if (raw !== '' && !/^\d*\.?\d*$/.test(raw)) return
              setHeightText(raw)
              set('height', parseNonNegNumber(raw))
            }}
          />
        </label>
        <div className="unit-toggle" role="group" aria-label="단위">
          {(['cm', 'mm'] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              className={`unit-btn ${value.unit === u ? 'selected' : ''}`}
              onClick={() => {
                if (u === value.unit) return
                const next = { ...value, unit: u }
                if (u === 'mm') {
                  next.width = Math.round(value.width * 10)
                  next.height = Math.round(value.height * 10)
                } else {
                  next.width = Math.round(value.width / 10)
                  next.height = Math.round(value.height / 10)
                }
                onChange(next)
              }}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>수량 (창 수)</span>
        <input
          type="text"
          inputMode="numeric"
          value={quantityText}
          onChange={(e) => {
            const raw = e.target.value
            if (raw !== '' && !/^\d*$/.test(raw)) return
            setQuantityText(raw)
            set('quantity', parseNonNegInt(raw))
          }}
        />
      </label>

      <label className="check-row">
        <input
          type="checkbox"
          checked={value.layered}
          onChange={(e) => set('layered', e.target.checked)}
        />
        <span>
          레이어드 (쉬어+암막)
          {layeredIncluded
            ? ' · 패키지 기본 포함'
            : ` · 가산 ${settings.layeredFeeRoom.toLocaleString('ko-KR')}원`}
        </span>
      </label>

      <label className="check-row">
        <input
          type="checkbox"
          checked={value.motorized}
          onChange={(e) => set('motorized', e.target.checked)}
        />
        <span>
          전동 · 스마트허브 (+
          {settings.motorFeePerUnit.toLocaleString('ko-KR')}원/식)
        </span>
      </label>

      <fieldset className="field-group">
        <legend>설치비</legend>
        <div className="chip-row">
          {(['included', 'excluded'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              className={`chip ${value.install === opt ? 'selected' : ''}`}
              onClick={() => set('install', opt)}
            >
              {INSTALL_LABELS[opt]}
              {opt === 'included' && settings.installFeePerUnit > 0
                ? ` (${settings.installFeePerUnit.toLocaleString('ko-KR')}원)`
                : ''}
            </button>
          ))}
        </div>
      </fieldset>

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
          placeholder="현장·원단·시공 일정 등"
          rows={3}
        />
      </label>
    </section>
  )
}
