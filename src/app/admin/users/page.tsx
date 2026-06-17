"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const users = [
  { id: 1, name: "Айгерим Серикова", phone: "+7 701 111 22 33", role: "customer", orders: 24 },
  { id: 2, name: "Ерлан Беков", phone: "+7 702 222 33 44", role: "courier", orders: 312 },
  { id: 3, name: "NOMI Sushi", phone: "+7 727 333 44 55", role: "store_admin", orders: 312 },
  { id: 4, name: "Дамир Касымов", phone: "+7 705 444 55 66", role: "customer", orders: 7 },
];

export default function AdminUsersPage() {
  const { t } = useI18n();
  const [banned, setBanned] = useState<Record<number, boolean>>({});

  return (
    <>
      <PageHeader title={t("nav.users")} subtitle={t("role.admin")} />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                <th className="px-5 py-3 font-semibold">{t("store.name")}</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                  {t("store.phone")}
                </th>
                <th className="px-5 py-3 font-semibold">Роль</th>
                <th className="px-5 py-3 font-semibold">{t("nav.orders")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-border last:border-0 hover:bg-surface-2"
                >
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="hidden px-5 py-3 text-muted sm:table-cell">
                    {u.phone}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone="info">
                      {t(
                        u.role === "store_admin"
                          ? "role.store"
                          : `role.${u.role}`,
                      )}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 font-semibold">{u.orders}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() =>
                        setBanned((s) => ({ ...s, [u.id]: !s[u.id] }))
                      }
                      className="cursor-pointer"
                    >
                      <Badge tone={banned[u.id] ? "danger" : "neutral"}>
                        {banned[u.id] ? "BANNED" : "BAN"}
                      </Badge>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
