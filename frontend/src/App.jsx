import { useState, useEffect } from "react";
const SITE_KEY = import.meta.env.VITE_DATA_SITEKEY
import Dashboard from "./Dashboard";
import Profile from "./Profile";

// const API_URL = "https://relaymails.dev/api";
const API_URL = import.meta.env.VITE_API_URL;

window.onTurnstileSuccess = (token) => {
  document.dispatchEvent(new CustomEvent("turnstile-success", { detail: token }));
};

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
  muted2:    "#475569",
  error:     "#f87171",
  green:     "#4ade80",
};

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

  .left-headline span { color: ${colors.blue}; }

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
    font-size: 15px;
    color: ${colors.muted};
    opacity: 0.5;
  }

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

  /* Mobile header — скрыт на десктопе */
  .mobile-header {
    display: none;
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

  .field { margin-bottom: 20px; }

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

  .btn-ghost {
    padding: 7px 14px;
    background: none;
    border: 1px solid ${colors.border};
    border-radius: 7px;
    color: ${colors.muted};
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: ${colors.muted2}; color: ${colors.text}; }

  .btn-google {
    width: 100%;
    padding: 13px;
    background: none;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    color: ${colors.text};
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 8px;
  }
  .btn-google:hover {
    border-color: ${colors.muted2};
    background: rgba(255,255,255,0.03);
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

  .noise {
    position: fixed;
    inset: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── MOBILE ─────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .auth-root {
      grid-template-columns: 1fr;
      min-height: 100vh;
    }

    .auth-left { display: none; }

    .auth-right {
      padding: 0;
      align-items: flex-start;
      min-height: 100vh;
      flex-direction: column;
    }

    /* Мобильный хедер */
    .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid ${colors.border};
      background: ${colors.surface};
      width: 100%;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .mobile-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: ${colors.text};
    }

    .mobile-logo-icon {
      width: 26px;
      height: 26px;
      background: ${colors.blue};
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }

    .mobile-tagline {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: ${colors.muted};
    }

    .auth-card {
      width: 100%;
      max-width: 100%;
      padding: 28px 24px 40px;
      flex: 1;
    }

    .auth-title { font-size: 24px; }

    .auth-tabs { margin-bottom: 28px; }
  }
`;

function Field({ label, type = "text", value, onChange, placeholder, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div style={{ position: "relative" }}>
        <input
          className={`field-input${error ? " error" : ""}`}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          style={isPassword ? { paddingRight: 40 } : {}}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            style={{
              position: "absolute", right: 10, top: "50%",
              transform: "translateY(-50%)", background: "none",
              border: "none", cursor: "pointer", color: colors.muted, padding: 0
            }}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

function LoginForm({ onSuccess, email, setEmail, password, setPassword }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

      <div className="auth-divider">or</div>

      <button className="btn-google" onClick={() => window.location.href = `${API_URL}/auth/google`}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
        </svg>
        Continue with Google
      </button>
    </>
  );
}

function ResendButton({ email }) {
  const [seconds, setSeconds] = useState(60);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleResend = async () => {
    setSending(true); setSent(false);
    try {
      const res = await fetch(`${API_URL}/users/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      setSeconds(60);
    } catch {
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.muted }}>
      {sent && <div style={{ color: colors.green, marginBottom: 8 }}>✓ Code sent</div>}
      {seconds > 0 ? (
        <span>Resend code in {seconds}s</span>
      ) : (
        <button
          onClick={handleResend}
          disabled={sending}
          style={{
            background: "none", border: "none", color: colors.blue,
            cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, textDecoration: "underline"
          }}
        >
          {sending ? "Sending..." : "Resend code"}
        </button>
      )}
    </div>
  );
}

