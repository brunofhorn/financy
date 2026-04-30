import { useState } from "react";
import { Edit2, FolderPlus, Plus, Trash2 } from "lucide-react";

import { CategoryDialog } from "../components/dialogs/category-dialog";
import { EmptyState } from "../components/shared/empty-state";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { formatDate } from "../lib/format";
import { useCategories, useCategoryMutations, useTransactions } from "../lib/hooks";
import type { Category } from "../lib/types";

export function CategoriesPage() {
  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions();
  const mutations = useCategoryMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories = categoriesQuery.data ?? [];
  const transactions = transactionsQuery.data ?? [];

  function openCreateDialog() {
    setSelectedCategory(null);
    setDialogOpen(true);
  }

  function openEditDialog(category: Category) {
    setSelectedCategory(category);
    setDialogOpen(true);
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(`Excluir "${category.name}"?`);

    if (confirmed) {
      await mutations.remove.mutateAsync(category);
    }
  }

  function countTransactions(categoryId: string) {
    return transactions.filter((transaction) => transaction.category?.id === categoryId).length;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-base">Categorias</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Organizacao</h1>
          <p className="mt-2 text-sm text-gray-500">
            Agrupe suas transacoes por finalidade.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      {categoriesQuery.isLoading ? (
        <div className="rounded-lg border border-border bg-white px-5 py-10 text-center text-sm text-gray-500">
          Carregando...
        </div>
      ) : categories.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category.id} className="rounded-lg border border-border bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="income" className="text-brand-dark">
                    Categoria
                  </Badge>
                  <h2 className="mt-3 text-lg font-semibold text-gray-900">{category.name}</h2>
                  <p className="mt-2 min-h-10 text-sm text-gray-500">
                    {category.description || "Sem descricao."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => openEditDialog(category)}
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleDelete(category)}
                    title="Excluir"
                    disabled={mutations.remove.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-feedback-danger" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-gray-500">Transacoes</span>
                <strong className="text-gray-900">{countTransactions(category.id)}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">Criada em</span>
                <strong className="text-gray-900">{formatDate(category.createdAt)}</strong>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          icon={<FolderPlus className="h-5 w-5" />}
          title="Nenhuma categoria"
          description="Crie categorias para separar seus lancamentos por contexto."
          action={
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Nova categoria
            </Button>
          }
        />
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
      />
    </div>
  );
}
