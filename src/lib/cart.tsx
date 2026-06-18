"use client";

import { useSyncExternalStore } from "react";
import { products, stores } from "./mock";
import type { Locale } from "./types";

// Global, persisted cart backed by an external store (read via
// useSyncExternalStore) so it works across all customer pages without a
// provider and without syncing state inside effects.

export interface CartEntry {
  id: number;
  qty: number;
  storeSlug: string;
}

const KEY = "nomi.cart";
let state: Record<number, CartEntry> = {};
let loaded = false;
const listeners = new Set<() => void>();
const EMPTY: Record<number, CartEntry> = {};

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch {
    /* storage unavailable */
  }
}

function commit(next: Record<number, CartEntry>) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
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
  return EMPTY;
}

export function addToCart(id: number, storeSlug: string) {
  const cur = state[id];
  commit({
    ...state,
    [id]: cur ? { ...cur, qty: cur.qty + 1 } : { id, qty: 1, storeSlug },
  });
}

export function decrement(id: number) {
  const cur = state[id];
  if (!cur) return;
  if (cur.qty <= 1) {
    const next = { ...state };
    delete next[id];
    commit(next);
  } else {
    commit({ ...state, [id]: { ...cur, qty: cur.qty - 1 } });
  }
}

export function clearCart() {
  commit({});
}

export interface CartLine {
  id: number;
  qty: number;
  name: string;
  price: number;
  emoji: string;
  unit: string;
  weightKg: number;
  storeSlug: string;
  storeName: string;
}

/** Join the raw cart with the catalog for rendering in the given locale. */
export function cartLines(
  map: Record<number, CartEntry>,
  locale: Locale,
): CartLine[] {
  return Object.values(map).flatMap((e) => {
    const p = products.find((x) => x.id === e.id);
    if (!p) return [];
    const store = stores.find((s) => s.slug === e.storeSlug);
    return [
      {
        id: e.id,
        qty: e.qty,
        name: p.name[locale],
        price: p.price,
        emoji: p.emoji,
        unit: p.unit,
        weightKg: p.weightKg,
        storeSlug: e.storeSlug,
        storeName: store?.name ?? "",
      },
    ];
  });
}

export function cartCount(map: Record<number, CartEntry>): number {
  return Object.values(map).reduce((s, e) => s + e.qty, 0);
}

export function cartTotal(map: Record<number, CartEntry>): number {
  return Object.values(map).reduce((s, e) => {
    const p = products.find((x) => x.id === e.id);
    return s + (p ? p.price * e.qty : 0);
  }, 0);
}

/** Total basket weight in kg (drives weight-based delivery pricing). */
export function cartWeightKg(map: Record<number, CartEntry>): number {
  const kg = Object.values(map).reduce((s, e) => {
    const p = products.find((x) => x.id === e.id);
    return s + (p ? p.weightKg * e.qty : 0);
  }, 0);
  return Math.round(kg * 10) / 10;
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
