"use client";

import { useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import {
  useManagedStores,
  addStore,
  updateStore,
  removeStore,
  effectiveCommission,
  type ManagedStore,
} from "@/lib/managedStores";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminStoresPage() {
  const { t } = useI18n();
  const stores = useManagedStores();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("Астана");
  const [address, setAddress] = useState("");

  const create = () => {
    if (!name.trim()) return;
    addStore({ name: name.trim(), city: city.trim(), address: address.trim() });
    setName("");
    setAddress("");
    setAdding(false);
  };

  return (
    <>
      <PageHeader
        title={t("nav.stores")}
        subtitle={t("role.admin")}
        action={
          <Button onClick={() => setAdding((v) => !v)}>
            <Plus size={18} /> {t("admin.addStore")}
          </Button>
        }
      />

      {adding && (
        <Card className="mb-4 flex flex-col gap-3 p-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("admin.storeName")} className={inputCls} />
          <div className="flex gap-3">
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("admin.city")} className={inputCls} />
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("admin.address")} className={inputCls} />
          </div>
          <Button onClick={create} disabled={!name.trim()}>
            {t("admin.save")}
          </Button>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {stores.map((s) => (
          <StoreRow key={s.slug} store={s} />
        ))}
      </div>
    </>
  );
}

function StoreRow({ store }: { store: ManagedStore }) {
  const { t } = useI18n();
  const eff = effectiveCommission(store);
  const boosted = eff !== store.commission;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-lg font-bold">{store.name}</div>
          <div className="text-sm text-muted">
            {store.city} · {store.address}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => updateStore(store.slug, { active: !store.active })} className="cursor-pointer">
            <Badge tone={store.active ? "success" : "neutral"}>
              {store.active ? t("shop.open") : t("shop.closed")}
            </Badge>
          </button>
          <button
            onClick={() => removeStore(store.slug)}
            aria-label="delete"
            className="grid h-7 w-7 place-items-center rounded-lg bg-surface-2 text-muted hover:text-danger cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric label={t("nav.orders")} value={String(store.orders)} />
        <Metric label={t("dash.revenue")} value={formatPrice(store.revenue)} />
        <Metric
          label={t("dash.rating")}
          value={
            <span className="flex items-center justify-center gap-1">
              <Star size={13} className="text-warning" fill="currentColor" />
              {store.rating}
            </span>
          }
        />
      </div>

      {/* Commission */}
      <div className="mt-4 border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t("dash.commission")}</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={store.commission}
              onChange={(e) =>
                updateStore(store.slug, { commission: Number(e.target.value) })
              }
              className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-right text-sm outline-none focus:border-brand"
            />
            <span className="text-sm font-bold">%</span>
          </div>
        </div>

        {/* Temporary boost */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-xs text-muted">{t("admin.tempCommission")}</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              max={100}
              value={store.tempRate ?? ""}
              placeholder="%"
              onChange={(e) =>
                updateStore(store.slug, {
                  tempRate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-14 rounded-lg border border-border bg-surface px-2 py-1 text-right text-sm outline-none focus:border-brand"
            />
            <input
              type="date"
              value={store.tempUntil ?? ""}
              onChange={(e) =>
                updateStore(store.slug, { tempUntil: e.target.value || undefined })
              }
              className="rounded-lg border border-border bg-surface px-2 py-1 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>
        {boosted && (
          <p className="mt-2 text-xs font-semibold text-warning">
            {t("admin.activeCommission")}: {eff}% ({t("admin.until")} {store.tempUntil})
          </p>
        )}
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface-2 py-2">
      <div className="font-semibold">{value}</div>
      <div className="text-[11px] text-faint">{label}</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";
