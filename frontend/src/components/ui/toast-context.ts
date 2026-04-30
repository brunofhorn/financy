import { createContext, useContext } from "react";

export type Toast = {
  id: string;
  title: string;
  description?: string;
};

export type ToastContextValue = {
  success: (toast: Omit<Toast, "id">) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider.");
  }

  return context;
}
