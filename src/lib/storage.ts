import type { PricingSettings, SavedQuote } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './defaults';

export function loadSettings(): PricingSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return { ...DEFAULT_SETTINGS, unitPrices: { ...DEFAULT_SETTINGS.unitPrices }, opacityMultipliers: { ...DEFAULT_SETTINGS.opacityMultipliers } };
    const parsed = JSON.parse(raw) as PricingSettings;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      unitPrices: { ...DEFAULT_SETTINGS.unitPrices, ...parsed.unitPrices },
      opacityMultipliers: {
        ...DEFAULT_SETTINGS.opacityMultipliers,
        ...parsed.opacityMultipliers,
      },
    };
  } catch {
    return { ...DEFAULT_SETTINGS, unitPrices: { ...DEFAULT_SETTINGS.unitPrices }, opacityMultipliers: { ...DEFAULT_SETTINGS.opacityMultipliers } };
  }
}

export function saveSettings(settings: PricingSettings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function resetSettings(): PricingSettings {
  localStorage.removeItem(STORAGE_KEYS.settings);
  return { ...DEFAULT_SETTINGS, unitPrices: { ...DEFAULT_SETTINGS.unitPrices }, opacityMultipliers: { ...DEFAULT_SETTINGS.opacityMultipliers } };
}

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
