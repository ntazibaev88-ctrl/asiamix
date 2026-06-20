"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import { Plus, BookMarked, Search, Smile, Tag, Trash2, Pencil, Lock } from "lucide-react";
import type { JournalEntry, Mood } from "@/types";

const MOODS: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: "great", emoji: "😄", label: "Тамаша", color: "text-emerald-500" },
  { value: "good", emoji: "😊", label: "Жақсы", color: "text-blue-500" },
  { value: "okay", emoji: "😐", label: "Қалыпты", color: "text-amber-500" },
  { value: "bad", emoji: "😔", label: "Жаман", color: "text-orange-500" },
  { value: "terrible", emoji: "😢", label: "Өте жаман", color: "text-red-500" },
];

function JournalForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<JournalEntry>;
  onSave: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title || "",
    content: initial?.content || "",
    mood: initial?.mood || null as Mood | null,
    tags: initial?.tags?.join(", ") || "",
    entry_date: initial?.entry_date?.split("T")[0] || new Date().toISOString().split("T")[0],
  });

  const handleSave = async () => {
    if (!form.content.trim()) {
      toast.error("Жазба мазмұнын жазыңыз");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const tags = form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title: form.title || null,
        content: form.content,
        mood: form.mood,
        tags,
        entry_date: form.entry_date,
        user_id: user.id,
      };

      if (initial?.id) {
        const { error } = await supabase.from("journal_entries").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Жазба жаңартылды");
      } else {
        const { error } = await supabase.from("journal_entries").insert(payload);
        if (error) throw error;
        toast.success("Жазба сақталды");
      }
      onSave();
      onClose();
    } catch {
      toast.error("Қате орын алды");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Тақырып (міндетті емес)</Label>
        <Input
          placeholder="Бүгінгі жазба..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Күй-көңіл</Label>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setForm({ ...form, mood: m.value })}
              className={`flex-1 py-2 rounded-xl border-2 transition-all text-center ${
                form.mood === m.value
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                  : "border-[var(--border)] hover:border-[var(--primary)]"
              }`}
              title={m.label}
            >
              <div className="text-xl">{m.emoji}</div>
              <div className="text-xs mt-0.5 text-[var(--muted-foreground)]">{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Жазба *</Label>
        <Textarea
          placeholder="Бүгін не болды? Не ойладыңыз?..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Тегтер (үтірмен бөліңіз)</Label>
        <Input
          placeholder="жұмыс, отбасы, денсаулық"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          icon={<Tag className="h-4 w-4" />}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Күні</Label>
        <Input
          type="date"
          value={form.entry_date}
          onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Болдырмау</Button>
        <Button variant="gradient" className="flex-1" loading={loading} onClick={handleSave}>
          {initial?.id ? "Жаңарту" : "Сақтау"}
        </Button>
      </div>
    </div>
  );
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadEntries = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false });
    setEntries((data || []) as JournalEntry[]);
    setLoading(false);
  };

  useEffect(() => { loadEntries(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Жазбаны жою керек пе?")) return;
    const supabase = createClient();
    await supabase.from("journal_entries").delete().eq("id", id);
    toast.success("Жазба жойылды");
    loadEntries();
  };

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.content.toLowerCase().includes(q) ||
      e.title?.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const moodCounts = MOODS.map((m) => ({
    ...m,
    count: entries.filter((e) => e.mood === m.value).length,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Жеке күнделік</h1>
            <div className="p-1 rounded-lg bg-[var(--secondary)]" title="Барлық жазбалар жеке">
              <Lock className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            </div>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {entries.length} жазба • Барлығы жеке және қауіпсіз
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" />
              Жазу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Жаңа жазба</DialogTitle>
            </DialogHeader>
            <JournalForm onSave={loadEntries} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mood Stats */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-3">
          <Smile className="h-4 w-4 text-[var(--muted-foreground)]" />
          <span className="text-sm font-medium">Күй-көңіл статистикасы</span>
        </div>
        <div className="flex gap-3">
          {moodCounts.map((m) => (
            <div key={m.value} className="flex-1 text-center">
              <div className="text-2xl mb-1">{m.emoji}</div>
              <div className="text-lg font-bold">{m.count}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Жазбаларды іздеу..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="h-4 w-4" />}
      />

      {/* Entries */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <BookMarked className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">
            {search ? "Жазба табылмады" : "Әлі жазба жоқ"}
          </p>
          {!search && (
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Бірінші жазбаңызды жасаңыз
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const mood = MOODS.find((m) => m.value === entry.mood);
            const isExpanded = expandedId === entry.id;
            const preview = entry.content.slice(0, 200);

            return (
              <div
                key={entry.id}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {mood && (
                      <span className="text-xl" title={mood.label}>{mood.emoji}</span>
                    )}
                    <div>
                      {entry.title && (
                        <div className="font-semibold text-sm">{entry.title}</div>
                      )}
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {formatDate(entry.entry_date)} • {formatRelativeDate(entry.entry_date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setEditEntry(entry)}
                      className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-[var(--muted-foreground)] hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                  {isExpanded ? entry.content : preview}
                  {!isExpanded && entry.content.length > 200 && (
                    <span className="text-primary-600 ml-1">...оқу</span>
                  )}
                </p>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--secondary)] text-xs text-[var(--muted-foreground)]"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editEntry} onOpenChange={(open) => !open && setEditEntry(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Жазбаны өзгерту</DialogTitle>
          </DialogHeader>
          {editEntry && (
            <JournalForm
              initial={editEntry}
              onSave={loadEntries}
              onClose={() => setEditEntry(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
