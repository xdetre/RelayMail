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

  .upgrade-root { min-height: 100vh; display: flex; flex-direction: column; }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 60px; flex-shrink: 0;
    border-bottom: 1px solid ${colors.border};
    background: ${colors.surface}; position: sticky; top: 0; z-index: 10;
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 800; letter-spacing: -0.5px; cursor: pointer; }
  .nav-logo-icon { width: 28px; height: 28px; background: ${colors.blue}; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .btn-ghost { padding: 7px 14px; background: none; border: 1px solid ${colors.border}; border-radius: 7px; color: ${colors.muted}; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { border-color: ${colors.muted2}; color: ${colors.text}; }

  .upgrade-main {
    flex: 1; max-width: 800px; margin: 0 auto; width: 100%;
    padding: 48px 24px 60px;
  }

  .upgrade-hero { text-align: center; margin-bottom: 48px; }
  .upgrade-title { font-size: 32px; font-weight: 800; letter-spacing: -1px; margin-bottom: 10px; }
  .upgrade-title span { color: ${colors.blue}; }
  .upgrade-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${colors.muted}; line-height: 1.7; }

  /* Pricing grid */
  .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }

  .pricing-card {
    background: ${colors.surface}; border: 1px solid ${colors.border};
    border-radius: 16px; padding: 28px; position: relative;
    transition: border-color 0.2s;
  }
  .pricing-card.pro {
    border-color: ${colors.blue};
    background: rgba(59,130,246,0.04);
  }
  .pricing-badge {
    position: absolute; top: -11px; left: 50%; transform: translateX(-50%);
    background: ${colors.blue}; color: #fff;
    font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700;
    padding: 3px 14px; border-radius: 20px; white-space: nowrap;
  }

  .pricing-plan { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.muted}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .pricing-price { font-size: 36px; font-weight: 800; letter-spacing: -1.5px; margin-bottom: 4px; }
  .pricing-price span { font-size: 14px; font-weight: 400; color: ${colors.muted}; }
  .pricing-desc { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.muted}; margin-bottom: 24px; }

  .pricing-features { list-style: none; margin-bottom: 28px; }
  .pricing-features li {
    display: flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    padding: 7px 0; border-bottom: 1px solid ${colors.border};
    color: ${colors.muted};
  }
  .pricing-features li:last-child { border-bottom: none; }
  .pricing-features li.yes { color: ${colors.text}; }
  .check { color: ${colors.green}; flex-shrink: 0; font-size: 13px; }
  .cross { color: ${colors.muted}; flex-shrink: 0; font-size: 13px; }

  .btn-plan {
    width: 100%; padding: 13px; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-plan-ghost { background: none; border: 1px solid ${colors.border}; color: ${colors.muted}; }
  .btn-plan-ghost:hover { border-color: ${colors.muted2}; color: ${colors.text}; }
  .btn-plan-primary { background: ${colors.blue}; border: none; color: #fff; }
  .btn-plan-primary:hover { background: ${colors.blueDim}; box-shadow: 0 4px 16px rgba(59,130,246,0.3); }
  .btn-plan-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Payment modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .modal { background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 16px; padding: 28px; width: 100%; max-width: 400px; }
  .modal-title { font-size: 18px; font-weight: 800; margin-bottom: 4px; }
  .modal-desc { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${colors.muted}; margin-bottom: 24px; }

  .payment-option {
    width: 100%; padding: 14px 16px; background: ${colors.surface2};
    border: 1px solid ${colors.border}; border-radius: 10px;
    color: ${colors.text}; cursor: pointer; text-align: left;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
    transition: border-color 0.2s; margin-bottom: 10px;
    display: block;
  }
  .payment-option:hover { border-color: ${colors.blue}; }
  .payment-option:disabled { opacity: 0.5; cursor: not-allowed; }
  .payment-option-desc { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${colors.muted}; margin-top: 3px; font-weight: 400; }

  /* Success banner */
  .success-banner {
    padding: 16px 20px; background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.2); border-radius: 12px;
    font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${colors.green};
    text-align: center; margin-bottom: 24px;
  }

  .spinner { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .pricing-grid { grid-template-columns: 1fr; }
    .upgrade-main { padding: 32px 16px 48px; }
    .upgrade-title { font-size: 26px; }
  }
`;

export default function Upgrade({ token, userEmail, isPro, onBack, onSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const handleCrypto = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/payments/create`, { method: "POST", headers });
      const data = await res.json();
      if (data.pay_url) window.open(data.pay_url, "_blank");
    } catch {}
    finally { setLoading(false); setShowModal(false); }
  };

  const handleCard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/payments/create-card`, { method: "POST", headers });
      const data = await res.json();
      if (data.pay_url) window.open(data.pay_url, "_blank");
    } catch {}
    finally { setLoading(false); setShowModal(false); }
  };

  return (
    <>
      <style>{css}</style>
      <div className="upgrade-root">
        <nav className="nav">
          <div className="nav-logo" onClick={onBack}>
            <div className="nav-logo-icon">✉</div>
            RelayMails
          </div>
          <button className="btn-ghost" onClick={onBack}>← Dashboard</button>
        </nav>

        <div className="upgrade-main">
          <div className="upgrade-hero">
            {isPro ? (
              <div className="success-banner">✓ You are already on the Pro plan!</div>
            ) : null}
            <h1 className="upgrade-title">Simple, <span>honest pricing</span></h1>
            <p className="upgrade-subtitle">
              Start free. Upgrade when you need more privacy and control.
            </p>
          </div>

          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card">
              <div className="pricing-plan">Free</div>
              <div className="pricing-price">$0 <span>/month</span></div>
              <div className="pricing-desc">For occasional use</div>
              <ul className="pricing-features">
                <li className="yes"><span className="check">✓</span> 5 aliases</li>
                <li className="yes"><span className="check">✓</span> 15 days expiry</li>
                <li className="yes"><span className="check">✓</span> Instant forwarding</li>
                <li className="yes"><span className="check">✓</span> Inbox in dashboard</li>
                <li><span className="cross">✗</span> Custom aliases</li>
                <li><span className="cross">✗</span> Unlimited duration</li>
                <li><span className="cross">✗</span> Reply via alias</li>
              </ul>
              <button className="btn-plan btn-plan-ghost" onClick={onBack}>
                Current plan
              </button>
            </div>

            {/* Pro */}
            <div className="pricing-card pro">
              <div className="pricing-badge">✦ Most popular</div>
              <div className="pricing-plan">Pro</div>
              <div className="pricing-price">$1 <span>/month</span></div>
              <div className="pricing-desc">For serious privacy</div>
              <ul className="pricing-features">
                <li className="yes"><span className="check">✓</span> Unlimited aliases</li>
                <li className="yes"><span className="check">✓</span> Never expire</li>
                <li className="yes"><span className="check">✓</span> Instant forwarding</li>
                <li className="yes"><span className="check">✓</span> Inbox in dashboard</li>
                <li className="yes"><span className="check">✓</span> Custom aliases</li>
                <li className="yes"><span className="check">✓</span> Unlimited duration</li>
                <li className="yes">
                  <span className="check">✓</span> Reply via alias
                  <span style={{ fontSize: 9, color: colors.muted, marginLeft: 6 }}></span>
                </li>
              </ul>
              {isPro ? (
                <button className="btn-plan btn-plan-ghost" disabled>✓ Active</button>
              ) : (
                <button className="btn-plan btn-plan-primary" onClick={() => setShowModal(true)}>
                  Get Pro →
                </button>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.muted, lineHeight: 1.8 }}>
            Questions? Email us at{" "}
            <a href="mailto:support@relaymails.dev" style={{ color: colors.blue }}>support@relaymails.dev</a>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Choose payment method</div>
            <div className="modal-desc">$1/month · Cancel anytime</div>

            <button className="payment-option" onClick={handleCard} disabled={loading}>
              {loading ? <span className="spinner" /> : "💳"} Pay with card
              <div className="payment-option-desc">Russian cards via ЮКасса · SBP available</div>
            </button>

            <button className="payment-option" onClick={handleCrypto} disabled={loading}>
              ₿ Pay with crypto
              <div className="payment-option-desc">USDT, BTC, ETH and more</div>
            </button>

            <button className="btn-ghost" style={{ width: "100%", marginTop: 4 }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}