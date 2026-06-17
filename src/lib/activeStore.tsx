"use client";

import { useSyncExternalStore } from "react";
import { stores, type Store } from "./mock";

// Which store the logged-in store-admin is managing. Set at login; read by the
// store-admin portal so each store is isolated (an Алтын Орда admin only sees
// Алтын Орда). In production this comes from the authenticated user's
// store_id, enforced by RLS.

const KEY = "nomi.store";
const listeners = new Set<() => void>();
const DEFAULT = stores[0].slug;
let cached: string | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): string {
  try {
    cached = localStorage.getItem(KEY) || DEFAULT;
  } catch {
    cached = DEFAULT;
  }
  return cached;
}

function getServerSnapshot(): string {
  return DEFAULT;
}

export function setActiveStore(slug: string) {
  try {
    localStorage.setItem(KEY, slug);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function useActiveStore(): Store {
  const slug = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return stores.find((s) => s.slug === slug) ?? stores[0];
}
