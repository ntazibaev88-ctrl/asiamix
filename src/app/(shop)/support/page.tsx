"use client";

import { useState } from "react";
import { Headphones, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useChat, sendMessage } from "@/lib/chat";
import { Card } from "@/components/ui/Card";

const SUPPORT_ID = "support";

export default function SupportPage() {
  const { t } = useI18n();
  const messages = useChat(SUPPORT_ID);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    const q = draft.trim();
    sendMessage(SUPPORT_ID, "client", q);
    setDraft("");
    setTimeout(() => {
      sendMessage(
        SUPPORT_ID,
        "courier",
        "Рахмет! Сұрағыңызды қабылдадық, оператор жақын арада жауап береді 🙂",
      );
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
          <Headphones size={20} />
        </span>
        <h1 className="font-display text-2xl font-bold">{t("support.title")}</h1>
      </div>

      <Card className="flex min-h-[50vh] flex-col gap-2 p-4">
        <div className="self-start max-w-[80%] rounded-2xl bg-surface-2 px-3.5 py-2 text-sm">
          {t("support.greeting")}
        </div>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
              m.from === "client"
                ? "self-end bg-brand text-brand-fg"
                : "self-start bg-surface-2"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("track.message")}
            className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]"
          />
          <button
            onClick={send}
            aria-label="send"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-brand-fg cursor-pointer"
          >
            <Send size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
}
