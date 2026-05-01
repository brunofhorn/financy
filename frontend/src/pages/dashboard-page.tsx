import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BriefcaseBusiness,
  CarFront,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  PiggyBank,
  Plus,
  ShoppingCart,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { TransactionDialog } from "../components/dialogs/transaction-dialog";
import { Badge } from "../components/ui/badge";
import { getCategoryAppearance } from "../lib/category-appearance";
import { formatCurrency, getTotals } from "../lib/format";
import { useCategories, useTransactions } from "../lib/hooks";
import type { Category, Transaction } from "../lib/types";
import { cn } from "../lib/utils";

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
    badge: "bg-finance-pink-light text-finance-pink-dark",
    icon: "bg-finance-pink-light text-finance-pink-dark",
    iconComponent: BriefcaseBusiness,
  },
  {
    badge: "bg-finance-yellow-light text-finance-yellow-dark",
    icon: "bg-finance-yellow-light text-finance-yellow-dark",
    iconComponent: PiggyBank,
  },
  {
    badge: "bg-finance-green-light text-finance-green-dark",
    icon: "bg-finance-green-light text-finance-green-dark",
    iconComponent: PiggyBank,
  },
];

type TransactionStyle = {
  badge?: string;
  icon?: string;
  iconComponent: LucideIcon;
  color?: string;
  backgroundColor?: string;
};

