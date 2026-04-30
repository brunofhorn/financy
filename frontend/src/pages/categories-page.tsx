import { useMemo, useState } from "react";
import {
  Edit2,
  Plus,
  Tag,
  Trash2,
  Utensils,
  ArrowUpDown,
  type LucideIcon,
} from "lucide-react";

import { ConfirmDeleteDialog } from "../components/dialogs/confirm-delete-dialog";
import { CategoryDialog } from "../components/dialogs/category-dialog";
import { EmptyState } from "../components/shared/empty-state";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/toast-context";
import { getCategoryAppearance } from "../lib/category-appearance";
import { useCategories, useCategoryMutations, useTransactions } from "../lib/hooks";
import type { Category, Transaction } from "../lib/types";
import { cn } from "../lib/utils";

export function CategoriesPage() {
  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions();
  const mutations = useCategoryMutations();
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const transactions = useMemo(
    () => transactionsQuery.data ?? [],
    [transactionsQuery.data],
  );
  const categoryRows = useMemo(
    () => buildCategoryRows(categories, transactions),
    [categories, transactions],
  );
  const mostUsedCategory = categoryRows[0];

  function openCreateDialog() {
    setSelectedCategory(null);
    setDialogOpen(true);
  }

  function openEditDialog(category: Category) {
    setSelectedCategory(category);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) {
      return;
    }

    await mutations.remove.mutateAsync(categoryToDelete);
    toast.success({
      title: "Categoria excluída",
      description: "A categoria foi removida com sucesso.",
    });
    setCategoryToDelete(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">Categorias</h1>
          <p className="mt-2 text-base text-[#4b5563]">
            Organize suas transações por categorias
          </p>
        </div>
        <Button className="h-9 rounded-md px-4" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <MetricCard
          icon={Tag}
          iconClassName="text-[#374151]"
          value={String(categories.length)}
          label="TOTAL DE CATEGORIAS"
        />
        <MetricCard
          icon={ArrowUpDown}
          iconClassName="text-finance-purple-base"
          value={String(transactions.length)}
          label="TOTAL DE TRANSAÇÕES"
        />
        <MetricCard
          icon={mostUsedCategory?.appearance.Icon ?? Utensils}
          iconColor={mostUsedCategory?.appearance.color}
          value={mostUsedCategory?.name ?? "Nenhuma"}
          label="CATEGORIA MAIS UTILIZADA"
        />
      </section>

      {categoriesQuery.isLoading ? (
        <div className="rounded-lg border border-[#e2e5e9] bg-white px-5 py-10 text-center text-sm text-[#6b7280]">
          Carregando...
        </div>
      ) : categories.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryRows.map((row) => {
            const Icon = row.appearance.Icon;

            return (
              <article
                key={row.category.id}
                className="rounded-lg border border-[#e2e5e9] bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-md"
                    style={{
                      backgroundColor: row.appearance.backgroundColor,
                      color: row.appearance.color,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex gap-2">
                    <ActionButton
                      title="Excluir"
                      onClick={() => setCategoryToDelete(row.category)}
                      disabled={
                        mutations.remove.isPending &&
                        categoryToDelete?.id === row.category.id
                      }
                    >
                      <Trash2 className="h-4 w-4 text-feedback-danger" />
                    </ActionButton>
                    <ActionButton title="Editar" onClick={() => openEditDialog(row.category)}>
                      <Edit2 className="h-4 w-4 text-[#4b5563]" />
                    </ActionButton>
                  </div>
                </div>

                <h2 className="mt-6 text-lg font-bold text-[#111827]">{row.name}</h2>
                <p className="mt-2 min-h-10 text-sm leading-5 text-[#4b5563]">
                  {row.description || "Sem descrição."}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <Badge
                    className="px-3 py-1.5 text-sm"
                    style={{
                      backgroundColor: row.appearance.backgroundColor,
                      color: row.appearance.color,
                    }}
                  >
                    {row.name}
                  </Badge>
                  <span className="whitespace-nowrap text-sm text-[#4b5563]">
                    {row.count} {row.count === 1 ? "item" : "itens"}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <EmptyState
          icon={<Tag className="h-5 w-5" />}
          title="Nenhuma categoria"
          description="Crie categorias para separar seus lançamentos por contexto."
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
      <ConfirmDeleteDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryToDelete(null);
          }
        }}
        title="Excluir categoria"
        description="Essa ação não pode ser desfeita. As transações vinculadas ficarão sem categoria."
        itemName={categoryToDelete?.name}
        isDeleting={mutations.remove.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  iconClassName,
  iconColor,
  value,
  label,
}: {
  icon: LucideIcon;
  iconClassName?: string;
  iconColor?: string;
  value: string;
  label: string;
}) {
  return (
    <article className="rounded-lg border border-[#e2e5e9] bg-white px-7 py-6">
      <div className="flex items-center gap-5">
        <Icon className={cn("h-6 w-6 shrink-0", iconClassName)} style={{ color: iconColor }} />
        <div className="min-w-0">
          <p className="truncate text-3xl font-extrabold text-[#111827]">{value}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
            {label}
          </p>
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  title,
  onClick,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d4d6da] bg-white transition-colors hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}

function buildCategoryRows(categories: Category[], transactions: Transaction[]) {
  return categories
    .map((category) => {
      const count = transactions.filter(
        (transaction) => transaction.category?.id === category.id,
      ).length;

      return {
        category,
        id: category.id,
        name: category.name,
        description: category.description,
        count,
        appearance: getCategoryAppearance(category),
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
