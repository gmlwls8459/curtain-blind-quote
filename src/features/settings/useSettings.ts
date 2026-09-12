import { useCallback, useEffect, useState } from 'react';
import type { PricingSettings } from '../pricing/types';
import { loadSettings, resetSettings, saveSettings } from './storage';

export function useSettings() {
  const [settings, setSettings] = useState<PricingSettings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const update = useCallback((partial: Partial<PricingSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setSettings(resetSettings());
  }, []);

  return { settings, setSettings, update, reset };
}
