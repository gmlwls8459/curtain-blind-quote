import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useQuotes } from './hooks/useQuotes';
import { useSettings } from './hooks/useSettings';
import { HomePage } from './pages/HomePage';
import { QuotesPage } from './pages/QuotesPage';
import { SettingsPage } from './pages/SettingsPage';
import type { SavedQuote } from './types';

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
