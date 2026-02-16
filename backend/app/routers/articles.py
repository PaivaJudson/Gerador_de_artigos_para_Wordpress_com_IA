"""Rotas de artigos (geração e CRUD)."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database import get_db
from app.models import User, Article
from app.schemas import (
    ArticleResponse,
    ArticleListResponse,
    ArticleGenerateRequest,
)
from app.auth import get_current_user
from app.services.openai_service import generate_article

router = APIRouter(prefix="/articles", tags=["articles"])


@router.post("/generate", response_model=ArticleResponse)
async def generate_and_save(
    body: ArticleGenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Gera um artigo com IA e opcionalmente salva no banco."""
    try:
        result = await generate_article(
            topic=body.topic,
            model=body.model_used or "gpt-4o-mini",
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erro ao gerar artigo: {str(e)}",
        )

    if not body.save:
        return ArticleResponse(
            id=0,
            user_id=current_user.id,
            title=result["title"],
            content=result["content"],
            excerpt=result.get("excerpt"),
            slug=result.get("slug"),
            prompt_or_topic=body.topic,
            model_used=body.model_used,
        )

    article = Article(
        user_id=current_user.id,
        title=result["title"],
        content=result["content"],
        excerpt=result.get("excerpt"),
        slug=result.get("slug"),
        prompt_or_topic=body.topic,
        model_used=body.model_used,
    )
    db.add(article)
    await db.flush()
    await db.refresh(article)
    return ArticleResponse.model_validate(article)


@router.get("", response_model=list[ArticleListResponse])
async def list_articles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """Lista artigos do usuário."""
    result = await db.execute(
        select(Article)
        .where(Article.user_id == current_user.id)
        .order_by(desc(Article.created_at))
        .offset(skip)
        .limit(limit)
    )
    articles = result.scalars().all()
    return [ArticleListResponse.model_validate(a) for a in articles]


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retorna um artigo por ID."""
    result = await db.execute(
        select(Article).where(
            Article.id == article_id,
            Article.user_id == current_user.id,
        )
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    return ArticleResponse.model_validate(article)


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove um artigo."""
    result = await db.execute(
        select(Article).where(
            Article.id == article_id,
            Article.user_id == current_user.id,
        )
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    await db.delete(article)
    return None
