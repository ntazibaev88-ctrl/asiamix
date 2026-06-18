"use client";

import { useState } from "react";
import { Plus, Ticket, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { usePromoCodes, addPromoCode, removePromoCode } from "@/lib/promoCodes";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminPromoCodesPage() {
  const { t } = useI18n();
  const codes = usePromoCodes();
  const [code, setCode] = useState("");
  const [pct, setPct] = useState("10");

  const add = () => {
    if (!code.trim()) return;
    addPromoCode(code, Number(pct) || 0);
    setCode("");
    setPct("10");
  };

  return (
    <>
      <PageHeader title={t("nav.promocodes")} subtitle={t("role.admin")} />
      <Card className="mb-5 flex flex-col gap-3 p-4 sm:flex-row">
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder={t("promo.code")} className={inputCls} />
        <input type="number" value={pct} onChange={(e) => setPct(e.target.value)} placeholder={t("promo.discount")} className={`${inputCls} sm:w-32`} />
        <Button onClick={add} disabled={!code.trim()}>
          <Plus size={18} /> {t("admin.save")}
        </Button>
      </Card>
      <div className="flex flex-col gap-3">
        {codes.map((c) => (
          <Card key={c.code} className="flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <Ticket size={18} />
            </span>
            <div className="flex-1">
              <div className="font-mono font-bold">{c.code}</div>
              <div className="text-sm text-muted">−{c.discountPct}%</div>
            </div>
            <button
              onClick={() => removePromoCode(c.code)}
              className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-muted hover:text-danger cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}

const inputCls =
  "flex-1 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";
