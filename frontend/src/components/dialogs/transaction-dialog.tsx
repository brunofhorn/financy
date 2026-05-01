import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
import { useToast } from "../ui/toast-context";
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
  date: z
    .string()
    .min(1, "Informe a data.")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA.")
    .refine((value) => Boolean(parsePtBrDate(value)), "Informe uma data válida."),
  categoryId: z.string().optional(),
  notes: z.string().trim().max(500, "Use no máximo 500 caracteres.").optional(),
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
  const toast = useToast();
  const isEditing = Boolean(transaction);
  const mutation = isEditing ? mutations.update : mutations.create;

  const defaultValues = useMemo<TransactionFormData>(
    () => ({
      title: transaction?.title ?? "",
      amount: transaction?.amount ?? 0,
      type: transaction?.type ?? "EXPENSE",
      date: formatPtBrDate(transaction?.date ? new Date(transaction.date) : new Date()),
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
      date: ptBrDateToApiDate(values.date),
      categoryId: values.categoryId === NO_CATEGORY ? null : values.categoryId,
      notes: values.notes?.trim() || null,
    };

    if (transaction) {
      await mutations.update.mutateAsync({ id: transaction.id, input });
    } else {
      await mutations.create.mutateAsync(input);
      toast.success({
        title: "Transação cadastrada",
        description: "O lançamento foi adicionado com sucesso.",
      });
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
              <Controller
                control={form.control}
                name="date"
                render={({ field }) => (
                  <DatePickerInput
                    value={field.value}
                    onChange={field.onChange}
                    error={Boolean(form.formState.errors.date)}
                  />
                )}
              />
            </ModalField>

            <ModalField label="Valor" error={form.formState.errors.amount?.message}>
              <Controller
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    error={Boolean(form.formState.errors.amount)}
                  />
                )}
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

function CurrencyInput({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
}) {
  return (
    <Input
      value={formatCurrencyInput(value)}
      onChange={(event) => onChange(parseCurrencyInput(event.target.value))}
      placeholder="R$ 0,00"
      inputMode="numeric"
      error={error}
      className="h-10 rounded-md border-[#d4d6da] text-sm placeholder:text-[#111827]"
    />
  );
}

function formatCurrencyInput(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function parseCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return 0;
  }

  return Number(digits) / 100;
}

function DatePickerInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}) {
  const selectedDate = useMemo(() => parsePtBrDate(value), [value]);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ?? new Date(),
  );
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);

  useEffect(() => {
    if (selectedDate) {
      queueMicrotask(() => {
        setVisibleMonth((current) => {
          if (
            current.getMonth() === selectedDate.getMonth() &&
            current.getFullYear() === selectedDate.getFullYear()
          ) {
            return current;
          }

          return selectedDate;
        });
      });
    }
  }, [selectedDate]);

  function changeMonth(offset: number) {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  }

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(event) => onChange(maskDate(event.target.value))}
        placeholder="DD/MM/AAAA"
        inputMode="numeric"
        error={error}
        rightIcon={<Calendar className="h-4 w-4" />}
        className="h-10 rounded-md border-[#d4d6da] pr-10 text-sm text-[#6b7280] placeholder:text-[#9ca3af]"
        onFocus={() => setOpen(true)}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-center text-[#6b7280]"
        onClick={() => setOpen((current) => !current)}
        aria-label="Abrir calendario"
      />

      {open ? (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-64 rounded-lg border border-[#e2e5e9] bg-white p-3 shadow-[0_12px_30px_rgba(17,24,39,0.14)]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#f7f8fa]"
              onClick={() => changeMonth(-1)}
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold capitalize text-[#111827]">
              {visibleMonth.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#f7f8fa]"
              onClick={() => changeMonth(1)}
              aria-label="Proximo mes"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#6b7280]">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
              const isSelected =
                selectedDate?.toDateString() === day.toDateString();

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={cn(
                    "flex h-8 items-center justify-center rounded-md text-xs transition-colors hover:bg-[#f7f8fa]",
                    !isCurrentMonth && "text-[#c2c7cf]",
                    isSelected && "bg-brand-base font-semibold text-white hover:bg-brand-base",
                  )}
                  onClick={() => {
                    onChange(formatPtBrDate(day));
                    setOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
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

function maskDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join("/");
}

function formatPtBrDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function parsePtBrDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function ptBrDateToApiDate(value: string) {
  const date = parsePtBrDate(value);

  if (!date) {
    return new Date().toISOString();
  }

  date.setHours(12, 0, 0, 0);
  return date.toISOString();
}

function getCalendarDays(visibleMonth: Date) {
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}
