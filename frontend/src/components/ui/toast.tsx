import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X } from "lucide-react";

import { cn } from "../../lib/utils";
import { ToastContext, type Toast } from "./toast-context";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...toast, id }]);
      window.setTimeout(() => removeToast(id), 4200);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ success }), [success]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border border-[#ccebdc] bg-white p-4 shadow-[0_16px_40px_rgba(17,24,39,0.14)]",
              "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-3",
            )}
            data-state="open"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-feedback-success" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#111827]">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-sm text-[#4b5563]">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-[#6b7280] transition-colors hover:bg-[#f7f8fa] hover:text-[#111827]"
              onClick={() => removeToast(toast.id)}
              aria-label="Fechar notificacao"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
