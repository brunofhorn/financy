import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Folders,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../context/auth-context";
import { cn } from "../../lib/utils";
import { Logo } from "../shared/logo";
import { Button } from "../ui/button";

const navItems = [
  { label: "Inicio", href: "/", icon: LayoutDashboard },
  { label: "Transacoes", href: "/transacoes", icon: ReceiptText },
  { label: "Categorias", href: "/categorias", icon: Folders },
  { label: "Relatorios", href: "/relatorios", icon: BarChart3 },
  { label: "Perfil", href: "/perfil", icon: UserRound },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-svh bg-gray-100">
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Ir para o dashboard">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.name ?? "Usuario"}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={handleLogout} title="Sair">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100svh-7rem)]">
          <nav className="flex gap-2 overflow-x-auto rounded-lg border border-border bg-white p-2 lg:flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex min-w-fit items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
                    isActive && "bg-finance-green-light text-brand-dark",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
