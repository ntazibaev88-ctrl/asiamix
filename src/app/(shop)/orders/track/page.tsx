"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bike, Check, Clock, Phone, Send, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useActiveOrder } from "@/lib/activeOrder";
import { useChat, sendMessage } from "@/lib/chat";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function beep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o.start();
    o.stop(ctx.currentTime + 0.6);
  } catch {
    /* audio unavailable */
  }
}

const STEPS = ["accepted", "ready", "on_the_way", "delivered"] as const;

export default function TrackPage() {
  const { t } = useI18n();
  const order = useActiveOrder();
  const [eta, setEta] = useState(order?.etaMin ?? 0);
  const [draft, setDraft] = useState("");
  const [tipped, setTipped] = useState(false);
  const [rated, setRated] = useState(false);
  const [stars, setStars] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const messages = useChat(order?.id ?? "none");
  const alerted = useRef(false);

  // Demo: accelerate the countdown so the flow is visible (1 min / 2.5 s).
  useEffect(() => {
    if (!order) return;
    const id = setInterval(() => {
      setEta((e) => (e > 0 ? e - 1 : 0));
    }, 2500);
    return () => clearInterval(id);
  }, [order]);

  // Sound + alert once the courier is near.
  useEffect(() => {
    if (eta > 0 && eta <= 3 && !alerted.current) {
      alerted.current = true;
      beep();
      sendMessage(order?.id ?? "none", "courier", "Мен подъезге жақындап қалдым 🚀");
    }
  }, [eta, order]);

  if (!order) {
    return (
      <div className="grid place-items-center py-24 text-center text-muted">
        <Bike size={48} className="opacity-30" />
        <p className="mt-3">{t("track.noOrder")}</p>
        <Link href="/" className="mt-4">
          <Button size="sm">{t("shop.goShopping")}</Button>
        </Link>
      </div>
    );
  }

  const status =
    eta <= 0 ? "delivered" : eta <= 12 ? "on_the_way" : "accepted";
  const stepIndex = STEPS.indexOf(status);
  const near = eta > 0 && eta <= 3;

  const send = () => {
    if (!draft.trim()) return;
    sendMessage(order.id, "client", draft);
    const reply = draft;
    setDraft("");
    // Demo: courier bot replies.
    setTimeout(() => {
      sendMessage(order.id, "courier", reply.includes("?") ? "Иә, бәрі дайын 👍" : "Қабылдадым, рахмет!");
    }, 1200);
  };

  const mapSrc =
    "https://www.openstreetmap.org/export/embed.html?bbox=71.40,51.08,71.45,51.12&layer=mapnik&marker=51.10,71.42";

  return (
    <div className="flex flex-col gap-4 pb-6">
      <h1 className="font-display text-2xl font-bold">{t("track.title")}</h1>

      {/* ETA card */}
      <Card
        className={`p-6 text-center ${near ? "bg-warning-soft" : ""}`}
        style={near ? { background: "var(--warning-soft)" } : undefined}
      >
        {eta > 0 ? (
          <>
            <div className="flex items-center justify-center gap-2 text-sm text-muted">
              <Clock size={16} className="text-brand" /> {t("track.eta")}
            </div>
            <div className="mt-1 font-display text-5xl font-bold">
              {eta} <span className="text-2xl">{t("track.min")}</span>
            </div>
            {near && (
              <div className="mt-3 animate-pulse text-sm font-bold text-warning">
                {t("track.near")}
              </div>
            )}
          </>
        ) : (
          <div className="font-display text-2xl font-bold text-success">
            {t("track.delivered")}
          </div>
        )}
      </Card>

      {/* Status steps */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full ${
                  i <= stepIndex ? "bg-brand text-brand-fg" : "bg-surface-2 text-faint"
                }`}
              >
                {i < stepIndex || status === "delivered" ? (
                  <Check size={16} />
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-[10px] text-muted">{t(`status.${s}`)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Map */}
      <Card className="overflow-hidden p-0">
        <iframe title="map" src={mapSrc} className="h-52 w-full border-0" loading="lazy" />
      </Card>

      {/* Order summary + comment */}
      <Card className="p-5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">#{order.id} · {order.store}</span>
          <span className="font-bold">{formatPrice(order.total)}</span>
        </div>
        <div className="mt-1 text-muted">{order.address}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {order.weightKg > 0 && (
            <span className="rounded-full bg-surface-2 px-2.5 py-1 font-semibold text-muted">
              ⚖️ {order.weightKg} {t("cart.kg")}
            </span>
          )}
          {order.confirmed && (
            <span className="rounded-full bg-success-soft px-2.5 py-1 font-semibold text-success">
              ✅ {t("cart.paid")}
            </span>
          )}
        </div>
        {order.comment && (
          <div className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-xs">
            💬 {order.comment}
          </div>
        )}
      </Card>

      {/* Tip the courier */}
      <Card className="p-5">
        <div className="text-sm font-semibold">{t("tip.title")}</div>
        {tipped ? (
          <p className="mt-2 text-sm font-medium text-success">{t("tip.thanks")}</p>
        ) : (
          <div className="mt-3 flex gap-2">
            {[100, 200, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => setTipped(true)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:border-brand hover:text-brand cursor-pointer"
              >
                {formatPrice(amt)}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Rate the order (after delivery) */}
      {eta <= 0 && (
        <Card className="p-5">
          <div className="text-sm font-semibold">{t("review.title")}</div>
          {rated ? (
            <p className="mt-2 text-sm font-medium text-success">{t("review.thanks")}</p>
          ) : (
            <>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setStars(n)} className="cursor-pointer">
                    <Star size={28} className="text-warning" fill={n <= stars ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={2}
                placeholder={t("review.comment")}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
              <Button size="sm" className="mt-2" onClick={() => setRated(true)}>
                {t("review.send")}
              </Button>
            </>
          )}
        </Card>
      )}

      {/* Courier + chat */}
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
            <Bike size={20} />
          </span>
          <div className="flex-1">
            <div className="text-xs text-faint">{t("track.courier")}</div>
            <div className="font-semibold">{order.courier}</div>
          </div>
          <a
            href={`tel:${order.courierPhone.replace(/\s/g, "")}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-fg"
            aria-label="call"
          >
            <Phone size={18} />
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="text-xs font-bold uppercase tracking-wide text-faint">
            {t("track.chat")}
          </div>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
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
          </div>
          <div className="mt-1 flex items-center gap-2">
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
        </div>
      </Card>
    </div>
  );
}
