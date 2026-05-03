#!/usr/bin/env python3
import sys
import logging
import psycopg
import smtplib
from email import message_from_string
from email.utils import parseaddr

# --- Конфиг ---
DB_URL = "postgresql://relay:relay@localhost:5432/relaymail"
DOMAIN = "relaymails.dev"

# --- Логирование ---
logging.basicConfig(
    filename="/var/log/relaymail_handler.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
log = logging.getLogger(__name__)


def parse_alias(recipient: str):
    """u3.d2fwlscv@relaymails.dev → (3, 'd2fwlscv')"""
    try:
        local = recipient.split("@")[0]  # u3.d2fwlscv
        user_part, alias = local.split(".", 1)  # u3 | d2fwlscv
        user_id = int(user_part[1:])  # 3
        return user_id, alias
    except Exception as e:
        log.warning(f"parse_alias failed for {recipient!r}: {e}")
        return None, None

def parse_temp_alias(recipient: str):
    """temp.abc123@relaymails.dev → 'temp.abc123'"""
    try:
        local = recipient.split("@")[0]
        if local.startswith("temp."):
            return local
        return None
    except:
        return None


def resolve_alias(user_id: int, alias: str):
    """Возвращает (alias_id, real_email) или None"""
    try:
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT a.id, u.email
                    FROM aliases a
                    JOIN users u ON u.id = a.user_id
                    WHERE a.user_id = %s
                      AND a.alias   = %s
                      AND a.is_active = true
                """, (user_id, alias))
                return cur.fetchone()  # (alias_id, real_email) или None
    except Exception as e:
        log.error(f"resolve_alias DB error: {e}")
        return None


def save_email(alias_id: int, sender: str, subject: str, body: str = ""):
    try:
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO emails (alias_id, sender, subject, body, received_at)
                    VALUES (%s, %s, %s, %s, NOW())
                """, (alias_id, sender, subject, body))
            conn.commit()
    except Exception as e:
        log.error(f"save_email DB error: {e}")


def forward_email(real_email: str, raw_data: str, original_recipient: str):
    try:
        msg = message_from_string(raw_data)
        original_from = msg.get("From", "")
        _, original_addr = parseaddr(original_from)
        sender_name = msg.get("From", "Unknown Sender")

        if "From" in msg:
            msg.replace_header("From", f"{sender_name} via relaymails.dev <noreply@relaymails.dev>")
        else:
            msg["From"] = f"via relaymails.dev <noreply@relaymails.dev>"

        # Удаляем оригинальные DKIM подписи — они невалидны после изменения From
        while "DKIM-Signature" in msg:
            del msg["DKIM-Signature"]

        if "Reply-To" not in msg:
            msg["Reply-To"] = original_from

        if "To" in msg:
            msg.replace_header("To", real_email)
        else:
            msg["To"] = real_email

        msg["X-RelayMail-Original-To"] = original_recipient

        log.info(f"Sending with From: {msg.get('From')}")  # дебаг

        with smtplib.SMTP("localhost", 25) as smtp:
            smtp.sendmail(
                "noreply@relaymails.dev",
                real_email,
                msg.as_bytes()  # вместо msg.as_string()
            )

        log.info(f"Forwarded to {real_email} (alias: {original_recipient})")
    except Exception as e:
        log.error(f"forward_email failed → {real_email}: {e}")


def parse_headers(raw_data: str):
    msg = message_from_string(raw_data)
    _, sender = parseaddr(msg.get("From", ""))
    subject = msg.get("Subject", "(no subject)")
    return sender, subject


# --- Точка входа ---
def main():
    if len(sys.argv) < 2:
        log.error("No recipient argument")
        sys.exit(1)

    recipient = sys.argv[1].lower().strip()
    log.info(f"Incoming mail for: {recipient}")

    if recipient == "support@relaymails.dev":
        raw_data = sys.stdin.read()
        forward_email("enderctoun@gmail.com", raw_data, recipient)
        sys.exit(0)

    if not recipient.endswith("@" + DOMAIN):
        log.info(f"Not our domain, skipping: {recipient}")
        sys.exit(0)

    raw_data = sys.stdin.read()
    if not raw_data:
        log.error("Empty stdin")
        sys.exit(1)

    # Проверяем temp алиас ПЕРЕД обычным parse_alias
    temp_alias = parse_temp_alias(recipient)
    if temp_alias:
        sender, subject = parse_headers(raw_data)
        body = extract_body(raw_data)
        save_temp_email_sync(temp_alias, sender, subject, body)
        sys.exit(0)

    # Проверяем кастомный алиас
    local = recipient.split("@")[0]
    if "." not in local or not local.split(".")[0].startswith("u"):
        result = resolve_custom_alias(local)
        if result:
            alias_id, real_email = result
            log.info(f"Custom alias resolved: {recipient} → {real_email}")
            sender, subject = parse_headers(raw_data)
            body = extract_body(raw_data)
            save_email(alias_id, sender, subject, body)
            forward_email(real_email, raw_data, recipient)
            sys.exit(0)

    user_id, alias = parse_alias(recipient)

    if user_id is None:
        log.warning(f"Could not parse alias from: {recipient}")
        sys.exit(0)

    result = resolve_alias(user_id, alias)
    if not result:
        log.warning(f"Alias not found or inactive: user_id={user_id} alias={alias}")
        sys.exit(0)

    alias_id, real_email = result  # ← правильный unpack
    log.info(f"Resolved: {recipient} → {real_email}")

    sender, subject = parse_headers(raw_data)
    body = extract_body(raw_data)
    save_email(alias_id, sender, subject, body)
    forward_email(real_email, raw_data, recipient)


def save_temp_email_sync(alias: str, sender: str, subject: str, body: str):
    try:
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id FROM temp_aliases 
                    WHERE alias = %s AND expires_at > NOW()
                """, (alias,))
                row = cur.fetchone()
                if not row:
                    log.warning(f"Temp alias not found or expired: {alias}")
                    return
                temp_alias_id = row[0]
                cur.execute("""
                    INSERT INTO temp_emails (temp_alias_id, sender, subject, body, received_at)
                    VALUES (%s, %s, %s, %s, NOW())
                """, (temp_alias_id, sender, subject, body))
            conn.commit()
    except Exception as e:
        log.error(f"save_temp_email_sync error: {e}")


def extract_body(raw_data: str) -> str:
    msg = message_from_string(raw_data)
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                return part.get_payload(decode=True).decode("utf-8", errors="ignore")
            if part.get_content_type() == "text/html":
                return part.get_payload(decode=True).decode("utf-8", errors="ignore")
    else:
        return msg.get_payload(decode=True).decode("utf-8", errors="ignore")
    return ""


#для ответов через кастомные алиасы
def resolve_custom_alias(alias: str):
    """amazon@relaymails.dev → (alias_id, real_email) или None"""
    try:
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT a.id, u.email
                    FROM aliases a
                    JOIN users u ON u.id = a.user_id
                    WHERE a.alias = %s
                      AND a.is_custom = true
                      AND a.is_active = true
                """, (alias,))
                return cur.fetchone()
    except Exception as e:
        log.error(f"resolve_custom_alias DB error: {e}")
        return None

if __name__ == "__main__":
    main()
