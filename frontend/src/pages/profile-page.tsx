import { ShieldCheck, UserRound } from "lucide-react";

import { useAuth } from "../context/auth-context";
import { formatDate } from "../lib/format";
import { getBackendUrlLabel } from "../lib/graphql";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-base">Perfil</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Conta</h1>
        <p className="mt-2 text-sm text-gray-500">
          Informacoes basicas da sessao autenticada.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-finance-green-light p-2 text-brand-base">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Criada em</dt>
              <dd className="font-semibold text-gray-900">
                {user?.createdAt ? formatDate(user.createdAt) : "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Atualizada em</dt>
              <dd className="font-semibold text-gray-900">
                {user?.updatedAt ? formatDate(user.updatedAt) : "-"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-finance-blue-light p-2 text-finance-blue-dark">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">API GraphQL</h2>
              <p className="text-sm text-gray-500">Configuracao atual do frontend.</p>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-gray-100 p-3 font-mono text-sm text-gray-700">
            {getBackendUrlLabel()}
          </div>
        </div>
      </section>
    </div>
  );
}
