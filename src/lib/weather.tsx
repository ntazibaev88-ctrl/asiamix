"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Weather } from "./delivery";

// Weather coefficient for delivery. By default it is detected automatically
// (Open-Meteo, no API key, browser-side). The Super Admin can override it from
// the admin panel. The customer never picks it — the surcharge is applied
// silently into the delivery fee.

export type WeatherSetting = Weather | "auto";

const KEY = "nomi.weather";
const listeners = new Set<() => void>();
let setting: WeatherSetting = "auto";
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY) as WeatherSetting | null;
    if (raw) setting = raw;
  } catch {
    /* ignore */
  }
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): WeatherSetting {
  load();
  return setting;
}

function getServerSnapshot(): WeatherSetting {
  return "auto";
}

export function setWeatherSetting(value: WeatherSetting) {
  setting = value;
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useWeatherSetting(): WeatherSetting {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Map Open-Meteo current conditions (Astana) to a surcharge level.
function classify(code: number, wind: number, precip: number): Weather {
  if (code >= 95 || (code >= 71 && code <= 86) || wind >= 45) return "high";
  if (code >= 51 || precip > 0 || wind >= 25) return "medium";
  return "normal";
}

let autoCache: Weather | null = null;

async function detectWeather(): Promise<Weather> {
  if (autoCache) return autoCache;
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=51.16&longitude=71.47&current=weather_code,wind_speed_10m,precipitation",
    );
    const j = await res.json();
    const c = j?.current ?? {};
    autoCache = classify(
      Number(c.weather_code ?? 0),
      Number(c.wind_speed_10m ?? 0),
      Number(c.precipitation ?? 0),
    );
    return autoCache;
  } catch {
    return "normal";
  }
}

/** Effective weather applied to delivery: admin override or auto-detected. */
export function useEffectiveWeather(): Weather {
  const s = useWeatherSetting();
  const [auto, setAuto] = useState<Weather>("normal");

  useEffect(() => {
    if (s !== "auto") return;
    let active = true;
    detectWeather().then((w) => {
      if (active) setAuto(w);
    });
    return () => {
      active = false;
    };
  }, [s]);

  return s === "auto" ? auto : s;
}
