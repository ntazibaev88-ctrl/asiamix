"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { Save, Megaphone, LayoutDashboard, Trophy } from "lucide-react";

type Settings = Record<string, string>;

const COLOR_OPTIONS = [
  { value: "blue",   label: "Көк (ақпарат)",      cls: "bg-blue-500" },
  { value: "amber",  label: "Сары (ескерту)",      cls: "bg-amber-500" },
  { value: "emerald",label: "Жасыл (жетістік)",    cls: "bg-emerald-500" },
  { value: "red",    label: "Қызыл (маңызды)",     cls: "bg-red-500" },
];

export default function AdminSitePage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    if (data) {
      const map: Settings = {};
      for (const row of data) map[row.key] = row.value;
      setSettings(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (key: string, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async (keys: string[]) => {
    setSaving(true);
    try {
      const supabase = createClient();
      for (const key of keys) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key, value: settings[key] ?? "", updated_at: new Date().toISOString() });
        if (error) throw error;
      }
      toast.success("Сақталды");
    } catch {
      toast.error("Сақтау қатесі");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--muted-foreground)] text-sm">
        Жүктелуде...
      </div>
    );
  }

  const announcementPreviewColor: Record<string, string> = {
    blue:    "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200",
    amber:   "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200",
    red:     "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200",
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Сайт баптаулары</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Басты бет мазмұнын осы жерден өзгертуге болады
        </p>
      </div>

      {/* Announcement Banner */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <Megaphone className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h2 className="font-semibold">Хабарландыру баннері</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Басты бетте барлық пайдаланушыларға көрінеді (бос болса жасырылады)</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Хабарландыру мәтіні</Label>
            <Textarea
              value={settings["announcement"] ?? ""}
              onChange={(e) => set("announcement", e.target.value)}
              placeholder="Мысалы: Жаңа функционал қосылды! Калькулятор бетін тексеріп көріңіз."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Түс</Label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => set("announcement_color", c.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    settings["announcement_color"] === c.value
                      ? "border-[var(--foreground)] bg-[var(--secondary)]"
                      : "border-[var(--border)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.cls}`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {settings["announcement"] && (
            <div className={`p-3 rounded-xl border text-sm ${announcementPreviewColor[settings["announcement_color"] || "blue"]}`}>
              <span className="font-medium">Алдын ала көру: </span>
              {settings["announcement"]}
            </div>
          )}
        </div>

        <Button
          variant="gradient"
          size="sm"
          loading={saving}
          onClick={() => save(["announcement", "announcement_color"])}
        >
          <Save className="h-4 w-4" />
          Сақтау
        </Button>
      </section>

      {/* Dashboard Content */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
            <LayoutDashboard className="h-4 w-4 text-primary-500" />
          </div>
          <div>
            <h2 className="font-semibold">Басты бет мазмұны</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Амандасу блогының астындағы жазу</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Subtitle мәтін</Label>
          <Input
            value={settings["dashboard_subtitle"] ?? ""}
            onChange={(e) => set("dashboard_subtitle", e.target.value)}
            placeholder="Бүгін де алға қарай жыл!"
          />
          <p className="text-xs text-[var(--muted-foreground)]">
            Пайдаланушы атымен бірге амандасудың астына шығады
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          loading={saving}
          onClick={() => save(["dashboard_subtitle"])}
        >
          <Save className="h-4 w-4" />
          Сақтау
        </Button>
      </section>

      {/* Weekly Challenge */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
            <Trophy className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <h2 className="font-semibold">Апта челленджі</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Басты беттегі «{settings["challenge_title"] || "Апта челленджі"}» блогы</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Тақырыбы</Label>
            <Input
              value={settings["challenge_title"] ?? ""}
              onChange={(e) => set("challenge_title", e.target.value)}
              placeholder="Апта челленджі"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Сипаттамасы</Label>
            <Textarea
              value={settings["challenge_desc"] ?? ""}
              onChange={(e) => set("challenge_desc", e.target.value)}
              placeholder="Челлендж сипаттамасы..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Прогресс (0–100%)</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={0}
                max={100}
                value={settings["challenge_progress"] ?? "0"}
                onChange={(e) => set("challenge_progress", e.target.value)}
                className="w-24"
              />
              <div className="flex-1 h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Number(settings["challenge_progress"]) || 0)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-primary-600 w-10 text-right">
                {settings["challenge_progress"] || "0"}%
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="gradient"
          size="sm"
          loading={saving}
          onClick={() => save(["challenge_title", "challenge_desc", "challenge_progress"])}
        >
          <Save className="h-4 w-4" />
          Сақтау
        </Button>
      </section>
    </div>
  );
}
