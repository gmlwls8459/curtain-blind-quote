import { useState } from 'react';
import { SettingsPage } from '../settings/SettingsPage';
import type { PricingSettings } from '../pricing/types';
import { AdminLogin } from './AdminLogin';
import { isAdminAuthenticated, setAdminAuthenticated } from './auth';

interface Props {
  settings: PricingSettings;
  onChange: (s: PricingSettings) => void;
  onReset: () => void;
}

export function AdminPage({ settings, onChange, onReset }: Props) {
  const [authed, setAuthed] = useState(() => isAdminAuthenticated());

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="admin-authed">
      <div className="admin-toolbar no-print">
        <span className="admin-toolbar-label">관리자 모드</span>
        <button type="button" className="btn ghost small" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
      <SettingsPage settings={settings} onChange={onChange} onReset={onReset} />
    </div>
  );
}
