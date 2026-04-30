import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-gray-200 text-gray-700",
        income: "bg-finance-green-light text-finance-green-dark",
        expense: "bg-finance-red-light text-finance-red-dark",
        blue: "bg-finance-blue-light text-finance-blue-dark",
        purple: "bg-finance-purple-light text-finance-purple-dark",
        yellow: "bg-finance-yellow-light text-finance-yellow-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
