import { BarChart3 } from "lucide-react";

import { Badge } from "../components/ui/badge";
import { formatCurrency, getTotals } from "../lib/format";
import { useTransactions } from "../lib/hooks";

export function ReportsPage() {
  const transactionsQuery = useTransactions();
  const transactions = transactionsQuery.data ?? [];
  const totals = getTotals(transactions);
  const maxTotal = Math.max(totals.income, totals.expense, 1);

  const byCategory = transactions.reduce<Record<string, number>>((acc, transaction) => {
    const key = transaction.category?.name ?? "Sem categoria";
    acc[key] = (acc[key] ?? 0) + transaction.amount;
    return acc;
  }, {});

  const categoryRows = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-base">Relatorios</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Resumo financeiro</h1>
        <p className="mt-2 text-sm text-gray-500">
          Uma leitura rapida dos valores por tipo e categoria.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-finance-green-light p-2 text-brand-base">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Fluxo por tipo</h2>
              <p className="text-sm text-gray-500">Entradas versus saidas.</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <ProgressRow
              label="Entradas"
              value={totals.income}
              max={maxTotal}
              className="bg-feedback-success"
            />
            <ProgressRow
              label="Saidas"
              value={totals.expense}
              max={maxTotal}
              className="bg-feedback-danger"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Categorias mais usadas</h2>
          <p className="text-sm text-gray-500">Soma absoluta dos lancamentos.</p>

          <div className="mt-5 space-y-3">
            {transactionsQuery.isLoading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : categoryRows.length ? (
              categoryRows.map(([name, value]) => (
                <div key={name} className="flex items-center justify-between gap-4">
                  <Badge variant="blue">{name}</Badge>
                  <strong className="text-sm text-gray-900">{formatCurrency(value)}</strong>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Registre transacoes para gerar indicadores.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  max,
  className,
}: {
  label: string;
  value: number;
  max: number;
  className: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <strong className="text-gray-900">{formatCurrency(value)}</strong>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full ${className}`}
          style={{ width: `${Math.max((value / max) * 100, value > 0 ? 4 : 0)}%` }}
        />
      </div>
    </div>
  );
}
