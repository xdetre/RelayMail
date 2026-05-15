# RelayMail

An email aliasing service — similar to Apple Hide My Email or SimpleLogin.
Users register and get disposable email aliases. Incoming mail is forwarded to their real inbox.
Anonymous users get 2 temporary aliases without registration.

🌐 **Live:** [relaymails.dev](https://relaymails.dev)

---

## Features

- **Disposable aliases** — up to 5 aliases for free (30-day expiry), unlimited for Pro
- **Instant forwarding** — incoming mail forwarded to real inbox via Postfix
- **Temp mail** — 2 temporary aliases without signup, sequential expiry (30/60 min)
- **Reply via alias** — reply to emails without revealing your real address
- **Custom aliases** — Pro users can create `amazon@relaymails.dev` style aliases
- **Inline inbox** — view emails directly in dashboard without leaving the page
- **Alias stats** — see top senders and activity charts per alias
- **Alias labels** — tag aliases (e.g. "Nike", "Banks")
- **Google OAuth** — sign in with Google
- **Email verification** — 4-digit code on registration via Resend
- **Cloudflare Turnstile** — captcha protection on registration
- **DKIM + SPF + PTR + SRS** — proper email authentication and DMARC compliance
- **Browser extension** — one-click alias creation on any website
- **Pro plan** — $1/month via YooKassa (cards) or CryptoCloud (crypto)
- **GDPR** — data export and account deletion

---

## Stack

**Backend**
- Python / FastAPI
- PostgreSQL + SQLAlchemy (async)
- Alembic migrations
- Postfix (SMTP) + custom pipe handler (`relay_handler.py`)
- postsrsd (SRS rewriting)
- Docker / Docker Compose

**Frontend**
- React / Vite
- React Router
- Mobile responsive

**Infrastructure**
- VPS: Timeweb Cloud (Ubuntu)
- Nginx reverse proxy
- SSL: Let's Encrypt
- DNS: Cloudflare
- Email: Resend (transactional), OpenDKIM

**Payments**
- YooKassa (Russian cards, SBP)
- CryptoCloud (USDT, BTC, ETH)

---

## Project Structure

```
RelayMail/
├── app/
│   ├── api/routes/      — REST API (users, aliases, emails, auth, temp, payments)
│   ├── core/            — config, security, rate limits
│   ├── db/              — database session
│   ├── models/          — SQLAlchemy models (User, Alias, Email, TempAlias, ReplyToken...)
│   ├── schemas/         — Pydantic schemas
│   └── services/        — business logic
├── frontend/
│   └── src/
│       ├── App.jsx       — auth pages (login, register, verify)
│       ├── Dashboard.jsx — alias management with split-view inbox
│       ├── Profile.jsx   — profile, password change, subscription management
│       ├── Upgrade.jsx   — pricing and payment page
│       └── pages/        — TempMail, Terms, Privacy
├── migrations/           — Alembic migrations
├── tests/                — pytest tests
└── relay_handler.py      — Postfix pipe handler
```

---

## Setup (Local)

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in values
3. Run the stack:

```bash
docker-compose up --build
docker-compose run migrate
```

4. API: `http://localhost:8001/docs`
5. Frontend: `http://localhost:5173`

### Environment variables

```
DATABASE_URL=postgresql+asyncpg://relay:relay@db:5432/relaymail
SECRET_KEY=your-secret-key
DOMAIN=relaymails.dev
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8001/auth/google/callback
RESEND_API_KEY=...
TURNSTILE_SECRET_KEY=...
FRONTEND_URL=http://localhost:5173
TEMP_ALIAS_LIMIT=2
TEMP_ALIAS_TTL_MINUTES=30
MAX_ALIASES_PER_USER=8
YOOKASSA_SHOP_ID=...
YOOKASSA_SECRET_KEY=...
CRYPTOCLOUD_API_KEY=...
CRYPTOCLOUD_SHOP_ID=...
```

---

## Plans

| Feature | Free    | Pro ($1/mo) |
|---|---------|---|
| Aliases | 5       | Unlimited |
| Expiry | 15 days | Never |
| Custom aliases | ✗       | ✓ |
| Reply via alias | ✓       | ✓ |
| Inbox in dashboard | ✓       | ✓ |

---

## Tests

```bash
pytest tests/ -v
```

---

## Browser Extension

Located in `extension/`. Load unpacked in Chrome via `chrome://extensions/` → Developer mode.

---

## Status

✅ Deployed and functional