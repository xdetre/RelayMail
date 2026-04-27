import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// const API_URL = "https://relaymails.dev/api";
const API_URL = import.meta.env.VITE_API_URL;
const POLL_INTERVAL = 8000; // 8 секунд


const colors = {
  bg:       "#080810",
  surface:  "#0f0f1a",
  surface2: "#141420",
  border:   "#1a1a2e",
  blue:     "#3b82f6",
  blueDim:  "#1d4ed8",
  cyan:     "#22d3ee",
  text:     "#e2e8f0",
  muted:    "#64748b",
  muted2:   "#475569",
  green:    "#4ade80",
  greenBg:  "rgba(74,222,128,0.08)",
  error:    "#f87171",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${colors.bg};
    color: ${colors.text};
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Background grid ── */
  .tm-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .tm-glow {
    position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
    width: 800px; height: 600px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* ── Nav ── */
  .tm-nav {
    position: sticky; top: 0; z-index: 20;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 56px;
    background: rgba(8,8,16,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${colors.border};
  }
  .tm-logo {
    display: flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 800; letter-spacing: -0.3px;
    color: ${colors.text}; text-decoration: none;
  }
  .tm-logo-icon {
    width: 26px; height: 26px; background: ${colors.blue};
    border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px;
  }
  .tm-nav-right { display: flex; align-items: center; gap: 10px; }
  .btn-nav {
    padding: 6px 14px; border-radius: 6px; font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
  }
  .btn-nav-ghost {
    background: none; border: 1px solid ${colors.border}; color: ${colors.muted};
  }
  .btn-nav-ghost:hover { border-color: ${colors.muted2}; color: ${colors.text}; }
  .btn-nav-primary {
    background: ${colors.blue}; border: none; color: #fff;
  }
  .btn-nav-primary:hover { background: ${colors.blueDim}; }

  /* ── Hero ── */
  .tm-hero {
    position: relative; z-index: 1;
    text-align: center;
    padding: 48px 24px 32px;
  }
  .tm-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px;
    background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2);
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.cyan};
    margin-bottom: 20px; letter-spacing: 0.5px;
  }
  .tm-badge-dot {
    width: 5px; height: 5px; border-radius: 50%; background: ${colors.cyan};
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  .tm-title {
    font-size: clamp(28px, 6vw, 52px);
    font-weight: 800; letter-spacing: -2px; line-height: 1.05;
    margin-bottom: 14px;
  }
  .tm-title span { color: ${colors.blue}; }
  .tm-subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(12px, 2vw, 14px);
    color: ${colors.muted}; line-height: 1.7;
    max-width: 480px; margin: 0 auto 32px;
  }

  /* ── Main area ── */
  .tm-main {
    position: relative; z-index: 1;
    max-width: 720px; margin: 0 auto; padding: 0 16px 60px;
  }

  /* ── Aliases grid ── */
  .tm-aliases {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    margin-bottom: 24px;
  }
  .alias-card {
    background: ${colors.surface}; border: 1px solid ${colors.border};
    border-radius: 12px; padding: 16px;
    cursor: pointer; transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .alias-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(59,130,246,0.04) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .alias-card:hover { border-color: ${colors.blue}; }
  .alias-card:hover::before { opacity: 1; }
  .alias-card.selected {
    border-color: ${colors.blue};
    background: ${colors.surface2};
  }
  .alias-card.selected::before { opacity: 1; }
  .alias-card-label {
    font-family: 'JetBrains Mono', monospace; font-size: 9px;
    color: ${colors.muted}; letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 6px;
  }
  .alias-card-email {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: ${colors.text}; word-break: break-all; line-height: 1.4;
  }
  .alias-card-email span { color: ${colors.blue}; }
  .alias-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 10px;
  }
  .alias-timer {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${colors.muted};
  }
  .alias-timer.urgent { color: ${colors.error}; }
  .alias-copy-btn {
    background: none; border: none; color: ${colors.muted};
    cursor: pointer; font-size: 14px; padding: 2px 6px;
    border-radius: 4px; transition: all 0.15s;
  }
  .alias-copy-btn:hover { color: ${colors.blue}; background: rgba(59,130,246,0.1); }

  /* ── Inbox ── */
  .tm-inbox {
    background: ${colors.surface}; border: 1px solid ${colors.border};
    border-radius: 14px; overflow: hidden;
  }
  .tm-inbox-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid ${colors.border};
    background: ${colors.surface2};
  }
  .tm-inbox-title {
    font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px;
  }
  .inbox-count {
    padding: 2px 8px; border-radius: 10px;
    background: rgba(59,130,246,0.15); color: ${colors.blue};
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
  }
  .inbox-live {
    display: flex; align-items: center; gap: 5px;
    font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${colors.green};
  }
  .inbox-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: ${colors.green};
    animation: pulse-dot 1.5s ease-in-out infinite;
  }

  /* Email list */
  .email-list { min-height: 200px; }
  .email-item {
    padding: 14px 20px; border-bottom: 1px solid ${colors.border};
    cursor: pointer; transition: background 0.15s;
  }
  .email-item:last-child { border-bottom: none; }
  .email-item:hover { background: ${colors.surface2}; }
  .email-item.unread { border-left: 2px solid ${colors.blue}; }
  .email-item-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
  .email-sender {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: ${colors.text}; font-weight: 500;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;
  }
  .email-time {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: ${colors.muted}; white-space: nowrap; flex-shrink: 0;
  }
  .email-subject {
    font-size: 13px; color: ${colors.text}; margin-bottom: 2px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .email-preview {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: ${colors.muted}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* Email detail */
  .email-detail {
    padding: 20px;
    border-top: 1px solid ${colors.border};
    background: ${colors.surface2};
  }
  .email-detail-header { margin-bottom: 16px; }
  .email-detail-subject { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  .email-detail-meta {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: ${colors.muted}; line-height: 1.8;
  }
  .email-detail-body {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: ${colors.text}; line-height: 1.8;
    white-space: pre-wrap; word-break: break-word;
    max-height: 300px; overflow-y: auto;
    padding: 12px; background: ${colors.surface};
    border-radius: 8px; border: 1px solid ${colors.border};
  }
  .btn-back {
    background: none; border: none; color: ${colors.muted};
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    cursor: pointer; margin-bottom: 12px; padding: 0;
    display: flex; align-items: center; gap: 4px;
  }
  .btn-back:hover { color: ${colors.text}; }

  /* Empty inbox */
  .inbox-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 48px 24px; text-align: center;
  }
  .inbox-empty-icon { font-size: 28px; opacity: 0.2; margin-bottom: 12px; }
  .inbox-empty-text {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: ${colors.muted}; line-height: 1.7;
  }
  .inbox-scanning {
    display: flex; align-items: center; gap: 6px; margin-top: 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.blue};
  }

  /* ── Limit banner ── */
  .limit-banner {
    background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.2);
    border-radius: 12px; padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    margin-bottom: 20px;
  }
  .limit-text { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.muted}; line-height: 1.6; }
  .limit-text strong { color: ${colors.text}; display: block; margin-bottom: 4px; font-family: 'Syne', sans-serif; font-size: 14px; }
  .btn-upgrade {
    padding: 10px 20px; background: ${colors.blue}; color: #fff; border: none;
    border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  }
  .btn-upgrade:hover { background: ${colors.blueDim}; box-shadow: 0 4px 16px rgba(59,130,246,0.3); }

  /* ── Features ── */
  .tm-features {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
    margin-top: 32px;
  }
  .feature-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: 8px;
    background: ${colors.surface}; border: 1px solid ${colors.border};
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.muted};
  }
  .feature-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: ${colors.blue}; flex-shrink: 0; }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(8px);
    padding: 10px 20px; background: ${colors.surface2}; border: 1px solid ${colors.border};
    border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: ${colors.green}; opacity: 0; transition: all 0.25s; pointer-events: none;
    white-space: nowrap; z-index: 100;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* ── Loading ── */
  .spinner-sm {
    width: 14px; height: 14px; border: 2px solid rgba(59,130,246,0.3);
    border-top-color: ${colors.blue}; border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Mobile ── */
  @media (max-width: 600px) {
    .tm-nav { padding: 0 16px; }
    .btn-nav { padding: 5px 10px; font-size: 11px; }
    .tm-hero { padding: 32px 16px 24px; }
    .tm-aliases { grid-template-columns: 1fr; }
    .alias-card-email { font-size: 11px; }
    .limit-banner { flex-direction: column; gap: 12px; }
    .btn-upgrade { width: 100%; text-align: center; }
    .tm-features { grid-template-columns: 1fr; }
    .email-detail-body { max-height: 200px; }
  }
`;

// ── Timer hook ──────────────────────────────────────────────
function useTimer(expiresAt) {
  const [remaining, setRemaining] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) { setRemaining("Expired"); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}:${s.toString().padStart(2, "0")}`);
      setUrgent(diff < 120000); // < 2 min
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return { remaining, urgent };
}

