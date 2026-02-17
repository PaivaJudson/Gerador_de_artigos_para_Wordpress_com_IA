"""Hash e verificação de senha com bcrypt (sem passlib para evitar incompatibilidade com bcrypt 5.x)."""
import bcrypt

# Limite do bcrypt: senha em bytes não pode passar de 72
MAX_PASSWORD_BYTES = 72


def hash_password(password: str) -> str:
    raw = password.encode("utf-8")
    if len(raw) > MAX_PASSWORD_BYTES:
        raise ValueError("Senha muito longa. Use no máximo 72 caracteres.")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(raw, salt)
    return hashed.decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain.encode("utf-8"),
            hashed.encode("utf-8"),
        )
    except Exception:
        return False
