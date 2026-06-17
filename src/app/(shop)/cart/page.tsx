"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Store } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import {
  useCart,
  addToCart,
  decrement,
  clearCart,
  cartLines,
  cartTotal,
} from "@/lib/cart";
import { Button } from "@/components/ui/Button";

const DELIVERY_FEE = 300;

export default function CartPage() {
  const { t, locale } = useI18n();
  const map = useCart();
  const lines = cartLines(map, locale);
  const subtotal = cartTotal(map);

  const [checkout, setCheckout] = useState(false);
  const [done, setDone] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [payment, setPayment] = useState<"cash" | "card" | "kaspi">("kaspi");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const delivery = deliveryType === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  const submit = async () => {
    if (!name || !phone) return;
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          deliveryType,
          payment,
          total,
          items: lines.map((l) => ({
            name_ru: l.name,
            qty: l.qty,
            price: l.price,
          })),
        }),
      });
    } catch {
      /* demo: keep UX flowing without a configured backend */
    }
    clearCart();
    setDone(true);
  };

  if (done) {
    return (
      <div className="grid place-items-center py-24 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-success-soft text-4xl">
          ✅
        </div>
        <h2 className="mt-5 font-display text-xl font-bold">
          {t("store.orderPlaced")}
        </h2>
        <p className="mt-2 max-w-xs text-sm text-muted">
          {t("store.orderPlacedDesc")}
        </p>
        <Link href="/" className="mt-6">
          <Button>{t("store.ok")}</Button>
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="grid place-items-center py-24 text-center text-muted">
        <ShoppingBasket size={48} className="opacity-30" />
        <p className="mt-3">{t("store.cartEmpty")}</p>
        <Link href="/stores" className="mt-4">
          <Button size="sm">{t("shop.goShopping")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">{t("shop.tab.cart")}</h1>

      {/* Items grouped by store */}
      <div className="flex flex-col gap-5">
        {Object.values(
          lines.reduce<Record<string, typeof lines>>((acc, l) => {
            (acc[l.storeSlug] ??= []).push(l);
            return acc;
          }, {}),
        ).map((group) => (
          <div key={group[0].storeSlug} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <Store size={15} className="text-brand" />
              <span className="text-sm font-bold">{group[0].storeName}</span>
            </div>
            {group.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-3xl bg-surface p-3.5 shadow-[var(--shadow)]"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface-2 text-2xl">
                  {item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted">
                    {formatPrice(item.price)}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => decrement(item.id)}
                    className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center text-sm font-bold">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => addToCart(item.id, item.storeSlug)}
                    className="grid h-7 w-7 place-items-center rounded-full bg-brand text-brand-fg cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Checkout form */}
      {checkout && (
        <div className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow)]">
          <Field label={t("store.name")}>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label={t("store.phone")}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className={inputCls}
            />
          </Field>
          <Field label={t("common.delivery")}>
            <Toggle
              value={deliveryType}
              onChange={setDeliveryType}
              options={[
                { value: "delivery", label: t("common.delivery") },
                { value: "pickup", label: t("common.pickup") },
              ]}
            />
          </Field>
          {deliveryType === "delivery" && (
            <Field label={t("store.address")}>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
            </Field>
          )}
          <Field label={t("store.payment")}>
            <Toggle
              value={payment}
              onChange={setPayment}
              options={[
                { value: "kaspi", label: "Kaspi" },
                { value: "card", label: t("store.card") },
                { value: "cash", label: t("store.cash") },
              ]}
            />
          </Field>
        </div>
      )}

      {/* Summary */}
      <div className="rounded-2xl bg-surface-2 p-4 text-sm">
        <Row label={t("common.cart")} value={formatPrice(subtotal)} muted />
        <Row label={t("common.delivery")} value={formatPrice(delivery)} muted />
        <div className="my-2 border-t border-border" />
        <Row label={t("common.total")} value={formatPrice(total)} />
      </div>

      {checkout ? (
        <Button className="w-full" disabled={!name || !phone} onClick={submit}>
          {t("common.confirm")} · {formatPrice(total)}
        </Button>
      ) : (
        <Button className="w-full" onClick={() => setCheckout(true)}>
          {t("common.checkout")} · {formatPrice(total)}
        </Button>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div
      className={`flex justify-between py-0.5 ${
        muted ? "text-muted" : "text-base font-bold"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Toggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
            value === o.value
              ? "border-brand bg-brand text-brand-fg"
              : "border-border text-muted hover:text-fg"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
