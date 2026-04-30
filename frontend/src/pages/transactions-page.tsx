import { useState } from "react";
import { Edit2, Plus, ReceiptText, Trash2 } from "lucide-react";

import { TransactionDialog } from "../components/dialogs/transaction-dialog";
import { EmptyState } from "../components/shared/empty-state";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { formatCurrency, formatDate } from "../lib/format";
import { useTransactionMutations, useTransactions } from "../lib/hooks";
import type { Transaction } from "../lib/types";

export function TransactionsPage() {
  const transactionsQuery = useTransactions();
  const mutations = useTransactionMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const transactions = transactionsQuery.data ?? [];

  function openCreateDialog() {
    setSelectedTransaction(null);
    setDialogOpen(true);
  }

  function openEditDialog(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  }

  async function handleDelete(transaction: Transaction) {
    const confirmed = window.confirm(`Excluir "${transaction.title}"?`);

    if (confirmed) {
      await mutations.remove.mutateAsync(transaction);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-base">Transacoes</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Lancamentos</h1>
          <p className="mt-2 text-sm text-gray-500">
            Crie, edite e exclua entradas e saidas da sua conta.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          Nova transacao
        </Button>
      </div>

      {transactionsQuery.isLoading ? (
        <div className="rounded-lg border border-border bg-white px-5 py-10 text-center text-sm text-gray-500">
          Carregando...
        </div>
      ) : transactions.length ? (
        <section className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Titulo</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3 text-right">Valor</th>
                  <th className="px-5 py-3 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-100/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{transaction.title}</p>
                      {transaction.notes ? (
                        <p className="mt-1 max-w-64 truncate text-xs text-gray-500">
                          {transaction.notes}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={transaction.type === "INCOME" ? "income" : "expense"}>
                        {transaction.type === "INCOME" ? "Entrada" : "Saida"}
                      </Badge>
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
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => openEditDialog(transaction)}
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => handleDelete(transaction)}
                          title="Excluir"
                          disabled={mutations.remove.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-feedback-danger" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          icon={<ReceiptText className="h-5 w-5" />}
          title="Nenhuma transacao"
          description="Registre entradas e saidas para montar seu historico financeiro."
          action={
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Nova transacao
            </Button>
          }
        />
      )}

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
}
