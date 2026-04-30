import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Field } from "../components/shared/field";
import { Logo } from "../components/shared/logo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/auth-context";
import { register } from "../lib/api";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres."),
  email: z.string().trim().email("Informe um e-mail valido."),
  password: z
    .string()
    .min(6, "A senha precisa ter ao menos 6 caracteres.")
    .max(72, "Senha muito longa."),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { setSession } = useAuth();
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: setSession,
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const error = mutation.error instanceof Error ? mutation.error.message : undefined;

  return (
    <main className="flex min-h-svh items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-panel">
        <Logo />
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="mt-2 text-sm text-gray-500">
            Seus dados financeiros ficam vinculados somente ao seu usuario.
          </p>
        </div>

        <form
          className="mt-6 space-y-3"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Field label="Nome" htmlFor="name" error={form.formState.errors.name?.message}>
            <Input
              id="name"
              icon={<UserRound className="h-4 w-4" />}
              placeholder="Seu nome"
              error={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
          </Field>

          <Field label="E-mail" htmlFor="email" error={form.formState.errors.email?.message}>
            <Input
              id="email"
              icon={<Mail className="h-4 w-4" />}
              placeholder="voce@email.com"
              error={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
          </Field>

          <Field
            label="Senha"
            htmlFor="password"
            error={form.formState.errors.password?.message}
          >
            <Input
              id="password"
              icon={<LockKeyhole className="h-4 w-4" />}
              type="password"
              placeholder="Minimo de 6 caracteres"
              error={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
          </Field>

          {error ? <p className="text-sm text-feedback-danger">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Ja possui conta?{" "}
          <Link className="font-semibold text-brand-base hover:text-brand-dark" to="/">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
