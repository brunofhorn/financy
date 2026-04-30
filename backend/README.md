# Backend - Sistema de Finanças

API GraphQL em TypeScript para gerenciamento de finanças pessoais com autenticação JWT, Prisma e PostgreSQL.

## Stack

- TypeScript
- GraphQL (Apollo Server + Express 5)
- Prisma
- PostgreSQL

## Requisitos atendidos

- Cadastro e login de usuário
- Usuário visualiza e gerencia apenas seus próprios dados
- CRUD de categorias
- CRUD de transações
- CORS habilitado

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores:

```env
JWT_SECRET=
DATABASE_URL=
PORT=3333
```

## Como rodar

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Servidor:

- GraphQL: `http://localhost:3333/graphql`
- Healthcheck: `http://localhost:3333/health`

## Schema Prisma

Modelos:

- `User`
- `Category`
- `Transaction`

Regra de ownership:

- Categorias e transações sempre filtradas por `userId` do token autenticado.
