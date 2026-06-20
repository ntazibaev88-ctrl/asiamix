import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ApprovePaymentButton } from "@/components/admin/approve-payment-button";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="warning">Күтілуде</Badge>;
      case "approved": return <Badge variant="success">Расталды</Badge>;
      case "rejected": return <Badge variant="destructive">Қабылданбады</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Төлемдер</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          VIP төлемдерін басқару
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--secondary)]">
              <tr>
                <th className="text-left p-4 font-semibold">Пайдаланушы</th>
                <th className="text-left p-4 font-semibold">Сома</th>
                <th className="text-left p-4 font-semibold">Күні</th>
                <th className="text-left p-4 font-semibold">Статус</th>
                <th className="text-left p-4 font-semibold">Дәлел</th>
                <th className="text-left p-4 font-semibold">Әрекет</th>
              </tr>
            </thead>
            <tbody>
              {(payments || []).map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--secondary)] transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium">
                      {(payment.profiles as { full_name?: string; email?: string })?.full_name || "—"}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {(payment.profiles as { full_name?: string; email?: string })?.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{formatCurrency(payment.amount)}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {payment.months}ай + {payment.bonus_months}ай бонус
                    </div>
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)]">
                    {formatDate(payment.created_at)}
                  </td>
                  <td className="p-4">{getStatusBadge(payment.status)}</td>
                  <td className="p-4">
                    {payment.proof_url ? (
                      <a
                        href={payment.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Скриншот →
                      </a>
                    ) : (
                      <span className="text-[var(--muted-foreground)]">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {payment.status === "pending" && (
                      <ApprovePaymentButton
                        paymentId={payment.id}
                        userId={payment.user_id}
                        months={payment.months + payment.bonus_months}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!payments || payments.length === 0) && (
            <div className="py-12 text-center text-[var(--muted-foreground)]">
              Төлемдер жоқ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
