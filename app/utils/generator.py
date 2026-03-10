import string, secrets

alphabet = string.ascii_lowercase + string.digits

def generate_alias(length: int = 10):
    return ''.join(secrets.choice(alphabet) for _ in range(length))