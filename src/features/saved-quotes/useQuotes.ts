import { useCallback, useState } from 'react';
import type { QuoteBreakdown, QuoteInput, SavedQuote } from '../pricing/types';
import { PACKAGE_LABELS } from '../pricing/types';
import {
  createId,
  deleteQuote,
  loadQuotes,
  upsertQuote,
} from './storage';

export function useQuotes() {
  const [quotes, setQuotes] = useState<SavedQuote[]>(() => loadQuotes());

  const save = useCallback(
    (input: QuoteInput, breakdown: QuoteBreakdown, existingId?: string) => {
      const now = new Date().toISOString();
      const id = existingId ?? createId();
      const prev = loadQuotes().find((q) => q.id === id);
      const label =
        (input.customerName.trim() || PACKAGE_LABELS[input.packageId]) +
        ` · ${PACKAGE_LABELS[input.packageId]} · ${input.width}×${input.height}${input.unit}`;
      const quote: SavedQuote = {
        id,
        createdAt: prev?.createdAt ?? now,
        updatedAt: now,
        input,
        breakdown,
        label,
      };
      const list = upsertQuote(quote);
      setQuotes(list);
      return quote;
    },
    []
  );

  const remove = useCallback((id: string) => {
    setQuotes(deleteQuote(id));
  }, []);

  const refresh = useCallback(() => {
    setQuotes(loadQuotes());
  }, []);

  return { quotes, save, remove, refresh };
}
