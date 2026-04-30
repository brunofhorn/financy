# Backend - Sistema de Financas

API GraphQL em TypeScript para gerenciamento de financas pessoais com autenticacao JWT, Prisma e PostgreSQL.

## Stack

- TypeScript
- GraphQL (Apollo Server + Express 5)
- Prisma
- PostgreSQL
- Swagger UI (OpenAPI)

## Requisitos atendidos

- Cadastro e login de usuario
- Usuario visualiza e gerencia apenas seus proprios dados
- CRUD de categorias
- CRUD de transacoes
- CORS habilitado
- Documentacao Swagger em `/docs`

## Variaveis de ambiente

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
npm run prisma:seed
npm run dev
```

## Seed de dados mockados

O seed cria:

- 1 usuario de login
- Categorias base (salario, freelance, moradia, alimentacao, transporte, lazer)
- Transacoes de entrada e saida

Credenciais de acesso criadas pelo seed:

- Email: `demo@financy.local`
- Senha: `123456`

## Endpoints

- GraphQL: `http://localhost:3333/graphql`
- Swagger UI: `http://localhost:3333/docs`
- Healthcheck: `http://localhost:3333/health`

## Swagger e autenticacao

Para operacoes protegidas no endpoint `/graphql`:

1. Execute `register` ou `login` para obter o token.
2. No Swagger, clique em **Authorize**.
3. Informe: `Bearer <seu_token_jwt>`.

## Schema Prisma

Modelos:

- `User`
- `Category`
- `Transaction`

Regra de ownership:

- Categorias e transacoes sempre filtradas por `userId` do token autenticado.