function RegisterForm({ onSwitchToLogin, onSuccess, email, setEmail, password, setPassword }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("register");
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [cfToken, setCfToken] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        window.turnstile.render("#cf-turnstile-container", {
          sitekey: SITE_KEY,
          callback: (token) => setCfToken(token),
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Fill in all fields"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters, include 1 uppercase and 1 special character"); return; }
    if (!agreed) { setError("Please agree to Terms and Privacy Policy"); return; }
    if (!cfToken) { setError("Please complete the captcha"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, cf_token: cfToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      setStep("verify");
    } catch (e) {
      if (e.message.includes("already registered")) {
        onSwitchToLogin(); // ← переключает на логин с заполненными данными
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 4) { setError("Enter 4-digit code"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/users/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid code");
      localStorage.setItem("token", data.access_token);
      onSuccess(data.access_token);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") return (
    <>
      <h2 className="auth-title">Check your email</h2>
      <p className="auth-subtitle">We sent a 4-digit code to {email}</p>

      {error && <div className="error-banner">{error}</div>}

      <Field label="Verification code" value={code} onChange={setCode} placeholder="0000" />

      <button className="btn-primary" onClick={handleVerify} disabled={loading}>
        {loading && <span className="spinner" />}
        {loading ? "Verifying..." : "Verify email"}
      </button>

      <div className="auth-divider">or</div>

      <ResendButton email={email} />

      <button className="btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => setStep("register")}>
        ← Back
      </button>
    </>
  );

  return (
    <>
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">Start protecting your real email address</p>

      {error && <div className="error-banner">{error}</div>}

      <Field label="Your real email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 chars, 1 uppercase, 1 special" />

      <div id="cf-turnstile-container" style={{ margin: "16px 0" }} />

      <button className="btn-primary" onClick={handleSubmit} disabled={loading || !agreed}>
        {loading && <span className="spinner" />}
        {loading ? "Creating account..." : "Create account"}
      </button>

      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10, margin: "16px 0",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.muted
      }}>
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, accentColor: colors.blue, cursor: "pointer" }}
        />
        <label htmlFor="agree" style={{ cursor: "pointer", lineHeight: 1.5 }}>
          I agree to the{" "}
          <a href="/terms" target="_blank" style={{ color: colors.blue }}>Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" target="_blank" style={{ color: colors.blue }}>Privacy Policy</a>
        </label>
      </div>

      <div className="auth-divider">or</div>

      <button className="btn-google" onClick={() => window.location.href = `${API_URL}/auth/google`}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
        </svg>
        Continue with Google
      </button>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("login");
  const [sharedEmail, setSharedEmail] = useState("");
  const [sharedPassword, setSharedPassword] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [userEmail, setUserEmail] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleToken = params.get("token");
    if (googleToken) {
      localStorage.setItem("token", googleToken);
      setToken(googleToken);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => setUserEmail(data.email || ""))
        .catch(() => {});
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserEmail("");
    setShowProfile(false);
  };

  if (token && showProfile) return (
    <Profile
    token={token}
    userEmail={userEmail}
    onLogout={handleLogout}
    onBack={() => setShowProfile(false)}
    />
  );

  if (token) return (
    <Dashboard
    token={token}
    onLogout={handleLogout}
    userEmail={userEmail}
    onProfile={() => setShowProfile(true)}
    />
  );

  return (
    <>
      <style>{css}</style>
      <div className="noise" />

      <div className="auth-root">
        {/* Left panel — desktop only */}
        <div className="auth-left">
          <a className="logo" href="#">
            <div className="logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            RelayMails
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
          <a className="left-footer" href="mailto:support@relaymails.dev">
            support@relaymails.dev
          </a>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          {/* Mobile header */}
          <div className="mobile-header">
            <div className="mobile-logo">
              <div className="mobile-logo-icon">✉</div>
              RelayMails
            </div>
            <span className="mobile-tagline">Your email, private.</span>
          </div>

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
              ? <LoginForm
                  onSuccess={setToken}
                  email={sharedEmail}
                  setEmail={setSharedEmail}
                  password={sharedPassword}
                  setPassword={setSharedPassword}
                />
              : <RegisterForm
                  onSwitchToLogin={() => setTab("login")}
                  onSuccess={setToken}
                  email={sharedEmail}
                  setEmail={setSharedEmail}
                  password={sharedPassword}
                  setPassword={setSharedPassword}
                />
            }
          </div>
        </div>
      </div>
    </>
  );
}