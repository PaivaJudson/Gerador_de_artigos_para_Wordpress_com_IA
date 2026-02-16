"""Configurações da aplicação."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configurações carregadas de variáveis de ambiente."""

    # API
    APP_NAME: str = "Gerador de Artigos WordPress"
    DEBUG: bool = False

    # Banco de dados (SQLite para desenvolvimento)
    DATABASE_URL: str = "sqlite+aiosqlite:///./artigos.db"

    # JWT
    SECRET_KEY: str = "altere-em-producao-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas

    # OpenAI (obrigatório para geração de artigos)
    OPENAI_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