// ── AliasCard ───────────────────────────────────────────────
function AliasCard({ alias, selected, onSelect, onCopy }) {
  const { remaining, urgent } = useTimer(alias.expires_at);
  const [local, domain] = alias.alias_email
    ? alias.alias_email.split("@")
    : [alias.alias, "relaymails.dev"];

  return (
    <div className={`alias-card${selected ? " selected" : ""}`} onClick={onSelect}>
      <div className="alias-card-label">Alias {alias.index + 1}</div>
      <div className="alias-card-email">
        {local}<span>@{domain}</span>
      </div>
      <div className="alias-card-footer">
        <span className={`alias-timer${urgent ? " urgent" : ""}`}>
          ⏱ {remaining}
        </span>
        <button
          className="alias-copy-btn"
          title="Copy"
          onClick={e => { e.stopPropagation(); onCopy(`${local}@${domain}`); }}
        >
          ⎘
        </button>
      </div>
    </div>
  );
}

// ── EmailDetail ─────────────────────────────────────────────
function EmailDetail({ email, onBack }) {
  const time = new Date(email.received_at).toLocaleTimeString();
  return (
    <div className="email-detail">
      <button className="btn-back" onClick={onBack}>← Back to inbox</button>
      <div className="email-detail-header">
        <div className="email-detail-subject">{email.subject || "(no subject)"}</div>
        <div className="email-detail-meta">
          From: {email.sender}<br />
          Time: {time}
        </div>
      </div>
      <div className="email-detail-body">
        {email.body || "(empty)"}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function TempMail() {
  const navigate = useNavigate();
  const [aliases, setAliases] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [emails, setEmails] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const pollRef = useRef(null);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied!");
  };

  // Создаём алиасы при загрузке
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    console.log("localStorage:", localStorage.getItem("temp_aliases"));

    const init = async () => {
      const saved = localStorage.getItem("temp_aliases");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const valid = parsed.filter(a => new Date(a.expires_at) > new Date());
          if (valid.length > 0) {
            setAliases(valid.map((a, i) => ({ ...a, index: i })));
            setLoading(false);
            return;
          }
        } catch {}
      }

      try {
        const res = await fetch(`${API_URL}/temp/create`, { method: "POST" });
        if (res.status === 429) { if (aliases.length === 0) setLimitReached(true); setLoading(false); return; }
        const data = await res.json();
        const withIndex = data.map((a, i) => ({ ...a, index: i }));
        setAliases(withIndex);
        localStorage.setItem("temp_aliases", JSON.stringify(withIndex));
      } catch {
        setLimitReached(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Polling писем
  const fetchEmails = useCallback(async () => {
    if (!aliases.length) return;
    for (const alias of aliases) {
      const aliasStr = alias.alias || alias.alias_email?.split("@")[0];
      if (!aliasStr) continue;
      try {
        const res = await fetch(`${API_URL}/temp/${aliasStr}/emails`);
        if (res.ok) {
          const data = await res.json();
          setEmails(prev => ({ ...prev, [aliasStr]: data.emails || [] }));
        }
      } catch {}
    }
  }, [aliases]);

  useEffect(() => {
    if (!aliases.length) return;
    fetchEmails();
    pollRef.current = setInterval(fetchEmails, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [aliases, fetchEmails]);

  const currentAlias = aliases[selectedIdx];
  const currentAliasStr = currentAlias?.alias || currentAlias?.alias_email?.split("@")[0];
  const currentEmails = currentAliasStr ? (emails[currentAliasStr] || []) : [];

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <style>{css}</style>
      <div className="tm-bg" />
      <div className="tm-glow" />

      {/* Nav */}
      <nav className="tm-nav">
        <a className="tm-logo" href="/">
          <div className="tm-logo-icon">✉</div>
          RelayMails
        </a>
        <div className="tm-nav-right">
          <button className="btn-nav btn-nav-ghost" onClick={() => navigate("/app")}>
            Sign in
          </button>
          <button className="btn-nav btn-nav-primary" onClick={() => navigate("/app")}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="tm-hero">
        <div className="tm-badge">
          <span className="tm-badge-dot" />
          Instant · No signup · Free
        </div>
        <h1 className="tm-title">
          Temp email,<br />
          <span>zero effort.</span>
        </h1>
        <p className="tm-subtitle">
          Two disposable aliases ready instantly. Watch emails arrive in real time.
          Need more? Create a free account.
        </p>
      </div>

      {/* Main */}
      <div className="tm-main">
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <span className="spinner-sm" />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.muted, marginTop: 12 }}>
              Generating aliases...
            </div>
          </div>
        ) : limitReached ? (
          <div className="limit-banner">
            <div className="limit-text">
              <strong>Free limit reached</strong>
              Create a free account for unlimited aliases, longer expiry, and full inbox history.
            </div>
            <button className="btn-upgrade" onClick={() => navigate("/app")}>
              Create free account →
            </button>
          </div>
        ) : (
          <>
            {/* Alias cards */}
            <div className="tm-aliases">
              {aliases.map((alias, i) => (
                <AliasCard
                  key={i}
                  alias={alias}
                  selected={selectedIdx === i}
                  onSelect={() => { setSelectedIdx(i); setSelectedEmail(null); }}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>

            {/* Inbox */}
            <div className="tm-inbox">
              <div className="tm-inbox-header">
                <div className="tm-inbox-title">
                  Inbox
                  <span className="inbox-count">{currentEmails.length}</span>
                </div>
                <div className="inbox-live">
                  <span className="inbox-live-dot" />
                  Live
                </div>
              </div>

              {selectedEmail ? (
                <EmailDetail
                  email={selectedEmail}
                  onBack={() => setSelectedEmail(null)}
                />
              ) : currentEmails.length === 0 ? (
                <div className="inbox-empty">
                  <div className="inbox-empty-icon">📭</div>
                  <div className="inbox-empty-text">
                    No emails yet.<br />
                    Send something to{" "}
                    <span style={{ color: colors.blue, fontFamily: "'JetBrains Mono', monospace" }}>
                      {currentAliasStr}@relaymails.dev
                    </span>
                  </div>
                  <div className="inbox-scanning">
                    <span className="spinner-sm" style={{ width: 10, height: 10 }} />
                    Checking every {POLL_INTERVAL / 1000}s
                  </div>
                </div>
              ) : (
                <div className="email-list">
                  {currentEmails.map(email => (
                    <div
                      key={email.id}
                      className="email-item unread"
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="email-item-header">
                        <div className="email-sender">{email.sender}</div>
                        <div className="email-time">{formatTime(email.received_at)}</div>
                      </div>
                      <div className="email-subject">{email.subject || "(no subject)"}</div>
                      <div className="email-preview">{(email.body || "").slice(0, 80)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upgrade banner */}
            <div className="limit-banner" style={{ marginTop: 20 }}>
              <div className="limit-text">
                <strong>Want unlimited aliases?</strong>
                Free account gives you unlimited aliases, no expiry, and full history.
              </div>
              <button className="btn-upgrade" onClick={() => navigate("/app")}>
                Sign up free →
              </button>
            </div>
          </>
        )}

        {/* Features */}
        <div className="tm-features">
          {[
            "Unlimited aliases per account",
            "Instant forwarding to real inbox",
            "One-click alias deactivation",
            "No tracking, no ads",
          ].map(f => (
            <div className="feature-pill" key={f}>
              <span className="feature-pill-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className={`toast${toast.show ? " show" : ""}`}>✓ {toast.msg}</div>
    </>
  );
}