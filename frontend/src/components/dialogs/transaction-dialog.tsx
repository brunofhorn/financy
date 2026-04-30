import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleArrowDown,
  CircleArrowUp,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { toApiDate, toDateInputValue } from "../../lib/format";
import { useCategories, useTransactionMutations } from "../../lib/hooks";
import type { Transaction } from "../../lib/types";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="max-w-[324px] gap-4 rounded-lg border-[#e2e5e9] p-5 shadow-[0_16px_40px_rgba(17,24,39,0.18)]">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-[#111827]">
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#6b7280]">
            Registre sua despesa ou receita
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                <TypeButton
                  active={field.value === "EXPENSE"}
                  tone="expense"
                  onClick={() => field.onChange("EXPENSE")}
                />
                <TypeButton
                  active={field.value === "INCOME"}
                  tone="income"
                  onClick={() => field.onChange("INCOME")}
                />
              </div>
            )}
          />

          <ModalField label="Descrição" error={form.formState.errors.title?.message}>
            <Input
              placeholder="Ex. Almoço no restaurante"
              error={Boolean(form.formState.errors.title)}
              className="h-10 rounded-md border-[#d4d6da] text-sm placeholder:text-[#9ca3af]"
              {...form.register("title")}
            />
          </ModalField>

          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Data" error={form.formState.errors.date?.message}>
              <Input
                type="date"
                error={Boolean(form.formState.errors.date)}
                className="h-10 rounded-md border-[#d4d6da] text-sm text-[#6b7280]"
                {...form.register("date")}
              />
            </ModalField>

            <ModalField label="Valor" error={form.formState.errors.amount?.message}>
              <Input
                min="0"
                step="0.01"
                type="number"
                placeholder="R$ 0,00"
                error={Boolean(form.formState.errors.amount)}
                className="h-10 rounded-md border-[#d4d6da] text-sm placeholder:text-[#111827]"
                {...form.register("amount", { valueAsNumber: true })}
              />
            </ModalField>
          </div>

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <ModalField label="Categoria">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 rounded-md border-[#d4d6da] text-sm text-[#6b7280]">
                    <SelectValue placeholder="Selecione" />
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
              </ModalField>
            )}
          />

          {error ? <p className="text-xs text-feedback-danger">{error}</p> : null}

          <Button
            type="submit"
            className="h-10 w-full rounded-md text-sm"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TypeButton({
  active,
  tone,
  onClick,
}: {
  active: boolean;
  tone: "expense" | "income";
  onClick: () => void;
}) {
  const isExpense = tone === "expense";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors",
        active
          ? isExpense
            ? "border-feedback-danger bg-white text-feedback-danger"
            : "border-brand-base bg-white text-brand-base"
          : "border-[#e2e5e9] bg-white text-[#6b7280] hover:bg-[#f7f8fa]",
      )}
    >
      {isExpense ? <CircleArrowDown className="h-4 w-4" /> : <CircleArrowUp className="h-4 w-4" />}
      {isExpense ? "Despesa" : "Receita"}
    </button>
  );
}

function ModalField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-semibold text-[#374151]">{label}</span>
      {children}
      {error ? <span className="block text-xs text-feedback-danger">{error}</span> : null}
    </label>
  );
}
