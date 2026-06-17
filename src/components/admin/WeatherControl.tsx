"use client";

import { CloudRain } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { weatherInfo } from "@/lib/delivery";
import {
  useWeatherSetting,
  setWeatherSetting,
  useEffectiveWeather,
  type WeatherSetting,
} from "@/lib/weather";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const options: WeatherSetting[] = ["auto", "normal", "medium", "high"];

export function WeatherControl() {
  const { t } = useI18n();
  const setting = useWeatherSetting();
  const effective = useEffectiveWeather();
  const fee = weatherInfo[effective].fee;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-info-soft text-info">
          <CloudRain size={20} />
        </span>
        <div>
          <div className="font-display text-base font-bold">
            {t("admin.weatherTitle")}
          </div>
          <div className="text-xs text-muted">{t("admin.weatherNote")}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setWeatherSetting(o)}
            className={cn(
              "rounded-xl border px-2 py-2 text-sm font-semibold transition-colors cursor-pointer",
              setting === o
                ? "border-brand bg-brand text-brand-fg"
                : "border-border text-muted hover:text-fg",
            )}
          >
            {t(o === "auto" ? "weather.auto" : `weather.${o}`)}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2 text-sm">
        <span className="text-muted">
          {t("admin.current")}: <b className="text-fg">{t(`weather.${effective}`)}</b>
        </span>
        <span className="font-bold">
          {fee > 0 ? `+${formatPrice(fee)}` : formatPrice(0)}
        </span>
      </div>
    </Card>
  );
}
