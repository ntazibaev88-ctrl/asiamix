"use client";

import { useSyncExternalStore } from "react";

// The customer's most recent placed order, used for live tracking. Persisted
// in localStorage. In production this comes from the orders table.

export interface ActiveOrder {
  id: string;
  store: string;
  address: string;
  total: number;
  items: number;
  weightKg: number;
  comment?: string;
  courier: string;
  courierPhone: string;
  placedAt: number;
  etaMin: number;
  paymentMethod: "cash" | "card" | "kaspi";
  /** online payment captured into the platform wallet */
  paid: boolean;
  /** auto-confirmed once payment is captured */
  confirmed: boolean;
}

const KEY = "nomi.activeOrder";
const listeners = new Set<() => void>();
let order: ActiveOrder | null = null;
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    order = raw ? JSON.parse(raw) : null;
  } catch {
    order = null;
  }
}

function commit(next: ActiveOrder | null) {
  order = next;
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
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
  return order;
}

function getServerSnapshot() {
  return null;
}

export function placeOrder(
  data: Omit<ActiveOrder, "id" | "placedAt" | "courier" | "courierPhone"> & {
    id?: string;
  },
): ActiveOrder {
  const { id, ...rest } = data;
  const next: ActiveOrder = {
    ...rest,
    id: id ?? newOrderId(),
    placedAt: Date.now(),
    courier: "Ерлан Б.",
    courierPhone: "+7 701 555 33 22",
  };
  commit(next);
  return next;
}

export function clearActiveOrder() {
  commit(null);
}

/** Generates a short order id (kept in a lib so callers stay render-pure). */
export function newOrderId(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function useActiveOrder(): ActiveOrder | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
