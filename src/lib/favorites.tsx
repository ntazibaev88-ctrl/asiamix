"use client";

import { useSyncExternalStore } from "react";

// Persisted set of favorite store slugs (Таңдаулы). Same external-store
// pattern as the cart.

const KEY = "nomi.favorites";
let state: string[] = [];
let loaded = false;
const listeners = new Set<() => void>();
const EMPTY: string[] = [];

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

function commit(next: string[]) {
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

export function toggleFavorite(slug: string) {
  commit(
    state.includes(slug) ? state.filter((s) => s !== slug) : [...state, slug],
  );
}

export function useFavorites() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ---- Favorite products (liked items) ----

const PKEY = "nomi.favProducts";
let pstate: number[] = [];
let ploaded = false;
const plisteners = new Set<() => void>();
const PEMPTY: number[] = [];

function pload() {
  if (ploaded) return;
  ploaded = true;
  try {
    const raw = localStorage.getItem(PKEY);
    if (raw) pstate = JSON.parse(raw);
  } catch {
    /* storage unavailable */
  }
}

function pcommit(next: number[]) {
  pstate = next;
  try {
    localStorage.setItem(PKEY, JSON.stringify(pstate));
  } catch {
    /* storage unavailable */
  }
  plisteners.forEach((l) => l());
}

function psubscribe(cb: () => void) {
  pload();
  plisteners.add(cb);
  return () => plisteners.delete(cb);
}

function pgetSnapshot() {
  pload();
  return pstate;
}

function pgetServerSnapshot() {
  return PEMPTY;
}

export function toggleFavoriteProduct(id: number) {
  pcommit(
    pstate.includes(id) ? pstate.filter((x) => x !== id) : [...pstate, id],
  );
}

export function useFavoriteProducts() {
  return useSyncExternalStore(psubscribe, pgetSnapshot, pgetServerSnapshot);
}
