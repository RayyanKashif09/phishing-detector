import { useState } from "react";
import Navbar from "../components/Navbar.jsx";

const DEFAULT_HISTORY = [
  { id: 1, date: "2026-05-24 14:22", subject: "Urgent: Verify your PayPal account",    from: "security@paypa1-support.com", result: "PHISHING",   confidence: 98.7, signal: "Urgency + lookalike domain" },
  { id: 2, date: "2026-05-24 11:05", subject: "Team lunch Thursday?",                  from: "sarah.chen@company.com",        result: "LEGITIMATE", confidence: 99.2, signal: "Personal greeting" },
  { id: 3, date: "2026-05-23 17:48", subject: "You've won a $500 Amazon gift card",    from: "noreply@amaz0n-rewards.com",    result: "PHISHING",   confidence: 97.1, signal: "Reward lure + short URL" },
  { id: 4, date: "2026-05-23 09:30", subject: "Quarterly report attached",             from: "reports@company.com",           result: "LEGITIMATE", confidence: 95.4, signal: "Trusted domain" },
  { id: 5, date: "2026-05-22 16:14", subject: "Action required: suspended account",   from: "alert@paypol-secure.net",       result: "PHISHING",   confidence: 96.8, signal: "Threatening language" },
  { id: 6, date: "2026-05-22 10:00", subject: "Your Analytics report is ready",       from: "reports@google.com",            result: "LEGITIMATE", confidence: 94.1, signal: "Known sender domain" },
  { id: 7, date: "2026-05-21 13:37", subject: "Verify your account or it will close", from: "noreply@netf1ix-billing.com",   result: "PHISHING",   confidence: 99.1, signal: "Urgency + credential req" },
  { id: 8, date: "2026-05-20 08:45", subject: "Project update from the dev team",     from: "dev@startup.io",                result: "LEGITIMATE", confidence: 97.8, signal: "Neutral tone" },
];

function ConfBar({ pct, type }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div className="conf-bar-wrap" style={{ width: 60 }}>
        <div className={`conf-bar-fill ${type.toLowerCase()}`} style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontFamily: "var(--mono)", fontSize: 12, whiteSpace: "nowrap" }}>{pct}%</span>
    </div>
  );
}

export default function History({ onNav, onLogout }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const rows = DEFAULT_HISTORY.filter(r => {
    const matchFilter = filter === "all" || r.result.toLowerCase() === filter;
    const matchSearch = !search ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.signal.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  function exportCSV() {
    const header = "Date,Subject,From,Result,Confidence,Signal\n";
    const body = DEFAULT_HISTORY.map(r =>
      `"${r.date}","${r.subject}","${r.from}","${r.result}","${r.confidence}","${r.signal}"`
    ).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "phishguard-history.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <Navbar page="history" onNav={onNav} onLogout={onLogout} />
      <div className="container page-content">

        {/* ── Title ── */}
        <div className="page-title-row">
          <div>
            <p className="label" style={{ marginBottom: 4 }}>Scan log</p>
            <h1 className="section-heading" style={{ fontSize: 28 }}>Scan history</h1>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
            Export CSV ↓
          </button>
        </div>

        {/* ── Summary stats ── */}
        <div className="bento bento-4" style={{ marginBottom: 28 }}>
          {[
            { label: "Total", value: DEFAULT_HISTORY.length, color: "var(--ink)" },
            { label: "Phishing", value: DEFAULT_HISTORY.filter(r => r.result === "PHISHING").length, color: "var(--red)" },
            { label: "Legitimate", value: DEFAULT_HISTORY.filter(r => r.result === "LEGITIMATE").length, color: "var(--green)" },
            { label: "Avg confidence", value: (DEFAULT_HISTORY.reduce((a, r) => a + r.confidence, 0) / DEFAULT_HISTORY.length).toFixed(1) + "%", color: "var(--ink)" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "16px 20px" }}>
              <p className="label" style={{ marginBottom: 4 }}>{s.label}</p>
              <div className="stat-number" style={{ fontSize: 28, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Filter + search ── */}
        <div className="search-row">
          <input
            className="search-input"
            placeholder="Search subjects, senders, signals…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {["all", "phishing", "legitimate"].map(f => (
            <button key={f} className={`filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>From</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>Top signal</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state" style={{ padding: "40px 24px" }}>
                    No results match your filter.
                  </td>
                </tr>
              )}
              {rows.map(row => (
                <tr key={row.id}>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>
                    {row.date}
                  </td>
                  <td style={{ fontFamily: "var(--tight)", fontWeight: 600, maxWidth: 220 }}>
                    <span title={row.subject}>{row.subject.length > 40 ? row.subject.slice(0, 40) + "…" : row.subject}</span>
                  </td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#888", maxWidth: 180 }}>
                    {row.from}
                  </td>
                  <td>
                    <span className={`badge badge-${row.result.toLowerCase()}`}>{row.result}</span>
                  </td>
                  <td><ConfBar pct={row.confidence} type={row.result} /></td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#888" }}>{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#bbb", marginTop: 16 }}>
          Showing {rows.length} of {DEFAULT_HISTORY.length} scans
        </p>
      </div>
    </div>
  );
}
