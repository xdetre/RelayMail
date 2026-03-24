import time

requests = {}

def is_rate_limited(key: str, limit: int = 5, window: int = 60):
    now = time.time()

    if key not in requests:
        requests[key] = []

    requests[key] = [
        t for t in requests[key]
        if now - t < window
    ]

    if len(requests[key]) >= limit:
        return True

    requests[key].append(now)
    return False