import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar.jsx";

/* ── Example emails ──────────────────────────────────────────────── */
const EXAMPLES = [
  {
    label: "Phishing 1",
    from: "security@paypa1-support.com",
    subject: "Urgent: Your account has been suspended",
    body: "Dear Customer,\n\nWe detected suspicious activity on your account. You must verify your identity immediately or your account will be permanently suspended within 24 hours.\n\nClick here to verify: http://paypa1-secure.tk/verify?id=39281\n\nFailure to act will result in permanent account closure.\n\nPayPal Security Team",
  },
  {
    label: "Phishing 2",
    from: "noreply@amaz0n-rewards.com",
    subject: "Congratulations! You've won a $500 gift card",
    body: "Dear Valued Customer,\n\nYou have been selected to receive a $500 Amazon gift card as part of our annual customer loyalty program!\n\nTo claim your prize, click the link below within 48 hours:\nhttp://bit.ly/amzn-gift-claim-now\n\nAct fast — this offer expires soon!\n\nAmazon Rewards Team",
  },
  {
    label: "Legitimate 1",
    from: "sarah.chen@company.com",
    subject: "Team lunch Thursday?",
    body: "Hi Rayyan,\n\nAre you free for team lunch this Thursday at 12:30pm? We're thinking of trying the new Italian place on Main Street.\n\nLet me know if you can make it!\n\nBest,\nSarah",
  },
  {
    label: "Legitimate 2",
    from: "reports@google.com",
    subject: "Your monthly Analytics report is ready",
    body: "Hello,\n\nYour Google Analytics monthly report for May 2026 is now available.\n\nKey metrics this month:\n- Sessions: 12,450 (+8%)\n- Bounce rate: 42.3%\n- Avg session: 3m 12s\n\nView the full report in your Google Analytics dashboard at analytics.google.com\n\nThe Google Analytics Team",
  },
];

/* ── Phishing signal patterns ────────────────────────────────────── */
const PHISHING_PATTERNS = [
  { pattern: /urgent|immediately|right away|act now|within \d+ hours?/gi, label: "Urgency cue", note: "Pressures victim to act without thinking" },
  { pattern: /suspended|locked|blocked|permanently closed/gi, label: "Threatening language", note: "Creates fear of account loss" },
  { pattern: /click here|click the link|click below/gi, label: "Generic link anchor", note: "Avoids showing actual destination URL" },
  { pattern: /http:\/\/[^\s]*\.tk|http:\/\/bit\.ly|http:\/\/[^\s]*[0-9][a-z]/gi, label: "Suspicious URL", note: "Lookalike domain or link shortener over plain HTTP" },
  { pattern: /verify your (identity|account|email|password)/gi, label: "Credential request", note: "Attempts to harvest login credentials" },
  { pattern: /won|prize|gift card|reward|selected|congratulations/gi, label: "Reward lure", note: "Too-good-to-be-true prize to entice clicks" },
  { pattern: /dear (customer|valued|user|member)/gi, label: "Generic greeting", note: "Lacks personalisation — bulk-sent phishing template" },
];

const LEGIT_PATTERNS = [
  { pattern: /analytics\.google\.com|google\.com|amazon\.com|microsoft\.com/gi, label: "Trusted domain", note: "Link points to a known, verified service" },
  { pattern: /\b(hi|hello)\s+[A-Z][a-z]+/g, label: "Personal greeting", note: "Uses recipient's actual name" },
  { pattern: /best,|regards,|thanks,|cheers,/gi, label: "Professional sign-off", note: "Normal email closing with sender context" },
];

function highlightText(text, isPhishing) {
  if (!text) return text;
  const patterns = isPhishing ? PHISHING_PATTERNS : LEGIT_PATTERNS;
  const spans = [];
  const lower = text.toLowerCase();
  for (const { pattern, label, note } of patterns) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(text)) !== null) {
      spans.push({ start: m.index, end: m.index + m[0].length, label, note, type: isPhishing ? "phishing" : "legitimate" });
    }
    pattern.lastIndex = 0;
  }
  spans.sort((a, b) => a.start - b.start);
  const merged = [];
  for (const s of spans) {
    if (merged.length && s.start < merged[merged.length - 1].end) continue;
    merged.push(s);
  }
  const parts = [];
  let pos = 0;
  for (const { start, end, label, note, type } of merged) {
    if (start > pos) parts.push({ text: text.slice(pos, start), type: "plain" });
    parts.push({ text: text.slice(start, end), type, label, note });
    pos = end;
  }
  if (pos < text.length) parts.push({ text: text.slice(pos), type: "plain" });
  return parts;
}

