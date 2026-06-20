"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Footprints, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toaster";

const loginSchema = z.object({
  email: z.string().email("Жарамды email енгізіңіз"),
  password: z.string().min(6, "Кемінде 6 символ"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        toast.error("Қате деректер", "Email немесе құпия сөз дұрыс емес");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Қате орын алды", "Қайталап көріңіз");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] hero-gradient">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Басты бетке
        </Link>

        {/* Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg mb-4">
              <Footprints className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Қайта оралдыңыз!</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Qadam-ға кіріңіз</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Құпия сөз</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Ұмыттым
                </Link>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-[var(--foreground)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Кіру
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
            Тіркелмедіңіз бе?{" "}
            <Link
              href="/register"
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Тіркелу
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
