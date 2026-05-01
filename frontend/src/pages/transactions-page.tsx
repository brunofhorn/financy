import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CarFront,
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Edit2,
  Landmark,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { ConfirmDeleteDialog } from "../components/dialogs/confirm-delete-dialog";
import { TransactionDialog } from "../components/dialogs/transaction-dialog";
import { EmptyState } from "../components/shared/empty-state";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/toast-context";
import { getCategoryAppearance } from "../lib/category-appearance";
import { formatCurrency } from "../lib/format";
import { useCategories, useTransactionMutations, useTransactions } from "../lib/hooks";
import type { Transaction } from "../lib/types";
import { cn } from "../lib/utils";

const ITEMS_PER_PAGE = 8;
const ALL = "all";

const categoryStyles = [
  {
    badge: "bg-finance-blue-light text-finance-blue-dark",
    icon: "bg-finance-blue-light text-finance-blue-dark",
    iconComponent: Utensils,
  },
  {
    badge: "bg-finance-purple-light text-finance-purple-dark",
    icon: "bg-finance-purple-light text-finance-purple-dark",
    iconComponent: CarFront,
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
    badge: "bg-finance-yellow-light text-finance-yellow-dark",
    icon: "bg-finance-yellow-light text-finance-yellow-dark",
    iconComponent: Landmark,
  },
  {
    badge: "bg-finance-pink-light text-finance-pink-dark",
    icon: "bg-finance-pink-light text-finance-pink-dark",
    iconComponent: BriefcaseBusiness,
  },
];

type TransactionStyle = {
  badge?: string;
  icon?: string;
  iconComponent: LucideIcon;
  color?: string;
  backgroundColor?: string;
};

