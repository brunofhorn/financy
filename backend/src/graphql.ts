import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import type { GraphQLContext } from "./context.js";
import { signAccessToken } from "./lib/auth.js";

const registerInputSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres."),
  email: z.string().trim().email("E-mail inválido."),
  password: z
    .string()
    .min(6, "Senha deve ter ao menos 6 caracteres.")
    .max(72, "Senha muito longa."),
});

const loginInputSchema = z.object({
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

const categoryCreateInputSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres."),
  description: z.string().trim().max(255).optional().nullable(),
  icon: z.string().trim().min(1).max(50).optional(),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

const categoryUpdateInputSchema = z.object({
  id: z.string().cuid("ID da categoria inválido."),
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().max(255).optional().nullable(),
  icon: z.string().trim().min(1).max(50).optional(),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

const transactionCreateInputSchema = z.object({
  title: z.string().trim().min(2, "Título deve ter ao menos 2 caracteres."),
  amount: z.number().positive("Valor precisa ser maior que zero."),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.string().datetime("Data inválida."),
  notes: z.string().trim().max(500).optional().nullable(),
  categoryId: z.string().cuid().optional().nullable(),
});

const transactionUpdateInputSchema = z.object({
  id: z.string().cuid("ID da transação inválido."),
  title: z.string().trim().min(2).optional(),
  amount: z.number().positive().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  date: z.string().datetime().optional(),
  notes: z.string().trim().max(500).optional().nullable(),
  categoryId: z.string().cuid().optional().nullable(),
});

export const typeDefs = `#graphql
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    description: String
    icon: String!
    color: String!
    createdAt: String!
    updatedAt: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: TransactionType!
    date: String!
    notes: String
    category: Category
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateCategoryInput {
    name: String!
    description: String
    icon: String
    color: String
  }

  input UpdateCategoryInput {
    id: ID!
    name: String
    description: String
    icon: String
    color: String
  }

  input CreateTransactionInput {
    title: String!
    amount: Float!
    type: TransactionType!
    date: String!
    notes: String
    categoryId: ID
  }

  input UpdateTransactionInput {
    id: ID!
    title: String
    amount: Float
    type: TransactionType
    date: String
    notes: String
    categoryId: ID
  }

  type Query {
    me: User!
    categories: [Category!]!
    transactions: [Transaction!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const user = await context.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new GraphQLError("Usuário não encontrado.", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return user;
    },
    categories: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const userId = requireAuth(context);
      return context.prisma.category.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    },
    transactions: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const userId = requireAuth(context);
      return context.prisma.transaction.findMany({
        where: { userId },
        include: { category: true },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      });
    },
  },
  Mutation: {
    register: async (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) => {
      const input = parseInputOrThrow(registerInputSchema, args.input);

      const existingUser = await context.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser) {
        throw new GraphQLError("E-mail já cadastrado.", {
          extensions: { code: "CONFLICT" },
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 10);

      const user = await context.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
        },
      });

      return {
        token: signAccessToken(user.id, user.email),
        user,
      };
    },
    login: async (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) => {
      const input = parseInputOrThrow(loginInputSchema, args.input);
      const user = await context.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new GraphQLError("Credenciais inválidas.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
      if (!passwordMatches) {
        throw new GraphQLError("Credenciais inválidas.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      return {
        token: signAccessToken(user.id, user.email),
        user,
      };
    },
    createCategory: async (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) => {
      const userId = requireAuth(context);
      const input = parseInputOrThrow(categoryCreateInputSchema, args.input);

      try {
        return await context.prisma.category.create({
          data: {
            name: input.name,
            description: input.description ?? null,
            icon: input.icon ?? "utensils",
            color: input.color ?? "#2563EB",
            userId,
          },
        });
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          throw new GraphQLError("Você já possui uma categoria com esse nome.", {
            extensions: { code: "CONFLICT" },
          });
        }
        throw error;
      }
    },
    updateCategory: async (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) => {
      const userId = requireAuth(context);
      const input = parseInputOrThrow(categoryUpdateInputSchema, args.input);

      const existing = await context.prisma.category.findFirst({
        where: { id: input.id, userId },
      });

      if (!existing) {
        throw new GraphQLError("Categoria não encontrada.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      try {
        return await context.prisma.category.update({
          where: { id: input.id },
          data: {
            name: input.name ?? existing.name,
            description:
              input.description !== undefined
                ? input.description
                : existing.description,
            icon: input.icon ?? existing.icon,
            color: input.color ?? existing.color,
          },
        });
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          throw new GraphQLError("Você já possui uma categoria com esse nome.", {
            extensions: { code: "CONFLICT" },
          });
        }
        throw error;
      }
    },
    deleteCategory: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      const userId = requireAuth(context);

      const category = await context.prisma.category.findFirst({
        where: { id: args.id, userId },
        select: { id: true },
      });

      if (!category) {
        throw new GraphQLError("Categoria não encontrada.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      await context.prisma.category.delete({ where: { id: args.id } });
      return true;
    },
    createTransaction: async (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) => {
      const userId = requireAuth(context);
      const input = parseInputOrThrow(transactionCreateInputSchema, args.input);

      if (input.categoryId) {
        await ensureCategoryOwnership(context, input.categoryId, userId);
      }

      return context.prisma.transaction.create({
        data: {
          title: input.title,
          amount: new Prisma.Decimal(input.amount),
          type: input.type,
          date: new Date(input.date),
          notes: input.notes ?? null,
          categoryId: input.categoryId ?? null,
          userId,
        },
        include: { category: true },
      });
    },
    updateTransaction: async (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) => {
      const userId = requireAuth(context);
      const input = parseInputOrThrow(transactionUpdateInputSchema, args.input);

      const transaction = await context.prisma.transaction.findFirst({
        where: { id: input.id, userId },
      });

      if (!transaction) {
        throw new GraphQLError("Transação não encontrada.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (input.categoryId) {
        await ensureCategoryOwnership(context, input.categoryId, userId);
      }

      const data: Prisma.TransactionUncheckedUpdateInput = {};
      if (input.title !== undefined) data.title = input.title;
      if (input.amount !== undefined) data.amount = new Prisma.Decimal(input.amount);
      if (input.type !== undefined) data.type = input.type;
      if (input.date !== undefined) data.date = new Date(input.date);
      if (input.notes !== undefined) data.notes = input.notes;
      if (input.categoryId !== undefined) data.categoryId = input.categoryId;

      return context.prisma.transaction.update({
        where: { id: input.id },
        data,
        include: { category: true },
      });
    },
    deleteTransaction: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      const userId = requireAuth(context);

      const transaction = await context.prisma.transaction.findFirst({
        where: { id: args.id, userId },
        select: { id: true },
      });

      if (!transaction) {
        throw new GraphQLError("Transação não encontrada.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      await context.prisma.transaction.delete({ where: { id: args.id } });
      return true;
    },
  },
  Transaction: {
    amount: (transaction: { amount: Prisma.Decimal }) =>
      Number(transaction.amount.toString()),
    date: (transaction: { date: Date }) => transaction.date.toISOString(),
    createdAt: (transaction: { createdAt: Date }) =>
      transaction.createdAt.toISOString(),
    updatedAt: (transaction: { updatedAt: Date }) =>
      transaction.updatedAt.toISOString(),
  },
  User: {
    createdAt: (user: { createdAt: Date }) => user.createdAt.toISOString(),
    updatedAt: (user: { updatedAt: Date }) => user.updatedAt.toISOString(),
  },
  Category: {
    createdAt: (category: { createdAt: Date }) => category.createdAt.toISOString(),
    updatedAt: (category: { updatedAt: Date }) => category.updatedAt.toISOString(),
  },
};

function requireAuth(context: GraphQLContext): string {
  if (!context.userId) {
    throw new GraphQLError("Autenticação necessária.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context.userId;
}

function parseInputOrThrow<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    throw new GraphQLError(errorMessage, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  return parsed.data;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

async function ensureCategoryOwnership(
  context: GraphQLContext,
  categoryId: string,
  userId: string,
): Promise<void> {
  const category = await context.prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });

  if (!category) {
    throw new GraphQLError("Categoria não encontrada.", {
      extensions: { code: "NOT_FOUND" },
    });
  }
}
