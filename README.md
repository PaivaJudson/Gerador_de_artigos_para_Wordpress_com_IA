# Gerador de Artigos para WordPress com IA

Projeto full-stack para gerar artigos em HTML para WordPress usando a API da OpenAI, com autenticação e persistência em banco de dados.

## Como executar o sistema

**Pré-requisitos:** Python 3.10+, Node.js 18+, chave da API OpenAI.

### Terminal 1 — Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edite .env e coloque sua OPENAI_API_KEY=sk-...
uvicorn app.main:app --reload --port 8000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Depois acesse **http://localhost:5173**. Para ver as páginas sem login, use **http://localhost:5173/demo**.

---

## Stack

| Camada    | Tecnologia        | Observação                          |
|-----------|-------------------|-------------------------------------|
| Backend   | **FastAPI**       | API REST, async, documentação OpenAPI |
| Banco     | **SQLite**        | Desenvolvimento; troca fácil para PostgreSQL depois |
| ORM       | **SQLAlchemy**    | Async; migração simples de banco    |
| Auth      | **JWT** (python-jose) + **bcrypt** | Login/registro seguro |
| IA        | **OpenAI API**    | Geração de artigos (GPT-4o-mini, etc.) |
| Frontend  | **React** + **Vite** | Build rápido                      |
| UI        | **React-Bootstrap** | Componentes flexíveis, fácil de alterar |
| Roteamento| **React Router**  | SPA com rotas protegidas            |

## Pré-requisitos

- Python 3.11+
- Node.js 18+
- Chave da API OpenAI ([platform.openai.com](https://platform.openai.com))

## Configuração

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edite .env e defina OPENAI_API_KEY=sk-...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

A API ficará em `http://127.0.0.1:8000`. Documentação interativa: `http://127.0.0.1:8000/docs`.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173` e usa proxy para a API em `/api` (Vite redireciona para a porta 8000).

### 3. Uso

1. Acesse `http://localhost:5173`.
2. Cadastre-se ou faça login.
3. Em **Gerar artigo**, informe o tema e clique em **Gerar artigo**.
4. Os artigos ficam em **Meus artigos** e podem ser visualizados ou excluídos.

## Estrutura do projeto

```
Gerador_de_Artigos_com_IA/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, rotas
│   │   ├── config.py        # Settings (env)
│   │   ├── database.py      # SQLAlchemy async, SQLite
│   │   ├── auth/            # JWT, senha, get_current_user
│   │   ├── models/          # User, Article
│   │   ├── schemas/         # Pydantic (request/response)
│   │   ├── routers/         # auth, articles
│   │   └── services/        # openai_service (geração)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, navbar
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Login, Register, Dashboard, Generate, ArticleDetail
│   │   └── services/        # api.js (fetch + token)
│   ├── package.json
│   └── vite.config.js       # proxy /api -> 8000
└── README.md
```

## Banco de dados em produção

Para trocar do SQLite para PostgreSQL:

1. Instale o driver async: `pip install asyncpg`.
2. No `.env`:  
   `DATABASE_URL=postgresql+asyncpg://usuario:senha@host:5432/nome_do_banco`
3. Os modelos já usam SQLAlchemy; em produção considere migrations (ex.: Alembic).

## Licença

Uso livre para fins de estudo e adaptação.
