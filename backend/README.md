# Backend - Sistema de Financas

API GraphQL em TypeScript para gerenciamento de finanças pessoais com autenticação JWT, Prisma e PostgreSQL.

## Stack

- TypeScript
- GraphQL (Apollo Server + Express 5)
- Prisma
- PostgreSQL
- Swagger UI (OpenAPI)

## Requisitos atendidos

- Cadastro e login de usuário
- Usuário visualiza e gerencia apenas seus próprios dados
- CRUD de categorias
- CRUD de transações
- CORS habilitado
- Documentação Swagger em `/docs`

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores:

```env
JWT_SECRET=
DATABASE_URL=postgresql://financy:financy@localhost:5432/financy?schema=public
PORT=3333
```

## Como rodar sem Docker

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Seed de dados mockados

O seed cria:

- 1 usuário de login
- Categorias base (salário, freelance, moradia, alimentação, transporte, lazer)
- Transações de entrada e saída

Credenciais de acesso criadas pelo seed:

- Email: `demo@financy.local`
- Senha: `12345678`

## Endpoints

- GraphQL: `http://localhost:3333/graphql`
- Swagger UI: `http://localhost:3333/docs`
- Healthcheck: `http://localhost:3333/health`

## Swagger e autenticação

Para operações protegidas no endpoint `/graphql`:

1. Execute `register` ou `login` para obter o token.
2. No Swagger, clique em **Authorize**.
3. Informe: `Bearer <seu_token_jwt>`.

## Schema Prisma

Modelos:

- `User`
- `Category`
- `Transaction`

Regra de ownership:

- Categorias e transações sempre filtradas por `userId` do token autenticado.

## Docker

Na raiz do repositório existe um `docker-compose.yml` que sobe Postgres, backend e frontend juntos. Para uso isolado do backend em Docker, prefira executar pela raiz do projeto.
