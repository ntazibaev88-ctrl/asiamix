"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { Cpu, Sparkles, BookOpen, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";

const CATEGORIES = [
  "investing", "bonds", "gold", "silver", "savings", "business", "personal_finance"
];

const CATEGORY_LABELS: Record<string, string> = {
  investing: "Инвестиция",
  bonds: "Облигациялар",
  gold: "Алтын",
  silver: "Күміс",
  savings: "Жинақ",
  business: "Бизнес",
  personal_finance: "Жеке қаржы",
};

interface GenerateResult {
  success?: boolean;
  title?: string;
  category?: string;
  error?: string;
}

export default function AdminAIPage() {
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<Array<{ title: string; category: string; success: boolean }>>([]);

  const generateArticle = async (count = 1) => {
    setGenerating(true);
    try {
      const newResults: Array<{ title: string; category: string; success: boolean }> = [];

      for (let i = 0; i < count; i++) {
        const res = await fetch("/api/cron/generate-articles", {
          headers: {
            authorization: `Bearer qadam-cron-secret-2026`,
          },
        });
        const data = await res.json() as GenerateResult;

        if (data.success && data.title) {
          newResults.push({ title: data.title, category: data.category || "", success: true });
          toast.success(`Мақала жарияланды: ${data.title.substring(0, 40)}...`);
        } else {
          newResults.push({ title: data.error || "Қате", category: "", success: false });
          toast.error("Мақала жасау сәтсіз болды", data.error);
        }

        // Small delay between requests
        if (i < count - 1) await new Promise((r) => setTimeout(r, 2000));
      }

      setResults((prev) => [...newResults, ...prev].slice(0, 20));
    } catch (e) {
      toast.error("Қате орын алды");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Cpu className="h-6 w-6 text-primary-600" />
          AI Басқару
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          AI агентті басқару және мақалаларды автоматты генерациялау
        </p>
      </div>

      {/* Article Generator */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold">AI Мақала Генераторы</div>
            <div className="text-xs text-[var(--muted-foreground)]">Claude AI арқылы қазақ тілінде мақала жазады</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
          <p className="text-sm font-medium mb-2">Категориялар:</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Badge key={cat} variant="secondary">{CATEGORY_LABELS[cat]}</Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button
            variant="gradient"
            loading={generating}
            onClick={() => generateArticle(1)}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            1 мақала жасау
          </Button>
          <Button
            variant="outline"
            loading={generating}
            onClick={() => generateArticle(3)}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            3 мақала жасау
          </Button>
          <Button
            variant="outline"
            loading={generating}
            onClick={() => generateArticle(7)}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            7 мақала (барлық категория)
          </Button>
        </div>
      </div>

      {/* Auto Schedule Info */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold">Автоматты кесте</h3>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] mb-3">
          Vercel Cron Job жергілікті жұмыс іркестейді. Күн сайын Алматы уақытымен 09:00-да автоматты мақала жарияланады.
        </p>
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
          <strong>Маңызды:</strong> Vercel ортасында <code>ANTHROPIC_API_KEY</code> орнатылуы керек.
          Vercel → Project → Settings → Environment Variables → <code>ANTHROPIC_API_KEY</code> қосыңыз.
        </div>
      </div>

      {/* Generation History */}
      {results.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Соңғы генерациялар</h3>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  r.success
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                    : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                }`}
              >
                {r.success ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  {r.category && (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {CATEGORY_LABELS[r.category] || r.category}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
