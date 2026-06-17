"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Phone, Send, Store, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useCourierJob, setStatus, nextStatus } from "@/lib/courierOrders";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";

interface Msg {
  from: "courier" | "client";
  text: string;
}

export default function CourierOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const job = useCourierJob(Number(id));

  const [messages, setMessages] = useState<Msg[]>([
    { from: "client", text: "Сәлеметсіз бе! Қашан жетесіз?" },
    { from: "courier", text: "Сәлем! 10 минутта боламын 🚀" },
  ]);
  const [draft, setDraft] = useState("");

  if (!job) notFound();

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "courier", text: draft.trim() }]);
    setDraft("");
  };

  const next = nextStatus(job.status);

  // OpenStreetMap embed (no API key). Marker on the client; swap for 2GIS or
  // Google Maps with a key in production.
  const lats = [job.store.lat, job.client.lat];
  const lngs = [job.store.lng, job.client.lng];
  const pad = 0.01;
  const bbox = `${Math.min(...lngs) - pad},${Math.min(...lats) - pad},${Math.max(...lngs) + pad},${Math.max(...lats) + pad}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${job.client.lat},${job.client.lng}`;

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/courier/orders"
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:text-fg"
        >
          <ArrowLeft size={18} />
        </Link>
        <PageHeader title={`#${job.id}`} />
      </div>

      <div className="flex items-center justify-between">
        <Badge tone={statusTone[job.status]}>{t(`status.${job.status}`)}</Badge>
        <span className="text-sm text-muted">
          {job.items} {t("shop.items")} · {formatPrice(job.total)} ·{" "}
          {job.payment === "online" ? t("store.online") : t("store.cashPay")}
        </span>
      </div>

      {/* Map */}
      <Card className="mt-4 overflow-hidden p-0">
        <iframe
          title="map"
          src={mapSrc}
          className="h-56 w-full border-0"
          loading="lazy"
        />
      </Card>

      {/* Addresses */}
      <div className="mt-4 flex flex-col gap-3">
        <Card className="flex items-start gap-3 p-4">
          <Store size={18} className="mt-0.5 text-brand" />
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wide text-faint">
              {t("courier.pickup")}
            </div>
            <div className="font-semibold">{job.store.name}</div>
            <div className="text-sm text-muted">{job.store.address}</div>
          </div>
        </Card>
        <Card className="flex items-start gap-3 p-4">
          <MapPin size={18} className="mt-0.5 text-danger" />
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wide text-faint">
              {t("courier.dropoff")}
            </div>
            <div className="font-semibold">{job.client.name}</div>
            <div className="text-sm text-muted">{job.client.address}</div>
          </div>
          <a
            href={`tel:${job.client.phone.replace(/\s/g, "")}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-fg"
            aria-label="call"
          >
            <Phone size={18} />
          </a>
        </Card>
      </div>

      {/* Status action */}
      {next ? (
        <Button className="mt-4 w-full" onClick={() => setStatus(job.id, next)}>
          {t("courier.markAs")}: {t(`status.${next}`)}
        </Button>
      ) : (
        <div className="mt-4 rounded-2xl bg-success-soft px-4 py-3 text-center text-sm font-semibold text-success">
          ✅ {t("status.delivered")}
        </div>
      )}

      {/* Chat */}
      <h2 className="mb-3 mt-8 font-display text-lg font-bold">{t("courier.chat")}</h2>
      <Card className="flex flex-col gap-2 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
              m.from === "courier"
                ? "self-end bg-brand text-brand-fg"
                : "self-start bg-surface-2"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div className="mt-2 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("courier.message")}
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
    </>
  );
}
