import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRoundPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../context/auth-context";
import { login } from "../lib/api";
import { Field } from "../components/shared/field";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import financyMark from "../assets/financy-mark.png";
import financyWordmark from "../assets/financy-logo-letter.png";

const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-svh bg-[#f7f8fa] px-4 py-10">
      <section className="mx-auto flex w-full max-w-[448px] flex-col items-center">
        <div className="mb-9 mt-2 flex items-center justify-center gap-3">
          <img src={financyMark} alt="" className="h-8 w-8 object-contain" />
          <img src={financyWordmark} alt="Financy" className="h-[22px] w-auto object-contain" />
        </div>

        <div className="w-full rounded-lg border border-[#e2e5e9] bg-white px-8 py-8 shadow-none sm:px-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#111827]">Fazer login</h1>
            <p className="mt-3 text-base text-[#4b5563]">
              Entre na sua conta para continuar
            </p>
          </div>

          <form
            className="mt-9"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <Field
              label="E-mail"
              htmlFor="email"
              error={form.formState.errors.email?.message}
            >
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
              <div className="relative">
                <Input
                  id="password"
                  icon={<LockKeyhole className="h-4 w-4" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  error={Boolean(form.formState.errors.password)}
                  className="h-12 rounded-md border-[#d4d6da] pr-10 text-base placeholder:text-[#9ca3af]"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-center text-[#111827] transition-colors hover:text-brand-base"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            <div className="mt-1 flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-[#374151]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#d4d6da] text-brand-base focus:ring-brand-base"
                />
                Lembrar-me
              </label>
              <Link
                to="/recuperar-senha"
                className="font-semibold text-brand-base transition-colors hover:text-brand-dark"
              >
                Recuperar senha
              </Link>
            </div>

            {error ? <p className="text-sm text-feedback-danger">{error}</p> : null}

            <Button
              className="mt-6 h-12 w-full rounded-md text-base"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#eef0f2]" />
            <span className="text-sm text-[#6b7280]">ou</span>
            <div className="h-px flex-1 bg-[#eef0f2]" />
          </div>

          <p className="text-center text-sm text-[#4b5563]">Ainda nao tem uma conta?</p>

          <Button asChild variant="secondary" className="mt-5 h-12 w-full rounded-md text-base">
            <Link to="/cadastro">
              <UserRoundPlus className="h-5 w-5" />
              Criar conta
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
