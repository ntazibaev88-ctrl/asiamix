"use client";

import { useSyncExternalStore } from "react";
import type { OrderLine } from "./mock";

// Store-side adjustment of order item quantities (e.g. an item is out of
// stock). Reducing a quantity refunds the difference to the customer. Persisted
// per order number.

const KEY = "nomi.orderItems";
const listeners = new Set<() => void>();
// orderNum -> lineIndex -> adjusted qty
let state: Record<number, Record<number, number>> = {};
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

function commit(next: Record<number, Record<number, number>>) {
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
  return {} as Record<number, Record<number, number>>;
}

export function setLineQty(num: number, index: number, qty: number) {
  const cur = state[num] ?? {};
  commit({ ...state, [num]: { ...cur, [index]: Math.max(0, qty) } });
}

export interface AdjustedOrder {
  lines: (OrderLine & { adjustedQty: number })[];
  originalTotal: number;
  newTotal: number;
  refund: number;
}

export function useAdjustedOrder(
  num: number,
  lines: OrderLine[],
): AdjustedOrder {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ov = all[num] ?? {};
  const adjLines = lines.map((l, i) => ({
    ...l,
    adjustedQty: ov[i] ?? l.qty,
  }));
  const originalTotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const newTotal = adjLines.reduce((s, l) => s + l.price * l.adjustedQty, 0);
  return { lines: adjLines, originalTotal, newTotal, refund: originalTotal - newTotal };
}
