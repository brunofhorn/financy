# Financy Frontend

Aplicacao React para gerenciamento de transacoes e categorias, integrada ao backend GraphQL da pasta `backend`.

## Stack

- TypeScript
- React
- Vite
- GraphQL via `fetch`
- TailwindCSS
- Shadcn/Radix UI
- React Query
- React Hook Form
- Zod

## Variaveis de ambiente

Copie `.env.example` para `.env` e informe a URL do backend:

```env
VITE_BACKEND_URL=http://localhost:3333
```

O cliente adiciona `/graphql` automaticamente quando a URL nao termina com esse caminho.

## Como rodar sem Docker

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: inicia o Vite
- `npm run build`: valida TypeScript e gera build de producao
- `npm run lint`: executa ESLint
- `npm run preview`: serve o build localmente

## Paginas

- `/`: login quando deslogado e dashboard quando logado
- `/cadastro`: criacao de conta
- `/transacoes`: CRUD de transacoes
- `/categorias`: CRUD de categorias
- `/relatorios`: resumo por tipo e categoria
- `/perfil`: dados da conta
