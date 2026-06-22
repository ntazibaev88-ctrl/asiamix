"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { calculateProgress, formatCurrency, formatDate, getDaysRemaining } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import {
  Plus, Target, Pencil, Trash2, CheckCircle2, Clock,
  TrendingUp, ArrowUpCircle, ArrowDownCircle, History,
} from "lucide-react";
import type { Goal, GoalCategory } from "@/types";

const CATEGORIES: { value: GoalCategory; label: string; emoji: string }[] = [
  { value: "house", label: "Үй", emoji: "🏠" },
  { value: "car", label: "Көлік", emoji: "🚗" },
  { value: "business", label: "Бизнес", emoji: "💼" },
  { value: "education", label: "Білім", emoji: "🎓" },
  { value: "travel", label: "Саяхат", emoji: "✈️" },
  { value: "family", label: "Отбасы", emoji: "👨‍👩‍👧" },
  { value: "health", label: "Денсаулық", emoji: "💪" },
  { value: "other", label: "Басқа", emoji: "🎯" },
];

interface Transaction {
  id: string;
  goal_id: string;
  amount: number;
  type: "deposit" | "withdraw";
  note: string | null;
  created_at: string;
}

function GoalForm({
  initial, onSave, onClose,
}: {
  initial?: Partial<Goal>;
  onSave: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    category: initial?.category || ("other" as GoalCategory),
    target_amount: initial?.target_amount?.toString() || "",
    current_amount: initial?.current_amount?.toString() || "0",
    deadline: initial?.deadline?.split("T")[0] || "",
  });

  const handleSave = async () => {
    if (!form.title || !form.target_amount) {
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const payload = {
        title: form.title,
        description: form.description || null,
        category: form.category,
        target_amount: parseFloat(form.target_amount),
        current_amount: parseFloat(form.current_amount) || 0,
        deadline: form.deadline || null,
        user_id: user.id,
        status: "active",
      };
      if (initial?.id) {
        await supabase.from("goals").update(payload).eq("id", initial.id);
        toast.success("Мақсат жаңартылды");
      } else {
        await supabase.from("goals").insert(payload);
        toast.success("Мақсат қосылды");
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
        <Label>Атауы *</Label>
        <Input placeholder="Мысалы: Үй сатып алу" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Санат</Label>
        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as GoalCategory })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Мақсатты сома (₸) *</Label>
          <Input type="number" placeholder="5 000 000" value={form.target_amount}
            onChange={(e) => setForm({ ...form, target_amount: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Ағымдағы сома (₸)</Label>
          <Input type="number" placeholder="0" value={form.current_amount}
            onChange={(e) => setForm({ ...form, current_amount: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Мерзім (міндетті емес)</Label>
        <Input type="date" value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Сипаттама</Label>
        <Textarea placeholder="Мақсат туралы қосымша ақпарат..." value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[80px]" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Болдырмау</Button>
        <Button variant="gradient" className="flex-1" loading={loading} onClick={handleSave}>
          {initial?.id ? "Сақтау" : "Қосу"}
        </Button>
      </div>
    </div>
  );
}

function TransactionDialog({ goal, onDone }: { goal: Goal; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"add" | "history">("add");
  const [type, setType] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("goal_transactions")
      .select("*")
      .eq("goal_id", goal.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setTransactions((data || []) as Transaction[]);
  };

  useEffect(() => {
    if (open) loadTransactions();
  }, [open]);

  const handleSubmit = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) { toast.error("Сома енгізіңіз"); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const delta = type === "deposit" ? num : -num;
      const newAmount = Math.max(0, goal.current_amount + delta);

      await supabase.from("goal_transactions").insert({
        goal_id: goal.id,
        amount: num,
        type,
        note: note || null,
      });
      await supabase.from("goals").update({ current_amount: newAmount }).eq("id", goal.id);

      toast.success(type === "deposit" ? `+${formatCurrency(num)} қосылды` : `-${formatCurrency(num)} алынды`);
      setAmount("");
      setNote("");
      onDone();
      loadTransactions();
      setTab("history");
    } catch {
      toast.error("Қате орын алды");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
          <ArrowUpCircle className="h-3.5 w-3.5" />
          Ақша
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal.title} — транзакция</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("add")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${tab === "add" ? "bg-primary-600 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
          >
            Ақша қосу/алу
          </button>
          <button
            onClick={() => { setTab("history"); loadTransactions(); }}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${tab === "history" ? "bg-primary-600 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
          >
            <History className="h-3.5 w-3.5 inline mr-1" />
            Тарих
          </button>
        </div>

        {tab === "add" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setType("deposit")}
                className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors border ${type === "deposit" ? "bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "border-[var(--border)] text-[var(--muted-foreground)]"}`}
              >
                <ArrowUpCircle className="h-4 w-4" /> Қосу (+)
              </button>
              <button
                onClick={() => setType("withdraw")}
                className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors border ${type === "withdraw" ? "bg-red-50 border-red-400 text-red-700 dark:bg-red-950/50 dark:text-red-400" : "border-[var(--border)] text-[var(--muted-foreground)]"}`}
              >
                <ArrowDownCircle className="h-4 w-4" /> Алу (-)
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[var(--secondary)] text-sm text-center">
              Ағымдағы: <strong>{formatCurrency(goal.current_amount)}</strong> / {formatCurrency(goal.target_amount)}
            </div>

            <div className="space-y-1.5">
              <Label>Сома (₸)</Label>
              <Input type="number" placeholder="10 000" value={amount}
                onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Ескерту (міндетті емес)</Label>
              <Input placeholder="Жалақы, бонус..." value={note}
                onChange={(e) => setNote(e.target.value)} />
            </div>
            <Button
              variant={type === "deposit" ? "gradient" : "destructive"}
              className="w-full"
              loading={loading}
              onClick={handleSubmit}
            >
              {type === "deposit" ? "Қосу" : "Алу"}
            </Button>
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-center text-sm text-[var(--muted-foreground)] py-8">Транзакция жоқ</p>
            ) : transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--secondary)]">
                <div className="flex items-center gap-3">
                  {t.type === "deposit"
                    ? <ArrowUpCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    : <ArrowDownCircle className="h-4 w-4 text-red-500 shrink-0" />}
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">{formatDate(t.created_at)}</p>
                    {t.note && <p className="text-xs text-[var(--muted-foreground)]">{t.note}</p>}
                  </div>
                </div>
                <span className={`font-semibold text-sm ${t.type === "deposit" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.type === "deposit" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const loadGoals = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setGoals((data || []) as Goal[]);
    setLoading(false);
  };

  useEffect(() => { loadGoals(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Мақсатты жою керек пе?")) return;
    const supabase = createClient();
    await supabase.from("goals").delete().eq("id", id);
    toast.success("Мақсат жойылды");
    loadGoals();
  };

  const handleComplete = async (goal: Goal) => {
    const supabase = createClient();
    await supabase.from("goals").update({ status: "completed", current_amount: goal.target_amount }).eq("id", goal.id);
    toast.success("Мақсат орындалды! 🎉");
    loadGoals();
  };

  const filtered = goals.filter((g) => {
    if (filter === "active") return g.status === "active";
    if (filter === "completed") return g.status === "completed";
    return true;
  });

  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current_amount, 0);
  const completed = goals.filter((g) => g.status === "completed").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Мақсаттар</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Өмірлік мақсаттарыңызды жоспарлаңыз</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient"><Plus className="h-4 w-4" />Мақсат қосу</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Жаңа мақсат</DialogTitle></DialogHeader>
            <GoalForm onSave={loadGoals} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Барлық мақсат", value: goals.length, icon: Target, color: "text-primary-600" },
          { label: "Орындалды", value: completed, icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Жалпы прогресс", value: `${calculateProgress(totalCurrent, totalTarget)}%`, icon: TrendingUp, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
            <s.icon className={`h-5 w-5 ${s.color} mx-auto mb-2`} />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-[var(--muted-foreground)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "active", "completed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${filter === f ? "bg-primary-600 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
            {f === "all" ? "Барлығы" : f === "active" ? "Белсенді" : "Орындалды"}
          </button>
        ))}
      </div>

      {/* Goals */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Target className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Мақсат табылмады</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const daysLeft = goal.deadline ? getDaysRemaining(goal.deadline) : null;
            const cat = CATEGORIES.find((c) => c.value === goal.category);

            return (
              <div key={goal.id} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{cat?.emoji || "🎯"}</div>
                    <div>
                      <div className="font-semibold">{goal.title}</div>
                      <div className="text-sm text-[var(--muted-foreground)]">{cat?.label}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={goal.status === "completed" ? "success" : "default"}>
                      {goal.status === "completed" ? "✓ Орындалды" : "Белсенді"}
                    </Badge>
                    <button onClick={() => setEditGoal(goal)}
                      className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(goal.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-[var(--muted-foreground)] hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">{goal.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Прогресс</span>
                    <span className="font-medium">{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
                  </div>
                  <Progress value={progress} color={progress === 100 ? "success" : "default"} />
                  <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                    <span>{progress}% орындалды</span>
                    {daysLeft !== null && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {daysLeft > 0 ? `${daysLeft} күн қалды` : "Мерзімі өтті"}
                      </span>
                    )}
                  </div>
                </div>

                {goal.status === "active" && (
                  <div className="flex gap-2 flex-wrap">
                    <TransactionDialog goal={goal} onDone={loadGoals} />
                    {progress < 100 && (
                      <Button size="sm" variant="outline"
                        onClick={() => handleComplete(goal)}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Орындалды
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!editGoal} onOpenChange={(open) => !open && setEditGoal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Мақсатты өзгерту</DialogTitle></DialogHeader>
          {editGoal && <GoalForm initial={editGoal} onSave={loadGoals} onClose={() => setEditGoal(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
