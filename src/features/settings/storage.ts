import type { PricingSettings } from '../pricing/types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../pricing/defaults';

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
