import type { Locale, Localized } from "./types";

/** Format an amount in Kazakhstani tenge, e.g. 2900 -> "2 900 ₸". */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₸`;
}

/** Pick the value for the active locale from a localized record. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale];
}
