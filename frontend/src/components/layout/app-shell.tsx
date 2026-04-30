import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

import financyMark from "../../assets/financy-mark.png";
import financyWordmark from "../../assets/financy-wordmark.png";
import { useAuth } from "../../context/auth-context";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Transações", href: "/transacoes" },
  { label: "Categorias", href: "/categorias" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const initials = (user?.name ?? "CT")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-svh bg-[#f7f8fa]">
      <header className="sticky top-0 z-30 border-b border-[#e2e5e9] bg-white">
        <div className="mx-auto grid h-[68px] max-w-[1184px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          <Link to="/" aria-label="Ir para o dashboard" className="flex items-center gap-2.5">
            <img src={financyMark} alt="" className="h-7 w-7 object-contain" />
            <img src={financyWordmark} alt="Financy" className="h-[18px] w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-semibold text-[#4b5563] transition-colors hover:text-brand-base",
                    isActive && "text-brand-base",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={logout}
              title="Sair"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5e7eb] text-sm font-bold text-[#111827] transition-colors hover:bg-[#d1d5db]"
            >
              {initials || "CT"}
            </button>
          </div>
        </div>

        <nav className="flex gap-5 overflow-x-auto border-t border-[#eef0f2] px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn("text-sm font-semibold text-[#4b5563]", isActive && "text-brand-base")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1184px] px-4 py-12 sm:px-6">{children}</main>
    </div>
  );
}
