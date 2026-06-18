"use client";

import { useSyncExternalStore } from "react";

// Promo codes managed by the admin; applied by customers at checkout.
export interface PromoCode {
  code: string;
  discountPct: number;
  active: boolean;
}

const KEY = "nomi.promoCodes";
const listeners = new Set<() => void>();
let state: PromoCode[] | null = null;
let loaded = false;

const DEFAULTS: PromoCode[] = [
  { code: "NOMI10", discountPct: 10, active: true },
  { code: "WELCOME15", discountPct: 15, active: true },
];

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : DEFAULTS;
  } catch {
    state = DEFAULTS;
  }
}

function commit(next: PromoCode[]) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
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
  return state ?? DEFAULTS;
}

function getServerSnapshot() {
  return DEFAULTS;
}

export function addPromoCode(code: string, discountPct: number) {
  const list = getSnapshot();
  commit([{ code: code.toUpperCase().trim(), discountPct, active: true }, ...list]);
}

export function removePromoCode(code: string) {
  commit(getSnapshot().filter((c) => c.code !== code));
}

/** Validate a code entered at checkout. */
export function validatePromo(code: string): PromoCode | null {
  const c = getSnapshot().find(
    (x) => x.active && x.code === code.toUpperCase().trim(),
  );
  return c ?? null;
}

export function usePromoCodes(): PromoCode[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