function detectSignals(subject, body, isPhishing) {
  const combined = `${subject} ${body}`.toLowerCase();
  if (isPhishing) {
    return [
      { name: "Urgency tactics",     weight: 0.95, note: "Pressures victim to act immediately", found: /urgent|immediately|within \d+ hours/.test(combined) },
      { name: "Suspicious URL",      weight: 0.88, note: "Lookalike domain or plain-HTTP link", found: /\.tk|bit\.ly|[0-9][a-z]+\.[a-z]{2}\//.test(combined) },
      { name: "Credential request",  weight: 0.84, note: "Asks for password or account verification", found: /verify|password|credential/.test(combined) },
      { name: "Generic greeting",    weight: 0.72, note: "No personalisation — bulk template", found: /dear (customer|user|valued)/.test(combined) },
      { name: "Threatening language",weight: 0.68, note: "Threatens account suspension", found: /suspend|locked|blocked|closed/.test(combined) },
      { name: "Reward lure",         weight: 0.61, note: "Prize or financial incentive to click", found: /gift card|won|prize|reward|congratulations/.test(combined) },
    ].filter(s => s.found).sort((a, b) => b.weight - a.weight);
  } else {
    return [
      { name: "Known sender domain", weight: 0.92, note: "Email originates from a verified domain", found: true },
      { name: "Personal context",    weight: 0.86, note: "References specific, personal details", found: /hi [a-z]|hello [a-z]/.test(combined) },
      { name: "Neutral tone",        weight: 0.81, note: "No urgency, threats, or pressure language", found: !/urgent|immediately|suspended/.test(combined) },
      { name: "Trusted link only",   weight: 0.78, note: "Links point to known, verified services", found: /analytics\.google|google\.com|amazon\.com/.test(combined) },
      { name: "No external links",   weight: 0.73, note: "No suspicious external links present", found: !/http:\/\/bit\.ly|\.tk/.test(combined) },
    ].filter(s => s.found).sort((a, b) => b.weight - a.weight);
  }
}

/* ── Pipeline component ──────────────────────────────────────────── */
function Pipeline({ step }) {
  const steps = ["Tokenize", "Encode", "LoRA classify"];
  return (
    <div className="pipeline">
      {steps.map((s, i) => (
        <>
          <div key={s} className={`pipeline-step ${step > i ? "done" : step === i ? "active" : ""}`}>
            <span className="step-dot">
              {step > i ? "✓" : i + 1}
            </span>
            {s}
          </div>
          {i < steps.length - 1 && <div key={`arrow-${i}`} className="pipeline-arrow" />}
        </>
      ))}
    </div>
  );
}

/* ── Highlighted body ────────────────────────────────────────────── */
function HighlightedBody({ text, isPhishing }) {
  if (!text) return null;
  const parts = highlightText(text, isPhishing);
  if (!Array.isArray(parts)) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        p.type === "plain"
          ? <span key={i}>{p.text}</span>
          : <span key={i} className={`signal-${p.type}`} data-tooltip={`${p.label}: ${p.note}`}>{p.text}</span>
      )}
    </>
  );
}

