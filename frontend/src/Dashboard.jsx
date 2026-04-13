import { useState, useEffect, useCallback } from "react";

// const API_URL = "https://relaymails.dev/api";
const API_URL = import.meta.env.VITE_API_URL;

const colors = {
  bg:       "#0a0a0f",
  surface:  "#111118",
  surface2: "#16161f",
  border:   "#1e1e2e",
  blue:     "#3b82f6",
  blueDim:  "#1d4ed8",
  blueGlow: "rgba(59,130,246,0.12)",
  text:     "#e2e8f0",
  muted:    "#64748b",
  muted2:   "#475569",
  error:    "#f87171",
  green:    "#4ade80",
  greenBg:  "rgba(74,222,128,0.08)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${colors.bg}; color: ${colors.text}; font-family: 'Syne', sans-serif; min-height: 100vh; }

  .dash-root { min-height: 100vh; display: flex; flex-direction: column; }

  /* Nav */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 60px;
    border-bottom: 1px solid ${colors.border};
    background: ${colors.surface};
    position: sticky; top: 0; z-index: 10;
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 800; letter-spacing: -0.5px; flex-shrink: 0; }
  .nav-logo-icon {
    width: 28px; height: 28px; background: ${colors.blue};
    border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
  }
  .nav-right { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .nav-email {
    font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.muted};
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px;
  }
  .btn-ghost {
    padding: 7px 14px; background: none; border: 1px solid ${colors.border};
    border-radius: 7px; color: ${colors.muted}; font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  }
  .btn-ghost:hover { border-color: ${colors.muted2}; color: ${colors.text}; }

  /* Main */
  .dash-main { flex: 1; padding: 32px 24px; max-width: 900px; margin: 0 auto; width: 100%; }

  /* Header row */
  .dash-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; gap: 16px; }
  .dash-title { font-size: 26px; font-weight: 800; letter-spacing: -0.8px; }
  .dash-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.muted}; margin-top: 4px; }

  /* Create button */
  .btn-primary {
    padding: 10px 20px; background: ${colors.blue}; color: #fff; border: none;
    border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;
    white-space: nowrap; flex-shrink: 0;
  }
  .btn-primary:hover { background: ${colors.blueDim}; box-shadow: 0 4px 16px rgba(59,130,246,0.25); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .spinner {
    width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Stats row */
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
  .stat-card {
    padding: 16px 20px; background: ${colors.surface}; border: 1px solid ${colors.border};
    border-radius: 12px;
  }
  .stat-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${colors.muted}; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; }
  .stat-value { font-size: 26px; font-weight: 800; letter-spacing: -1px; }
  .stat-value.blue { color: ${colors.blue}; }
  .stat-value.green { color: ${colors.green}; }

  /* Aliases list — desktop */
  .aliases-header {
    display: grid; grid-template-columns: 1fr 100px 80px;
    padding: 0 16px 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: ${colors.muted}; letter-spacing: 1px; text-transform: uppercase;
    border-bottom: 1px solid ${colors.border}; margin-bottom: 8px;
  }
  .alias-row {
    display: grid; grid-template-columns: 1fr 100px 80px;
    align-items: center; padding: 14px 16px;
    background: ${colors.surface}; border: 1px solid ${colors.border};
    border-radius: 10px; margin-bottom: 8px;
    transition: border-color 0.2s;
  }
  .alias-row:hover { border-color: ${colors.muted2}; }
  .alias-email { font-family: 'JetBrains Mono', monospace; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .alias-email span { color: ${colors.blue}; }

  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-family: 'JetBrains Mono', monospace; font-size: 11px;
  }
  .badge.active { background: ${colors.greenBg}; color: ${colors.green}; }
  .badge.inactive { background: rgba(100,116,139,0.1); color: ${colors.muted}; }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .alias-actions { display: flex; align-items: center; gap: 6px; }
  .btn-icon {
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    background: none; border: 1px solid ${colors.border}; border-radius: 6px;
    color: ${colors.muted}; cursor: pointer; font-size: 13px; transition: all 0.15s;
  }
  .btn-icon:hover { border-color: ${colors.blue}; color: ${colors.blue}; }
  .btn-icon.danger:hover { border-color: ${colors.error}; color: ${colors.error}; }

  /* Toast */
  .toast {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(8px);
    padding: 10px 20px; background: ${colors.surface2}; border: 1px solid ${colors.border};
    border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: ${colors.green}; opacity: 0; transition: all 0.25s; pointer-events: none; white-space: nowrap; z-index: 100;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* Empty state */
  .empty { text-align: center; padding: 60px 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${colors.muted}; }
  .empty-icon { font-size: 32px; margin-bottom: 16px; opacity: 0.4; }
  .empty-text { margin-bottom: 24px; line-height: 1.7; }

  /* Skeleton */
  .skeleton { background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 10px; height: 52px; margin-bottom: 8px; animation: pulse 1.4s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* Error */
  .error-banner { padding: 12px 16px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.error}; margin-bottom: 20px; }

  /* ── MOBILE ────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .nav { padding: 0 16px; }
    .nav-email { max-width: 100px; font-size: 11px; }
    .btn-ghost { padding: 6px 10px; font-size: 11px; }

    .dash-main { padding: 20px 16px; }

    .dash-header { flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .dash-header .btn-primary { width: 100%; justify-content: center; }
    .dash-title { font-size: 22px; }

    .stats-row { grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
    .stat-card { padding: 12px 14px; }
    .stat-label { font-size: 9px; }
    .stat-value { font-size: 22px; }

    /* Мобильный вид алиасов — карточки */
    .aliases-header { display: none; }
    .alias-row {
      display: flex; flex-direction: column; gap: 10px;
      padding: 14px 16px;
    }
    .alias-row-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .alias-row-bottom { display: flex; align-items: center; justify-content: space-between; }
    .alias-email { font-size: 12px; }
    .alias-actions { gap: 8px; }
    .btn-icon { width: 34px; height: 34px; font-size: 15px; }
  }
`;

function Toast({ message, show }) {
  return <div className={`toast${show ? " show" : ""}`}>✓ {message}</div>;
}

function SkeletonRow() {
  return <div className="skeleton" />;
}

// Определяем мобильный вид
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function Dashboard({ token, onLogout, userEmail }) {
  const [aliases, setAliases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const isMobile = useIsMobile();

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const fetchAliases = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/aliases`, { headers });
      if (!res.ok) throw new Error("Failed to load aliases");
      const data = await res.json();
      setAliases(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAliases(); }, [fetchAliases]);

  const createAlias = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/aliases`, { method: "POST", headers });
      if (!res.ok) throw new Error("Failed to create alias");
      const data = await res.json();
      setAliases(prev => [data, ...prev]);
      showToast("Alias created");
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleAlias = async (id, currentState) => {
    try {
      const endpoint = currentState ? "disable" : "enable";
      const res = await fetch(`${API_URL}/aliases/${id}/${endpoint}`, { method: "PATCH", headers });
      if (!res.ok) throw new Error();
      setAliases(prev => prev.map(a => a.id === id ? { ...a, is_active: !currentState } : a));
    } catch {
      setError("Failed to update alias");
    }
  };

  const deleteAlias = async (id) => {
    try {
      const res = await fetch(`${API_URL}/aliases/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error();
      setAliases(prev => prev.filter(a => a.id !== id));
      showToast("Alias deleted");
    } catch {
      setError("Failed to delete alias");
    }
  };

  const copyAlias = (email) => {
    navigator.clipboard.writeText(email);
    showToast("Copied to clipboard");
  };

  const activeCount = aliases.filter(a => a.is_active).length;

  return (
    <>
      <style>{css}</style>
      <div className="dash-root">
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">✉</div>
            RelayMails
          </div>
          <div className="nav-right">
            {userEmail && <span className="nav-email">{userEmail}</span>}
            <button className="btn-ghost" onClick={onLogout}>Sign out</button>
          </div>
        </nav>

        <main className="dash-main">
          <div className="dash-header">
            <div>
              <h1 className="dash-title">Your aliases</h1>
              <p className="dash-subtitle">Manage your email aliases and forwarding</p>
            </div>
            <button className="btn-primary" onClick={createAlias} disabled={creating}>
              {creating ? <span className="spinner" /> : <span>+</span>}
              {creating ? "Creating..." : "New alias"}
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total</div>
              <div className="stat-value blue">{aliases.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active</div>
              <div className="stat-value green">{activeCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Inactive</div>
              <div className="stat-value">{aliases.length - activeCount}</div>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <>{[1,2,3].map(i => <SkeletonRow key={i} />)}</>
          ) : aliases.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✉</div>
              <div className="empty-text">No aliases yet.<br />Create your first alias to get started.</div>
              <button className="btn-primary" style={{ margin: "0 auto" }} onClick={createAlias} disabled={creating}>
                {creating ? <span className="spinner" /> : <span>+</span>}
                Create alias
              </button>
            </div>
          ) : (
            <>
              {!isMobile && (
                <div className="aliases-header">
                  <span>Alias</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
              )}
              {aliases.map(alias => {
                const email = alias.email || `u${alias.user_id}.${alias.alias}@relaymails.dev`;
                const [local, domain] = email.split("@");
                return (
                  <div className="alias-row" key={alias.id}>
                    {isMobile ? (
                      <>
                        <div className="alias-row-top">
                          <div className="alias-email" style={{ flex: 1 }}>
                            {local}<span>@{domain}</span>
                          </div>
                          <span className={`badge ${alias.is_active ? "active" : "inactive"}`}>
                            <span className="badge-dot" />
                            {alias.is_active ? "Active" : "Off"}
                          </span>
                        </div>
                        <div className="alias-row-bottom">
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: colors.muted }}>
                            tap to copy
                          </div>
                          <div className="alias-actions">
                            <button className="btn-icon" title="Copy" onClick={() => copyAlias(email)}>⎘</button>
                            <button className="btn-icon" title={alias.is_active ? "Deactivate" : "Activate"} onClick={() => toggleAlias(alias.id, alias.is_active)}>
                              {alias.is_active ? "⏸" : "▶"}
                            </button>
                            <button className="btn-icon danger" title="Delete" onClick={() => deleteAlias(alias.id)}>✕</button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="alias-email">{local}<span>@{domain}</span></div>
                        <div>
                          <span className={`badge ${alias.is_active ? "active" : "inactive"}`}>
                            <span className="badge-dot" />
                            {alias.is_active ? "Active" : "Off"}
                          </span>
                        </div>
                        <div className="alias-actions">
                          <button className="btn-icon" title="Copy" onClick={() => copyAlias(email)}>⎘</button>
                          <button className="btn-icon" title={alias.is_active ? "Deactivate" : "Activate"} onClick={() => toggleAlias(alias.id, alias.is_active)}>
                            {alias.is_active ? "⏸" : "▶"}
                          </button>
                          <button className="btn-icon danger" title="Delete" onClick={() => deleteAlias(alias.id)}>✕</button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </main>
      </div>
      <Toast message={toast.message} show={toast.show} />
    </>
  );
}