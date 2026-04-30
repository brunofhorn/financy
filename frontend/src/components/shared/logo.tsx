import { CircleDollarSign } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-brand-base">
      <CircleDollarSign className="h-7 w-7" strokeWidth={2.5} />
      <span className="text-xl font-extrabold uppercase tracking-normal">Financy</span>
    </div>
  );
}
