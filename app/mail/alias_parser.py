
def parser_alias(local_part: str):
    try:
        user_part, alias = local_part.split(".")

        user_id = int(user_part[1:])

        return user_id, alias

    except Exception:
        return None, None