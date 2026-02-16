"""Modelo de artigo gerado por IA."""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    title = Column(String(500), nullable=False)
    slug = Column(String(500), index=True, nullable=True)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)

    # Parâmetros usados na geração (para reprodutibilidade)
    prompt_or_topic = Column(String(1000), nullable=True)
    model_used = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
