"use client";

import { useSyncExternalStore } from "react";

// Customer account (demo). Stored in localStorage; replace with Supabase phone
// auth later. Includes a loyalty rating shown in the profile.

export interface NomiUser {
  name: string;
  phone: string;
  rating: number; // customer reliability rating
  points: number; // loyalty points
  cashback: number; // ₸
  level: string; // loyalty tier
}

const KEY = "nomi.user";
const listeners = new Set<() => void>();
let cache: NomiUser | null = null;
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as NomiUser) : null;
  } catch {
    cache = null;
  }
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): NomiUser | null {
  load();
  return cache;
}

function getServerSnapshot(): NomiUser | null {
  return null;
}

export function signIn(name: string, phone: string) {
  cache = {
    name,
    phone,
    rating: 5.0,
    points: 1250,
    cashback: 860,
    level: "NOMI Gold",
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function signOut() {
  cache = null;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function useUser(): NomiUser | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
