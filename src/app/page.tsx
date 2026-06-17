"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BRAND } from "@/lib/brand";
import { formatPrice } from "@/lib/format";
import {
  categories,
  products,
  reviews,
  type Product,
} from "@/lib/mock";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitch } from "@/components/LangSwitch";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

const DELIVERY_FEE = 300;

export default function StorefrontPage() {
  const { t, locale } = useI18n();
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [payment, setPayment] = useState<"cash" | "card">("cash");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const filtered = useMemo(
    () =>
      activeCat === "all"
        ? products
        : products.filter((p) => p.cat === activeCat),
    [activeCat],
  );

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const delivery = deliveryType === "delivery" ? DELIVERY_FEE : 0;

  const addItem = (p: Product) =>
    setCart((prev) => ({
      ...prev,
      [p.id]: prev[p.id]
        ? { ...prev[p.id], qty: prev[p.id].qty + 1 }
        : { id: p.id, name: p.name[locale], price: p.price, qty: 1, emoji: p.emoji },
    }));

  const removeItem = (id: number) =>
    setCart((prev) => {
      const next = { ...prev };
      if (next[id].qty <= 1) delete next[id];
      else next[id] = { ...next[id], qty: next[id].qty - 1 };
      return next;
    });

  const submitOrder = async () => {
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
          total: cartTotal + delivery,
          items: cartItems.map((i) => ({
            name_ru: i.name,
            qty: i.qty,
            price: i.price,
          })),
        }),
      });
    } catch {
      /* keep UX flowing in demo even if the API/env is not configured */
    }
    setStep("success");
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            NOMI<span className="text-brand">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                {t("portal.title")}
              </Button>
            </Link>
            <LangSwitch />
            <ThemeToggle />
            <Button
              size="sm"
              onClick={() => {
                setCartOpen(true);
                setStep("cart");
              }}
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">{t("common.cart")}</span>
              {cartCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-fg px-1 text-[11px] font-bold text-brand">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--brand) 0%, transparent 70%)",
            animation: "nomi-float 6s ease-in-out infinite",
          }}
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <Badge tone="brand">⚡ {BRAND.supportPhone}</Badge>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
              {BRAND.tagline[locale]}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">
              {t("store.hero.cta")} — {categories
                .filter((c) => c.slug !== "all")
                .map((c) => c.name[locale])
                .join(" · ")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#menu">
                <Button size="lg">
                  {t("store.hero.cta")} <ArrowRight size={18} />
                </Button>
              </a>
              <div className="flex items-center gap-4 px-2">
                <Stat icon={<Clock size={16} />} label="45 мин" />
                <Stat icon={<Truck size={16} />} label={t("common.delivery")} />
                <Stat icon={<Star size={16} />} label="4.8" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-brand py-2.5">
        <div
          className="flex w-max gap-12 whitespace-nowrap font-display text-sm font-bold text-brand-fg"
          style={{ animation: "nomi-marquee 22s linear infinite" }}
        >
          {Array.from({ length: 2 }).map((_, b) => (
            <div key={b} className="flex gap-12">
              {["🔥 NEW MENU", "🚀 45 MIN DELIVERY", "⭐ 4.8 RATING", "💳 KASPI · VISA · MASTERCARD", "🎁 CASHBACK 5%"].map(
                (s) => (
                  <span key={s}>{s}</span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div
        id="menu"
        className="sticky top-16 z-30 border-b border-border bg-bg/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCat(c.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeCat === c.slug
                  ? "bg-brand text-brand-fg"
                  : "bg-surface-2 text-muted hover:text-fg"
              }`}
            >
              {c.name[locale]}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => {
            const qty = cart[p.id]?.qty || 0;
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-[var(--shadow-lg)]"
              >
                <div className="relative grid h-32 place-items-center bg-surface-2 text-6xl">
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {p.emoji}
                  </span>
                  {p.tag && (
                    <span className="absolute left-3 top-3">
                      <Badge tone={p.tag === "NEW" ? "success" : "brand"}>
                        {p.tag}
                      </Badge>
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold leading-tight">{p.name[locale]}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    {p.desc[locale]}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-lg font-bold">
                        {formatPrice(p.price)}
                      </span>
                      {p.oldPrice && (
                        <span className="text-xs text-faint line-through">
                          {formatPrice(p.oldPrice)}
                        </span>
                      )}
                    </div>
                    {qty === 0 ? (
                      <Button
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => addItem(p)}
                        aria-label={t("store.add")}
                      >
                        <Plus size={18} />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Qty onClick={() => removeItem(p.id)}>
                          <Minus size={15} />
                        </Qty>
                        <span className="w-4 text-center text-sm font-bold">
                          {qty}
                        </span>
                        <Qty onClick={() => addItem(p)}>
                          <Plus size={15} />
                        </Qty>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="mb-5 font-display text-2xl font-bold tracking-tight">
          {t("store.reviews")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s < r.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">{r.text[locale]}</p>
              <p className="mt-3 text-sm font-semibold">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="font-display text-xl font-bold">
              NOMI<span className="text-brand">.</span>
            </div>
            <p className="mt-1 text-sm text-muted">{BRAND.tagline[locale]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                {t("role.courier")}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                {t("role.store")}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                {t("role.admin")}
              </Button>
            </Link>
          </div>
        </div>
      </footer>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}
          >
            <motion.div
              className="flex h-full w-full max-w-md flex-col gap-4 overflow-y-auto bg-surface p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {step === "cart" && (
                <>
                  <DrawerHead onClose={() => setCartOpen(false)}>
                    {t("common.cart")}
                  </DrawerHead>
                  {cartItems.length === 0 ? (
                    <div className="grid flex-1 place-items-center text-center text-muted">
                      <div>
                        <ShoppingBag size={48} className="mx-auto opacity-40" />
                        <p className="mt-3">{t("store.cartEmpty")}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 border-b border-border pb-3"
                          >
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface-2 text-2xl">
                              {item.emoji}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold">
                                {item.name}
                              </div>
                              <div className="text-xs text-muted">
                                {formatPrice(item.price)} × {item.qty}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Qty onClick={() => removeItem(item.id)}>
                                <Minus size={14} />
                              </Qty>
                              <span className="w-4 text-center text-sm font-bold">
                                {item.qty}
                              </span>
                              <Qty
                                onClick={() => {
                                  const p = products.find(
                                    (x) => x.id === item.id,
                                  )!;
                                  addItem(p);
                                }}
                              >
                                <Plus size={14} />
                              </Qty>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Summary
                        subtotal={cartTotal}
                        delivery={DELIVERY_FEE}
                        total={cartTotal + DELIVERY_FEE}
                        t={t}
                      />
                      <Button
                        className="mt-auto w-full"
                        onClick={() => setStep("checkout")}
                      >
                        {t("common.checkout")} <ArrowRight size={18} />
                      </Button>
                    </>
                  )}
                </>
              )}

              {step === "checkout" && (
                <>
                  <DrawerHead onBack={() => setStep("cart")}>
                    {t("common.checkout")}
                  </DrawerHead>
                  <Field label={t("store.name")}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                    />
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
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                  )}
                  <Field label={t("store.payment")}>
                    <Toggle
                      value={payment}
                      onChange={setPayment}
                      options={[
                        { value: "cash", label: t("store.cash") },
                        { value: "card", label: t("store.card") },
                      ]}
                    />
                  </Field>
                  <Summary
                    subtotal={cartTotal}
                    delivery={delivery}
                    total={cartTotal + delivery}
                    t={t}
                  />
                  <Button
                    className="w-full"
                    disabled={!name || !phone}
                    onClick={submitOrder}
                  >
                    {t("common.confirm")}
                  </Button>
                </>
              )}

              {step === "success" && (
                <div className="grid flex-1 place-items-center text-center">
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success-soft text-4xl"
                    >
                      ✅
                    </motion.div>
                    <h3 className="mt-5 font-display text-xl font-bold">
                      {t("store.orderPlaced")}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-muted">
                      {t("store.orderPlacedDesc")}
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => {
                        setCart({});
                        setCartOpen(false);
                        setStep("cart");
                      }}
                    >
                      {t("store.ok")}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-muted">
      {icon}
      {label}
    </span>
  );
}

function Qty({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-lg bg-surface-2 text-fg transition-colors hover:brightness-95 cursor-pointer"
    >
      {children}
    </button>
  );
}

function DrawerHead({
  children,
  onClose,
  onBack,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-2 cursor-pointer"
          >
            <ArrowRight size={18} className="rotate-180" />
          </button>
        )}
        <span className="font-display text-lg font-bold">{children}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-2 cursor-pointer"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}

function Summary({
  subtotal,
  delivery,
  total,
  t,
}: {
  subtotal: number;
  delivery: number;
  total: number;
  t: (k: string) => string;
}) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4 text-sm">
      <Row label={t("common.cart")} value={formatPrice(subtotal)} muted />
      <Row label={t("common.delivery")} value={formatPrice(delivery)} muted />
      <div className="my-2 border-t border-border" />
      <Row label={t("common.total")} value={formatPrice(total)} />
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        muted ? "text-muted" : "text-base font-bold"
      } py-0.5`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">
        {label}
      </span>
      {children}
    </label>
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
