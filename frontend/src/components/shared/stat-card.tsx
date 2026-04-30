import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: "default" | "success" | "danger" | "blue";
};

const tones = {
  default: "bg-white text-brand-base",
  success: "bg-finance-green-light text-finance-green-dark",
  danger: "bg-finance-red-light text-finance-red-dark",
  blue: "bg-finance-blue-light text-finance-blue-dark",
};

export function StatCard({ label, value, icon, tone = "default" }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={cn("rounded-md p-2.5", tones[tone])}>{icon}</div>
      </div>
    </div>
  );
}
