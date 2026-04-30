import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../context/auth-context";
import { login } from "../lib/api";
import { Field } from "../components/shared/field";
import { Logo } from "../components/shared/logo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { setSession } = useAuth();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: setSession,
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const error = mutation.error instanceof Error ? mutation.error.message : undefined;

  return (
    <main className="grid min-h-svh bg-gray-100 lg:grid-cols-[1fr_480px]">
      <section className="hidden bg-brand-dark px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase text-white/70">Controle financeiro</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight">
            Acompanhe entradas, saidas e categorias no mesmo lugar.
          </h1>
          <p className="mt-5 text-base text-white/75">
            Um painel objetivo para registrar transacoes e manter a organizacao
            pessoal conectada ao backend GraphQL.
          </p>
        </div>
        <div className="grid max-w-lg grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-white/10 p-4">
            <strong className="block text-2xl">GraphQL</strong>
            <span className="text-white/70">API integrada</span>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <strong className="block text-2xl">JWT</strong>
            <span className="text-white/70">Sessao segura</span>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <strong className="block text-2xl">CRUD</strong>
            <span className="text-white/70">Dados por usuario</span>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-panel">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>
            <p className="mt-2 text-sm text-gray-500">
              Acesse sua conta para gerenciar transacoes e categorias.
            </p>
          </div>

          <form
            className="mt-6 space-y-3"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
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
                placeholder="Sua senha"
                error={Boolean(form.formState.errors.password)}
                {...form.register("password")}
              />
            </Field>

            {error ? <p className="text-sm text-feedback-danger">{error}</p> : null}

            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Ainda nao tem conta?{" "}
            <Link className="font-semibold text-brand-base hover:text-brand-dark" to="/cadastro">
              Criar conta
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
