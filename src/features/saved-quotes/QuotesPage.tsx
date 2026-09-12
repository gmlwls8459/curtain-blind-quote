import { Link } from 'react-router-dom';
import type { SavedQuote } from '../pricing/types';
import { CATEGORY_LABELS } from '../pricing/types';
import { formatKRW, formatNumber } from '../pricing/pricing';

interface Props {
  quotes: SavedQuote[];
  onDelete: (id: string) => void;
  onEdit: (quote: SavedQuote) => void;
}

export function QuotesPage({ quotes, onDelete, onEdit }: Props) {
  if (quotes.length === 0) {
    return (
      <div className="page">
        <div className="card empty-card">
          <h2>저장된 견적 없음</h2>
          <p>견적 화면에서 「견적 저장」을 누르면 여기에 쌓입니다.</p>
          <Link to="/" className="btn primary">
            견적 작성하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <h2>최근 견적</h2>
        <span className="muted">{quotes.length}건 (최대 50)</span>
      </div>
      <ul className="quote-list">
        {quotes.map((q) => (
          <li key={q.id} className="card quote-item">
            <div className="quote-item-main">
              <div className="quote-item-title">{q.label}</div>
              <div className="quote-item-meta">
                {CATEGORY_LABELS[q.input.category]} ·{' '}
                {formatNumber(q.input.width, 1)}×{formatNumber(q.input.height, 1)}
                {q.input.unit} · {q.input.quantity}개
              </div>
              <div className="quote-item-date">
                {new Date(q.updatedAt).toLocaleString('ko-KR')}
              </div>
            </div>
            <div className="quote-item-side">
              <div className="quote-item-price">
                {formatKRW(q.breakdown.roundedTotal)}
              </div>
              <div className="quote-item-actions">
                <button
                  type="button"
                  className="btn small primary"
                  onClick={() => onEdit(q)}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="btn small danger"
                  onClick={() => {
                    if (confirm('이 견적을 삭제할까요?')) onDelete(q.id);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
