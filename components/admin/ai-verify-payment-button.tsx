"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { Sparkles, Ban, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AIVerifyPaymentButtonProps {
  paymentId: string;
  proofUrl: string;
  userId: string;
  aiVerdict?: string | null;
  aiNotes?: string | null;
}

export function AIVerifyPaymentButton({
  paymentId,
  proofUrl,
  userId,
  aiVerdict,
  aiNotes,
}: AIVerifyPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState(aiVerdict);
  const [notes, setNotes] = useState(aiNotes);
  const [banning, setBanning] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, proofUrl }),
      });
      const data = await res.json() as {
        verdict?: string;
        notes?: string;
        error?: string;
        reason?: string;
      };
      if (data.error) {
        toast.error("Қате: " + data.error);
        return;
      }
      setVerdict(data.verdict || null);
      setNotes(data.notes || data.reason || null);
      if (data.verdict === "approved") {
        toast.success("AI расталды! VIP белсендірілді.");
      } else if (data.verdict === "rejected") {
        toast.error("AI қабылдамады: " + (data.notes || data.reason || ""));
      } else {
        toast.success("AI тексерді: " + (data.verdict || ""));
      }
      router.refresh();
    } catch {
      toast.error("Тексеру сәтсіз болды");
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    if (!confirm("Бұл пайдаланушыны бан тізіміне қосасыз ба?")) return;
    setBanning(true);
    try {
      const supabase = createClient();
      await supabase.from("blacklist").insert({
        user_id: userId,
        reason: `AI тексеру: ${notes || "алаяқ чек"}`,
      });
      await supabase.from("profiles").update({ role: "blocked" }).eq("id", userId);
      toast.success("Пайдаланушы бан тізіміне қосылды");
      router.refresh();
    } catch {
      toast.error("Бан қосу сәтсіз болды");
    } finally {
      setBanning(false);
    }
  };

  if (verdict) {
    return (
      <div className="space-y-1.5">
        {verdict === "approved" && (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs font-medium">AI расталды</span>
          </div>
        )}
        {verdict === "rejected" && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-red-500">
              <XCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs font-medium">AI қабылдамады</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-orange-500 hover:text-orange-600 h-6 px-2 text-xs"
              onClick={handleBan}
              disabled={banning}
            >
              <Ban className="h-3 w-3 mr-1" />
              Бан
            </Button>
          </div>
        )}
        {verdict === "uncertain" && (
          <div className="flex items-center gap-1.5 text-amber-500">
            <HelpCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs font-medium">Анықсыз</span>
          </div>
        )}
        {notes && (
          <p className="text-xs text-[var(--muted-foreground)] max-w-[200px] truncate" title={notes}>
            {notes}
          </p>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="text-[var(--muted-foreground)] h-6 px-2 text-xs"
          onClick={handleVerify}
          disabled={loading}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Қайта тексеру
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1.5 text-violet-600 border-violet-200 hover:bg-violet-50 dark:hover:bg-violet-950/30"
      loading={loading}
      onClick={handleVerify}
    >
      <Sparkles className="h-3.5 w-3.5" />
      AI тексеру
    </Button>
  );
}
