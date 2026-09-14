import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header no-print">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden>
              ▦
            </span>
            <div>
              <h1 className="brand-title">커튼 블라인더 견적</h1>
              <p className="brand-sub">D&apos;MOTIVE WINDOW · 기획 가정 단가</p>
            </div>
          </div>
          <nav className="nav" aria-label="주요 메뉴">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              견적
            </NavLink>
            <NavLink to="/quotes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              저장목록
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer no-print">
        <p>
          단가는 「기획 가정 단가」이며 실제 시세·원단·시공 조건과 다를 수 있습니다. · 데이터는 이
          기기에만 저장됩니다.
        </p>
      </footer>
    </div>
  );
}
