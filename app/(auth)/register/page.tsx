"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Footprints, ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toaster";

const registerSchema = z
  .object({
    full_name: z.string().min(2, "Кемінде 2 символ"),
    email: z.string().email("Жарамды email енгізіңіз"),
    password: z
      .string()
      .min(8, "Кемінде 8 символ")
      .regex(/[A-Z]/, "Бір бас әріп болуы керек")
      .regex(/[0-9]/, "Бір сан болуы керек"),
    confirm_password: z.string(),
    referral_code: z.string().optional(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Құпия сөздер сәйкес келмейді",
    path: ["confirm_password"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Кемінде 8 символ", valid: password.length >= 8 },
    { label: "Бас әріп (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "Сан (0-9)", valid: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-2 text-xs">
          {c.valid ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <X className="h-3 w-3 text-red-400" />
          )}
          <span className={c.valid ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--muted-foreground)]"}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            referral_code: data.referral_code,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Бұл email тіркелген", "Басқа email қолданыңыз немесе кіріңіз");
        } else {
          toast.error("Қате орын алды", error.message);
        }
        return;
      }

      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Қате орын алды", msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] hero-gradient">
        <div className="w-full max-w-md">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Email тексеріңіз!</h2>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-6">
              Аккаунтты белсендіру үшін email-іңізге хат жібердік. Поштаңызды тексеріңіз.
            </p>
            <Link href="/login">
              <Button variant="gradient" className="w-full">Кіру бетіне өту</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] hero-gradient">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Басты бетке
        </Link>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg mb-4">
              <Footprints className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Qadam-ға қосылыңыз</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Тегін тіркеліңіз</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Толық атыңыз</Label>
              <Input
                id="full_name"
                placeholder="Аружан Сейткали"
                autoComplete="name"
                {...register("full_name")}
                error={errors.full_name?.message}
              />
            </div>

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
              <Label htmlFor="password">Құпия сөз</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
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
              <PasswordStrength password={password} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Құпия сөзді растаңыз</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirm_password")}
                error={errors.confirm_password?.message}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="referral_code">
                Реферал коды{" "}
                <span className="text-[var(--muted-foreground)] font-normal">(міндетті емес)</span>
              </Label>
              <Input
                id="referral_code"
                placeholder="QADAM-XXXXX"
                {...register("referral_code")}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-2"
              loading={loading}
            >
              Тіркелу
            </Button>

            <p className="text-xs text-center text-[var(--muted-foreground)]">
              Тіркелу арқылы{" "}
              <Link href="/terms" className="text-primary-600 hover:underline">Шарттармен</Link>{" "}
              және{" "}
              <Link href="/privacy" className="text-primary-600 hover:underline">Құпиялылық саясатымен</Link>{" "}
              келісесіз.
            </p>
          </form>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
            Тіркелдіңіз бе?{" "}
            <Link
              href="/login"
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Кіру
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
