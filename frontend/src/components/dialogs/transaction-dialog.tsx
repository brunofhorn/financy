import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, Mail, Wallet } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { formatCurrency, toApiDate, toDateInputValue } from "../../lib/format";
import { useCategories, useTransactionMutations } from "../../lib/hooks";
import type { Transaction } from "../../lib/types";
import { Field } from "../shared/field";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const NO_CATEGORY = "none";

const transactionSchema = z.object({
  title: z.string().trim().min(2, "Informe ao menos 2 caracteres."),
  amount: z.number().positive("Informe um valor maior que zero."),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.string().min(1, "Informe a data."),
  categoryId: z.string().optional(),
  notes: z.string().trim().max(500, "Use no maximo 500 caracteres.").optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

type TransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
};

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDialogProps) {
  const categoriesQuery = useCategories();
  const mutations = useTransactionMutations();
  const isEditing = Boolean(transaction);
  const mutation = isEditing ? mutations.update : mutations.create;

  const defaultValues = useMemo<TransactionFormData>(
    () => ({
      title: transaction?.title ?? "",
      amount: transaction?.amount ?? 0,
      type: transaction?.type ?? "EXPENSE",
      date: toDateInputValue(transaction?.date),
      categoryId: transaction?.category?.id ?? NO_CATEGORY,
      notes: transaction?.notes ?? "",
    }),
    [transaction],
  );

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });
  const amountPreview = useWatch({ control: form.control, name: "amount" });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  const error = mutation.error instanceof Error ? mutation.error.message : undefined;

  async function onSubmit(values: TransactionFormData) {
    const input = {
      title: values.title.trim(),
      amount: Number(values.amount),
      type: values.type,
      date: toApiDate(values.date),
      categoryId: values.categoryId === NO_CATEGORY ? null : values.categoryId,
      notes: values.notes?.trim() || null,
    };

    if (transaction) {
      await mutations.update.mutateAsync({ id: transaction.id, input });
    } else {
      await mutations.create.mutateAsync(input);
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transacao" : "Nova transacao"}
          </DialogTitle>
          <DialogDescription>
            Registre valores com categoria, data e observacoes.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Titulo"
              htmlFor="transaction-title"
              error={form.formState.errors.title?.message}
            >
              <Input
                id="transaction-title"
                icon={<Mail className="h-4 w-4" />}
                placeholder="Ex: Salario"
                error={Boolean(form.formState.errors.title)}
                {...form.register("title")}
              />
            </Field>

            <Field
              label="Valor"
              htmlFor="transaction-amount"
              error={form.formState.errors.amount?.message}
              helper={formatCurrency(Number(amountPreview || 0))}
            >
              <Input
                id="transaction-amount"
                icon={<Wallet className="h-4 w-4" />}
                min="0"
                step="0.01"
                type="number"
                error={Boolean(form.formState.errors.amount)}
                {...form.register("amount", { valueAsNumber: true })}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Field label="Tipo" error={form.formState.errors.type?.message}>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Entrada</SelectItem>
                      <SelectItem value="EXPENSE">Saida</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Field
              label="Data"
              htmlFor="transaction-date"
              error={form.formState.errors.date?.message}
            >
              <Input
                id="transaction-date"
                icon={<Calendar className="h-4 w-4" />}
                type="date"
                error={Boolean(form.formState.errors.date)}
                {...form.register("date")}
              />
            </Field>
          </div>

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Field label="Categoria">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_CATEGORY}>Sem categoria</SelectItem>
                    {(categoriesQuery.data ?? []).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Field
            label="Observacoes"
            htmlFor="transaction-notes"
            error={form.formState.errors.notes?.message}
          >
            <Textarea
              id="transaction-notes"
              placeholder="Opcional"
              error={Boolean(form.formState.errors.notes)}
              {...form.register("notes")}
            />
          </Field>

          {error ? <p className="text-sm text-feedback-danger">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
