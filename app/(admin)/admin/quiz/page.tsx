"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toaster";
import { Plus, Pencil, Trash2, Brain, CheckCircle } from "lucide-react";

type Quiz = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  xp: number;
  is_active: boolean;
  created_at: string;
};

const EMPTY_FORM = {
  question: "",
  option_0: "",
  option_1: "",
  option_2: "",
  option_3: "",
  correct_index: 0,
  explanation: "",
  xp: 10,
};

function QuizForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Quiz;
  onSave: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(
    initial
      ? {
          question: initial.question,
          option_0: initial.options[0] || "",
          option_1: initial.options[1] || "",
          option_2: initial.options[2] || "",
          option_3: initial.options[3] || "",
          correct_index: initial.correct_index,
          explanation: initial.explanation || "",
          xp: initial.xp || 10,
        }
      : EMPTY_FORM
  );

  const handleSave = async () => {
    if (!form.question.trim()) return toast.error("Сұрақ жазыңыз");
    if (!form.option_0 || !form.option_1 || !form.option_2 || !form.option_3)
      return toast.error("Барлық 4 жауапты толтырыңыз");

    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        question: form.question,
        options: [form.option_0, form.option_1, form.option_2, form.option_3],
        correct_index: form.correct_index,
        explanation: form.explanation,
        xp: form.xp,
        is_active: true,
      };

      if (initial?.id) {
        const { error } = await supabase.from("financial_quizzes").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Ойын жаңартылды");
      } else {
        const { error } = await supabase.from("financial_quizzes").insert(payload);
        if (error) throw error;
        toast.success("Ойын қосылды");
      }
      onSave();
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Қате орын алды";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="space-y-1.5">
        <Label>Сұрақ *</Label>
        <Textarea
          placeholder="Инфляция дегеніміз не?"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Жауаптар (дұрыс жауапты белгілеңіз) *</Label>
        {[0, 1, 2, 3].map((i) => {
          const key = `option_${i}` as keyof typeof form;
          return (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, correct_index: i })}
                className={`w-7 h-7 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  form.correct_index === i
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-[var(--border)]"
                }`}
              >
                {form.correct_index === i && <CheckCircle className="h-4 w-4 text-white" />}
              </button>
              <Input
                placeholder={`${i + 1}-жауап`}
                value={form[key] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          );
        })}
        <p className="text-xs text-[var(--muted-foreground)]">
          Жасыл дөңгелек = дұрыс жауап
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Түсіндірме</Label>
        <Textarea
          placeholder="Дұрыс жауаптың түсіндірмесі..."
          value={form.explanation}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>XP ұпай</Label>
        <Input
          type="number"
          value={form.xp}
          onChange={(e) => setForm({ ...form, xp: Number(e.target.value) })}
          min={1}
          max={100}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Болдырмау
        </Button>
        <Button variant="gradient" className="flex-1" loading={loading} onClick={handleSave}>
          {initial?.id ? "Жаңарту" : "Қосу"}
        </Button>
      </div>
    </div>
  );
}

export default function AdminQuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("financial_quizzes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Кесте табылмады. Supabase-те financial_quizzes кестесін жасаңыз.");
    }
    setQuizzes((data || []) as Quiz[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Ойынды жою керек пе?")) return;
    const supabase = createClient();
    await supabase.from("financial_quizzes").delete().eq("id", id);
    toast.success("Ойын жойылды");
    load();
  };

  const handleToggle = async (quiz: Quiz) => {
    const supabase = createClient();
    await supabase
      .from("financial_quizzes")
      .update({ is_active: !quiz.is_active })
      .eq("id", quiz.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-violet-500" />
            Қаржы сауаттылығы ойындары
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {quizzes.length} сұрақ • Күнделікті ойын
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" /> Ойын қосу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Жаңа сұрақ қосу</DialogTitle>
            </DialogHeader>
            <QuizForm onSave={load} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* SQL hint */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400">
        <strong>Ескерту:</strong> Алдымен Supabase-те мына SQL орындаңыз:
        <pre className="mt-2 text-xs bg-black/10 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{`CREATE TABLE IF NOT EXISTS financial_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options text[] NOT NULL,
  correct_index int NOT NULL DEFAULT 0,
  explanation text DEFAULT '',
  xp int DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE financial_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access" ON financial_quizzes USING (true) WITH CHECK (true);`}</pre>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="py-16 text-center">
          <Brain className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-30" />
          <p className="text-[var(--muted-foreground)]">Ойын жоқ</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Жоғарыдан «Ойын қосу» батырмасын басыңыз
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz, idx) => (
            <div
              key={quiz.id}
              className={`p-5 rounded-2xl bg-[var(--card)] border transition-all ${
                quiz.is_active ? "border-[var(--border)]" : "border-[var(--border)] opacity-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">
                      #{idx + 1}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">+{quiz.xp} XP</span>
                    {!quiz.is_active && (
                      <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                        Өшірулі
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-sm mb-3">{quiz.question}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quiz.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`text-xs px-3 py-1.5 rounded-lg border ${
                          i === quiz.correct_index
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                            : "border-[var(--border)] text-[var(--muted-foreground)]"
                        }`}
                      >
                        {i === quiz.correct_index && "✓ "}
                        {opt}
                      </div>
                    ))}
                  </div>
                  {quiz.explanation && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
                      💡 {quiz.explanation}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setEditQuiz(quiz)}
                    className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggle(quiz)}
                    className={`p-1.5 rounded-lg transition-colors text-xs font-medium ${
                      quiz.is_active
                        ? "hover:bg-amber-50 dark:hover:bg-amber-950 text-amber-500"
                        : "hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-500"
                    }`}
                    title={quiz.is_active ? "Өшіру" : "Қосу"}
                  >
                    {quiz.is_active ? "⏸" : "▶"}
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-[var(--muted-foreground)] hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editQuiz} onOpenChange={(open) => !open && setEditQuiz(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ойынды өзгерту</DialogTitle>
          </DialogHeader>
          {editQuiz && (
            <QuizForm
              initial={editQuiz}
              onSave={load}
              onClose={() => setEditQuiz(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
