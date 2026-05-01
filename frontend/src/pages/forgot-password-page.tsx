import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import financyWordmark from "../assets/financy-logo-letter.png";
import financyMark from "../assets/financy-mark.png";
import { Field } from "../components/shared/field";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/toast-context";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSubmit(values: ForgotPasswordFormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setIsSubmitting(false);

    toast.success({
      title: "Solicitação enviada",
      description: `Se ${values.email} estiver cadastrado, enviaremos as instruções de recuperação.`,
    });
    form.reset();
  }

  return (
    <main className="min-h-svh bg-[#f7f8fa] px-4 py-10">
      <section className="mx-auto flex w-full max-w-[448px] flex-col items-center">
        <div className="mb-9 mt-2 flex items-center justify-center gap-3">
          <img src={financyMark} alt="" className="h-8 w-8 object-contain" />
          <img src={financyWordmark} alt="Financy" className="h-[22px] w-auto object-contain" />
        </div>

        <div className="w-full rounded-lg border border-[#e2e5e9] bg-white px-8 py-8 shadow-none sm:px-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#111827]">Recuperar senha</h1>
            <p className="mt-3 text-base text-[#4b5563]">
              Informe seu e-mail de cadastro para receber instruções de acesso
            </p>
          </div>

          <form className="mt-9" onSubmit={form.handleSubmit(handleSubmit)}>
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
                className="h-12 rounded-lg border-[#d4d6da] text-base placeholder:text-[#9ca3af]"
                {...form.register("email")}
              />
            </Field>

            <Button
              className="mt-6 h-12 w-full rounded-lg text-base"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Enviar instruções
            </Button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#eef0f2]" />
            <span className="text-sm text-[#6b7280]">ou</span>
            <div className="h-px flex-1 bg-[#eef0f2]" />
          </div>

          <Button asChild variant="secondary" className="h-12 w-full rounded-lg text-base">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao login
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
