const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; color: #e2e8f0; font-family: 'Syne', sans-serif; }
  .page { max-width: 720px; margin: 0 auto; padding: 60px 24px; }
  .back { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #3b82f6; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 40px; }
  .back:hover { opacity: 0.8; }
  h1 { font-size: 32px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
  .date { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; margin-bottom: 40px; }
  h2 { font-size: 16px; font-weight: 700; margin: 32px 0 12px; color: #e2e8f0; }
  p { font-size: 14px; line-height: 1.8; color: #94a3b8; margin-bottom: 12px; }
  a { color: #3b82f6; }
`;

export default function Terms() {
  return (
    <>
      <style>{css}</style>
      <div className="page">
        <a className="back" href="/">← Back</a>
        <h1>Terms of Service</h1>
        <p className="date">Last updated: April 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using RelayMail, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>

        <h2>2. Description of Service</h2>
        <p>RelayMail is an email aliasing service that allows you to create disposable email addresses that forward messages to your real inbox. We do not store the content of forwarded emails.</p>

        <h2>3. Account Registration</h2>
        <p>You must provide a valid email address to register. You are responsible for maintaining the security of your account credentials.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to use RelayMail for sending spam, phishing, or any illegal activity. We reserve the right to terminate accounts that violate this policy.</p>

        <h2>5. Privacy</h2>
        <p>We collect your email address for the purpose of providing the service. See our <a href="/privacy">Privacy Policy</a> for more details.</p>

        <h2>6. Service Availability</h2>
        <p>We strive to maintain high availability but do not guarantee uninterrupted service. We are not liable for any losses resulting from service downtime.</p>

        <h2>7. Termination</h2>
        <p>You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these terms.</p>

        <h2>8. Changes to Terms</h2>
        <p>We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>

        <h2>9. Contact</h2>
        <p>For questions about these terms, contact us at <a href="mailto:support@relaymails.dev">support@relaymails.dev</a>.</p>
      </div>
    </>
  );
}