import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sameOrigin } from "@/lib/auth/security";
import { products } from "@/lib/mock";
import {
  deliveryFeeByWeight,
  weightSeverity,
  bagsFor,
} from "@/lib/delivery";

// Authoritative, SERVER-SIDE delivery quote. The client may compute the same
// numbers for instant UI (shared pure functions), but this endpoint is the
// source of truth: weight and fee are derived from the server's product table,
// never trusted from the request body.
const schema = z.object({
  items: z
    .array(
      z.object({
        id: z.number().int(),
        qty: z.number().int().min(1).max(999),
      }),
    )
    .max(200),
});

export async function POST(req: NextRequest) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  let totalKg = 0;
  let units = 0;
  for (const it of parsed.data.items) {
    const p = products.find((x) => x.id === it.id);
    if (!p) continue; // ignore unknown ids; never trust client weights
    totalKg += p.weightKg * it.qty;
    units += it.qty;
  }
  totalKg = Math.round(totalKg * 10) / 10;

  return NextResponse.json({
    totalKg,
    deliveryFee: deliveryFeeByWeight(totalKg),
    severity: weightSeverity(totalKg),
    bags: bagsFor(units),
    units,
  });
}
