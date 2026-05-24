import { useState } from "react";

function AuthPanel({ mode }) {
  return (
    <div className="auth-panel-left">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <div style={{
            width: 28, height: 28,
            background: "var(--lime)",
            border: "1px solid var(--lime)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--tight)", fontWeight: 900, fontSize: 14, color: "var(--ink)"
          }}>P</div>
          <span style={{ fontFamily: "var(--tight)", fontWeight: 800, fontSize: 18 }}>PhishGuard</span>
        </div>

        <h2 style={{
          fontFamily: "var(--tight)", fontWeight: 900, fontSize: 36,
          letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16
        }}>
          {mode === "login"
            ? <>Your inbox,<br /><em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>defended.</em></>
            : <>Phishing stops<br /><em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>here.</em></>
          }
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 280 }}>
          AI-powered detection using DistilBERT + LoRA, trained on real phishing campaigns.
        </p>
      </div>

      <div>
        <div className="deco-card">
          <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Live detection</div>
          <div style={{ marginBottom: 4 }}>Subject: Urgent: Verify your account now</div>
          <div style={{ color: "rgba(255,255,255,0.4)" }}>From: security@paypa1-support.com</div>
          <div style={{
            marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 10px", border: "1px solid rgba(220,38,38,0.6)",
            background: "rgba(220,38,38,0.1)", color: "#f87171",
            fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase"
          }}>
            ● PHISHING — 98.7%
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
          {[["97.8%", "Accuracy"], ["96.5%", "F1 Score"], ["92.0%", "AI-phishing"], ["<50ms", "Latency"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--tight)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>{n}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoginPage({ onNav, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    onLogin("Rayyan");
  }

  return (
    <div className="auth-layout">
      <AuthPanel mode="login" />
      <div className="auth-panel-right">
        <div style={{ marginBottom: 32 }}>
          <p className="label" style={{ marginBottom: 8 }}>Welcome back</p>
          <h1 style={{ fontFamily: "var(--tight)", fontWeight: 900, fontSize: 28, letterSpacing: "-0.03em" }}>
            Log in
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <button className="social-btn" onClick={() => onLogin("Rayyan")}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <button className="social-btn" onClick={() => onLogin("Rayyan")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Continue with GitHub
          </button>
        </div>

        <div className="divider">or</div>

        {error && <div className="toast-error" style={{ marginTop: 12 }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input-field" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input-field" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="checkbox-row">
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontFamily: "var(--tight)", fontWeight: 600,
              textDecoration: "underline"
            }}>Forgot password?</button>
          </div>
          <button type="submit" className="btn btn-ink btn-full" style={{ marginTop: 4 }}>
            Log in
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 13, color: "#888", textAlign: "center" }}>
          No account?{" "}
          <button onClick={() => onNav("signup")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--tight)", fontWeight: 700, fontSize: 13,
            textDecoration: "underline", color: "var(--ink)"
          }}>Sign up</button>
        </p>
      </div>
    </div>
  );
}

export function SignupPage({ onNav, onLogin }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!first || !email || !password) { setError("Please fill in all required fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!agreed) { setError("You must agree to the terms."); return; }
    onLogin(first || "Rayyan");
  }

  return (
    <div className="auth-layout">
      <AuthPanel mode="signup" />
      <div className="auth-panel-right">
        <div style={{ marginBottom: 32 }}>
          <p className="label" style={{ marginBottom: 8 }}>Free forever</p>
          <h1 style={{ fontFamily: "var(--tight)", fontWeight: 900, fontSize: 28, letterSpacing: "-0.03em" }}>
            Create account
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <button className="social-btn" onClick={() => onLogin("Rayyan")}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>
          <button className="social-btn" onClick={() => onLogin("Rayyan")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Sign up with GitHub
          </button>
        </div>

        <div className="divider">or</div>

        {error && <div className="toast-error" style={{ marginTop: 12 }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div className="form-row">
            <div className="input-group">
              <label className="input-label">First name</label>
              <input className="input-field" placeholder="Rayyan"
                value={first} onChange={e => setFirst(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Last name</label>
              <input className="input-field" placeholder="Kashif"
                value={last} onChange={e => setLast(e.target.value)} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input-field" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input-field" type="password" placeholder="Min. 8 characters"
              value={password} onChange={e => setPassword(e.target.value)} />
            {password && (
              <p className="input-hint">
                Strength: {password.length < 8 ? "weak" : password.length < 12 ? "fair" : "strong"}
              </p>
            )}
          </div>
          <div className="input-group">
            <label className="input-label">Confirm password</label>
            <input className="input-field" type="password" placeholder="••••••••"
              value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          <label className="checkbox-row">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            I agree to the <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span>
          </label>
          <button type="submit" className="btn btn-ink btn-full" style={{ marginTop: 4 }}>
            Create account
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 13, color: "#888", textAlign: "center" }}>
          Already have an account?{" "}
          <button onClick={() => onNav("login")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--tight)", fontWeight: 700, fontSize: 13,
            textDecoration: "underline", color: "var(--ink)"
          }}>Log in</button>
        </p>
      </div>
    </div>
  );
}
