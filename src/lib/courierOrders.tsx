"use client";

import { useSyncExternalStore } from "react";
import { courierJobs, type CourierJob } from "./mock";
import type { OrderStatus } from "./types";

// Courier job statuses, persisted so changing a status on the detail page is
// reflected in the list.

const KEY = "nomi.courierStatus";
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

export const FLOW: OrderStatus[] = ["accepted", "ready", "on_the_way", "delivered"];

export function nextStatus(s: OrderStatus): OrderStatus | null {
  const i = FLOW.indexOf(s);
  if (i < 0 || i >= FLOW.length - 1) return null;
  return FLOW[i + 1];
}

export function setStatus(id: number, status: OrderStatus) {
  commit({ ...overrides, [id]: status });
}

export function useCourierJobs(): CourierJob[] {
  const ov = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return courierJobs.map((j) => (ov[j.id] ? { ...j, status: ov[j.id] } : j));
}

export function useCourierJob(id: number): CourierJob | undefined {
  return useCourierJobs().find((j) => j.id === id);
}
