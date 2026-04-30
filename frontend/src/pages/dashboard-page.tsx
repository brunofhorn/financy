import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, FolderPlus, Plus, ReceiptText, Wallet } from "lucide-react";

import { CategoryDialog } from "../components/dialogs/category-dialog";
import { TransactionDialog } from "../components/dialogs/transaction-dialog";
import { EmptyState } from "../components/shared/empty-state";
import { StatCard } from "../components/shared/stat-card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/auth-context";
import { formatCurrency, formatDate, getTotals } from "../lib/format";
import { useCategories, useTransactions } from "../lib/hooks";

export function DashboardPage() {
  const { user } = useAuth();
  const transactionsQuery = useTransactions();
  const categoriesQuery = useCategories();
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const transactions = transactionsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const totals = getTotals(transactions);
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-base">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Ola, {user?.name?.split(" ")[0] ?? "usuario"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sua visao geral de transacoes, saldo e categorias.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setCategoryDialogOpen(true)}>
            <FolderPlus className="h-4 w-4" />
            Categoria
          </Button>
          <Button onClick={() => setTransactionDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Transacao
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Saldo"
          value={formatCurrency(totals.balance)}
          icon={<Wallet className="h-5 w-5" />}
          tone="blue"
        />
        <StatCard
          label="Entradas"
          value={formatCurrency(totals.income)}
          icon={<ArrowUpCircle className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Saidas"
          value={formatCurrency(totals.expense)}
          icon={<ArrowDownCircle className="h-5 w-5" />}
          tone="danger"
        />
        <StatCard
          label="Categorias"
          value={String(categories.length)}
          icon={<FolderPlus className="h-5 w-5" />}
        />
      </section>

      <section className="rounded-lg border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ultimas transacoes</h2>
            <p className="text-sm text-gray-500">Lancamentos ordenados por data.</p>
          </div>
        </div>

        {transactionsQuery.isLoading ? (
          <p className="px-5 py-10 text-center text-sm text-gray-500">Carregando...</p>
        ) : recentTransactions.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Titulo</th>
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {transaction.title}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="blue">
                        {transaction.category?.name ?? "Sem categoria"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{formatDate(transaction.date)}</td>
                    <td
                      className={
                        transaction.type === "INCOME"
                          ? "px-5 py-4 text-right font-bold text-finance-green-dark"
                          : "px-5 py-4 text-right font-bold text-finance-red-dark"
                      }
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              icon={<ReceiptText className="h-5 w-5" />}
              title="Nenhuma transacao registrada"
              description="Crie seu primeiro lancamento para acompanhar o saldo."
              action={
                <Button onClick={() => setTransactionDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Nova transacao
                </Button>
              }
            />
          </div>
        )}
      </section>

      <TransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
      />
      <CategoryDialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen} />
    </div>
  );
}
