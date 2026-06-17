"use client";

import { useSyncExternalStore } from "react";
import { demoStores } from "./mock";

// Stores managed by the Super Admin (add/edit/remove, commission). Persisted in
// localStorage so changes stick across the demo. Default commission is 3%, with
// an optional temporary boost until a given date.

export interface ManagedStore {
  slug: string;
  name: string;
  city: string;
  address: string;
  orders: number;
  revenue: number;
  rating: number;
  commission: number; // base %, default 3
  active: boolean;
  tempRate?: number; // temporary commission %
  tempUntil?: string; // ISO date the boost lasts until
}

const KEY = "nomi.managedStores";
const listeners = new Set<() => void>();
let state: ManagedStore[] = [];
let loaded = false;

function seed(): ManagedStore[] {
  return demoStores.map((s) => ({
    slug: s.slug,
    name: s.name,
    city: s.city,
    address: s.address,
    orders: s.orders,
    revenue: s.revenue,
    rating: s.rating,
    commission: s.commission,
    active: s.active,
  }));
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : seed();
  } catch {
    state = seed();
  }
}

function commit(next: ManagedStore[]) {
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
  return [] as ManagedStore[];
}

/** Effective commission right now (temp boost if still active). */
export function effectiveCommission(s: ManagedStore): number {
  if (s.tempRate && s.tempUntil && new Date(s.tempUntil) > new Date())
    return s.tempRate;
  return s.commission;
}

export function addStore(input: {
  name: string;
  city: string;
  address: string;
}) {
  const slug =
    input.name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-|-$/g, "") ||
    `store-${Date.now()}`;
  commit([
    ...state,
    {
      slug,
      name: input.name,
      city: input.city,
      address: input.address,
      orders: 0,
      revenue: 0,
      rating: 5,
      commission: 3,
      active: true,
    },
  ]);
}

export function updateStore(slug: string, patch: Partial<ManagedStore>) {
  commit(state.map((s) => (s.slug === slug ? { ...s, ...patch } : s)));
}

export function removeStore(slug: string) {
  commit(state.filter((s) => s.slug !== slug));
}

export function useManagedStores() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
