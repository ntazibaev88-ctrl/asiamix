"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Footprints, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toaster";

const schema = z.object({
  email: z.string().email("Жарамды email енгізіңіз"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });
      if (error) {
        toast.error("Қате орын алды", error.message);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] hero-gradient">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Кіру бетіне
        </Link>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg mb-4">
              <Footprints className="h-6 w-6 text-white" />
            </div>
            {!sent ? (
              <>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Құпия сөзді ұмыттым</h1>
                <p className="text-sm text-[var(--muted-foreground)] mt-1 text-center">
                  Email-іңізді енгізіңіз, сілтеме жібереміз
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Хат жіберілді!</h1>
                <p className="text-sm text-[var(--muted-foreground)] mt-1 text-center">
                  Email-іңізді тексеріңіз және сілтемені басыңыз
                </p>
              </>
            )}
          </div>

          {!sent && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                loading={loading}
              >
                Сілтеме жіберу
              </Button>
            </form>
          )}

          {sent && (
            <Link href="/login">
              <Button variant="outline" className="w-full">Кіру бетіне оралу</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
