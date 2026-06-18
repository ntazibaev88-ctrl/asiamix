"use client";

import { useSyncExternalStore } from "react";

// Admin broadcast shown to customers on the home page.
const KEY = "nomi.announcement";
const listeners = new Set<() => void>();
let text: string | null = null;
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    text = localStorage.getItem(KEY);
  } catch {
    text = null;
  }
}

function commit(next: string | null) {
  text = next;
  try {
    if (next) localStorage.setItem(KEY, next);
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
  return text;
}

function getServerSnapshot() {
  return null;
}

export function setAnnouncement(msg: string | null) {
  commit(msg);
}

export function useAnnouncement() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
