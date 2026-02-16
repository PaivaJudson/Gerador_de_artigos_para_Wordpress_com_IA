"""Serviço de geração de artigos com OpenAI."""
import re
from openai import AsyncOpenAI
from app.config import get_settings

settings = get_settings()
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

SYSTEM_PROMPT = """Você é um redator especializado em criar artigos para WordPress.
Gere artigos em HTML adequado para WordPress (pode usar <p>, <h2>, <h3>, <ul>, <ol>, <strong>, <em>).
O texto deve ser em português do Brasil, claro e bem estruturado.
Retorne apenas o corpo do artigo em HTML, sem wrappers extras. Inclua um título sugerido no início, dentro de um comentário HTML: <!-- TITLE: Seu título aqui -->"""


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text[:200].strip("-")


async def generate_article(topic: str, model: str = "gpt-4o-mini") -> dict:
    """
    Gera um artigo com base no tema usando OpenAI.
    Retorna dict com title, content, excerpt, slug.
    """
    if not client:
        raise ValueError("OPENAI_API_KEY não configurada. Defina no .env.")

    user_prompt = f"Crie um artigo completo para WordPress sobre: {topic}"

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        max_tokens=4000,
    )

    raw_content = response.choices[0].message.content or ""

    # Extrair título do comentário se existir
    title_match = re.search(r"<!--\s*TITLE:\s*(.+?)\s*-->", raw_content, re.IGNORECASE | re.DOTALL)
    if title_match:
        title = title_match.group(1).strip()
        content = raw_content.replace(title_match.group(0), "").strip()
    else:
        title = topic[:200]
        content = raw_content

    # Excerpt: primeiras ~160 caracteres do texto, sem HTML
    text_only = re.sub(r"<[^>]+>", " ", content)
    text_only = " ".join(text_only.split())
    excerpt = (text_only[:157] + "...") if len(text_only) > 160 else text_only

    slug = _slugify(title)

    return {
        "title": title,
        "content": content,
        "excerpt": excerpt,
        "slug": slug,
    }
