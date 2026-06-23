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
import { Plus, Pencil, Trash2, Crown, Eye, EyeOff, BookOpen, FileText } from "lucide-react";

const CATEGORIES = [
  { value: "money", label: "Ақша" },
  { value: "business", label: "Бизнес" },
  { value: "self_development", label: "Өзін дамыту" },
  { value: "investing", label: "Инвестиция" },
];

function BookForm({ initial, onSave, onClose }: { initial?: Record<string, unknown>; onSave: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: (initial?.title as string) || "",
    author: (initial?.author as string) || "",
    description: (initial?.description as string) || "",
    cover_url: (initial?.cover_url as string) || "",
    category: (initial?.category as string) || "money",
    rating: String(initial?.rating || ""),
    is_premium: Boolean(initial?.is_premium),
    buy_url: (initial?.buy_url as string) || "",
    pdf_url: (initial?.pdf_url as string) || "",
    pages: String(initial?.pages || ""),
    xp_reward: String(initial?.xp_reward || ""),
    published: initial?.published !== undefined ? Boolean(initial.published) : true,
  });

  const handleSave = async () => {
    if (!form.title || !form.author) {
      toast.error("Тақырыбы мен автор міндетті");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        title: form.title,
        author: form.author,
        description: form.description || null,
        cover_url: form.cover_url || null,
        category: form.category,
        rating: form.rating ? parseFloat(form.rating) : null,
        is_premium: form.is_premium,
        buy_url: form.buy_url || null,
        pdf_url: form.pdf_url || null,
        pages: form.pages ? parseInt(form.pages) : null,
        xp_reward: form.xp_reward ? parseInt(form.xp_reward) : null,
        published: form.published,
      };

      if (initial?.id) {
        const { error } = await supabase.from("books").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Кітап жаңартылды");
      } else {
        const { error } = await supabase.from("books").insert(payload);
        if (error) throw error;
        toast.success("Кітап қосылды");
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
        <Label>Тақырыбы *</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Кітап атауы" />
      </div>
      <div className="space-y-1.5">
        <Label>Автор *</Label>
        <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Автор аты" />
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
          <Label>Рейтинг (1-5)</Label>
          <Input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="4.5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Беттер саны</Label>
          <Input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} placeholder="320" />
        </div>
        <div className="space-y-1.5">
          <Label>XP сыйақы</Label>
          <Input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: e.target.value })} placeholder="30" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Мұқаба URL</Label>
        <Input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://..." />
      </div>
      <div className="space-y-1.5">
        <Label>PDF URL</Label>
        <Input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} placeholder="https://... (.pdf файл)" />
      </div>
      <div className="space-y-1.5">
        <Label>Сатып алу сілтемесі</Label>
        <Input value={form.buy_url} onChange={(e) => setForm({ ...form, buy_url: e.target.value })} placeholder="https://..." />
      </div>
      <div className="space-y-1.5">
        <Label>Сипаттама</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Кітап туралы..." className="min-h-[80px]" />
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

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Record<string, unknown>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editBook, setEditBook] = useState<Record<string, unknown> | null>(null);

  const loadBooks = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    setBooks(data || []);
  };

  useEffect(() => { loadBooks(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Кітапты жою керек пе?")) return;
    const supabase = createClient();
    await supabase.from("books").delete().eq("id", id);
    toast.success("Кітап жойылды");
    loadBooks();
  };

  const togglePublished = async (id: string, current: boolean) => {
    const supabase = createClient();
    const { error } = await supabase.from("books").update({ published: !current }).eq("id", id);
    if (error) { toast.error("Қате орын алды"); return; }
    toast.success(!current ? "Жарияланды" : "Жасырылды");
    loadBooks();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Кітаптар</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient"><Plus className="h-4 w-4" />Кітап қосу</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Жаңа кітап</DialogTitle></DialogHeader>
            <BookForm onSave={loadBooks} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => {
          const cat = CATEGORIES.find((c) => c.value === book.category);
          const isPublished = book.published !== false;
          return (
            <div key={book.id as string} className={`rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden ${!isPublished ? "opacity-60" : ""}`}>
              {/* Cover preview */}
              <div className="aspect-[3/2] bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/50 dark:to-violet-950/50 flex items-center justify-center relative">
                {Boolean(book.cover_url) ? (
                  <img
                    src={book.cover_url as string}
                    alt={book.title as string}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-10 w-10 text-primary-300" />
                )}
                {Boolean(book.pdf_url) && (
                  <span className="absolute bottom-2 left-2 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <FileText className="h-2.5 w-2.5" />PDF
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{book.title as string}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">{book.author as string}</div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => togglePublished(book.id as string, isPublished)}
                      className={`p-1.5 rounded-lg transition-colors ${isPublished ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"}`}
                      title={isPublished ? "Жасыру" : "Жариялау"}
                    >
                      {isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => setEditBook(book)} className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(book.id as string)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-[var(--muted-foreground)] hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{cat?.label}</Badge>
                  {Boolean(book.is_premium) && <Badge variant="premium"><Crown className="h-3 w-3" /></Badge>}
                  {book.rating != null && <span className="text-xs text-amber-600">⭐ {String(book.rating as number)}</span>}
                  {!isPublished && <Badge variant="secondary" className="text-orange-500">Жасырылған</Badge>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!editBook} onOpenChange={(open) => !open && setEditBook(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Кітапты өзгерту</DialogTitle></DialogHeader>
          {editBook && <BookForm initial={editBook} onSave={loadBooks} onClose={() => setEditBook(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
