"""Schemas Pydantic para artigos."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ArticleBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    slug: Optional[str] = None


class ArticleCreate(BaseModel):
    topic: str = Field(..., min_length=3, description="Tema ou prompt para gerar o artigo")
    model_used: Optional[str] = Field(default="gpt-4o-mini", description="Modelo OpenAI")


class ArticleGenerateRequest(BaseModel):
    topic: str = Field(..., min_length=3)
    model_used: Optional[str] = "gpt-4o-mini"
    save: bool = Field(default=True, description="Salvar no banco após gerar")


class ArticleResponse(ArticleBase):
    id: int
    user_id: int
    prompt_or_topic: Optional[str] = None
    model_used: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    id: int
    title: str
    excerpt: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
