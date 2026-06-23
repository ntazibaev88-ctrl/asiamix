"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="text-xl font-bold">Бет жүктелмеді</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          {error.message || "Күтпеген қате орын алды."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="gradient" onClick={reset}>
            Қайталап көру
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Басты бетке</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
