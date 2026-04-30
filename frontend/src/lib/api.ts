import { graphqlRequest } from "./graphql";
import type { AuthPayload, Category, Transaction, TransactionType, User } from "./types";

const USER_FIELDS = `
  id
  name
  email
  createdAt
  updatedAt
`;

const CATEGORY_FIELDS = `
  id
  name
  description
  icon
  color
  createdAt
  updatedAt
`;

const TRANSACTION_FIELDS = `
  id
  title
  amount
  type
  date
  notes
  category {
    ${CATEGORY_FIELDS}
  }
  createdAt
  updatedAt
`;

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type CategoryInput = {
  name: string;
  description?: string | null;
  icon?: string;
  color?: string;
};

export type TransactionInput = {
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  notes?: string | null;
  categoryId?: string | null;
};

export async function login(input: LoginInput) {
  const data = await graphqlRequest<{ login: AuthPayload }>(
    `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user { ${USER_FIELDS} }
        }
      }
    `,
    { input },
  );

  return data.login;
}

export async function register(input: RegisterInput) {
  const data = await graphqlRequest<{ register: AuthPayload }>(
    `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user { ${USER_FIELDS} }
        }
      }
    `,
    { input },
  );

  return data.register;
}

export async function getMe(token: string) {
  const data = await graphqlRequest<{ me: User }>(
    `
      query Me {
        me { ${USER_FIELDS} }
      }
    `,
    undefined,
    token,
  );

  return data.me;
}

export async function getCategories(token: string) {
  const data = await graphqlRequest<{ categories: Category[] }>(
    `
      query Categories {
        categories { ${CATEGORY_FIELDS} }
      }
    `,
    undefined,
    token,
  );

  return data.categories;
}

export async function getTransactions(token: string) {
  const data = await graphqlRequest<{ transactions: Transaction[] }>(
    `
      query Transactions {
        transactions { ${TRANSACTION_FIELDS} }
      }
    `,
    undefined,
    token,
  );

  return data.transactions;
}

export async function createCategory(input: CategoryInput, token: string) {
  const data = await graphqlRequest<{ createCategory: Category }>(
    `
      mutation CreateCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) { ${CATEGORY_FIELDS} }
      }
    `,
    { input },
    token,
  );

  return data.createCategory;
}

export async function updateCategory(id: string, input: CategoryInput, token: string) {
  const data = await graphqlRequest<{ updateCategory: Category }>(
    `
      mutation UpdateCategory($input: UpdateCategoryInput!) {
        updateCategory(input: $input) { ${CATEGORY_FIELDS} }
      }
    `,
    { input: { id, ...input } },
    token,
  );

  return data.updateCategory;
}

export async function deleteCategory(id: string, token: string) {
  const data = await graphqlRequest<{ deleteCategory: boolean }>(
    `
      mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id)
      }
    `,
    { id },
    token,
  );

  return data.deleteCategory;
}

export async function createTransaction(input: TransactionInput, token: string) {
  const data = await graphqlRequest<{ createTransaction: Transaction }>(
    `
      mutation CreateTransaction($input: CreateTransactionInput!) {
        createTransaction(input: $input) { ${TRANSACTION_FIELDS} }
      }
    `,
    { input },
    token,
  );

  return data.createTransaction;
}

export async function updateTransaction(
  id: string,
  input: TransactionInput,
  token: string,
) {
  const data = await graphqlRequest<{ updateTransaction: Transaction }>(
    `
      mutation UpdateTransaction($input: UpdateTransactionInput!) {
        updateTransaction(input: $input) { ${TRANSACTION_FIELDS} }
      }
    `,
    { input: { id, ...input } },
    token,
  );

  return data.updateTransaction;
}

export async function deleteTransaction(id: string, token: string) {
  const data = await graphqlRequest<{ deleteTransaction: boolean }>(
    `
      mutation DeleteTransaction($id: ID!) {
        deleteTransaction(id: $id)
      }
    `,
    { id },
    token,
  );

  return data.deleteTransaction;
}
