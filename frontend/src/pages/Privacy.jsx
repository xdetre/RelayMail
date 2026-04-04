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
  ul { padding-left: 20px; margin-bottom: 12px; }
  li { font-size: 14px; line-height: 1.8; color: #94a3b8; }
  a { color: #3b82f6; }
`;

export default function Privacy() {
  return (
    <>
      <style>{css}</style>
      <div className="page">
        <a className="back" href="/">← Back</a>
        <h1>Privacy Policy</h1>
        <p className="date">Last updated: April 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following information when you use RelayMail:</p>
        <ul>
          <li>Your email address (used for account registration and forwarding)</li>
          <li>Email aliases you create</li>
          <li>Metadata about forwarded emails (sender, subject, timestamp)</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information solely to provide the RelayMail service — specifically to forward emails from your aliases to your real inbox. We do not sell, share, or use your data for advertising.</p>

        <h2>3. Email Content</h2>
        <p>We do not store the content of emails that pass through our system. Emails are forwarded in real time and not retained on our servers.</p>

        <h2>4. Data Storage</h2>
        <p>Your account data (email address, aliases) is stored on servers located in Russia. We take reasonable measures to protect your data from unauthorized access.</p>

        <h2>5. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li>Google OAuth — for optional sign-in with Google</li>
          <li>Resend — for sending verification emails</li>
        </ul>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data at any time by deleting your account or contacting us directly.</p>

        <h2>7. Cookies</h2>
        <p>We use localStorage to store your authentication token. We do not use tracking cookies.</p>

        <h2>8. Contact</h2>
        <p>For privacy-related questions, contact us at <a href="mailto:support@relaymails.dev">support@relaymails.dev</a>.</p>
      </div>
    </>
  );
}