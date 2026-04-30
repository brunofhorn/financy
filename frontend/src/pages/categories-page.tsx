import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CarFront,
  Edit2,
  HeartPulse,
  Landmark,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  Utensils,
  ArrowUpDown,
  type LucideIcon,
} from "lucide-react";

import { CategoryDialog } from "../components/dialogs/category-dialog";
import { EmptyState } from "../components/shared/empty-state";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useCategories, useCategoryMutations, useTransactions } from "../lib/hooks";
import type { Category, Transaction } from "../lib/types";
import { cn } from "../lib/utils";

const categoryStyles = [
  {
    badge: "bg-finance-blue-light text-finance-blue-dark",
    icon: "bg-finance-blue-light text-finance-blue-dark",
    iconComponent: Utensils,
  },
  {
    badge: "bg-finance-pink-light text-finance-pink-dark",
    icon: "bg-finance-pink-light text-finance-pink-dark",
    iconComponent: HeartPulse,
  },
  {
    badge: "bg-finance-green-light text-finance-green-dark",
    icon: "bg-finance-green-light text-finance-green-dark",
    iconComponent: Landmark,
  },
  {
    badge: "bg-finance-orange-light text-finance-orange-dark",
    icon: "bg-finance-orange-light text-finance-orange-dark",
    iconComponent: ShoppingCart,
  },
  {
    badge: "bg-finance-green-light text-finance-green-dark",
    icon: "bg-finance-green-light text-finance-green-dark",
    iconComponent: BriefcaseBusiness,
  },
  {
    badge: "bg-finance-red-light text-finance-red-dark",
    icon: "bg-finance-red-light text-finance-red-dark",
    iconComponent: HeartPulse,
  },
  {
    badge: "bg-finance-purple-light text-finance-purple-dark",
    icon: "bg-finance-purple-light text-finance-purple-dark",
    iconComponent: CarFront,
  },
  {
    badge: "bg-finance-yellow-light text-finance-yellow-dark",
    icon: "bg-finance-yellow-light text-finance-yellow-dark",
    iconComponent: Landmark,
  },
];

export function CategoriesPage() {
  const categoriesQuery = useCategories();
  const transactionsQuery = useTransactions();
  const mutations = useCategoryMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(`Excluir "${category.name}"?`);

    if (confirmed) {
      await mutations.remove.mutateAsync(category);
    }
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
          icon={mostUsedCategory?.style.iconComponent ?? Utensils}
          iconClassName={mostUsedCategory?.style.badge.replace("bg-", "text-") ?? "text-finance-blue-dark"}
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
            const Icon = row.style.iconComponent;

            return (
              <article
                key={row.category.id}
                className="rounded-lg border border-[#e2e5e9] bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", row.style.icon)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex gap-2">
                    <ActionButton
                      title="Excluir"
                      onClick={() => handleDelete(row.category)}
                      disabled={mutations.remove.isPending}
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
                  <Badge className={cn("px-3 py-1.5 text-sm", row.style.badge)}>
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
    </div>
  );
}

function MetricCard({
  icon: Icon,
  iconClassName,
  value,
  label,
}: {
  icon: LucideIcon;
  iconClassName: string;
  value: string;
  label: string;
}) {
  return (
    <article className="rounded-lg border border-[#e2e5e9] bg-white px-7 py-6">
      <div className="flex items-center gap-5">
        <Icon className={cn("h-6 w-6 shrink-0", iconClassName)} />
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
    .map((category, index) => {
      const count = transactions.filter(
        (transaction) => transaction.category?.id === category.id,
      ).length;
      const style = resolveCategoryStyle(category.name, index);

      return {
        category,
        id: category.id,
        name: category.name,
        description: category.description,
        count,
        style,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function resolveCategoryStyle(name: string, index: number) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("aliment")) return categoryStyles[0];
  if (normalizedName.includes("entre")) return categoryStyles[1];
  if (normalizedName.includes("invest")) return categoryStyles[2];
  if (normalizedName.includes("merc")) return categoryStyles[3];
  if (normalizedName.includes("sal")) return categoryStyles[4];
  if (normalizedName.includes("sa")) return categoryStyles[5];
  if (normalizedName.includes("trans")) return categoryStyles[6];
  if (normalizedName.includes("util")) return categoryStyles[7];

  return categoryStyles[index % categoryStyles.length];
}