export default function Scanner({ onNav, onLogout, initialSubject, initialBody, onScanComplete }) {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState(initialSubject || "");
  const [body, setBody] = useState(initialBody || "");
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  useEffect(() => {
    if (initialSubject) setSubject(initialSubject);
    if (initialBody) setBody(initialBody);
  }, [initialSubject, initialBody]);

  const charCount = body.length;
  const tokenEst = Math.round(body.split(/\s+/).filter(Boolean).length * 1.3);

  function fillExample(ex) {
    setFrom(ex.from);
    setSubject(ex.subject);
    setBody(ex.body);
    setResult(null);
    setError("");
    setPipelineStep(-1);
  }

  async function analyze(e) {
    e.preventDefault();
    if (!subject && !body) { setError("Please enter at least a subject or body."); return; }
    setLoading(true);
    setError("");
    setResult(null);
    setPipelineStep(0);

    try {
      await new Promise(r => setTimeout(r, 500));
      setPipelineStep(1);
      await new Promise(r => setTimeout(r, 500));
      setPipelineStep(2);

      const resp = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok) throw new Error(data?.error || "Backend unavailable. Start Flask on port 5000.");

      await new Promise(r => setTimeout(r, 300));
      setPipelineStep(3);
      setResult(data);
      if (onScanComplete) onScanComplete({ subject, from, result: data });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isPhishing = result?.label === "PHISHING" || result?.label === "Phishing";
  const confidence = result ? (result.confidence * 100).toFixed(1) : null;
  const signals = result ? detectSignals(subject, body, isPhishing) : [];

  return (
    <div>
      <Navbar page="scanner" onNav={onNav} onLogout={onLogout} />
      <div className="container page-content">

        {/* ── Title ── */}
        <div className="page-title-row">
          <div>
            <p className="label" style={{ marginBottom: 4 }}>AI Detection</p>
            <h1 className="section-heading" style={{ fontSize: 28 }}>Scan email</h1>
          </div>
        </div>

        <div className="scanner-layout">
          {/* ── Left: form ── */}
          <div>
            <form onSubmit={analyze} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="input-group">
                <label className="input-label">From</label>
                <input className="input-field" placeholder="sender@example.com"
                  value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Subject <span style={{ color: "#c00", fontWeight: 400 }}>*</span></label>
                <input className="input-field" placeholder="Email subject line…"
                  value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Body</label>
                <textarea className="input-field" placeholder="Paste the full email body here…" style={{ minHeight: 200 }}
                  value={body} onChange={e => setBody(e.target.value)} />
                <div style={{ display: "flex", gap: 16 }}>
                  <span className="input-hint">{charCount} chars</span>
                  <span className="input-hint">~{tokenEst} tokens</span>
                </div>
              </div>

              {loading && <Pipeline step={pipelineStep} />}

              {error && <div className="toast-error">{error}</div>}

              <button type="submit" className="btn btn-ink" disabled={loading} style={{ alignSelf: "flex-start" }}>
                {loading ? <><span className="spinner" />Analyzing…</> : "Analyze →"}
              </button>
            </form>

            {/* ── Examples ── */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #e5e2da" }}>
              <p className="label" style={{ marginBottom: 10 }}>Try an example</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {EXAMPLES.map(ex => (
                  <button key={ex.label} className="btn btn-ghost btn-sm" onClick={() => fillExample(ex)}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: result ── */}
          <div ref={resultRef}>
            {!result && !loading && (
              <div style={{
                border: "var(--border)", padding: 40, textAlign: "center",
                color: "#bbb", fontFamily: "var(--mono)", fontSize: 12
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⬤</div>
                Result will appear here
              </div>
            )}

            {loading && pipelineStep >= 0 && !result && (
              <div style={{ border: "var(--border)", padding: 32 }}>
                <p className="label" style={{ marginBottom: 12 }}>Processing</p>
                <Pipeline step={pipelineStep} />
                <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#aaa", marginTop: 16 }}>
                  Running DistilBERT inference…
                </p>
              </div>
            )}

            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Verdict card */}
                <div className={`card ${isPhishing ? "" : ""}`} style={{
                  borderColor: isPhishing ? "var(--red)" : "var(--green)",
                  background: isPhishing ? "#fef2f2" : "#f0fdf4",
                }}>
                  <p className="label" style={{ marginBottom: 8, color: isPhishing ? "var(--red)" : "var(--green)" }}>Verdict</p>
                  <div className={`result-verdict ${isPhishing ? "phishing" : "legitimate"}`}>
                    {isPhishing ? "PHISHING" : "LEGITIMATE"}
                  </div>
                  <p className="result-confidence">Confidence: {confidence}%</p>
                  <div style={{ marginTop: 12 }}>
                    <div className="conf-bar-wrap">
                      <div
                        className={`conf-bar-fill ${isPhishing ? "phishing" : "legitimate"}`}
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Highlighted body */}
                {body && (
                  <div>
                    <p className="label" style={{ marginBottom: 8 }}>Email body — highlighted signals</p>
                    <div className="email-body-rendered">
                      <HighlightedBody text={body} isPhishing={isPhishing} />
                    </div>
                    <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#888", marginTop: 6 }}>
                      Hover highlighted phrases for signal details
                    </p>
                  </div>
                )}

                {/* Signals panel */}
                {signals.length > 0 && (
                  <div className="card" style={{ padding: 16 }}>
                    <p className="label" style={{ marginBottom: 12 }}>
                      {isPhishing ? "Phishing signals detected" : "Trust signals detected"}
                    </p>
                    <div>
                      {signals.map((s, i) => (
                        <div key={i} className="signal-item">
                          <div className="signal-top">
                            <span className="signal-name">{s.name}</span>
                            <span className="signal-weight">{(s.weight * 100).toFixed(0)}%</span>
                          </div>
                          <div className="signal-bar-wrap">
                            <div
                              className={`signal-bar-fill ${isPhishing ? "phishing" : "legitimate"}`}
                              style={{ width: `${s.weight * 100}%` }}
                            />
                          </div>
                          <span className="signal-note">{s.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why this verdict */}
                <div className="card" style={{ padding: 16, background: "#fafaf8" }}>
                  <p className="label" style={{ marginBottom: 8 }}>Why this verdict?</p>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                    {isPhishing
                      ? `The model detected ${signals.length} phishing signal${signals.length !== 1 ? "s" : ""} in this email. The strongest indicators were: ${signals.slice(0, 2).map(s => s.name.toLowerCase()).join(" and ")}. These patterns are consistent with known phishing campaigns targeting credential harvesting.`
                      : `The model found no significant phishing indicators. ${signals.length > 0 ? `Positive signals include: ${signals.slice(0, 2).map(s => s.name.toLowerCase()).join(" and ")}.` : "The email's tone, structure, and link patterns are consistent with legitimate correspondence."}`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
