import {
  BriefcaseBusiness,
  CarFront,
  Gift,
  HeartPulse,
  Home,
  Landmark,
  ReceiptText,
  ShoppingCart,
  Tags,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import type { Category } from "./types";

export const CATEGORY_ICON_OPTIONS: Array<{ id: string; icon: LucideIcon }> = [
  { id: "briefcase", icon: BriefcaseBusiness },
  { id: "car", icon: CarFront },
  { id: "heart", icon: HeartPulse },
  { id: "landmark", icon: Landmark },
  { id: "cart", icon: ShoppingCart },
  { id: "tags", icon: Tags },
  { id: "gift", icon: Gift },
  { id: "utensils", icon: Utensils },
  { id: "home", icon: Home },
  { id: "wallet", icon: WalletCards },
  { id: "receipt", icon: ReceiptText },
];

export const CATEGORY_COLOR_OPTIONS = [
  "#1F6E43",
  "#2563EB",
  "#9333EA",
  "#DB2777",
  "#DC2626",
  "#EA580C",
  "#CA8A04",
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
