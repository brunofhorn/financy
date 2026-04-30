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
VITE_BACKEND_URL=http://localhost:3333/graphql
```

Se a variavel estiver vazia, o frontend usa `http://localhost:3333/graphql`.

## Como rodar

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
- `/perfil`: dados da conta e endpoint configurado
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
