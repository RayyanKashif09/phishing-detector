const MARQUEE = [
  "97.8% Accuracy", "DistilBERT + LoRA", "96.5% F1 Score",
  "NUML Faisalabad", "92.0% AI-Phishing Detection", "Open Source Model",
  "97.8% Accuracy", "DistilBERT + LoRA", "96.5% F1 Score",
  "NUML Faisalabad", "92.0% AI-Phishing Detection", "Open Source Model",
];

export default function Landing({ onNav }) {
  return (
    <div>
      {/* ── Nav ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <span className="navbar-logo" style={{ cursor: "default" }}>
            <span className="logo-mark">P</span>
            PhishGuard
          </span>
          <div className="navbar-links">
            <button className="nav-link" onClick={() => onNav("login")}>Log in</button>
            <button className="nav-link lime" onClick={() => onNav("signup")}>Sign up</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="container">
        <div className="landing-hero">
          <p className="hero-kicker">AI-Powered Email Defense</p>
          <h1 className="hero-title">
            Phishing,<br />
            <em>caught</em> in a blink.
          </h1>
          <p className="hero-sub">
            PhishGuard uses DistilBERT fine-tuned with LoRA to detect phishing emails
            with surgical precision — in real time.
          </p>
          <div className="hero-actions">
            <button className="btn btn-ink" onClick={() => onNav("signup")}>
              Get started free
            </button>
            <button className="btn btn-ghost" onClick={() => onNav("login")}>
              Sign in →
            </button>
          </div>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {MARQUEE.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}&nbsp;&nbsp;·
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats band ── */}
      <div className="container">
        <div className="stats-band" style={{ borderTop: "none" }}>
          <div className="stat-cell">
            <div className="stat-number">97.8%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-cell">
            <div className="stat-number">96.5%</div>
            <div className="stat-label">F1 Score</div>
          </div>
          <div className="stat-cell">
            <div className="stat-number">92.0%</div>
            <div className="stat-label">AI-phishing detection</div>
          </div>
        </div>

        {/* ── Feature strip ── */}
        <div className="bento bento-3" style={{ padding: "40px 0" }}>
          {[
            { tag: "Model", title: "DistilBERT + LoRA", body: "Parameter-efficient fine-tuning on a 2024 phishing corpus. Fast, accurate, and explainable." },
            { tag: "Explainability", title: "Token-level signals", body: "See exactly which phrases triggered the verdict — urgency cues, lookalike domains, credential requests." },
            { tag: "Deployment", title: "API + Extension", body: "REST API for integration and a Chrome extension for inline inbox warnings." },
          ].map(f => (
            <div key={f.tag} className="card">
              <p className="label" style={{ marginBottom: 10 }}>{f.tag}</p>
              <h3 style={{ fontFamily: "var(--tight)", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>

        <div className="byline">
          DistilBERT + LoRA — NUML Faisalabad · Research paper available on request
        </div>
      </div>
    </div>
  );
}
