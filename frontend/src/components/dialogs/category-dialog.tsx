import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  CarFront,
  Gift,
  HeartPulse,
  Home,
  Landmark,
  Loader2,
  ReceiptText,
  ShoppingCart,
  Tags,
  Utensils,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCategoryMutations } from "../../lib/hooks";
import type { Category } from "../../lib/types";
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

const categorySchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres."),
  description: z.string().trim().max(255, "Use no maximo 255 caracteres.").optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
};

const iconOptions = [
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  Landmark,
  ShoppingCart,
  Tags,
  Gift,
  Utensils,
  Home,
  WalletCards,
  ReceiptText,
];

const colorOptions = [
  "#1F6E43",
  "#2563EB",
  "#9333EA",
  "#DB2777",
  "#DC2626",
  "#EA580C",
  "#CA8A04",
];

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) {
  const mutations = useCategoryMutations();
  const isEditing = Boolean(category);
  const mutation = isEditing ? mutations.update : mutations.create;
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const defaultValues = useMemo<CategoryFormData>(
    () => ({
      name: category?.name ?? "",
      description: category?.description ?? "",
    }),
    [category],
  );

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      queueMicrotask(() => {
        setSelectedIcon(0);
        setSelectedColor(colorOptions[0]);
      });
    }
  }, [defaultValues, form, open]);

  const error = mutation.error instanceof Error ? mutation.error.message : undefined;

  async function onSubmit(values: CategoryFormData) {
    const input = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
    };

    if (category) {
      await mutations.update.mutateAsync({ id: category.id, input });
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
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#6b7280]">
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <ModalField label="Título" error={form.formState.errors.name?.message}>
            <Input
              placeholder="Ex. Alimentação"
              error={Boolean(form.formState.errors.name)}
              className="h-10 rounded-md border-[#d4d6da] text-sm placeholder:text-[#9ca3af]"
              {...form.register("name")}
            />
          </ModalField>

          <ModalField label="Descrição" error={form.formState.errors.description?.message}>
            <Input
              placeholder="Descrição da categoria"
              error={Boolean(form.formState.errors.description)}
              className="h-10 rounded-md border-[#d4d6da] text-sm placeholder:text-[#9ca3af]"
              {...form.register("description")}
            />
            <span className="block text-xs text-[#6b7280]">Opcional</span>
          </ModalField>

          <div className="space-y-2">
            <span className="block text-xs font-semibold text-[#374151]">Ícone</span>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((Icon, index) => (
                <button
                  key={Icon.displayName ?? Icon.name}
                  type="button"
                  onClick={() => setSelectedIcon(index)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md border border-[#d4d6da] bg-white text-[#4b5563] transition-colors hover:bg-[#f7f8fa]",
                    selectedIcon === index && "border-brand-base ring-2 ring-brand-base/20",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-semibold text-[#374151]">Cor</span>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "h-6 w-8 rounded-md border border-white shadow-[0_0_0_1px_#d4d6da]",
                    selectedColor === color && "shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#1F6E43]",
                  )}
                  style={{ backgroundColor: color }}
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
          </div>

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

function ModalField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-semibold text-[#374151]">{label}</span>
      {children}
      {error ? <span className="block text-xs text-feedback-danger">{error}</span> : null}
    </label>
  );
}
