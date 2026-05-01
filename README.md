<p align="center">
  <img src="./frontend/public/financy-mark.png" alt="Financy" width="72" />
</p>

<h1 align="center">Financy</h1>

<p align="center">
  Sistema financeiro pessoal para gerenciar transações e categorias com autenticação, dashboard, filtros, relatórios e interface responsiva.
</p>

<p align="center">
  <a href="https://ftr-financy.vercel.app/">Frontend Live</a>
  |
  <a href="https://financy-backend-jfxf.onrender.com">Backend Live</a>
  |
  <a href="https://financy-backend-jfxf.onrender.com/docs">Swagger</a>
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img alt="GraphQL" src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

## Sobre

O Financy é uma aplicação full stack desenvolvida para gerenciamento financeiro pessoal. O usuário pode criar uma conta, autenticar-se, criar categorias, cadastrar transações de entrada e saída, visualizar indicadores no dashboard e manter seus dados isolados por usuário.

O projeto esta organizado em duas aplicações:

- `backend`: API GraphQL em Node.js, Apollo Server, Express, Prisma e PostgreSQL.
- `frontend`: SPA em React, Vite, TailwindCSS, Radix/Shadcn, React Query, React Hook Form e Zod.

## Funcionalidades

- Cadastro e login de usuários
- Dashboard com saldo, receitas, despesas, transações recentes e categorias
- CRUD de transações
- CRUD de categorias com ícone e cor
- Filtros de transações por texto, tipo, categoria e período
- Perfil do usuário
- Toasts de sucesso
- Modais de confirmação para exclusão
- Seed com dados de demonstração
- Ambiente local completo com Docker

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Frontend | React, TypeScript, Vite, TailwindCSS, Radix UI/Shadcn, React Query, React Hook Form, Zod, Lucide Icons |
| Backend | Node.js, TypeScript, Apollo Server, Express, GraphQL, Prisma, JWT, bcrypt, Zod |
| Banco | PostgreSQL |
| DevOps | Docker, Docker Compose, Prisma Migrations, Nginx |
| Deploy | Vercel, Render |

## Links Live

- Frontend: https://ftr-financy.vercel.app/
- Backend: https://financy-backend-jfxf.onrender.com
- GraphQL: https://financy-backend-jfxf.onrender.com/graphql
- Swagger: https://financy-backend-jfxf.onrender.com/docs

## Rodando Localmente Com Docker

### Pré-requisitos

- Git
- Docker
- Docker Compose

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd financy
```

### 2. Suba todo o ambiente

```bash
docker compose up --build
```

Esse comando sobe:

- PostgreSQL em `localhost:5432`
- Backend em `http://localhost:3333`
- Frontend em `http://localhost:5173`

Durante a inicialização, o backend executa automaticamente:

- `prisma migrate deploy`
- `prisma db seed`

### 3. Acesse a aplicação

Abra:

```txt
http://localhost:5173
```

Usuario de demonstracao criado pelo seed:

```txt
Email: demo@financy.local
Senha: 12345678
```

Também é possível criar uma nova conta pela tela de cadastro.

## Serviços Docker

| Serviço | Porta | Descrição |
| --- | --- | --- |
| `postgres` | `5432` | Banco PostgreSQL local |
| `backend` | `3333` | API GraphQL + Swagger |
| `frontend` | `5173` | Aplicação React servida por Nginx |

Credenciais locais do banco:

```txt
Database: financy
User: financy
Password: financy
Host: localhost
Port: 5432
```

String de conexão usada pelo backend no Docker:

```txt
postgresql://financy:financy@postgres:5432/financy?schema=public
```

Os dados ficam persistidos no volume Docker `postgres_data`.

## Comandos Uteis

Ver logs:

```bash
docker compose logs -f
```

Parar containers:

```bash
docker compose down
```

Parar containers e apagar o banco local:

```bash
docker compose down -v
```

Executar migrations manualmente:

```bash
docker compose exec backend npx prisma migrate deploy
```

Executar seed manualmente:

```bash
docker compose exec backend npm run prisma:seed
```

Abrir shell no backend:

```bash
docker compose exec backend sh
```

## Rodando Sem Docker

Use essa opção se quiser executar backend e frontend diretamente na máquina.

### Backend

Crie `backend/.env` a partir de `backend/.env.example`:

```env
JWT_SECRET=change-me
DATABASE_URL=postgresql://financy:financy@localhost:5432/financy?schema=public
PORT=3333
```

Depois execute:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Frontend

Crie `frontend/.env` a partir de `frontend/.env.example`:

```env
VITE_BACKEND_URL=http://localhost:3333
```

Depois execute:

```bash
cd frontend
npm install
npm run dev
```

## Estrutura

```txt
financy/
|-- backend/
|   |-- prisma/
|   |-- src/
|   |-- Dockerfile
|   `-- README.md
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- Dockerfile
|   |-- nginx.conf
|   `-- README.md
|-- docker-compose.yml
`-- README.md
```

## Observações

- Arquivos `.env` locais não devem ser versionados.
- Os arquivos `.env.example` contém apenas valores seguros para desenvolvimento local.
- O seed e idempotente para o usuário demo e recria os dados desse usuário.
- Se a porta `5432`, `3333` ou `5173` estiver ocupada, ajuste o mapeamento no `docker-compose.yml`.
