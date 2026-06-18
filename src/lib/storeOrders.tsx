"use client";

import { useSyncExternalStore } from "react";
import { demoOrders, type DemoOrder } from "./mock";
import type { OrderStatus } from "./types";

// Store-side order actions: accept / reject / mark ready. Status overrides are
// persisted so the store and the rest of the demo stay in sync.

const KEY = "nomi.storeOrders";
const listeners = new Set<() => void>();
let overrides: Record<number, OrderStatus> = {};
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    overrides = raw ? JSON.parse(raw) : {};
  } catch {
    overrides = {};
  }
}

function commit(next: Record<number, OrderStatus>) {
  overrides = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(overrides));
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
  return overrides;
}

function getServerSnapshot() {
  return {} as Record<number, OrderStatus>;
}

export function setOrderStatus(num: number, status: OrderStatus) {
  commit({ ...overrides, [num]: status });
}

export function useStoreOrders(storeName: string): DemoOrder[] {
  const ov = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return demoOrders
    .filter((o) => o.store === storeName)
    .map((o) => (ov[o.num] ? { ...o, status: ov[o.num] } : o));
}
