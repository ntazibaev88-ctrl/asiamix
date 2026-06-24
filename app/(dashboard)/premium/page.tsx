"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/client";
import {
  Crown,
  Check,
  Upload,
  Copy,
  Zap,
  Shield,
  Users,
  Gift,
  ArrowRight,
} from "lucide-react";

const VIP_FEATURES = [
  "Шексіз мақсаттар",
  "Шексіз күнделік жазбалары",
  "Барлық Premium мақалалар",
  "Premium кітаптар мен фильмдер",
  "Кеңейтілген аналитика",
  "Жинақ есептері мен PDF",
  "Басымдықты қолдау",
  "Ерте рұқсат мүмкіндіктері",
];

const KASPI_PHONE = "+7 771 412 15 73";
const KASPI_CARD = "4400 4303 3787 7838";
const KASPI_RECIPIENT = "Fariza T";

export default function PremiumPage() {
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [kaspiNumber, setKaspiNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [email, setEmail] = useState("");

  useState(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .single();
      if (data) setReferralCode(data.referral_code);
    };
    loadProfile();
  });

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(KASPI_PHONE);
    toast.success("Телефон нөмірі көшірілді!");
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText(KASPI_CARD);
    toast.success("Карта нөмірі көшірілді!");
  };

  const handleCopyReferral = () => {
    const url = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Сілтеме көшірілді!");
  };

  const handleSubmitPayment = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email дұрыс енгізіңіз");
      return;
    }
    if (!proofFile) {
      toast.error("Төлем дәлелін жүктеңіз");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upload proof image
      const fileExt = proofFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, proofFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      // Create payment record
      const { error } = await supabase.from("payments").insert({
        user_id: user.id,
        amount: 990,
        months: 1,
        bonus_months: 1,
        status: "pending",
        proof_url: publicUrl,
        kaspi_number: kaspiNumber || null,
        notes: `Email: ${email}${notes ? `\n${notes}` : ""}`,
      });

      if (error) throw error;

      setStep("success");
      toast.success("Өтінім жіберілді! Тексеруден кейін VIP белсендіріледі.");
    } catch (e) {
      toast.error("Қате орын алды", "Қайталап көріңіз");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Өтінім жіберілді! 🎉</h2>
        <p className="text-[var(--muted-foreground)] mb-6">
          Төлемді тексергеннен кейін (24 сағ ішінде) VIP автоматты түрде белсендіріледі.
          Сізге email жіберіледі.
        </p>
        <Button variant="gradient" onClick={() => window.location.href = "/dashboard"}>
          Басты бетке
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">VIP Мүшелік</h1>
        <p className="text-[var(--muted-foreground)]">
          Qadam-ның барлық мүмкіндіктерін ашыңыз
        </p>
      </div>

      {step === "info" && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Card */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 text-white shadow-2xl">
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/20 text-white border-0">Ең танымал</Badge>
            </div>

            <Crown className="h-8 w-8 text-amber-300 mb-4" />
            <div className="text-4xl font-bold mb-1">₸990</div>
            <div className="text-sm opacity-80 mb-2">айына</div>

            <div className="p-3 rounded-xl bg-white/10 mb-6 text-sm">
              🎁 <strong>Арнайы ұсыныс:</strong> 1 ай төлеңіз + 1 ай тегін!
              <br />
              <span className="opacity-80">Алғашқы сатып алуда 2 ай аласыз!</span>
            </div>

            <ul className="space-y-3 mb-8">
              {VIP_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                  <span className="opacity-90">{f}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full bg-white text-primary-700 hover:bg-white/90 font-semibold"
              onClick={() => setStep("payment")}
            >
              <Zap className="h-4 w-4" />
              VIP алу — ₸990
            </Button>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <Shield className="h-6 w-6 text-primary-600 mb-3" />
              <h3 className="font-semibold mb-1">Қауіпсіз төлем</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Kaspi арқылы тікелей аудару. Скриншот жіберіңіз — VIP белсендіреміз.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <Gift className="h-6 w-6 text-amber-500 mb-3" />
              <h3 className="font-semibold mb-1">Бонус айлар</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Алғашқы VIP сатып алуда 2 ай аласыз — 1 ай төлеп, 1 ай тегін!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <Users className="h-6 w-6 text-emerald-600 mb-3" />
              <h3 className="font-semibold mb-1">Реферал жүйесі</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-3">
                Досыңызды шақырыңыз — екеуіңіз де тегін VIP күндер аласыздар!
              </p>
              {referralCode && (
                <div className="flex gap-2">
                  <div className="flex-1 p-2 rounded-xl bg-[var(--secondary)] text-sm font-mono text-center">
                    {referralCode}
                  </div>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handleCopyReferral}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="max-w-lg mx-auto">
          <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Kaspi арқылы төлеу</h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Төмендегі нөмірге ₸990 аударыңыз және скриншот жіберіңіз
              </p>
            </div>

            {/* Kaspi Rekvizits */}
            <div className="p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)] space-y-3">
              <div className="text-sm font-medium">Kaspi реквизиттері:</div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-[var(--muted-foreground)]">Телефон нөміріне:</div>
                  <div className="text-lg font-bold font-mono">{KASPI_PHONE}</div>
                </div>
                <Button variant="outline" size="icon-sm" onClick={handleCopyPhone}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-[var(--muted-foreground)]">Немесе картаға:</div>
                  <div className="text-lg font-bold font-mono">{KASPI_CARD}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Алушы: {KASPI_RECIPIENT}</div>
                </div>
                <Button variant="outline" size="icon-sm" onClick={handleCopyCard}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="border-t border-[var(--border)] pt-2 text-sm text-[var(--muted-foreground)]">
                Сома: <strong className="text-[var(--foreground)]">₸990</strong> •
                Хабарлама: <strong className="text-[var(--foreground)]">VIP Qadam</strong>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label>Сіздің Email *</Label>
              <Input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "border-red-400" : ""}
              />
              <p className="text-xs text-[var(--muted-foreground)]">
                VIP белсендіру үшін аккаунтыңыздың email-ін жазыңыз
              </p>
            </div>

            {/* Upload Proof */}
            <div className="space-y-2">
              <Label>Төлем скриншотын жүктеңіз *</Label>
              <div
                className="relative border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById("proof-upload")?.click()}
              >
                <input
                  id="proof-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                />
                {proofFile ? (
                  <div>
                    <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">{proofFile.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Өзгерту үшін басыңыз
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-2" />
                    <p className="text-sm font-medium">Скриншотты жүктеңіз</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      PNG, JPG, JPEG — 5MB дейін
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Kaspi нөміріңіз (міндетті емес)</Label>
              <Input
                placeholder="+7 777 000 0000"
                value={kaspiNumber}
                onChange={(e) => setKaspiNumber(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ескерту (міндетті емес)</Label>
              <Textarea
                placeholder="Қосымша ақпарат..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("info")}
              >
                Артқа
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                loading={loading}
                onClick={handleSubmitPayment}
              >
                <Upload className="h-4 w-4" />
                Жіберу
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
