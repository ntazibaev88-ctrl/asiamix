"use client";

import { useSyncExternalStore } from "react";

// Per-store promotions ("акции") — mini-ad banners shown as a slider on the
// store page. Each store admin manages its own. Persisted in localStorage;
// move to a `promotions` table in Supabase for production.

export interface Promo {
  id: string;
  title: string;
  gradient: string;
  emoji: string;
  image?: string; // uploaded data URL (overrides barcode)
  barcode?: string; // real product photo via Open Food Facts
}

export const PROMO_GRADIENTS: { name: string; value: string }[] = [
  { name: "green", value: "linear-gradient(135deg,#22c55e,#15803d)" },
  { name: "yellow", value: "linear-gradient(135deg,#fbbf24,#f59e0b)" },
  { name: "amber", value: "linear-gradient(135deg,#fcd34d,#ea9a16)" },
  { name: "blue", value: "linear-gradient(135deg,#38bdf8,#0284c7)" },
  { name: "red", value: "linear-gradient(135deg,#fb7185,#e11d48)" },
  { name: "violet", value: "linear-gradient(135deg,#a78bfa,#7c3aed)" },
];

const DEFAULTS: Promo[] = [
  { id: "p1", title: "Освежись с Coca-Cola", gradient: PROMO_GRADIENTS[4].value, emoji: "🥤", barcode: "5449000054227" },
  { id: "p2", title: "Сладкий момент", gradient: PROMO_GRADIENTS[2].value, emoji: "🍫", barcode: "5000159461122" },
  { id: "p3", title: "Хрустящий вкус", gradient: PROMO_GRADIENTS[1].value, emoji: "🥔", barcode: "5900259035378" },
  { id: "p4", title: "Яркий вкус Fanta", gradient: PROMO_GRADIENTS[3].value, emoji: "🍊", barcode: "5449000011527" },
];

type State = Record<string, Promo[]>;

const KEY = "nomi.promotions";
const listeners = new Set<() => void>();
let state: State = {};
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : {};
  } catch {
    state = {};
  }
}

function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return {} as State;
}

function listFor(slug: string): Promo[] {
  return state[slug] ?? DEFAULTS;
}

export function addPromo(slug: string, p: Omit<Promo, "id">) {
  commit({ ...state, [slug]: [{ ...p, id: `p${Date.now()}` }, ...listFor(slug)] });
}

export function removePromo(slug: string, id: string) {
  commit({ ...state, [slug]: listFor(slug).filter((x) => x.id !== id) });
}

export function usePromos(slug: string): Promo[] {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return all[slug] ?? DEFAULTS;
}
