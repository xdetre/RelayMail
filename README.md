# RelayMail

An email aliasing service — similar to Apple Hide My Email or SimpleLogin.
Users register and get disposable email aliases. Incoming mail is forwarded to their real inbox.
Anonymous users get 2 temporary aliases without registration.

🌐 **Live:** [relaymails.dev](https://relaymails.dev)

---

## Features

- **Disposable aliases** — generate unlimited aliases (up to 8 per account)
- **Instant forwarding** — incoming mail forwarded to real inbox via Postfix
- **Temp mail** — 2 temporary aliases without signup, auto-expire in 30/60 min
- **Google OAuth** — sign in with Google
- **Email verification** — 4-digit code on registration via Resend
- **Cloudflare Turnstile** — captcha protection on registration
- **DKIM + SPF + PTR** — proper email authentication
- **SRS** — sender rewriting for DMARC-strict senders
- **Browser extension** — one-click alias creation on any website

---

## Stack

**Backend**
- Python / FastAPI
- PostgreSQL + SQLAlchemy (async)
- Alembic migrations
- Postfix (SMTP) + custom pipe handler (`relay_handler.py`)
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

---

## Project Structure

```
RelayMail/
├── app/
│   ├── api/routes/      — REST API (users, aliases, emails, auth, temp)
│   ├── core/            — config, security, rate limits
│   ├── db/              — database session
│   ├── models/          — SQLAlchemy models
│   ├── schemas/         — Pydantic schemas
│   └── services/        — business logic
├── frontend/
│   └── src/
│       ├── App.jsx       — auth pages (login, register, verify)
│       ├── Dashboard.jsx — alias management
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
```

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