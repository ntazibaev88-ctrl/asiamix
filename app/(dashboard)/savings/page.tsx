"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import { Plus, PiggyBank, TrendingUp, Calculator, Trash2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { SavingsPlan } from "@/types";

function SavingsForm({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    goal_amount: "",
    current_amount: "0",
    monthly_target: "",
    interest_rate: "10",
    deadline: "",
  });

  const months = form.goal_amount && form.monthly_target
    ? Math.ceil((parseFloat(form.goal_amount) - parseFloat(form.current_amount || "0")) / parseFloat(form.monthly_target))
    : null;

  const handleSave = async () => {
    if (!form.name || !form.goal_amount || !form.monthly_target) {
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("savings_plans").insert({
        name: form.name,
        goal_amount: parseFloat(form.goal_amount),
        current_amount: parseFloat(form.current_amount) || 0,
        monthly_target: parseFloat(form.monthly_target),
        interest_rate: parseFloat(form.interest_rate) || 0,
        deadline: form.deadline || null,
        user_id: user.id,
      });
      if (error) throw error;
      toast.success("Жинақ жоспары қосылды");
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
        <Label>Жоспар атауы *</Label>
        <Input
          placeholder="Мысалы: Үйге бастапқы жарна"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Мақсатты сома (₸) *</Label>
          <Input
            type="number"
            placeholder="5 000 000"
            value={form.goal_amount}
            onChange={(e) => setForm({ ...form, goal_amount: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Ағымдағы жинақ (₸)</Label>
          <Input
            type="number"
            placeholder="0"
            value={form.current_amount}
            onChange={(e) => setForm({ ...form, current_amount: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Айлық жинақ (₸) *</Label>
          <Input
            type="number"
            placeholder="100 000"
            value={form.monthly_target}
            onChange={(e) => setForm({ ...form, monthly_target: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Жылдық % (депозит)</Label>
          <Input
            type="number"
            placeholder="10"
            value={form.interest_rate}
            onChange={(e) => setForm({ ...form, interest_rate: e.target.value })}
          />
        </div>
      </div>

      {months && months > 0 && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
            <Calculator className="h-4 w-4" />
            <span>
              Мақсатқа жету үшін шамамен <strong>{months} ай</strong> қажет
            </span>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Мерзім (міндетті емес)</Label>
        <Input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Болдырмау</Button>
        <Button variant="gradient" className="flex-1" loading={loading} onClick={handleSave}>
          Қосу
        </Button>
      </div>
    </div>
  );
}

function generateProjection(current: number, monthly: number, rate: number, months: number) {
  const data = [];
  let balance = current;
  const monthlyRate = rate / 100 / 12;
  for (let i = 0; i <= Math.min(months, 24); i++) {
    data.push({ month: `${i}ай`, amount: Math.round(balance) });
    balance = balance * (1 + monthlyRate) + monthly;
  }
  return data;
}

export default function SavingsPage() {
  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const loadPlans = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("savings_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setPlans((data || []) as SavingsPlan[]);
    setLoading(false);
  };

  useEffect(() => { loadPlans(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Жинақ жоспарын жою керек пе?")) return;
    const supabase = createClient();
    await supabase.from("savings_plans").delete().eq("id", id);
    toast.success("Жинақ жоспары жойылды");
    loadPlans();
  };

  const totalSavings = plans.reduce((s, p) => s + p.current_amount, 0);
  const totalGoal = plans.reduce((s, p) => s + p.goal_amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Жинақ жоспарлаушы</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Қаржылық мақсаттарыңызды жоспарлаңыз
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" />
              Жоспар қосу
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Жаңа жинақ жоспары</DialogTitle>
            </DialogHeader>
            <SavingsForm onSave={loadPlans} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <PiggyBank className="h-6 w-6 mb-3 opacity-80" />
          <div className="text-2xl font-bold">{formatCurrency(totalSavings)}</div>
          <div className="text-sm opacity-80">Барлық жинақ</div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 text-white">
          <TrendingUp className="h-6 w-6 mb-3 opacity-80" />
          <div className="text-2xl font-bold">{calculateProgress(totalSavings, totalGoal)}%</div>
          <div className="text-sm opacity-80">Жалпы прогресс</div>
        </div>
      </div>

      {/* Plans */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-48 rounded-2xl shimmer" />)}
        </div>
      ) : plans.length === 0 ? (
        <div className="py-16 text-center">
          <PiggyBank className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Жинақ жоспары жоқ</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Бірінші жоспарыңызды жасаңыз</p>
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => {
            const progress = calculateProgress(plan.current_amount, plan.goal_amount);
            const months = Math.ceil(
              (plan.goal_amount - plan.current_amount) / plan.monthly_target
            );
            const chartData = generateProjection(
              plan.current_amount,
              plan.monthly_target,
              plan.interest_rate,
              months
            );

            return (
              <div key={plan.id} className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Айлық мақсат: {formatCurrency(plan.monthly_target)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xl font-bold gradient-text">{progress}%</div>
                        <div className="text-xs text-[var(--muted-foreground)]">орындалды</div>
                      </div>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Progress value={progress} color="success" className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">
                        {formatCurrency(plan.current_amount)}
                      </span>
                      <span className="font-medium">{formatCurrency(plan.goal_amount)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="p-2.5 rounded-xl bg-[var(--secondary)]">
                      <div className="font-semibold">{months > 0 ? months : 0}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">ай қалды</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--secondary)]">
                      <div className="font-semibold">{plan.interest_rate}%</div>
                      <div className="text-xs text-[var(--muted-foreground)]">жылдық %</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--secondary)]">
                      <div className="font-semibold">{formatCurrency(plan.goal_amount - plan.current_amount)}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">қалды</div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="px-6 pb-6">
                  <div className="text-sm font-medium mb-3 text-[var(--muted-foreground)]">
                    Болжамды өсу
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`grad-${plan.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₸${(v / 1000000).toFixed(1)}М`} />
                      <Tooltip
                        formatter={(v) => [formatCurrency(Number(v)), "Жинақ"]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                          color: "var(--foreground)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill={`url(#grad-${plan.id})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
