import type { SavedQuote } from '../pricing/types';
import { STORAGE_KEYS } from '../pricing/defaults';

export function loadQuotes(): SavedQuote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.quotes);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedQuote[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveQuotes(quotes: SavedQuote[]): void {
  localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
}

export function upsertQuote(quote: SavedQuote): SavedQuote[] {
  const list = loadQuotes();
  const idx = list.findIndex((q) => q.id === quote.id);
  if (idx >= 0) {
    list[idx] = quote;
  } else {
    list.unshift(quote);
  }
  // Keep last 50
  const trimmed = list.slice(0, 50);
  saveQuotes(trimmed);
  return trimmed;
}

export function deleteQuote(id: string): SavedQuote[] {
  const list = loadQuotes().filter((q) => q.id !== id);
  saveQuotes(list);
  return list;
}

export function createId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
