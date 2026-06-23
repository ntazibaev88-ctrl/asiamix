"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { getInitials, formatDate } from "@/lib/utils";
import { Crown, Copy, Save, User, Mail, Phone, Calendar, Shield, Star } from "lucide-react";
import type { UserProfile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", phone: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoading(false); return; }
        setEmail(user.email || "");
        let { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (!data) {
          await supabase.from("profiles").insert({ id: user.id, email: user.email, plan: "free", role: "user" });
          const res = await supabase.from("profiles").select("*").eq("id", user.id).single();
          data = res.data;
        }
        if (data) {
          setProfile(data as UserProfile);
          setForm({
            full_name: data.full_name || "",
            phone: (data as UserProfile & { phone?: string }).phone || "",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: form.full_name, phone: form.phone || null })
        .eq("id", profile.id);
      if (error) throw error;
      setProfile({ ...profile, full_name: form.full_name });
      toast.success("Профиль жаңартылды");
    } catch {
      toast.error("Қате орын алды");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferral = () => {
    if (!profile) return;
    const url = `${window.location.origin}/register?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(url);
    toast.success("Реферал сілтемесі көшірілді!");
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-[var(--muted-foreground)]">Профиль жүктелмеді. Қайта кіріп көріңіз.</p>
      </div>
    );
  }

  const isVipActive = profile.vip_expires_at && new Date(profile.vip_expires_at) > new Date();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold">Профиль</h1>

      {/* Avatar & Plan */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 text-white">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20 ring-4 ring-white/30">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-white/20 text-white">
              {getInitials(profile.full_name || email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{profile.full_name || "Пайдаланушы"}</h2>
            <p className="text-sm text-white/70 mt-0.5">{email}</p>
            <div className="flex items-center gap-2 mt-2">
              {isVipActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
                  <Crown className="h-3 w-3" /> VIP Мүше
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-semibold">
                  <Star className="h-3 w-3" /> Тегін жоспар
                </span>
              )}
              {profile.role === "admin" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-400/20 text-red-300 text-xs font-semibold border border-red-400/30">
                  <Shield className="h-3 w-3" /> Әкімші
                </span>
              )}
            </div>
          </div>
        </div>
        {isVipActive && profile.vip_expires_at && (
          <div className="mt-4 p-3 rounded-xl bg-white/10 text-sm">
            VIP мерзімі: <strong>{formatDate(profile.vip_expires_at)}</strong>
          </div>
        )}
      </div>

      {/* Edit Form */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <User className="h-4 w-4 text-primary-600" />
          Жеке ақпарат
        </h3>

        <div className="space-y-1.5">
          <Label>Аты-жөні</Label>
          <Input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Аты-жөніңіз"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email (логин)
          </Label>
          <Input value={email} disabled className="opacity-60" />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> Телефон нөмірі
          </Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+7 700 000 0000"
          />
        </div>

        <Button variant="gradient" loading={loading} onClick={handleSave} className="w-full sm:w-auto">
          <Save className="h-4 w-4" />
          Сақтау
        </Button>
      </div>

      {/* Plan */}
      {!isVipActive && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                VIP мүшелікке өту
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Барлық мүмкіндіктерді ашыңыз — ₸990/ай
              </p>
            </div>
            <Button variant="gradient" size="sm" asChild>
              <a href="/premium">VIP алу</a>
            </Button>
          </div>
        </div>
      )}

      {/* Account Info */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary-600" />
          Аккаунт туралы
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted-foreground)]">Тіркелген күн</span>
            <span className="font-medium">{formatDate(profile.created_at)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted-foreground)]">Аккаунт ID</span>
            <span className="font-mono text-xs bg-[var(--secondary)] px-2 py-1 rounded">{profile.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[var(--muted-foreground)]">Жоспар</span>
            <Badge variant={isVipActive ? "premium" : "secondary"}>
              {isVipActive ? "VIP" : "Тегін"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <h3 className="font-semibold mb-2">Реферал жүйесі</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Досыңызды шақырыңыз — екеуіңіз де тегін VIP күндер аласыздар!
        </p>
        <div className="flex gap-2">
          <div className="flex-1 p-3 rounded-xl bg-[var(--secondary)] text-sm font-mono break-all">
            {profile.referral_code}
          </div>
          <Button variant="outline" size="icon" onClick={handleCopyReferral}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
