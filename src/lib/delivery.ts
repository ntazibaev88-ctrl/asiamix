// Delivery pricing for NOMI. The delivery fee is also the courier's payout.
// Model: a flat BASE fee + a WEIGHT SURCHARGE for heavier baskets (only added
// above 7 kg). Shared pure functions, also used by the server.

// ── Weight-based delivery pricing ─────────────────────────────────────────
// Base delivery fee (₸). Light orders (≤7 кг) pay only this. Configurable.
export const BASE_DELIVERY = Number(process.env.BASE_DELIVERY ?? 500);

export interface WeightTier {
  maxKg: number;
  surcharge: number;
  label: string;
}

// Weight surcharge added on top of the base fee:
//   ≤7 кг → +0 · 8–14 кг → +300 · 15–20 кг → +400 · 20–30 кг → +600
export const weightTiers: WeightTier[] = [
  { maxKg: 7, surcharge: 0, label: "≤7 кг" },
  { maxKg: 14, surcharge: 300, label: "8–14 кг" },
  { maxKg: 20, surcharge: 400, label: "15–20 кг" },
  { maxKg: 30, surcharge: 600, label: "20–30 кг" },
];

/** Weight surcharge (₸) for a basket of the given total weight (kg). */
export function weightSurcharge(totalKg: number): number {
  const kg = Math.max(0, totalKg);
  for (const tier of weightTiers) if (kg <= tier.maxKg) return tier.surcharge;
  // Above the top tier we keep the heaviest surcharge.
  return weightTiers[weightTiers.length - 1].surcharge;
}

/** Total delivery fee = base + weight surcharge. */
export function deliveryFeeByWeight(totalKg: number): number {
  return BASE_DELIVERY + weightSurcharge(totalKg);
}

export type WeightSeverity = "normal" | "medium" | "heavy" | "very_heavy";

/**
 * Courier-facing weight severity:
 *   ≥30 кг → 🚨 өте ауыр · ≥15 кг → ⚠️ ауыр · ≥8 кг → ⚠️ орташа ауыр.
 */
export function weightSeverity(totalKg: number): WeightSeverity {
  if (totalKg >= 30) return "very_heavy";
  if (totalKg >= 15) return "heavy";
  if (totalKg >= 8) return "medium";
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

