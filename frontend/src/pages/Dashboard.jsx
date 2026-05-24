import Navbar from "../components/Navbar.jsx";

const HISTORY = [
  { date: "2026-05-24", subject: "Urgent: Verify your PayPal account", result: "PHISHING", confidence: 98.7, signal: "Urgency cue + lookalike domain" },
  { date: "2026-05-24", subject: "Team lunch Thursday?",               result: "LEGITIMATE", confidence: 99.2, signal: "Known sender, no links" },
  { date: "2026-05-23", subject: "You've won a $500 Amazon gift card",  result: "PHISHING", confidence: 97.1, signal: "Reward lure + shortened URL" },
  { date: "2026-05-23", subject: "Quarterly report attached",           result: "LEGITIMATE", confidence: 95.4, signal: "Trusted domain, neutral tone" },
  { date: "2026-05-22", subject: "Action required: suspended account",  result: "PHISHING", confidence: 96.8, signal: "Threatening language" },
];

function Sparkline() {
  const points = [6, 3, 8, 5, 9, 4, 7, 5, 8, 6, 10, 8];
  const max = Math.max(...points);
  const w = 120, h = 32;
  const pts = points.map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Dashboard({ user, onNav, onLogout }) {
  return (
    <div>
      <Navbar page="dashboard" onNav={onNav} onLogout={onLogout} />
      <div className="container page-content">

        {/* ── Welcome ── */}
        <div style={{ marginBottom: 32 }}>
          <p className="label" style={{ marginBottom: 6 }}>Dashboard</p>
          <h1 style={{ fontFamily: "var(--tight)", fontWeight: 900, fontSize: 32, letterSpacing: "-0.03em" }}>
            Welcome, <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>{user}</em>
          </h1>
        </div>

        {/* ── Bento row 1 ── */}
        <div className="bento bento-4" style={{ marginBottom: 12 }}>
          {/* Lime stat — total scans */}
          <div className="card card-lime" style={{ gridColumn: "span 2" }}>
            <p className="label" style={{ marginBottom: 8 }}>Total scans</p>
            <div className="stat-number" style={{ fontSize: 56, marginBottom: 8 }}>24</div>
            <Sparkline />
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, marginTop: 8, color: "#555" }}>+3 this week</p>
          </div>

          {/* Phishing count */}
          <div className="card">
            <p className="label" style={{ marginBottom: 8, color: "var(--red)" }}>Phishing</p>
            <div className="stat-number" style={{ fontSize: 48, color: "var(--red)" }}>8</div>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#888", marginTop: 8 }}>33.3% of scans</p>
          </div>

          {/* Legitimate count */}
          <div className="card">
            <p className="label" style={{ marginBottom: 8, color: "var(--green)" }}>Legitimate</p>
            <div className="stat-number" style={{ fontSize: 48, color: "var(--green)" }}>16</div>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#888", marginTop: 8 }}>66.7% of scans</p>
          </div>
        </div>

        {/* ── Bento row 2 ── */}
        <div className="bento bento-3" style={{ marginBottom: 32 }}>
          {/* Model card */}
          <div className="card card-ink">
            <p className="label" style={{ marginBottom: 8, color: "rgba(255,255,255,0.4)" }}>Model</p>
            <div style={{ fontFamily: "var(--tight)", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>DistilBERT + LoRA</div>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Fine-tuned on 2024 phishing corpus.<br />
              NUML Faisalabad research.
            </p>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              {[["97.8%", "Acc"], ["96.5%", "F1"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "var(--tight)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.03em" }}>{n}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top signal */}
          <div className="card">
            <p className="label" style={{ marginBottom: 8 }}>Top signal detected</p>
            <div style={{ fontFamily: "var(--tight)", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Urgency tactics</div>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#888", lineHeight: 1.6 }}>
              Appeared in 5 of 8 phishing emails. Common phrasing: "Verify immediately", "Account suspended".
            </p>
          </div>

          {/* Quick actions */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
            <p className="label" style={{ marginBottom: 4 }}>Quick actions</p>
            <button className="btn btn-ink btn-full btn-sm" onClick={() => onNav("scanner")}>
              Scan new email
            </button>
            <button className="btn btn-ghost btn-full btn-sm" onClick={() => onNav("history")}>
              View history →
            </button>
          </div>
        </div>

        {/* ── Recent activity ── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--tight)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>Recent activity</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav("history")}>See all →</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Result</th>
                  <th>Confidence</th>
                  <th>Top signal</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY.slice(0, 4).map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>{row.date}</td>
                    <td style={{ fontFamily: "var(--tight)", fontWeight: 600, maxWidth: 240 }}>{row.subject}</td>
                    <td>
                      <span className={`badge badge-${row.result.toLowerCase()}`}>{row.result}</span>
                    </td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12, whiteSpace: "nowrap" }}>{row.confidence}%</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#888" }}>{row.signal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
