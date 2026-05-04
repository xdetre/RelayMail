import { useState } from "react";

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
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${colors.bg}; color: ${colors.text}; font-family: 'Syne', sans-serif; min-height: 100vh; }

  .profile-root { min-height: 100vh; display: flex; flex-direction: column; }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 60px; flex-shrink: 0;
    border-bottom: 1px solid ${colors.border};
    background: ${colors.surface}; position: sticky; top: 0; z-index: 10;
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 800; letter-spacing: -0.5px; cursor: pointer; }
  .nav-logo-icon { width: 28px; height: 28px; background: ${colors.blue}; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .btn-ghost { padding: 7px 14px; background: none; border: 1px solid ${colors.border}; border-radius: 7px; color: ${colors.muted}; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { border-color: ${colors.muted2}; color: ${colors.text}; }

  .profile-main { max-width: 560px; margin: 0 auto; width: 100%; padding: 40px 24px; }

  .profile-header { margin-bottom: 32px; }
  .profile-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, ${colors.blue}, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 800; color: #fff;
    margin-bottom: 16px;
  }
  .profile-name { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
  .profile-email-text { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.muted}; }

  .profile-section {
    background: ${colors.surface}; border: 1px solid ${colors.border};
    border-radius: 12px; padding: 24px; margin-bottom: 16px;
  }
  .section-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .section-desc { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.muted}; margin-bottom: 20px; line-height: 1.6; }

  .field { margin-bottom: 14px; }
  .field label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: ${colors.muted}; margin-bottom: 6px; }
  .field input { width: 100%; padding: 11px 14px; background: ${colors.surface2}; border: 1px solid ${colors.border}; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${colors.text}; outline: none; transition: border-color 0.2s; }
  .field input:focus { border-color: ${colors.blue}; }

  .btn-primary { padding: 10px 20px; background: ${colors.blue}; color: #fff; border: none; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .btn-primary:hover { background: ${colors.blueDim}; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-danger { padding: 10px 20px; background: none; color: ${colors.error}; border: 1px solid rgba(248,113,113,0.3); border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .btn-danger:hover { background: rgba(248,113,113,0.08); border-color: ${colors.error}; }

  .success-msg { padding: 10px 14px; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.green}; margin-bottom: 14px; }
  .error-msg { padding: 10px 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.error}; margin-bottom: 14px; }

  .danger-zone { border-color: rgba(248,113,113,0.2); }

  /* Delete confirm modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .modal { background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 14px; padding: 28px; max-width: 400px; width: 100%; }
  .modal-title { font-size: 18px; font-weight: 800; margin-bottom: 8px; }
  .modal-desc { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${colors.muted}; margin-bottom: 20px; line-height: 1.6; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

  .spinner { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .profile-main { padding: 24px 16px; }
  }
`;

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: "absolute", right: 10, top: "50%",
            transform: "translateY(-50%)", background: "none",
            border: "none", cursor: "pointer", color: colors.muted, padding: 0
          }}
        >
          {show ? (
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
      </div>
    </div>
  );
}


export default function Profile({ token, userEmail, onLogout, onBack }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const initials = userEmail ? userEmail[0].toUpperCase() : "?";

  const handleChangePassword = async () => {
    setPwError(""); setPwSuccess("");
    if (!currentPassword || !newPassword) { setPwError("Fill in all fields"); return; }
    if (newPassword.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { setPwError("Passwords don't match"); return; }

    setPwLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: "POST",
        headers,
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      setPwSuccess("Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e) {
      setPwError(e.message);
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/me`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Failed to delete account");
      onLogout();
    } catch {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="profile-root">
        <nav className="nav">
          <div className="nav-logo" onClick={onBack}>
            <div className="nav-logo-icon">✉</div>
            RelayMails
          </div>
          <div className="nav-right">
            <button className="btn-ghost" onClick={onBack}>← Dashboard</button>
            <button className="btn-ghost" onClick={onLogout}>Sign out</button>
          </div>
        </nav>

        <div className="profile-main">
          <div className="profile-header">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-name">{userEmail?.split("@")[0]}</div>
            <div className="profile-email-text">{userEmail}</div>
          </div>

          {/* Change password */}
          <div className="profile-section">
            <div className="section-title">Change password</div>
            <div className="section-desc">Update your account password. Must be at least 8 characters.</div>

            {pwSuccess && <div className="success-msg">✓ {pwSuccess}</div>}
            {pwError && <div className="error-msg">{pwError}</div>}

            <PasswordField label="Current password" value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" />
            <PasswordField label="New password" value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
            <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />

            <button className="btn-primary" onClick={handleChangePassword} disabled={pwLoading}>
              {pwLoading && <span className="spinner" />}
              {pwLoading ? "Saving..." : "Save password"}
            </button>
          </div>

          {/* Danger zone */}
          <div className="profile-section danger-zone">
            <div className="section-title" style={{ color: colors.error }}>Danger zone</div>
            <div className="section-desc">
              Permanently delete your account and all associated data including aliases, emails and settings. This action cannot be undone.
            </div>
            <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
              Delete my account
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete account?</div>
            <div className="modal-desc">
              This will permanently delete your account, all aliases and all stored emails. This cannot be undone.
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading && <span className="spinner" />}
                {deleteLoading ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
