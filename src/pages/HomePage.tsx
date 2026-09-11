import { useEffect, useMemo, useState } from 'react';
import { QuoteForm } from '../components/QuoteForm';
import { QuoteBreakdownCard } from '../components/QuoteBreakdownCard';
import { DEFAULT_INPUT } from '../lib/defaults';
import { calculateQuote } from '../lib/pricing';
import type { PricingSettings, QuoteInput, SavedQuote } from '../types';

interface Props {
  settings: PricingSettings;
  onSave: (
    input: QuoteInput,
    breakdown: ReturnType<typeof calculateQuote>,
    id?: string
  ) => SavedQuote;
  editing?: SavedQuote | null;
  onClearEdit?: () => void;
}

export function HomePage({ settings, onSave, editing, onClearEdit }: Props) {
  const [input, setInput] = useState<QuoteInput>(DEFAULT_INPUT);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setInput(editing.input);
      setEditId(editing.id);
    }
  }, [editing]);

  const breakdown = useMemo(
    () => calculateQuote(input, settings),
    [input, settings]
  );

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleSave = () => {
    onSave(input, breakdown, editId);
    showToast(editId ? '견적이 수정되었습니다' : '견적이 저장되었습니다');
  };

  const handleNew = () => {
    setInput({ ...DEFAULT_INPUT });
    setEditId(undefined);
    onClearEdit?.();
    showToast('새 견적 작성');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page quote-page">
      <div className="print-only print-header">
        <h1>커튼 블라인더 견적서</h1>
        <p>{new Date().toLocaleString('ko-KR')}</p>
      </div>

      <div className="quote-grid">
        <div className="no-print">
          <QuoteForm value={input} onChange={setInput} />
        </div>
        <div>
          <QuoteBreakdownCard
            input={input}
            breakdown={breakdown}
            settings={settings}
          />
          <div className="action-bar no-print">
            <button type="button" className="btn primary" onClick={handleSave}>
              {editId ? '수정 저장' : '견적 저장'}
            </button>
            <button type="button" className="btn ghost" onClick={handlePrint}>
              인쇄
            </button>
            <button type="button" className="btn ghost" onClick={handleNew}>
              새로 작성
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast no-print" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
