import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from '../shared/Layout';
import { useQuotes } from '../features/saved-quotes/useQuotes';
import { useSettings } from '../features/settings/useSettings';
import { HomePage } from '../features/quote/HomePage';
import { QuotesPage } from '../features/saved-quotes/QuotesPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import type { SavedQuote } from '../features/pricing/types';

function AppRoutes() {
  const { settings, setSettings, reset } = useSettings();
  const { quotes, save, remove } = useQuotes();
  const [editing, setEditing] = useState<SavedQuote | null>(null);
  const navigate = useNavigate();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <HomePage
              settings={settings}
              onSave={save}
              editing={editing}
              onClearEdit={() => setEditing(null)}
            />
          }
        />
        <Route
          path="/quotes"
          element={
            <QuotesPage
              quotes={quotes}
              onDelete={remove}
              onEdit={(q) => {
                setEditing(q);
                navigate('/');
              }}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <SettingsPage
              settings={settings}
              onChange={setSettings}
              onReset={reset}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
