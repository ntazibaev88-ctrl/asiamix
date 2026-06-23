"use client";

import { useState, useEffect } from "react";
import { Gift, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DailyBonus({ streak }: { streak: number }) {
  const today = new Date().toDateString();
  const bonusKey = `bonus_${today}`;

  const [claimed, setClaimed] = useState(false);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    setClaimed(localStorage.getItem(bonusKey) === "1");
  }, [bonusKey]);

  const handleClaim = () => {
    localStorage.setItem(bonusKey, "1");
    setClaimed(true);
    setPopped(true);
    setTimeout(() => setPopped(false), 600);
  };

  const weekProgress = Math.min(streak % 7 || (streak > 0 ? 7 : 0), 7);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/20 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold">🎁 Күнделікті бонус</p>
            <div className="flex items-center gap-1 text-sm text-orange-400 mt-0.5">
              <Flame className="h-3.5 w-3.5" />
              <span>{streak} күн қатарынан!</span>
            </div>
          </div>
        </div>
        {claimed ? (
          <div className="text-right">
            <div className="text-emerald-400 font-semibold text-sm">✅ Алдыңыз!</div>
            <div className="text-xs text-[var(--muted-foreground)]">+5 XP</div>
          </div>
        ) : (
          <Button
            variant="gradient"
            size="sm"
            onClick={handleClaim}
            className={`transition-transform ${popped ? "scale-125" : "scale-100"}`}
          >
            +5 XP алу
          </Button>
        )}
      </div>

      <div className="mt-4">
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all ${
                i < weekProgress
                  ? "bg-gradient-to-r from-orange-500 to-rose-500"
                  : "bg-[var(--secondary)]"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-1.5">
          Апталық серия {weekProgress}/7 — {7 - weekProgress > 0 ? `${7 - weekProgress} күн қалды!` : "Апталық марапат! 🏆"}
        </p>
      </div>
    </div>
  );
}
