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
import { Plus, Pencil, Trash2, Eye, EyeOff, Crown } from "lucide-react";

const CATEGORIES = [
  { value: "investing", label: "Инвестиция" },
  { value: "bonds", label: "Облигациялар" },
  { value: "gold", label: "Алтын" },
  { value: "silver", label: "Күміс" },
  { value: "savings", label: "Жинақ" },
  { value: "business", label: "Бизнес" },
  { value: "personal_finance", label: "Жеке қаржы" },
];

function ArticleForm({ initial, onSave, onClose }: { initial?: Record<string, unknown>; onSave: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: (initial?.title as string) || "",
    slug: (initial?.slug as string) || "",
    excerpt: (initial?.excerpt as string) || "",
    content: (initial?.content as string) || "",
    category: (initial?.category as string) || "investing",
    is_premium: Boolean(initial?.is_premium) || false,
    published: Boolean(initial?.published) !== false,
  });

  const handleSave = async () => {
    if (!form.title || !form.content || !form.slug) {
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const payload = { ...form, author_id: user.id };

      if (initial?.id) {
        const { error } = await supabase.from("articles").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Мақала жаңартылды");
      } else {
        const { error } = await supabase.from("articles").insert(payload);
        if (error) throw error;
        toast.success("Мақала қосылды");
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
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-1.5">
        <Label>Тақырыбы *</Label>
        <Input
          value={form.title}
          onChange={(e) => {
            const slug = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
            setForm({ ...form, title: e.target.value, slug });
          }}
          placeholder="Мақала тақырыбы"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Slug *</Label>
        <Input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="makala-taqyryby"
        />
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
          <Label>Мәртебесі</Label>
          <div className="flex gap-2 pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_premium}
                onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
                className="rounded"
              />
              Premium
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded"
              />
              Жариялау
            </label>
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Қысқаша сипаттама</Label>
        <Textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          placeholder="Мақала туралы қысқаша..."
          className="min-h-[60px]"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Мазмұн *</Label>
        <Textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Мақала мазмұны..."
          className="min-h-[200px]"
        />
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

export default function AdminContentPage() {
  const [articles, setArticles] = useState<Record<string, unknown>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<Record<string, unknown> | null>(null);

  const loadArticles = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    setArticles(data || []);
  };

  useEffect(() => { loadArticles(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Мақаланы жою керек пе?")) return;
    const supabase = createClient();
    await supabase.from("articles").delete().eq("id", id);
    toast.success("Мақала жойылды");
    loadArticles();
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    const supabase = createClient();
    await supabase.from("articles").update({ published: !published }).eq("id", id);
    loadArticles();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мақалалар</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" />
              Мақала қосу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader><DialogTitle>Жаңа мақала</DialogTitle></DialogHeader>
            <ArticleForm onSave={loadArticles} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--secondary)]">
            <tr>
              <th className="text-left p-4 font-semibold">Тақырыбы</th>
              <th className="text-left p-4 font-semibold">Санат</th>
              <th className="text-left p-4 font-semibold">Статус</th>
              <th className="text-left p-4 font-semibold">Қаралды</th>
              <th className="text-left p-4 font-semibold">Әрекет</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => {
              const cat = CATEGORIES.find((c) => c.value === a.category);
              return (
                <tr key={a.id as string} className="border-b border-[var(--border)] hover:bg-[var(--secondary)] transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{a.title as string}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{a.slug as string}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{cat?.label || (a.category as string)}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {a.published ? (
                        <Badge variant="success">Жарияланды</Badge>
                      ) : (
                        <Badge variant="secondary">Жасырын</Badge>
                      )}
                      {Boolean(a.is_premium) && (
                        <Badge variant="premium"><Crown className="h-3 w-3" /></Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)]">{a.views as number}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(a.id as string, a.published as boolean)}
                        className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]"
                      >
                        {a.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setEditArticle(a)}
                        className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id as string)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-[var(--muted-foreground)] hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editArticle} onOpenChange={(open) => !open && setEditArticle(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Мақаланы өзгерту</DialogTitle></DialogHeader>
          {editArticle && (
            <ArticleForm initial={editArticle} onSave={loadArticles} onClose={() => setEditArticle(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
