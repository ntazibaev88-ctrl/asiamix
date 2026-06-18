// Delivery pricing for NOMI. The delivery fee is also the courier's payout.
// Pricing is WEIGHT-BASED (shared pure functions, also used by the server);
// distance zones + weather are kept for reference but no longer set the price.

// ── Weight-based delivery pricing ─────────────────────────────────────────
export interface WeightTier {
  maxKg: number;
  price: number;
  label: string;
}

// 0–5 кг = 1000 ₸ · 5–10 = 1200 · 10–15 = 1500 · 15–30 = 2000 · 30–50 = 3000
export const weightTiers: WeightTier[] = [
  { maxKg: 5, price: 1000, label: "0–5 кг" },
  { maxKg: 10, price: 1200, label: "5–10 кг" },
  { maxKg: 15, price: 1500, label: "10–15 кг" },
  { maxKg: 30, price: 2000, label: "15–30 кг" },
  { maxKg: 50, price: 3000, label: "30–50 кг" },
];

/** Delivery fee for a basket of the given total weight (kg). */
export function deliveryFeeByWeight(totalKg: number): number {
  const kg = Math.max(0, totalKg);
  for (const tier of weightTiers) if (kg <= tier.maxKg) return tier.price;
  // Above the top tier we still charge the heaviest rate.
  return weightTiers[weightTiers.length - 1].price;
}

export type WeightSeverity = "normal" | "medium" | "heavy" | "very_heavy";

/**
 * Courier-facing weight severity:
 *   ≥30 кг → 🚨 өте ауыр · ≥15 кг → ⚠️ ауыр · ≥10 кг → ⚠️ орташа ауыр.
 */
export function weightSeverity(totalKg: number): WeightSeverity {
  if (totalKg >= 30) return "very_heavy";
  if (totalKg >= 15) return "heavy";
  if (totalKg >= 10) return "medium";
  return "normal";
}

/** Estimated number of shopping bags for an item count. */
export function bagsFor(units: number): number {
  return Math.max(1, Math.ceil(units / 6));
}

/**
 * Best-effort kg from a human weight string ("1 л", "0.4 кг", "200 г",
 * "500 мл"). Liquids are treated as ~1 kg/L. Returns undefined when unparseable.
 */
export function parseWeightKg(weight?: string): number | undefined {
  if (!weight) return undefined;
  const m = weight.replace(",", ".").match(/([\d.]+)\s*(кг|г|kg|g|л|l|мл|ml)/i);
  if (!m) return undefined;
  const value = parseFloat(m[1]);
  if (!Number.isFinite(value)) return undefined;
  switch (m[2].toLowerCase()) {
    case "кг":
    case "kg":
    case "л":
    case "l":
      return value;
    case "г":
    case "g":
    case "мл":
    case "ml":
      return value / 1000;
    default:
      return undefined;
  }
}

export interface DistanceTier {
  id: string;
  label: string;
  price: number;
}

export const distanceTiers: DistanceTier[] = [
  { id: "z1", label: "~300 м", price: 350 },
  { id: "z2", label: "~700 м", price: 500 },
  { id: "z3", label: "~1 км", price: 600 },
  { id: "z4", label: "1.5–3 км", price: 1000 },
];

export type Weather = "normal" | "medium" | "high";

// Surcharge ranges; `fee` is the value actually applied (mid of the range).
export const weatherInfo: Record<
  Weather,
  { fee: number; min: number; max: number }
> = {
  normal: { fee: 0, min: 0, max: 0 },
  medium: { fee: 350, min: 200, max: 500 },
  high: { fee: 750, min: 500, max: 1000 },
};

export function deliveryFee(tierId: string, weather: Weather): number {
  const base = distanceTiers.find((t) => t.id === tierId)?.price ?? 0;
  return base + weatherInfo[weather].fee;
}

// Temporary delivery area — Esil district (Astana). Other districts soon.
export const esilStreets = [
  "Керей-Жәнібек",
  "Мәңгілік Ел",
  "Ұлы Дала",
  "Бұхар жырау",
  "Орынбор",
  "Аққұм",
  "Аль-Фараби",
  "Фариза Оңғарсынова",
  "Жошы хан",
  "Түркістан",
  "Тұрар Рысқұлов",
  "Әбіш Кекілбаев",
  "Жиделі",
  "VIP городок",
];

// Each street maps to a distance zone from the stores (on Аль-Фараби). The
// customer never picks a zone — it is derived automatically from the address.
const streetZone: Record<string, string> = {
  "Аль-Фараби": "z1",
  "Фариза Оңғарсынова": "z1",
  "Керей-Жәнібек": "z2",
  "Мәңгілік Ел": "z2",
  "Ұлы Дала": "z2",
  "VIP городок": "z2",
  "Орынбор": "z3",
  "Бұхар жырау": "z3",
  "Аққұм": "z3",
  "Жошы хан": "z3",
  "Түркістан": "z4",
  "Тұрар Рысқұлов": "z4",
  "Әбіш Кекілбаев": "z4",
  "Жиделі": "z4",
};

export function zoneForStreet(street: string): DistanceTier {
  const id = streetZone[street] ?? "z2";
  return distanceTiers.find((t) => t.id === id) ?? distanceTiers[1];
}

