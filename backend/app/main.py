"""Aplicação FastAPI - Gerador de Artigos WordPress com IA."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import init_db
from app.routers import auth, articles

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
settings = get_settings()


async def catch_all_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Garante que todo erro retorna JSON; HTTPException mantém status original."""
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail if isinstance(exc.detail, str) else exc.detail},
        )
    logger.exception("Erro 500: %s", exc)
    detail = str(exc) if settings.DEBUG else "Erro interno. Tente novamente."
    return JSONResponse(status_code=500, content={"detail": detail})


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    # cleanup se necessário


app = FastAPI(
    title=settings.APP_NAME,
    description="API para gerar artigos para WordPress usando OpenAI",
    version="1.0.0",
    lifespan=lifespan,
)
app.add_exception_handler(Exception, catch_all_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(articles.router)


@app.get("/health")
def health():
    return {"status": "ok"}
