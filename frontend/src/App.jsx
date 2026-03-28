import { useState } from "react";

const API_URL = "http://localhost:8001";

// ── Tokens ──────────────────────────────────────────────────────────────────
const colors = {
  bg:        "#0a0a0f",
  surface:   "#111118",
  border:    "#1e1e2e",
  borderHov: "#2e2e4e",
  blue:      "#3b82f6",
  blueDim:   "#1d4ed8",
  blueGlow:  "rgba(59,130,246,0.15)",
  text:      "#e2e8f0",
  muted:     "#64748b",
  error:     "#f87171",
};

// ── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${colors.bg};
    color: ${colors.text};
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
  }

  .auth-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }

  /* Left panel */
  .auth-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    position: relative;
    border-right: 1px solid ${colors.border};
    background: ${colors.surface};
  }

  .auth-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: ${colors.text};
    text-decoration: none;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: ${colors.blue};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .left-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 0;
  }

  .left-headline {
    font-size: 42px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
    color: ${colors.text};
  }

  .left-headline span {
    color: ${colors.blue};
  }

  .left-desc {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 300;
    color: ${colors.muted};
    line-height: 1.7;
    max-width: 340px;
  }

  .left-features {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: ${colors.muted};
  }

  .feature-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${colors.blue};
    flex-shrink: 0;
  }

  .left-footer {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: ${colors.muted};
    opacity: 0.5;
  }

  /* Right panel */
  .auth-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    position: relative;
  }

  .auth-right::before {
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-card {
    width: 100%;
    max-width: 400px;
  }

  .auth-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 40px;
    border-bottom: 1px solid ${colors.border};
  }

  .auth-tab {
    flex: 1;
    padding: 12px 0;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${colors.muted};
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: -1px;
  }

  .auth-tab:hover { color: ${colors.text}; }

  .auth-tab.active {
    color: ${colors.blue};
    border-bottom-color: ${colors.blue};
  }

  .auth-title {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
    color: ${colors.text};
  }

  .auth-subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: ${colors.muted};
    margin-bottom: 36px;
    line-height: 1.6;
  }

  .field {
    margin-bottom: 20px;
  }

  .field-label {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${colors.muted};
    margin-bottom: 8px;
  }

  .field-input {
    width: 100%;
    padding: 13px 16px;
    background: ${colors.surface};
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 300;
    color: ${colors.text};
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field-input::placeholder { color: ${colors.muted}; opacity: 0.5; }

  .field-input:focus {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.blueGlow};
  }

  .field-input.error { border-color: ${colors.error}; }

  .field-error {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: ${colors.error};
    margin-top: 6px;
  }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: ${colors.blue};
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
  }

  .btn-primary:hover {
    background: ${colors.blueDim};
    box-shadow: 0 4px 20px rgba(59,130,246,0.3);
  }

  .btn-primary:active { transform: scale(0.99); }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .btn-primary .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: ${colors.muted};
  }

  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${colors.border};
  }

  .success-banner {
    padding: 14px 16px;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: ${colors.blue};
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .error-banner {
    padding: 14px 16px;
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: ${colors.error};
    margin-bottom: 20px;
    line-height: 1.5;
  }

  /* Grid noise overlay */
  .noise {
    position: fixed;
    inset: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
    pointer-events: none;
    z-index: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 32px 24px; }
  }
`;

// ── Components ────────────────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, error }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <input
        className={`field-input${error ? " error" : ""}`}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      localStorage.setItem("token", data.access_token);
      onSuccess(data.access_token);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Sign in to manage your aliases</p>

      {error && <div className="error-banner">{error}</div>}

      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading && <span className="spinner" />}
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <>
      <h2 className="auth-title">You're in</h2>
      <p className="auth-subtitle">Account created successfully</p>
      <div className="success-banner">
        ✓ Account created for {email}<br />
        You can now sign in and create aliases.
      </div>
      <button className="btn-primary" onClick={onSwitchToLogin}>
        Go to Sign in →
      </button>
    </>
  );

  return (
    <>
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">Start protecting your real email address</p>

      {error && <div className="error-banner">{error}</div>}

      <Field label="Your real email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 6 characters" />

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading && <span className="spinner" />}
        {loading ? "Creating account..." : "Create account"}
      </button>
    </>
  );
}

// ── Dashboard stub ────────────────────────────────────────────────────────────
function Dashboard({ token, onLogout }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
      fontFamily: "'JetBrains Mono', monospace",
      color: colors.muted,
      fontSize: 13,
    }}>
      <div style={{ color: colors.blue, fontSize: 24, fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
        ✓ Logged in
      </div>
      <div>Token saved. Dashboard coming next.</div>
      <button
        onClick={onLogout}
        style={{
          marginTop: 8,
          padding: "8px 20px",
          background: "none",
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          color: colors.muted,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
        }}
      >
        Logout
      </button>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
// import Dashboard from "./Dashboard";
export default function App() {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (token) return (
  <Dashboard
    token={token}
    onLogout={handleLogout}
    userEmail="user@example.com"
        />
    );

  return (
    <>
      <style>{css}</style>
      <div className="noise" />

      <div className="auth-root">
        {/* Left */}
        <div className="auth-left">
          <a className="logo" href="#">
            <div className="logo-icon">✉</div>
            RelayMail
          </a>

          <div className="left-content">
            <h1 className="left-headline">
              Your email,<br />
              <span>without the noise.</span>
            </h1>
            <p className="left-desc">
              Generate disposable aliases. Forward mail to your real inbox.
              Stay private everywhere.
            </p>

            <div className="left-features">
              {[
                "Unlimited aliases per account",
                "Instant forwarding to real inbox",
                "One-click alias deactivation",
                "No tracking, no ads",
              ].map(f => (
                <div className="feature-item" key={f}>
                  <div className="feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="left-footer">relaymails.dev — open source</div>
        </div>

        {/* Right */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                className={`auth-tab${tab === "login" ? " active" : ""}`}
                onClick={() => setTab("login")}
              >
                Sign in
              </button>
              <button
                className={`auth-tab${tab === "register" ? " active" : ""}`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>

            {tab === "login"
              ? <LoginForm onSuccess={setToken} />
              : <RegisterForm onSwitchToLogin={() => setTab("login")} />
            }
          </div>
        </div>
      </div>
    </>
  );
}