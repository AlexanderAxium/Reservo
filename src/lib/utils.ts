import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un precio (Decimal de Prisma) a string con 2 decimales
 */
export function formatPrice(
  price: string | number | { toString(): string } | null | undefined
): string {
  if (price === null || price === undefined) return "0.00";

  const priceStr =
    typeof price === "string"
      ? price
      : typeof price === "number"
        ? price.toFixed(2)
        : price.toString();

  // Asegurar que tenga 2 decimales
  const num = Number.parseFloat(priceStr);
  if (Number.isNaN(num)) return "0.00";

  return num.toFixed(2);
}
