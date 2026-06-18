"use client";

import { useState } from "react";
import { Megaphone, Send, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAnnouncement, setAnnouncement } from "@/lib/announcements";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminNotifyPage() {
  const { t } = useI18n();
  const current = useAnnouncement();
  const [text, setText] = useState("");

  return (
    <>
      <PageHeader title={t("nav.notify")} subtitle={t("role.admin")} />
      <Card className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 font-semibold">
          <Megaphone size={18} className="text-brand" /> {t("admin.notifyTitle")}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder={t("admin.notifyPh")}
          className="w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]"
        />
        <Button
          disabled={!text.trim()}
          onClick={() => {
            setAnnouncement(text.trim());
            setText("");
          }}
        >
          <Send size={18} /> {t("admin.send")}
        </Button>
      </Card>

      {current && (
        <Card className="mt-4 flex items-center gap-3 p-4">
          <Megaphone size={16} className="text-brand" />
          <span className="flex-1 text-sm">{current}</span>
          <button
            onClick={() => setAnnouncement(null)}
            className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-muted hover:text-danger cursor-pointer"
          >
            <X size={15} />
          </button>
        </Card>
      )}
    </>
  );
}
