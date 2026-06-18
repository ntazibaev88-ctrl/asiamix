"use client";

import { useSyncExternalStore } from "react";

// Per-store products the store admin adds (with uploaded image), plus
// availability overrides for the base catalog. Persisted in localStorage so a
// store only ever manages its own items (isolation). Replace with the store's
// product table in Supabase later.

export interface CustomProduct {
  id: string;
  name: string;
  price: number;
  cat: string;
  unit: string;
  stock: number;
  image?: string; // data URL from upload
  emoji: string;
}

interface StoreData {
  custom: CustomProduct[];
  unavailable: number[]; // base catalog product ids turned off
}

type State = Record<string, StoreData>;

const KEY = "nomi.storeProducts";
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

const EMPTY: StoreData = { custom: [], unavailable: [] };
function dataFor(slug: string): StoreData {
  return state[slug] ?? EMPTY;
}

function getServerSnapshot() {
  return {} as State;
}

export function addCustomProduct(
  slug: string,
  p: Omit<CustomProduct, "id">,
) {
  const cur = dataFor(slug);
  commit({
    ...state,
    [slug]: {
      ...cur,
      custom: [{ ...p, id: `c${Date.now()}` }, ...cur.custom],
    },
  });
}

export function removeCustomProduct(slug: string, id: string) {
  const cur = dataFor(slug);
  commit({
    ...state,
    [slug]: { ...cur, custom: cur.custom.filter((c) => c.id !== id) },
  });
}

export function toggleAvailability(slug: string, productId: number) {
  const cur = dataFor(slug);
  const off = cur.unavailable.includes(productId);
  commit({
    ...state,
    [slug]: {
      ...cur,
      unavailable: off
        ? cur.unavailable.filter((x) => x !== productId)
        : [...cur.unavailable, productId],
    },
  });
}

export function useStoreData(slug: string): StoreData {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return all[slug] ?? EMPTY;
}
