import { LogOut, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/auth-context";

export function ProfilePage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const initials = (user?.name ?? "CT")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="mx-auto max-w-[448px]">
      <section className="rounded-lg border border-[#e2e5e9] bg-white px-8 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d9dde3] text-2xl font-semibold text-[#111827]">
            {initials || "CT"}
          </div>
          <h1 className="mt-6 text-xl font-bold text-[#111827]">{user?.name ?? "Conta"}</h1>
          <p className="mt-2 text-base text-[#6b7280]">{user?.email}</p>
        </div>

        <div className="my-9 h-px bg-[#edf0f2]" />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="block text-sm font-semibold text-[#374151]">Nome completo</span>
            <Input
              icon={<UserRound className="h-4 w-4" />}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-md border-[#d4d6da] text-base"
            />
          </label>

          <label className="block space-y-2">
            <span className="block text-sm font-semibold text-[#374151]">E-mail</span>
            <Input
              icon={<Mail className="h-4 w-4" />}
              value={user?.email ?? ""}
              disabled
              className="h-12 rounded-md border-[#d4d6da] bg-white text-base disabled:bg-white disabled:text-[#6b7280]"
            />
            <span className="block text-xs text-[#6b7280]">O e-mail não pode ser alterado</span>
          </label>

          <Button type="submit" className="mt-8 h-12 w-full rounded-md text-base">
            Salvar alterações
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="h-12 w-full rounded-md text-base"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-feedback-danger" />
            Sair da conta
          </Button>
        </form>
      </section>
    </div>
  );
}
