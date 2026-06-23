"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { Plus, Pencil, Trash2, Crown, Eye, EyeOff, Film } from "lucide-react";

const CATEGORIES = [
  { value: "money", label: "Ақша" },
  { value: "business", label: "Бизнес" },
  { value: "success", label: "Табыс" },
  { value: "investing", label: "Инвестиция" },
  { value: "documentary", label: "Документал" },
];

function MovieForm({ initial, onSave, onClose }: { initial?: Record<string, unknown>; onSave: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: (initial?.title as string) || "",
    director: (initial?.director as string) || "",
    description: (initial?.description as string) || "",
    poster_url: (initial?.poster_url as string) || "",
    banner_url: (initial?.banner_url as string) || "",
    video_url: (initial?.video_url as string) || "",
    watch_url: (initial?.watch_url as string) || "",
    trailer_url: (initial?.trailer_url as string) || "",
    category: (initial?.category as string) || "money",
    year: String(initial?.year || ""),
    rating: String(initial?.rating || ""),
    duration: String(initial?.duration || ""),
    xp_reward: String(initial?.xp_reward || ""),
    is_premium: Boolean(initial?.is_premium),
    published: initial?.published !== undefined ? Boolean(initial.published) : true,
  });

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Атауы міндетті");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        title: form.title,
        director: form.director || null,
        description: form.description || null,
        poster_url: form.poster_url || null,
        banner_url: form.banner_url || null,
        video_url: form.video_url || null,
        watch_url: form.watch_url || null,
        trailer_url: form.trailer_url || null,
        category: form.category,
        year: form.year ? parseInt(form.year) : null,
        rating: form.rating ? parseFloat(form.rating) : null,
        duration: form.duration ? parseInt(form.duration) : null,
        xp_reward: form.xp_reward ? parseInt(form.xp_reward) : null,
        is_premium: form.is_premium,
        published: form.published,
      };

      if (initial?.id) {
        const { error } = await supabase.from("movies").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Фильм жаңартылды");
      } else {
        const { error } = await supabase.from("movies").insert(payload);
        if (error) throw error;
        toast.success("Фильм қосылды");
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
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="space-y-1.5">
        <Label>Атауы *</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Фильм атауы" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Режиссер</Label>
          <Input value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} placeholder="Режиссер аты" />
        </div>
        <div className="space-y-1.5">
          <Label>Жылы</Label>
          <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2023" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Санат</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Рейтинг (1-10)</Label>
          <Input type="number" min="1" max="10" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="8.5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Ұзақтығы (мин)</Label>
          <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="120" />
        </div>
        <div className="space-y-1.5">
          <Label>XP сыйақы</Label>
          <Input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: e.target.value })} placeholder="50" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Постер URL</Label>
        <Input value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} placeholder="https://..." />
      </div>
      <div className="space-y-1.5">
        <Label>Баннер URL (hero)</Label>
        <Input value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} placeholder="https://... (кең сурет)" />
      </div>
      <div className="space-y-1.5">
        <Label>Видео URL (YouTube/MP4)</Label>
        <Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=... немесе .mp4" />
      </div>
      <div className="space-y-1.5">
        <Label>Сыртқы қарау сілтемесі</Label>
        <Input value={form.watch_url} onChange={(e) => setForm({ ...form, watch_url: e.target.value })} placeholder="https://..." />
      </div>
      <div className="space-y-1.5">
        <Label>Трейлер URL</Label>
        <Input value={form.trailer_url} onChange={(e) => setForm({ ...form, trailer_url: e.target.value })} placeholder="https://..." />
      </div>
      <div className="space-y-1.5">
        <Label>Сипаттама</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Фильм туралы..." className="min-h-[80px]" />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} className="rounded" />
          Premium (VIP ғана)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
          Жарияланған
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Болдырмау</Button>
        <Button variant="gradient" className="flex-1" loading={loading} onClick={handleSave}>
          {initial?.id ? "Жаңарту" : "Қосу"}
        </Button>
      </div>
    </div>
  );
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Record<string, unknown>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<Record<string, unknown> | null>(null);

  const loadMovies = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("movies").select("*").order("created_at", { ascending: false });
    setMovies(data || []);
  };

  useEffect(() => { loadMovies(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Фильмді жою керек пе?")) return;
    const supabase = createClient();
    await supabase.from("movies").delete().eq("id", id);
    toast.success("Фильм жойылды");
    loadMovies();
  };

  const togglePublished = async (id: string, current: boolean) => {
    const supabase = createClient();
    const { error } = await supabase.from("movies").update({ published: !current }).eq("id", id);
    if (error) { toast.error("Қате орын алды"); return; }
    toast.success(!current ? "Жарияланды" : "Жасырылды");
    loadMovies();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Фильмдер</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient"><Plus className="h-4 w-4" />Фильм қосу</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Жаңа фильм</DialogTitle></DialogHeader>
            <MovieForm onSave={loadMovies} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie) => {
          const cat = CATEGORIES.find((c) => c.value === movie.category);
          const isPublished = movie.published !== false;
          return (
            <div key={movie.id as string} className={`rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden ${!isPublished ? "opacity-60" : ""}`}>
              {/* Poster preview */}
              {Boolean(movie.poster_url) && (
                <div className="aspect-video bg-gray-900">
                  <img
                    src={movie.poster_url as string}
                    alt={movie.title as string}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {!movie.poster_url && (
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Film className="h-10 w-10 text-gray-600" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{movie.title as string}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {(movie.director as string) || "—"}{movie.year ? ` • ${movie.year}` : ""}{movie.duration ? ` • ${movie.duration} мин` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => togglePublished(movie.id as string, isPublished)}
                      className={`p-1.5 rounded-lg transition-colors ${isPublished ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"}`}
                      title={isPublished ? "Жасыру" : "Жариялау"}
                    >
                      {isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => setEditMovie(movie)} className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(movie.id as string)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-[var(--muted-foreground)] hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{cat?.label}</Badge>
                  {Boolean(movie.is_premium) && <Badge variant="premium"><Crown className="h-3 w-3" /></Badge>}
                  {movie.rating != null && <span className="text-xs text-amber-600">⭐ {String(movie.rating as number)}/10</span>}
                  {!isPublished && <Badge variant="secondary" className="text-orange-500">Жасырылған</Badge>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!editMovie} onOpenChange={(open) => !open && setEditMovie(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Фильмді өзгерту</DialogTitle></DialogHeader>
          {editMovie && <MovieForm initial={editMovie} onSave={loadMovies} onClose={() => setEditMovie(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
