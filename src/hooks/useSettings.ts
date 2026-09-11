import { useCallback, useEffect, useState } from 'react';
import type { PricingSettings } from '../types';
import { loadSettings, resetSettings, saveSettings } from '../lib/storage';

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
