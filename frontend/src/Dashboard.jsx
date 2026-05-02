import { useState, useEffect, useCallback, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const colors = {
  bg:       "#0a0a0f",
  surface:  "#111118",
  surface2: "#16161f",
  border:   "#1e1e2e",
  blue:     "#3b82f6",
  blueDim:  "#1d4ed8",
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

  .dash-root { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 60px; flex-shrink: 0;
    border-bottom: 1px solid ${colors.border};
    background: ${colors.surface};
    z-index: 10;
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 800; letter-spacing: -0.5px; }
  .nav-logo-icon { width: 28px; height: 28px; background: ${colors.blue}; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .nav-right { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .nav-email { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.muted}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
  .btn-ghost { padding: 7px 14px; background: none; border: 1px solid ${colors.border}; border-radius: 7px; color: ${colors.muted}; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { border-color: ${colors.muted2}; color: ${colors.text}; }

  /* Split layout */
  .dash-body { flex: 1; display: flex; overflow: hidden; }

  /* ── Aliases panel ── */
  .aliases-panel {
    width: 380px; flex-shrink: 0;
    border-right: 1px solid ${colors.border};
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  .aliases-panel-header {
    padding: 20px 20px 16px; flex-shrink: 0;
    border-bottom: 1px solid ${colors.border};
    background: ${colors.surface};
  }

  .panel-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .panel-title { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }

  .btn-primary {
    padding: 7px 14px; background: ${colors.blue}; color: #fff; border: none;
    border-radius: 7px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .btn-primary:hover { background: ${colors.blueDim}; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .spinner { width: 11px; height: 11px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .stat-card { padding: 10px 12px; background: ${colors.surface2}; border: 1px solid ${colors.border}; border-radius: 8px; }
  .stat-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: ${colors.muted}; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .stat-value { font-size: 20px; font-weight: 800; }
  .stat-value.blue { color: ${colors.blue}; }
  .stat-value.green { color: ${colors.green}; }

  .aliases-list { flex: 1; overflow-y: auto; padding: 10px; }

  .alias-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 12px;
    background: ${colors.surface}; border: 1px solid ${colors.border};
    border-radius: 9px; margin-bottom: 5px;
    cursor: pointer; transition: all 0.15s;
  }
  .alias-item:hover { border-color: ${colors.muted2}; }
  .alias-item.selected { border-color: ${colors.blue}; background: rgba(59,130,246,0.05); }

  .alias-item-body { flex: 1; min-width: 0; }
  .alias-item-email { font-family: 'JetBrains Mono', monospace; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px; }
  .alias-item-email span { color: ${colors.blue}; }

  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; }
  .badge.active { background: ${colors.greenBg}; color: ${colors.green}; }
  .badge.inactive { background: rgba(100,116,139,0.1); color: ${colors.muted}; }
  .badge-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }

  .alias-item-actions { display: flex; gap: 4px; flex-shrink: 0; opacity: 0; transition: opacity 0.15s; }
  .alias-item:hover .alias-item-actions { opacity: 1; }

  .btn-icon {
    width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
    background: none; border: 1px solid ${colors.border}; border-radius: 5px;
    color: ${colors.muted}; cursor: pointer; font-size: 12px; transition: all 0.15s;
  }
  .btn-icon:hover { border-color: ${colors.blue}; color: ${colors.blue}; }
  .btn-icon.danger:hover { border-color: ${colors.error}; color: ${colors.error}; }

  .panel-footer { padding: 12px 20px; border-top: 1px solid ${colors.border}; text-align: center; flex-shrink: 0; }

  /* ── Inbox panel ── */
  .inbox-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  .inbox-select-state {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.muted}; text-align: center;
  }

  .inbox-header {
    padding: 14px 24px; flex-shrink: 0;
    border-bottom: 1px solid ${colors.border};
    background: ${colors.surface};
    display: flex; align-items: center; justify-content: space-between;
  }
  .inbox-alias-name { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
  .inbox-alias-name span { color: ${colors.blue}; }
  .inbox-live { display: flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${colors.green}; }
  .inbox-live-dot { width: 5px; height: 5px; border-radius: 50%; background: ${colors.green}; animation: pulse-dot 1.5s ease-in-out infinite; }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .email-list { flex: 1; overflow-y: auto; }

  .email-row {
    padding: 13px 24px; border-bottom: 1px solid ${colors.border};
    cursor: pointer; transition: background 0.15s;
  }
  .email-row:hover { background: ${colors.surface2}; }

  .email-row-top { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
  .email-sender { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
  .email-time { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${colors.muted}; white-space: nowrap; }
  .email-subject { font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; }
  .email-preview { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.muted}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .inbox-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.muted}; }

  /* Email detail */
  .email-detail { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .email-detail-head { padding: 16px 24px; border-bottom: 1px solid ${colors.border}; background: ${colors.surface}; flex-shrink: 0; }
  .back-btn { background: none; border: none; color: ${colors.muted}; font-family: 'JetBrains Mono', monospace; font-size: 11px; cursor: pointer; margin-bottom: 10px; padding: 0; }
  .back-btn:hover { color: ${colors.text}; }
  .detail-subject { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
  .detail-meta { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.muted}; line-height: 1.8; }
  .detail-body { flex: 1; overflow-y: auto; padding: 20px 24px; }

  /* Error */
  .error-banner { padding: 10px 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.error}; margin: 10px; }

  /* Skeleton */
  .skeleton { background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 9px; height: 58px; margin-bottom: 5px; animation: pulse 1.4s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* Toast */
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(6px); padding: 9px 18px; background: ${colors.surface2}; border: 1px solid ${colors.border}; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.green}; opacity: 0; transition: all 0.2s; pointer-events: none; white-space: nowrap; z-index: 100; }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* Mobile */
  @media (max-width: 768px) {
    .aliases-panel { width: 100%; border-right: none; }
    .inbox-panel { display: none; position: fixed; inset: 60px 0 0 0; background: ${colors.bg}; z-index: 20; }
    .inbox-panel.show { display: flex; }
    .aliases-panel.hidden { display: none; }
    .alias-item-actions { opacity: 1; }
  }
`;

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setV(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return v;
}

export default function Dashboard({ token, onLogout, userEmail }) {
  const [aliases, setAliases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [selectedAlias, setSelectedAlias] = useState(null);
  const [emails, setEmails] = useState([]);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showInbox, setShowInbox] = useState(false);
  const pollRef = useRef(null);
  const isMobile = useIsMobile();
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const fetchAliases = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/aliases`, { headers });
      if (res.status === 401) { onLogout(); return; }
      if (!res.ok) throw new Error("Failed to load aliases");
      setAliases(await res.json());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchAliases(); }, [fetchAliases]);

  const fetchEmails = useCallback(async (id) => {
    if (!id) return;
    const res = await fetch(`${API_URL}/aliases/${id}/emails`, { headers });
    if (res.ok) setEmails(await res.json());
  }, [token]);

  useEffect(() => {
    clearInterval(pollRef.current);
    if (!selectedAlias) return;
    setEmailsLoading(true);
    fetchEmails(selectedAlias.id).finally(() => setEmailsLoading(false));
    pollRef.current = setInterval(() => fetchEmails(selectedAlias.id), 10000);
    return () => clearInterval(pollRef.current);
  }, [selectedAlias, fetchEmails]);

  const selectAlias = (alias) => {
    setSelectedAlias(alias);
    setSelectedEmail(null);
    setEmails([]);
    if (isMobile) setShowInbox(true);
  };

  const createAlias = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/aliases`, { method: "POST", headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      setAliases(prev => [data, ...prev]);
      showToast("Alias created");
    } catch (e) { setError(e.message); }
    finally { setCreating(false); }
  };

  const toggleAlias = async (id, state) => {
    try {
      const res = await fetch(`${API_URL}/aliases/${id}/${state ? "disable" : "enable"}`, { method: "PATCH", headers });
      if (!res.ok) throw new Error();
      setAliases(prev => prev.map(a => a.id === id ? { ...a, is_active: !state } : a));
    } catch { setError("Failed to update"); }
  };

  const deleteAlias = async (id) => {
    try {
      const res = await fetch(`${API_URL}/aliases/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error();
      setAliases(prev => prev.filter(a => a.id !== id));
      if (selectedAlias?.id === id) { setSelectedAlias(null); setEmails([]); }
      showToast("Alias deleted");
    } catch { setError("Failed to delete"); }
  };

  const fmt = (iso) => {
    const d = new Date(iso + (iso.endsWith("Z") ? "" : "Z"));
    const diff = Date.now() - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  const getEmail = (a) => a.email || `u${a.user_id}.${a.alias}@relaymails.dev`;
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

        <div className="dash-body">
          {/* Aliases panel */}
          <div className={`aliases-panel${isMobile && showInbox ? " hidden" : ""}`}>
            <div className="aliases-panel-header">
              <div className="panel-top">
                <span className="panel-title">Your aliases</span>
                <button className="btn-primary" onClick={createAlias} disabled={creating}>
                  {creating ? <span className="spinner" /> : "+"} {creating ? "..." : "New alias"}
                </button>
              </div>
              <div className="stats-row">
                <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value blue">{aliases.length}</div></div>
                <div className="stat-card"><div className="stat-label">Active</div><div className="stat-value green">{activeCount}</div></div>
                <div className="stat-card"><div className="stat-label">Inactive</div><div className="stat-value">{aliases.length - activeCount}</div></div>
              </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="aliases-list">
              {loading ? [1,2,3].map(i => <div className="skeleton" key={i} />) :
               aliases.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: colors.muted }}>
                  <div style={{ fontSize: 28, opacity: 0.2, marginBottom: 12 }}>✉</div>
                  No aliases yet.
                </div>
              ) : aliases.map(alias => {
                const email = getEmail(alias);
                const [local, domain] = email.split("@");
                return (
                  <div key={alias.id} className={`alias-item${selectedAlias?.id === alias.id ? " selected" : ""}`} onClick={() => selectAlias(alias)}>
                    <div className="alias-item-body">
                      <div className="alias-item-email">{local}<span>@{domain}</span></div>
                      <span className={`badge ${alias.is_active ? "active" : "inactive"}`}>
                        <span className="badge-dot" />{alias.is_active ? "Active" : "Off"}
                      </span>
                    </div>
                    <div className="alias-item-actions" onClick={e => e.stopPropagation()}>
                      <button className="btn-icon" onClick={() => { navigator.clipboard.writeText(email); showToast("Copied!"); }}>⎘</button>
                      <button className="btn-icon" onClick={() => toggleAlias(alias.id, alias.is_active)}>{alias.is_active ? "⏸" : "▶"}</button>
                      <button className="btn-icon danger" onClick={() => deleteAlias(alias.id)}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="panel-footer">
              <a href="mailto:support@relaymails.dev" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: colors.muted, textDecoration: "none" }}>
                support@relaymails.dev
              </a>
            </div>
          </div>

          {/* Inbox panel */}
          <div className={`inbox-panel${isMobile && showInbox ? " show" : ""}`}>
            {!selectedAlias ? (
              <div className="inbox-select-state">
                <div style={{ fontSize: 32, opacity: 0.1, marginBottom: 16 }}>✉</div>
                Select an alias<br />to view its inbox
              </div>
            ) : selectedEmail ? (
              <div className="email-detail">
                <div className="email-detail-head">
                  {isMobile && <button className="back-btn" onClick={() => setShowInbox(false)}>← Aliases</button>}
                  <button className="back-btn" onClick={() => setSelectedEmail(null)}>← Back to inbox</button>
                  <div className="detail-subject">{selectedEmail.subject || "(no subject)"}</div>
                  <div className="detail-meta">From: {selectedEmail.sender}<br />{fmt(selectedEmail.received_at)}</div>
                </div>
                <div className="detail-body" dangerouslySetInnerHTML={{ __html: selectedEmail.body || "(empty)" }} />
              </div>
            ) : (
              <>
                <div className="inbox-header">
                  <div>
                    {isMobile && <button className="back-btn" style={{ marginBottom: 4 }} onClick={() => setShowInbox(false)}>← Aliases</button>}
                    <div className="inbox-alias-name">
                      {(() => { const [l, d] = getEmail(selectedAlias).split("@"); return <>{l}<span>@{d}</span></>; })()}
                    </div>
                  </div>
                  <div className="inbox-live"><span className="inbox-live-dot" />Live</div>
                </div>

                {emailsLoading && emails.length === 0 ? (
                  <div className="inbox-empty" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: colors.muted }}>Loading...</div>
                ) : emails.length === 0 ? (
                  <div className="inbox-empty">
                    <div style={{ fontSize: 28, opacity: 0.15, marginBottom: 12 }}>📭</div>
                    No emails yet.<br />
                    <span style={{ color: colors.blue }}>{getEmail(selectedAlias)}</span><br />is waiting.
                  </div>
                ) : (
                  <div className="email-list">
                    {emails.map(e => (
                      <div key={e.id} className="email-row" onClick={() => setSelectedEmail(e)}>
                        <div className="email-row-top">
                          <div className="email-sender">{e.sender}</div>
                          <div className="email-time">{fmt(e.received_at)}</div>
                        </div>
                        <div className="email-subject">{e.subject || "(no subject)"}</div>
                        <div className="email-preview">{(e.body || "").replace(/<[^>]*>/g, "").slice(0, 80)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className={`toast${toast.show ? " show" : ""}`}>✓ {toast.message}</div>
    </>
  );
}