export default function Navbar({ page, onNav, onLogout }) {
  const links = [
    { id: "scanner", label: "Scan" },
    { id: "history", label: "History" },
    { id: "about",   label: "About" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-logo" onClick={() => onNav("dashboard")}>
          <span className="logo-mark">P</span>
          PhishGuard
        </button>
        <div className="navbar-links">
          {links.map(l => (
            <button
              key={l.id}
              className={`nav-link${page === l.id ? " active" : ""}`}
              onClick={() => onNav(l.id)}
            >
              {l.label}
            </button>
          ))}
          <button className="nav-link" onClick={onLogout}>Log out</button>
        </div>
      </div>
    </nav>
  );
}
