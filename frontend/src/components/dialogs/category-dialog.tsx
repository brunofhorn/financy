import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCategoryMutations } from "../../lib/hooks";
import type { Category } from "../../lib/types";
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
import { Textarea } from "../ui/textarea";
import { Field } from "../shared/field";

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

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) {
  const mutations = useCategoryMutations();
  const isEditing = Boolean(category);
  const mutation = isEditing ? mutations.update : mutations.create;

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>
            Organize entradas e saidas por area, projeto ou rotina.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Field
            label="Nome"
            htmlFor="category-name"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="category-name"
              placeholder="Ex: Moradia"
              error={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
          </Field>

          <Field
            label="Descricao"
            htmlFor="category-description"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              id="category-description"
              placeholder="Opcional"
              error={Boolean(form.formState.errors.description)}
              {...form.register("description")}
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
