# Financy

Sistema financeiro pessoal com backend GraphQL e frontend React. O projeto foi preparado para ser executado localmente com Docker, sem exigir instalacao manual de PostgreSQL ou Node.js na maquina de quem for avaliar.

## Stack

- Backend: Node.js, TypeScript, Apollo Server, Express, Prisma e PostgreSQL
- Frontend: React, TypeScript, Vite, TailwindCSS, Shadcn/Radix UI, React Query, React Hook Form e Zod
- DevOps/local: Docker, Docker Compose, migrations Prisma e seed automatizado

## Requisitos

- Git
- Docker
- Docker Compose

## Como rodar com Docker

Clone o repositorio e execute na raiz:

```bash
docker compose up --build
```

Ao subir, o ambiente executa automaticamente:

- PostgreSQL local
- Migrations do Prisma
- Seed com usuario e dados de demonstracao
- Backend em `http://localhost:3333`
- Frontend em `http://localhost:5173`

## Acessos

- Aplicacao: `http://localhost:5173`
- API GraphQL: `http://localhost:3333/graphql`
- Swagger: `http://localhost:3333/docs`
- Healthcheck: `http://localhost:3333/health`

Usuario criado pelo seed:

```txt
Email: demo@financy.local
Senha: 123456
```

Tambem e possivel criar uma nova conta pela tela de cadastro.

## Banco de dados

O Compose cria um Postgres com as credenciais:

```txt
Host local: localhost
Porta: 5432
Database: financy
Usuario: financy
Senha: financy
```

A string usada pelo backend dentro do Docker e:

```txt
postgresql://financy:financy@postgres:5432/financy?schema=public
```

Os dados ficam persistidos no volume Docker `postgres_data`.

## Comandos uteis

Parar os containers:

```bash
docker compose down
```

Parar e apagar os dados do banco:

```bash
docker compose down -v
```

Ver logs:

```bash
docker compose logs -f
```

Executar migrations manualmente no container:

```bash
docker compose exec backend npx prisma migrate deploy
```

Executar seed manualmente:

```bash
docker compose exec backend npm run prisma:seed
```

## Rodando sem Docker

Tambem e possivel rodar manualmente. Nesse caso, suba um PostgreSQL local e configure os arquivos:

- `backend/.env`
- `frontend/.env`

Use os exemplos:

- `backend/.env.example`
- `frontend/.env.example`

Backend:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Observacoes para avaliacao

- O backend aplica migrations automaticamente quando sobe via Docker.
- O seed e idempotente para o usuario demo: ele recria categorias e transacoes desse usuario.
- Arquivos `.env` locais nao devem ser versionados.
- Os arquivos `.env.example` contem apenas valores seguros para ambiente local.
