import type { PricingSettings } from '../pricing/types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../pricing/defaults';

function cloneDefaults(): PricingSettings {
  return {
    ...DEFAULT_SETTINGS,
    packageBases: { ...DEFAULT_SETTINGS.packageBases },
    packageBands: {
      room: { ...DEFAULT_SETTINGS.packageBands.room },
      suite: { ...DEFAULT_SETTINGS.packageBands.suite },
      home: { ...DEFAULT_SETTINGS.packageBands.home },
    },
    lineMultipliers: { ...DEFAULT_SETTINGS.lineMultipliers },
    categoryMultipliers: { ...DEFAULT_SETTINGS.categoryMultipliers },
  };
}

export function loadSettings(): PricingSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return cloneDefaults();
    const parsed = JSON.parse(raw) as Partial<PricingSettings>;
    return {
      ...cloneDefaults(),
      ...parsed,
      packageBases: {
        ...DEFAULT_SETTINGS.packageBases,
        ...(parsed.packageBases ?? {}),
      },
      packageBands: {
        room: {
          ...DEFAULT_SETTINGS.packageBands.room,
          ...(parsed.packageBands?.room ?? {}),
        },
        suite: {
          ...DEFAULT_SETTINGS.packageBands.suite,
          ...(parsed.packageBands?.suite ?? {}),
        },
        home: {
          ...DEFAULT_SETTINGS.packageBands.home,
          ...(parsed.packageBands?.home ?? {}),
        },
      },
      lineMultipliers: {
        ...DEFAULT_SETTINGS.lineMultipliers,
        ...(parsed.lineMultipliers ?? {}),
      },
      categoryMultipliers: {
        ...DEFAULT_SETTINGS.categoryMultipliers,
        ...(parsed.categoryMultipliers ?? {}),
      },
    };
  } catch {
    return cloneDefaults();
  }
}

export function saveSettings(settings: PricingSettings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function resetSettings(): PricingSettings {
  localStorage.removeItem(STORAGE_KEYS.settings);
  return cloneDefaults();
}
