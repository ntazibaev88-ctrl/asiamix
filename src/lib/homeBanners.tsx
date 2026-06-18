"use client";

import { useSyncExternalStore } from "react";

export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  /** optional promo code advertised on the banner (tap-to-copy) */
  promoCode?: string;
}

export const BANNER_GRADIENTS = [
  "linear-gradient(135deg,#ff3b30,#b3160d)",
  "linear-gradient(135deg,#1fa45a,#0c6e3a)",
  "linear-gradient(135deg,#3a7afe,#1f3fae)",
  "linear-gradient(135deg,#f59e0b,#b45309)",
  "linear-gradient(135deg,#a78bfa,#7c3aed)",
];

const DEFAULTS: HomeBanner[] = [
  { id: "b0", title: "Жеткізуге −90%", subtitle: "Промокодпен · бірінші тапсырыс", emoji: "🛵", gradient: BANNER_GRADIENTS[1], promoCode: "DOSTAVKA90" },
  { id: "b1", title: "Coca-Cola 0.5л ТЕГІН", subtitle: "4500₸-дан тапсырысқа", emoji: "🥤", gradient: BANNER_GRADIENTS[0] },
  { id: "b2", title: "Жеткізу ТЕГІН", subtitle: "5000₸-нан бастап", emoji: "🚀", gradient: BANNER_GRADIENTS[2] },
  { id: "b3", title: "5% кэшбэк", subtitle: "әр тапсырыстан", emoji: "💰", gradient: BANNER_GRADIENTS[3] },
];

const KEY = "nomi.homeBanners";
const listeners = new Set<() => void>();
let state: HomeBanner[] | null = null;
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : DEFAULTS;
  } catch {
    state = DEFAULTS;
  }
}

function commit(next: HomeBanner[]) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
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
  return state ?? DEFAULTS;
}

function getServerSnapshot() {
  return DEFAULTS;
}

export function addBanner(b: Omit<HomeBanner, "id">) {
  commit([{ ...b, id: `b${Date.now()}` }, ...getSnapshot()]);
}

export function removeBanner(id: string) {
  commit(getSnapshot().filter((b) => b.id !== id));
}

export function useHomeBanners(): HomeBanner[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
