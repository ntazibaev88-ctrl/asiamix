"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toaster";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApprovePaymentButtonProps {
  paymentId: string;
  userId: string;
  months: number;
}

export function ApprovePaymentButton({
  paymentId,
  userId,
  months,
}: ApprovePaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Calculate VIP expiry
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);

      // Update payment status
      const { error: paymentError } = await supabase
        .from("payments")
        .update({
          status: "approved",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", paymentId);

      if (paymentError) throw paymentError;

      // Activate VIP for user
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          plan: "vip",
          vip_expires_at: expiresAt.toISOString(),
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      toast.success("VIP белсендірілді!");
      router.refresh();
    } catch {
      toast.error("Қате орын алды");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Төлемді қабылдамайсыз ба?")) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from("payments")
        .update({
          status: "rejected",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", paymentId);
      toast.success("Төлем қабылданбады");
      router.refresh();
    } catch {
      toast.error("Қате орын алды");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="success"
        loading={loading}
        onClick={handleApprove}
      >
        <Check className="h-3.5 w-3.5" />
        Растау
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        onClick={handleReject}
        disabled={loading}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
