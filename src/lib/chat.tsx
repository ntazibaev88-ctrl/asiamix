"use client";

import { useSyncExternalStore } from "react";

// Per-order chat shared between the customer and the courier (persisted in
// localStorage, so both sides see the same thread within the demo). In
// production this is Supabase Realtime on a `messages` table.

export interface ChatMsg {
  from: "client" | "courier";
  text: string;
  at: number;
}

type State = Record<string, ChatMsg[]>;

const KEY = "nomi.chat";
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
  // Cross-tab/device sync within the same browser.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

const EMPTY: ChatMsg[] = [];
function getServerSnapshot() {
  return {} as State;
}

export function sendMessage(orderId: string, from: ChatMsg["from"], text: string) {
  const t = text.trim();
  if (!t) return;
  const cur = state[orderId] ?? [];
  commit({ ...state, [orderId]: [...cur, { from, text: t, at: Date.now() }] });
}

export function useChat(orderId: string): ChatMsg[] {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return all[orderId] ?? EMPTY;
}
