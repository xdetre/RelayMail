# RelayMail

A backend service for email aliasing — similar to Apple Hide My Email.
Users register with their real email and get generated aliases (e.g. `u3.d2fwlscv@relaymails.ru`).
Incoming mail to aliases is forwarded to the user's real email.

## Stack

- **Python** / FastAPI
- **PostgreSQL**
- **Postfix** (SMTP server + pipe handler)
- **Docker** / Docker Compose

## Project Structure

- `app/api/routes/` — REST API endpoints (users, aliases, emails)
- `app/services/` — business logic
- `app/models/` — database models
- `app/mail/` — email parsing and building
- `relay_handler.py` — Postfix pipe handler for incoming mail forwarding

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your values
3. Run the stack:

\```bash
docker-compose up --build
\```

4. API available at `http://localhost:8001/docs`

## Status

🚧 In active development