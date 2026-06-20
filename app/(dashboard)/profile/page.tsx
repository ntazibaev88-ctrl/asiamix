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
import { Crown, Copy, Camera, Save } from "lucide-react";
import type { UserProfile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "" });

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data as UserProfile);
        setForm({ full_name: data.full_name || "" });
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
        .update({ full_name: form.full_name })
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

  if (!profile) {
    return <div className="h-48 rounded-2xl shimmer max-w-2xl mx-auto" />;
  }

  const isVipActive = profile.vip_expires_at && new Date(profile.vip_expires_at) > new Date();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Профиль</h1>

      {/* Avatar & Name */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-xl">
                {getInitials(profile.full_name || profile.email)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.full_name || "Пайдаланушы"}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {isVipActive ? (
                <Badge variant="premium">
                  <Crown className="h-3 w-3" />
                  VIP
                </Badge>
              ) : (
                <Badge variant="secondary">Тегін жоспар</Badge>
              )}
              {profile.role === "admin" && (
                <Badge variant="default">Әкімші</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Толық аты-жөні</Label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ full_name: e.target.value })}
              placeholder="Аты-жөніңіз"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={profile.email} disabled className="opacity-60" />
          </div>
          <Button variant="gradient" loading={loading} onClick={handleSave}>
            <Save className="h-4 w-4" />
            Сақтау
          </Button>
        </div>
      </div>

      {/* Plan Info */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <h3 className="font-semibold mb-4">Мүшелік</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              {isVipActive ? "VIP Мүшелік" : "Тегін жоспар"}
            </p>
            {isVipActive && profile.vip_expires_at && (
              <p className="text-sm text-[var(--muted-foreground)]">
                Мерзімі: {formatDate(profile.vip_expires_at)}
              </p>
            )}
          </div>
          {!isVipActive && (
            <Button variant="gradient" size="sm" asChild>
              <a href="/premium">
                <Crown className="h-4 w-4 text-amber-300" />
                VIP алу
              </a>
            </Button>
          )}
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

      {/* Account Info */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <h3 className="font-semibold mb-4">Аккаунт туралы</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Тіркелген күн</span>
            <span>{formatDate(profile.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Аккаунт ID</span>
            <span className="font-mono text-xs">{profile.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
