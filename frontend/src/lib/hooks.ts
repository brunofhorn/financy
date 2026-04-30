import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategory,
  createTransaction,
  deleteCategory,
  deleteTransaction,
  getCategories,
  getTransactions,
  updateCategory,
  updateTransaction,
  type CategoryInput,
  type TransactionInput,
} from "./api";
import type { Category, Transaction } from "./types";
import { useAuth } from "../context/auth-context";

export function useCategories() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token as string),
    enabled: Boolean(token),
  });
}

export function useTransactions() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(token as string),
    enabled: Boolean(token),
  });
}

export function useCategoryMutations() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return {
    create: useMutation({
      mutationFn: (input: CategoryInput) => createCategory(input, token as string),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: CategoryInput }) =>
        updateCategory(id, input, token as string),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (category: Category) => deleteCategory(category.id, token as string),
      onSuccess: invalidate,
    }),
  };
}

export function useTransactionMutations() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return {
    create: useMutation({
      mutationFn: (input: TransactionInput) =>
        createTransaction(input, token as string),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: TransactionInput }) =>
        updateTransaction(id, input, token as string),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (transaction: Transaction) =>
        deleteTransaction(transaction.id, token as string),
      onSuccess: invalidate,
    }),
  };
}
