"use client";

import { useSyncExternalStore } from "react";

// Customer product reviews (rating + text), persisted locally.
export interface Review {
  rating: number;
  text: string;
  author: string;
  at: number;
}

type State = Record<number, Review[]>;

const KEY = "nomi.reviews";
const listeners = new Set<() => void>();
let state: State = {};
let loaded = false;
const EMPTY: Review[] = [];

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

export function addReview(productId: number, r: Omit<Review, "at">) {
  const cur = state[productId] ?? [];
  commit({ ...state, [productId]: [{ ...r, at: Date.now() }, ...cur] });
}

export function useReviews(productId: number): Review[] {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return all[productId] ?? EMPTY;
}
