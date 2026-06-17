"use client";

import { Banknote, Percent, TrendingUp, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { useManagedStores, effectiveCommission } from "@/lib/managedStores";

export default function AdminFinancePage() {
  const { t } = useI18n();
  const stores = useManagedStores();
  const gmv = stores.reduce((s, x) => s + x.revenue, 0);
  const commission = stores.reduce(
    (s, x) => s + (x.revenue * effectiveCommission(x)) / 100,
    0,
  );

  return (
    <>
      <PageHeader title={t("nav.finance")} subtitle={t("role.admin")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="GMV" value={formatPrice(gmv)} delta="+16%" />
        <StatCard
          icon={Percent}
          label={t("dash.commission")}
          value={formatPrice(Math.round(commission))}
          delta="+11%"
        />
        <StatCard icon={Banknote} label="Выплаты" value={formatPrice(420000)} />
        <StatCard icon={Wallet} label="Cashback" value={formatPrice(86000)} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-display text-lg font-bold">
          {t("dash.commission")} · {t("nav.stores")}
        </h2>
        <div className="flex flex-col gap-3">
          {stores.map((s) => {
            const eff = effectiveCommission(s);
            const boosted = eff !== s.commission;
            return (
              <div key={s.slug} className="flex items-center gap-3">
                <span className="flex-1 truncate text-sm font-medium">{s.name}</span>
                <span className={`text-xs ${boosted ? "font-bold text-warning" : "text-faint"}`}>
                  {eff}%{boosted ? " ⏱" : ""}
                </span>
                <span className="w-28 text-right text-sm font-semibold">
                  {formatPrice(Math.round((s.revenue * eff) / 100))}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
