# Frontend – Gerador de Artigos WordPress

Projeto em **Vite + React** (não CRA). Interface com React-Bootstrap.

## Como rodar

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Iniciar o backend** (obrigatório para login e gerar artigos)
   Em outro terminal, na raiz do projeto:
   ```bash
   cd backend
   source .venv/bin/activate   # ou .venv\Scripts\activate no Windows
   uvicorn app.main:app --reload --port 8000
   ```

3. **Iniciar o frontend**
   ```bash
   npm run dev
   ```
   Acesse: http://localhost:5173

Se aparecer erro ao entrar ou cadastrar, confira se o backend está rodando na porta **8000**. O frontend usa o proxy do Vite: chamadas para `/api` são enviadas para `http://127.0.0.1:8000`.

## Scripts

- `npm run dev` – servidor de desenvolvimento (Vite)
- `npm run build` – build para produção
- `npm run preview` – preview do build
