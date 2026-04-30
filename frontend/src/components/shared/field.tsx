import type { ReactNode } from "react";

import { Label } from "../ui/label";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  helper?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, helper, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className={error ? "text-feedback-danger" : undefined}>
        {label}
      </Label>
      {children}
      <p className={error ? "text-xs text-feedback-danger" : "text-xs text-gray-500"}>
        {error ?? helper ?? "\u00a0"}
      </p>
    </div>
  );
}