export function TransactionsPage() {
  const transactionsQuery = useTransactions();
  const categoriesQuery = useCategories();
  const mutations = useTransactionMutations();
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>(ALL);
  const [categoryId, setCategoryId] = useState<string>(ALL);
  const [period, setPeriod] = useState<string>(ALL);
  const [page, setPage] = useState(1);

  const transactions = useMemo(
    () => transactionsQuery.data ?? [],
    [transactionsQuery.data],
  );
  const categories = categoriesQuery.data ?? [];
  const periods = useMemo(() => getPeriods(transactions), [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        transaction.title.toLowerCase().includes(normalizedSearch) ||
        transaction.notes?.toLowerCase().includes(normalizedSearch);
      const matchesType = type === ALL || transaction.type === type;
      const matchesCategory =
        categoryId === ALL || transaction.category?.id === categoryId;
      const matchesPeriod = period === ALL || getPeriodKey(transaction.date) === period;

      return matchesSearch && matchesType && matchesCategory && matchesPeriod;
    });
  }, [categoryId, period, search, transactions, type]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const showingFrom =
    filteredTransactions.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length);

  function openCreateDialog() {
    setSelectedTransaction(null);
    setDialogOpen(true);
  }

  function openEditDialog(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!transactionToDelete) {
      return;
    }

    await mutations.remove.mutateAsync(transactionToDelete);
    toast.success({
      title: "Transação excluída",
      description: "O lançamento foi removido com sucesso.",
    });
    setTransactionToDelete(null);
  }

  function updateFilter(callback: () => void) {
    callback();
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">Transações</h1>
          <p className="mt-2 text-base text-[#4b5563]">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <Button className="h-9 rounded-lg px-4" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          Nova transação
        </Button>
      </div>

      <section className="rounded-lg border border-[#e2e5e9] bg-white p-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="Buscar">
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder="Buscar por descrição"
              value={search}
              onChange={(event) => updateFilter(() => setSearch(event.target.value))}
              className="h-12 rounded-lg border-[#d4d6da] text-base placeholder:text-[#9ca3af]"
            />
          </FilterField>

          <FilterField label="Tipo">
            <Select value={type} onValueChange={(value) => updateFilter(() => setType(value))}>
              <SelectTrigger className="h-12 rounded-lg border-[#d4d6da] text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos</SelectItem>
                <SelectItem value="INCOME">Entradas</SelectItem>
                <SelectItem value="EXPENSE">Saídas</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Categoria">
            <Select
              value={categoryId}
              onValueChange={(value) => updateFilter(() => setCategoryId(value))}
            >
              <SelectTrigger className="h-12 rounded-lg border-[#d4d6da] text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Período">
            <Select
              value={period}
              onValueChange={(value) => updateFilter(() => setPeriod(value))}
            >
              <SelectTrigger className="h-12 rounded-lg border-[#d4d6da] text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos</SelectItem>
                {periods.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </div>
      </section>

      {transactionsQuery.isLoading ? (
        <div className="rounded-lg border border-[#e2e5e9] bg-white px-5 py-10 text-center text-sm text-[#6b7280]">
          Carregando...
        </div>
      ) : transactions.length ? (
        <section className="overflow-hidden rounded-lg border border-[#e2e5e9] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#edf0f2] text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                  <th className="px-6 py-5">Descrição</th>
                  <th className="px-6 py-5 text-center">Data</th>
                  <th className="px-6 py-5 text-center">Categoria</th>
                  <th className="px-6 py-5 text-center">Tipo</th>
                  <th className="px-6 py-5 text-right">Valor</th>
                  <th className="px-6 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
                {paginatedTransactions.map((transaction, index) => (
                  <TransactionTableRow
                    key={transaction.id}
                    transaction={transaction}
                    style={getTransactionStyle(transaction, index)}
                    onEdit={() => openEditDialog(transaction)}
                    onDelete={() => setTransactionToDelete(transaction)}
                    deleting={
                      mutations.remove.isPending &&
                      transactionToDelete?.id === transaction.id
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#edf0f2] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#111827]">
              {showingFrom} a {showingTo} | {filteredTransactions.length} resultados
            </p>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </section>
      ) : (
        <EmptyState
          icon={<ShoppingCart className="h-5 w-5" />}
          title="Nenhuma transação"
          description="Registre entradas e saídas para montar seu histórico financeiro."
          action={
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Nova transação
            </Button>
          }
        />
      )}

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
      />
      <ConfirmDeleteDialog
        open={Boolean(transactionToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setTransactionToDelete(null);
          }
        }}
        title="Excluir transação"
        description="Essa ação não pode ser desfeita. A transação será removida permanentemente do seu histórico."
        itemName={transactionToDelete?.title}
        isDeleting={mutations.remove.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-[#374151]">{label}</span>
      {children}
    </label>
  );
}

function TransactionTableRow({
  transaction,
  style,
  onEdit,
  onDelete,
  deleting,
}: {
  transaction: Transaction;
  style: TransactionStyle;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const Icon = style.iconComponent;
  const isIncome = transaction.type === "INCOME";

  return (
    <tr className="hover:bg-[#f7f8fa]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div
            className={cn("flex h-10 w-10 items-center justify-center rounded-lg", style.icon)}
            style={
              style.color
                ? { color: style.color, backgroundColor: style.backgroundColor }
                : undefined
            }
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-[#111827]">{transaction.title}</p>
            {transaction.notes ? (
              <p className="mt-1 max-w-72 truncate text-xs text-[#6b7280]">
                {transaction.notes}
              </p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-[#4b5563] text-center">{formatShortDate(transaction.date)}</td>
      <td className="px-6 py-4 text-center">
        <Badge
          className={cn("px-3 py-1.5 text-sm", style.badge)}
          style={
            style.color
              ? { color: style.color, backgroundColor: style.backgroundColor }
              : undefined
          }
        >
          {transaction.category?.name ?? "Sem categoria"}
        </Badge>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={cn(
            "inline-flex items-center gap-2 text-sm font-semibold",
            isIncome ? "text-brand-base" : "text-feedback-danger",
          )}
        >
          {isIncome ? (
            <CircleArrowUp className="h-4 w-4" />
          ) : (
            <CircleArrowDown className="h-4 w-4" />
          )}
          {isIncome ? "Entrada" : "Saída"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <strong className="whitespace-nowrap text-[#111827]">
          {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
        </strong>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <ActionButton title="Excluir" onClick={onDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4 text-feedback-danger" />
          </ActionButton>
          <ActionButton title="Editar" onClick={onEdit}>
            <Edit2 className="h-4 w-4 text-[#4b5563]" />
          </ActionButton>
        </div>
      </td>
    </tr>
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
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d4d6da] bg-white transition-colors hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-end gap-2">
      <PaginationButton disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>
      {pages.map((item) => (
        <PaginationButton
          key={item}
          active={page === item}
          onClick={() => onPageChange(item)}
        >
          {item}
        </PaginationButton>
      ))}
      <PaginationButton
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </div>
  );
}

function PaginationButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#e2e5e9] bg-white px-2 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:text-[#d1d5db]",
        active && "border-brand-base bg-brand-base text-white hover:bg-brand-base",
      )}
    >
      {children}
    </button>
  );
}

function getTransactionStyle(transaction: Transaction, index: number): TransactionStyle {
  if (transaction.category) {
    const appearance = getCategoryAppearance(transaction.category);
    return {
      iconComponent: appearance.Icon,
      color: appearance.color,
      backgroundColor: appearance.backgroundColor,
    };
  }

  if (transaction.type === "INCOME") {
    return {
      badge: "bg-finance-green-light text-finance-green-dark",
      icon: "bg-finance-green-light text-finance-green-dark",
      iconComponent: BriefcaseBusiness,
    };
  }

  return categoryStyles[index % categoryStyles.length];
}

function getPeriods(transactions: Transaction[]) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const periods = new Map<string, string>();

  transactions.forEach((transaction) => {
    const key = getPeriodKey(transaction.date);
    const label = formatter.format(new Date(transaction.date));
    periods.set(key, label.charAt(0).toUpperCase() + label.slice(1));
  });

  return Array.from(periods.entries()).map(([key, label]) => ({ key, label }));
}

function getPeriodKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(value));
}
