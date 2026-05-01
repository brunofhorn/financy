import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import type { Category } from "./types";

export const CATEGORY_ICON_OPTIONS: Array<{ id: string; icon: LucideIcon }> = [
  { id: "briefcase", icon: BriefcaseBusiness },
  { id: "car", icon: CarFront },
  { id: "heart", icon: HeartPulse },
  { id: "pigbank", icon: PiggyBank },
  { id: "cart", icon: ShoppingCart },
  { id: "ticket", icon: Ticket },
  { id: "toolcase", icon: ToolCase },
  { id: "utensils", icon: Utensils },
  { id: "pawprint", icon: PawPrint },
  { id: "house", icon: House },
  { id: "gift", icon: Gift },
  { id: "dumbbell", icon: Dumbbell },
  { id: "bookopen", icon: BookOpen },
  { id: "baggageclaim", icon: BaggageClaim },
  { id: "mailbox", icon: Mailbox },
  { id: "receipt", icon: ReceiptText },
  { id: "receipt", icon: ReceiptText }
];

export const CATEGORY_COLOR_OPTIONS = [
  "#16A34A",
  "#2563eb",
  "#9333ea",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#ca8a04"
];

export function getCategoryAppearance(category?: Pick<Category, "icon" | "color"> | null) {
  const icon = CATEGORY_ICON_OPTIONS.find((option) => option.id === category?.icon)?.icon;
  const color = category?.color || CATEGORY_COLOR_OPTIONS[1];

  return {
    Icon: icon ?? Utensils,
    color,
    backgroundColor: hexToRgba(color, 0.12),
  };
}

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  if (Number.isNaN(value) || normalized.length !== 6) {
    return `rgba(37, 99, 235, ${alpha})`;
  }

  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
