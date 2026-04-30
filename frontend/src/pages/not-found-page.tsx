import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md rounded-lg border border-border bg-white p-6 text-center shadow-panel">
        <p className="text-sm font-semibold uppercase text-brand-base">404</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Pagina nao encontrada</h1>
        <p className="mt-2 text-sm text-gray-500">
          O caminho informado nao existe nesta aplicacao.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Voltar ao inicio</Link>
        </Button>
      </div>
    </main>
  );
}
