// Delivery pricing for NOMI. The delivery fee is also the courier's payout.
// Base price depends on distance; bad weather adds a surcharge.

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

