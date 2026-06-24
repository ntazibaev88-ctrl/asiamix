"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import {
  Save, Megaphone, LayoutDashboard, Trophy, CreditCard,
  ToggleLeft, ToggleRight, Lightbulb, Plus, Trash2, Target,
} from "lucide-react";

type Settings = Record<string, string>;
interface Tip { tip: string; emoji: string }
interface Category { key: string; label: string; icon: string }

const COLOR_OPTIONS = [
  { value: "blue",    label: "Көк",     cls: "bg-blue-500" },
  { value: "amber",   label: "Сары",    cls: "bg-amber-500" },
  { value: "emerald", label: "Жасыл",   cls: "bg-emerald-500" },
  { value: "red",     label: "Қызыл",   cls: "bg-red-500" },
];

const ANNOUNCEMENT_COLORS: Record<string, string> = {
  blue:    "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200",
  amber:   "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200",
  red:     "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200",
};

export default function AdminSitePage() {
  const [settings, setSettings] = useState<Settings>({});
  const [tips, setTips] = useState<Tip[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    if (data) {
      const map: Settings = {};
      for (const row of data) map[row.key] = row.value;
      setSettings(map);
      try { setTips(JSON.parse(map["daily_tips"] || "[]")); } catch { setTips([]); }
      try { setCategories(JSON.parse(map["goal_categories"] || "[]")); } catch { setCategories([]); }
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (key: string, value: string) =>
    setSettings((p) => ({ ...p, [key]: value }));

  const toggle = (key: string) =>
    set(key, settings[key] === "true" ? "false" : "true");

  const save = async (keys: string[]) => {
    setSaving(true);
    try {
      const supabase = createClient();
      for (const key of keys) {
        const { error } = await supabase.from("site_settings").upsert({
          key, value: settings[key] ?? "", updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      toast.success("Сақталды");
    } catch {
      toast.error("Сақтау қатесі");
    } finally {
      setSaving(false);
    }
  };

  const saveTips = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("site_settings").upsert({
        key: "daily_tips", value: JSON.stringify(tips), updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Кеңестер сақталды");
    } catch { toast.error("Қате"); } finally { setSaving(false); }
  };

  const saveCategories = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("site_settings").upsert({
        key: "goal_categories", value: JSON.stringify(categories), updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Категориялар сақталды");
    } catch { toast.error("Қате"); } finally { setSaving(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-sm text-[var(--muted-foreground)]">Жүктелуде...</div>;
  }

  const ToggleBtn = ({ settingKey, label }: { settingKey: string; label: string }) => {
    const on = settings[settingKey] === "true";
    return (
      <button
        onClick={() => toggle(settingKey)}
        className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-[var(--secondary)] transition-colors"
      >
        <span className="text-sm font-medium">{label}</span>
        {on
          ? <ToggleRight className="h-6 w-6 text-primary-600" />
          : <ToggleLeft className="h-6 w-6 text-[var(--muted-foreground)]" />}
      </button>
    );
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Сайт баптаулары</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Сайт мазмұнын осы жерден басқарыңыз</p>
      </div>

      {/* ─── Announcement ─── */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <SectionHeader icon={<Megaphone className="h-4 w-4 text-amber-500" />} bg="bg-amber-500/10"
          title="Хабарландыру баннері"
          desc="Барлық пайдаланушының басты бетінде шығады (бос болса жасырылады)" />
        <div className="space-y-1.5">
          <Label>Мәтін</Label>
          <Textarea value={settings["announcement"] ?? ""} onChange={(e) => set("announcement", e.target.value)}
            placeholder="Жаңа функционал қосылды!.." className="min-h-[70px]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map((c) => (
            <button key={c.value} onClick={() => set("announcement_color", c.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${settings["announcement_color"] === c.value ? "border-[var(--foreground)] bg-[var(--secondary)]" : "border-[var(--border)]"}`}>
              <span className={`w-3 h-3 rounded-full ${c.cls}`} />{c.label}
            </button>
          ))}
        </div>
        {settings["announcement"] && (
          <div className={`p-3 rounded-xl border text-sm ${ANNOUNCEMENT_COLORS[settings["announcement_color"] || "blue"]}`}>
            📢 {settings["announcement"]}
          </div>
        )}
        <SaveBtn onClick={() => save(["announcement", "announcement_color"])} loading={saving} />
      </section>

      {/* ─── Dashboard Content ─── */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <SectionHeader icon={<LayoutDashboard className="h-4 w-4 text-primary-500" />} bg="bg-primary-500/10"
          title="Басты бет мазмұны"
          desc="Пайдаланушы амандасуының астындағы жазу" />
        <div className="space-y-1.5">
          <Label>Қош келдіңіз мәтіні</Label>
          <Input value={settings["dashboard_subtitle"] ?? ""} onChange={(e) => set("dashboard_subtitle", e.target.value)}
            placeholder="Бүгін де алға қарай жыл!" />
        </div>
        <SaveBtn onClick={() => save(["dashboard_subtitle"])} loading={saving} />
      </section>

      {/* ─── Blocks toggle ─── */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-2">
        <SectionHeader icon={<ToggleRight className="h-4 w-4 text-violet-500" />} bg="bg-violet-500/10"
          title="Блоктарды көрсету / жасыру"
          desc="Басты беттегі секцияларды қосып-өшіріңіз" />
        <div className="divide-y divide-[var(--border)]">
          <ToggleBtn settingKey="show_tips_block"      label="🔥 Бүгінгі кеңес" />
          <ToggleBtn settingKey="show_challenge_block" label="🏆 Апта челленджі" />
          <ToggleBtn settingKey="show_articles_block"  label="📰 Пайдалы мақалалар" />
          <ToggleBtn settingKey="show_news_block"      label="🌐 Қаржылық жаңалықтар" />
        </div>
        <SaveBtn onClick={() => save(["show_tips_block", "show_challenge_block", "show_articles_block", "show_news_block"])} loading={saving} />
      </section>

      {/* ─── Weekly Challenge ─── */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <SectionHeader icon={<Trophy className="h-4 w-4 text-violet-500" />} bg="bg-violet-500/10"
          title="Апта челленджі" desc="Басты беттегі прогресс блогы" />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Тақырыбы</Label>
            <Input value={settings["challenge_title"] ?? ""} onChange={(e) => set("challenge_title", e.target.value)} placeholder="Апта челленджі" />
          </div>
          <div className="space-y-1.5">
            <Label>Сипаттамасы</Label>
            <Textarea value={settings["challenge_desc"] ?? ""} onChange={(e) => set("challenge_desc", e.target.value)} className="min-h-[70px]" />
          </div>
          <div className="space-y-1.5">
            <Label>Прогресс %</Label>
            <div className="flex items-center gap-3">
              <Input type="number" min={0} max={100} value={settings["challenge_progress"] ?? "0"}
                onChange={(e) => set("challenge_progress", e.target.value)} className="w-24" />
              <div className="flex-1 h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: `${Math.min(100, Number(settings["challenge_progress"]) || 0)}%` }} />
              </div>
              <span className="text-sm font-bold text-primary-600 w-10">{settings["challenge_progress"] || 0}%</span>
            </div>
          </div>
        </div>
        <SaveBtn onClick={() => save(["challenge_title", "challenge_desc", "challenge_progress"])} loading={saving} />
      </section>

      {/* ─── Kaspi Details ─── */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <SectionHeader icon={<CreditCard className="h-4 w-4 text-emerald-500" />} bg="bg-emerald-500/10"
          title="Kaspi реквизиттері" desc="VIP сатып алу бетінде көрінеді" />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Телефон нөмірі</Label>
            <Input value={settings["kaspi_phone"] ?? ""} onChange={(e) => set("kaspi_phone", e.target.value)} placeholder="+7 771 412 15 73" />
          </div>
          <div className="space-y-1.5">
            <Label>Карта нөмірі</Label>
            <Input value={settings["kaspi_card"] ?? ""} onChange={(e) => set("kaspi_card", e.target.value)} placeholder="4400 4303 3787 7838" />
          </div>
          <div className="space-y-1.5">
            <Label>Алушының аты</Label>
            <Input value={settings["kaspi_recipient"] ?? ""} onChange={(e) => set("kaspi_recipient", e.target.value)} placeholder="Fariza T" />
          </div>
        </div>
        <SaveBtn onClick={() => save(["kaspi_phone", "kaspi_card", "kaspi_recipient"])} loading={saving} />
      </section>

      {/* ─── Daily Tips ─── */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <SectionHeader icon={<Lightbulb className="h-4 w-4 text-amber-500" />} bg="bg-amber-500/10"
          title="Күнделікті кеңестер" desc="Басты бетте ротациямен шығатын кеңестер" />
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Input value={tip.emoji} onChange={(e) => setTips((p) => p.map((t, j) => j === i ? { ...t, emoji: e.target.value } : t))}
                className="w-14 text-center text-lg shrink-0" placeholder="💡" />
              <Textarea value={tip.tip} onChange={(e) => setTips((p) => p.map((t, j) => j === i ? { ...t, tip: e.target.value } : t))}
                className="flex-1 min-h-[60px] text-sm" />
              <button onClick={() => setTips((p) => p.filter((_, j) => j !== i))}
                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-[var(--muted-foreground)] hover:text-red-500 transition-colors shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setTips((p) => [...p, { emoji: "💡", tip: "" }])}>
            <Plus className="h-4 w-4" /> Кеңес қосу
          </Button>
        </div>
        <SaveBtn onClick={saveTips} loading={saving} />
      </section>

      {/* ─── Goal Categories ─── */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <SectionHeader icon={<Target className="h-4 w-4 text-primary-500" />} bg="bg-primary-500/10"
          title="Мақсат категориялары" desc="Пайдаланушылар мақсат қосқанда осы тізімнен таңдайды" />
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input value={cat.icon} onChange={(e) => setCategories((p) => p.map((c, j) => j === i ? { ...c, icon: e.target.value } : c))}
                className="w-14 text-center text-lg shrink-0" placeholder="🏠" />
              <Input value={cat.label} onChange={(e) => setCategories((p) => p.map((c, j) => j === i ? { ...c, label: e.target.value } : c))}
                className="flex-1" placeholder="Атауы" />
              <Input value={cat.key} onChange={(e) => setCategories((p) => p.map((c, j) => j === i ? { ...c, key: e.target.value } : c))}
                className="w-28 text-xs text-[var(--muted-foreground)]" placeholder="key" />
              <button onClick={() => setCategories((p) => p.filter((_, j) => j !== i))}
                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-[var(--muted-foreground)] hover:text-red-500 transition-colors shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCategories((p) => [...p, { key: "", label: "", icon: "🎯" }])}>
            <Plus className="h-4 w-4" /> Категория қосу
          </Button>
        </div>
        <SaveBtn onClick={saveCategories} loading={saving} />
      </section>
    </div>
  );
}

function SectionHeader({ icon, bg, title, desc }: { icon: React.ReactNode; bg: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-xs text-[var(--muted-foreground)]">{desc}</p>
      </div>
    </div>
  );
}

function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <Button variant="gradient" size="sm" loading={loading} onClick={onClick}>
      <Save className="h-4 w-4" /> Сақтау
    </Button>
  );
}
