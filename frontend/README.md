# Financy Frontend

Aplicação React para gerenciamento de transações e categorias, integrada ao backend GraphQL da pasta `backend`.

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

## Variáveis de ambiente

Copie `.env.example` para `.env` e informe a URL do backend:

```env
VITE_BACKEND_URL=http://localhost:3333
```

O cliente adiciona `/graphql` automaticamente quando a URL não termina com esse caminho.

## Como rodar sem Docker

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: inicia o Vite
- `npm run build`: valida TypeScript e gera build de produção
- `npm run lint`: executa ESLint
- `npm run preview`: serve o build localmente

## Páginas

- `/`: login quando deslogado e dashboard quando logado
- `/cadastro`: criação de conta
- `/transacoes`: CRUD de transações
- `/categorias`: CRUD de categorias
- `/relatorios`: resumo por tipo e categoria
- `/perfil`: dados da conta
