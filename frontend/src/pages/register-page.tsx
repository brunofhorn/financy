import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Loader2, LockKeyhole, LogIn, Mail, UserRound } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Field } from "../components/shared/field";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/auth-context";
import { register } from "../lib/api";
import financyMark from "../assets/financy-mark.png";
import financyWordmark from "../assets/financy-wordmark.png";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres."),
  email: z.string().trim().email("Informe um e-mail valido."),
  password: z
    .string()
    .min(8, "A senha precisa ter ao menos 8 caracteres.")
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
    <main className="min-h-svh bg-[#f7f8fa] px-4 py-10">
      <section className="mx-auto flex w-full max-w-[448px] flex-col items-center">
        <div className="mb-9 mt-2 flex items-center justify-center gap-3">
          <img src={financyMark} alt="" className="h-8 w-8 object-contain" />
          <img src={financyWordmark} alt="Financy" className="h-[22px] w-auto object-contain" />
        </div>

        <div className="w-full rounded-lg border border-[#e2e5e9] bg-white px-8 py-8 shadow-none sm:px-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#111827]">Criar conta</h1>
            <p className="mt-3 text-base text-[#4b5563]">
              Comece a controlar suas financas ainda hoje
            </p>
          </div>

        <form
          className="mt-9"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Field
            label="Nome completo"
            htmlFor="name"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="name"
              icon={<UserRound className="h-4 w-4" />}
              placeholder="Seu nome completo"
              error={Boolean(form.formState.errors.name)}
              className="h-12 rounded-md border-[#d4d6da] text-base placeholder:text-[#9ca3af]"
              {...form.register("name")}
            />
          </Field>

          <Field label="E-mail" htmlFor="email" error={form.formState.errors.email?.message}>
            <Input
              id="email"
              icon={<Mail className="h-4 w-4" />}
              placeholder="mail@exemplo.com"
              error={Boolean(form.formState.errors.email)}
              className="h-12 rounded-md border-[#d4d6da] text-base placeholder:text-[#9ca3af]"
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
              rightIcon={<EyeOff className="h-4 w-4" />}
              type="password"
              placeholder="Digite sua senha"
              error={Boolean(form.formState.errors.password)}
              className="h-12 rounded-md border-[#d4d6da] text-base placeholder:text-[#9ca3af]"
              {...form.register("password")}
            />
          </Field>
          <p className="-mt-1 text-xs text-[#6b7280]">
            A senha deve ter no minimo 8 caracteres
          </p>

          {error ? <p className="text-sm text-feedback-danger">{error}</p> : null}

          <Button
            className="mt-6 h-12 w-full rounded-md text-base"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Cadastrar
          </Button>
        </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#eef0f2]" />
            <span className="text-sm text-[#6b7280]">ou</span>
            <div className="h-px flex-1 bg-[#eef0f2]" />
          </div>

          <p className="text-center text-sm text-[#4b5563]">Ja tem uma conta?</p>

          <Button asChild variant="secondary" className="mt-5 h-12 w-full rounded-md text-base">
            <Link to="/">
              <LogIn className="h-5 w-5" />
              Fazer login
          </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
