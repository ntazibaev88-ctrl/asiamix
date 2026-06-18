"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface MonthlyRow {
  store: string;
  orders: number;
  sales: number;
  commissionPct: number;
  commission: number;
  payable: number;
  refunds: number;
  net: number;
}
interface Monthly {
  periodFrom: string;
  periodTo: string;
  rows: MonthlyRow[];
  totals: { orders: number; sales: number; commission: number; payable: number; net: number };
}

export default function AdminReportsPage() {
  const { t } = useI18n();
  const [data, setData] = useState<Monthly | null>(null);

  useEffect(() => {
    let on = true;
    fetch("/api/payments/monthly")
      .then((r) => r.json())
      .then((d) => on && setData(d))
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  const cols = [
    t("rep.store"),
    t("rep.orders"),
    t("rep.sales"),
    "%",
    t("rep.commission"),
    t("rep.payable"),
    t("rep.refunds"),
    t("rep.net"),
  ];
  const body = (data?.rows ?? []).map((r) => [
    r.store,
    String(r.orders),
    String(r.sales),
    `${r.commissionPct}%`,
    String(r.commission),
    String(r.payable),
    String(r.refunds),
    String(r.net),
  ]);

  const exportPdf = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("NOMI — Monthly report", 14, 18);
    doc.setFontSize(10);
    doc.text(`${data.periodFrom} — ${data.periodTo}`, 14, 25);
    autoTable(doc, {
      head: [cols],
      body,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [31, 164, 90] },
    });
    doc.save(`nomi-report-${data.periodFrom}.pdf`);
  };

  const exportExcel = () => {
    if (!data) return;
    const rows = [cols, ...body];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nomi-report-${data.periodFrom}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title={t("rep.title")}
        subtitle={data ? `${t("rep.period")}: ${data.periodFrom} — ${data.periodTo}` : t("role.admin")}
        action={
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer size={16} /> {t("rep.print")}
            </Button>
            <Button size="sm" variant="outline" onClick={exportExcel}>
              <Download size={16} /> Excel
            </Button>
            <Button size="sm" onClick={exportPdf}>
              <FileText size={16} /> PDF
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden" id="report">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                {cols.map((c) => (
                  <th key={c} className="px-3 py-3 font-semibold">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.rows ?? []).map((r) => (
                <tr key={r.store} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-semibold">{r.store}</td>
                  <td className="px-3 py-3">{r.orders}</td>
                  <td className="px-3 py-3">{formatPrice(r.sales)}</td>
                  <td className="px-3 py-3">{r.commissionPct}%</td>
                  <td className="px-3 py-3 text-brand">{formatPrice(r.commission)}</td>
                  <td className="px-3 py-3 font-semibold">{formatPrice(r.payable)}</td>
                  <td className="px-3 py-3">{formatPrice(r.refunds)}</td>
                  <td className="px-3 py-3 font-bold">{formatPrice(r.net)}</td>
                </tr>
              ))}
              {data && (
                <tr className="bg-surface-2 font-bold">
                  <td className="px-3 py-3">{t("rep.total")}</td>
                  <td className="px-3 py-3">{data.totals.orders}</td>
                  <td className="px-3 py-3">{formatPrice(data.totals.sales)}</td>
                  <td className="px-3 py-3">—</td>
                  <td className="px-3 py-3 text-brand">{formatPrice(data.totals.commission)}</td>
                  <td className="px-3 py-3">{formatPrice(data.totals.payable)}</td>
                  <td className="px-3 py-3">—</td>
                  <td className="px-3 py-3">{formatPrice(data.totals.net)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