export function DashboardPage() {
  const transactionsQuery = useTransactions();
  const categoriesQuery = useCategories();
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const transactions = transactionsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const totals = getTotals(transactions);
  const monthTotals = getCurrentMonthTotals(transactions);
  const recentTransactions = transactions.slice(0, 5);
  const categoryRows = getCategoryRows(categories, transactions).slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-3">
        <MetricCard
          icon={WalletCards}
          iconClassName="text-finance-purple-base"
          label="SALDO TOTAL"
          value={formatCurrency(totals.balance)}
        />
        <MetricCard
          icon={ArrowUpCircle}
          iconClassName="text-brand-base"
          label="RECEITAS DO MÊS"
          value={formatCurrency(monthTotals.income)}
        />
        <MetricCard
          icon={ArrowDownCircle}
          iconClassName="text-feedback-danger"
          label="DESPESAS DO MÊS"
          value={formatCurrency(monthTotals.expense)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg border border-[#e2e5e9] bg-white lg:col-span-2">
          <PanelHeader title="TRANSAÇÕES RECENTES" href="/transacoes" action="Ver todas" />

          {transactionsQuery.isLoading ? (
            <PanelMessage>Carregando transações...</PanelMessage>
          ) : recentTransactions.length ? (
            <div className="divide-y divide-[#edf0f2]">
              {recentTransactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  style={getTransactionStyle(transaction, index)}
                />
              ))}
            </div>
          ) : (
            <PanelMessage>Nenhuma transação registrada ainda.</PanelMessage>
          )}

          <button
            type="button"
            onClick={() => setTransactionDialogOpen(true)}
            className="flex h-[60px] w-full items-center justify-center gap-2 border-t border-[#edf0f2] text-sm font-semibold text-brand-base transition-colors hover:bg-[#f7f8fa]"
          >
            <Plus className="h-4 w-4" />
            Nova transação
          </button>
        </div>

        <div className="self-start overflow-hidden rounded-lg border border-[#e2e5e9] bg-white">
          <PanelHeader title="CATEGORIAS" href="/categorias" action="Gerenciar" />

          {categoriesQuery.isLoading || transactionsQuery.isLoading ? (
            <PanelMessage>Carregando categorias...</PanelMessage>
          ) : categoryRows.length ? (
            <div className="space-y-5 px-6 py-6">
              {categoryRows.map((row) => {
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-[minmax(0,1fr)_64px_82px] items-center gap-3"
                  >
                    <Badge
                      className="w-fit justify-self-start px-3 py-1.5 text-sm"
                      style={{
                        color: row.appearance.color,
                        backgroundColor: row.appearance.backgroundColor,
                      }}
                    >
                      {row.name}
                    </Badge>
                    <span className="text-right text-sm text-[#4b5563]">
                      {row.count} itens
                    </span>
                    <strong className="whitespace-nowrap text-right text-sm text-[#111827]">
                      {formatCurrency(row.total)}
                    </strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <PanelMessage>Nenhuma categoria cadastrada.</PanelMessage>
          )}
        </div>
      </section>

      <TransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
      />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  iconClassName,
  label,
  value,
}: {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-lg border border-[#e2e5e9] bg-white px-6 py-7">
      <div className="flex items-center gap-3">
        <Icon className={cn("h-5 w-5", iconClassName)} />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
          {label}
        </span>
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-normal text-[#111827]">{value}</p>
    </article>
  );
}

function PanelHeader({
  title,
  href,
  action,
}: {
  title: string;
  href: string;
  action: string;
}) {
  return (
    <div className="flex h-[62px] items-center justify-between border-b border-[#edf0f2] px-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
        {title}
      </h2>
      <Link
        to={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-base hover:text-brand-dark"
      >
        {action}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function PanelMessage({ children }: { children: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-6 py-10 text-sm text-[#6b7280]">
      {children}
    </div>
  );
}

function TransactionRow({
  transaction,
  style,
}: {
  transaction: Transaction;
  style: TransactionStyle;
}) {
  const Icon = style.iconComponent;
  const isIncome = transaction.type === "INCOME";

  return (
    <div className="grid min-h-20 grid-cols-[40px_minmax(0,1fr)_auto_auto] items-center gap-4 px-6 py-4">
      <div
        className={cn("flex h-10 w-10 items-center justify-center rounded-md", style.icon)}
        style={
          style.color
            ? { color: style.color, backgroundColor: style.backgroundColor }
            : undefined
        }
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-[#111827]">{transaction.title}</h3>
        <p className="mt-1 text-sm text-[#4b5563]">{formatShortDate(transaction.date)}</p>
      </div>

      <Badge
        className={cn("hidden justify-center px-3 py-1.5 text-sm sm:inline-flex", style.badge)}
        style={
          style.color
            ? { color: style.color, backgroundColor: style.backgroundColor }
            : undefined
        }
      >
        {isIncome ? "Receita" : transaction.category?.name ?? "Sem categoria"}
      </Badge>

      <div className="flex min-w-[132px] items-center justify-end gap-2">
        <strong className="whitespace-nowrap text-sm text-[#111827]">
          {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
        </strong>
        {isIncome ? (
          <CircleArrowUp className="h-4 w-4 text-brand-base" />
        ) : (
          <CircleArrowDown className="h-4 w-4 text-feedback-danger" />
        )}
      </div>
    </div>
  );
}

function getCurrentMonthTotals(transactions: Transaction[]) {
  const now = new Date();

  return transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date);
      const isCurrentMonth =
        date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

      if (!isCurrentMonth) {
        return acc;
      }

      if (transaction.type === "INCOME") {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }

      return acc;
    },
    { income: 0, expense: 0 },
  );
}

function getCategoryRows(categories: Category[], transactions: Transaction[]) {
  const rows = new Map<
    string,
    {
      id: string;
      name: string;
      count: number;
      total: number;
      appearance: ReturnType<typeof getCategoryAppearance>;
    }
  >();

  categories.forEach((category) => {
    rows.set(category.id, {
      id: category.id,
      name: category.name,
      count: 0,
      total: 0,
      appearance: getCategoryAppearance(category),
    });
  });

  transactions.forEach((transaction) => {
    const category = transaction.category;

    if (!category) {
      return;
    }

    const row =
      rows.get(category.id) ??
      rows
        .set(category.id, {
          id: category.id,
          name: category.name,
          count: 0,
          total: 0,
          appearance: getCategoryAppearance(category),
        })
        .get(category.id);

    if (!row) {
      return;
    }

    row.count += 1;
    if (transaction.type === "EXPENSE") {
      row.total += transaction.amount;
    }
  });

  return Array.from(rows.values())
    .filter((row) => row.count > 0 || row.total > 0)
    .sort((a, b) => b.total - a.total);
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

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(value));
}
