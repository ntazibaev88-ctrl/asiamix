import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://qmwbofntuccgblfsdtcd.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtd2JvZm50dWNjZ2JsZnNkdGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMTY5MDgsImV4cCI6MjA5NzU5MjkwOH0.hVKsJdOzvFW21gS7iT4UD6VZ_TFQve2fiDtroGlh2io";

// Real Kaspi rekvizits
const EXPECTED = {
  cardLast4: "9653",
  phone: "77712634685",
  recipient: "Арайлым",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Must be admin
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const ADMIN_EMAILS = ["ntazibaev88@gmail.com"];
  const isAdmin = profile?.role === "admin" || ADMIN_EMAILS.includes(user.email || "");
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { paymentId, proofUrl } = await request.json() as { paymentId: string; proofUrl: string };

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const anonSupabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });

  try {
    // Fetch image for hashing & AI analysis
    const imgRes = await fetch(proofUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    const imgHash = crypto.createHash("sha256").update(Buffer.from(imgBuffer)).digest("hex");

    // Check for duplicate receipt
    const { data: existing } = await anonSupabase
      .from("payments")
      .select("id")
      .eq("image_hash", imgHash)
      .neq("id", paymentId)
      .single();

    if (existing) {
      await anonSupabase.from("payments").update({
        ai_verdict: "rejected",
        ai_notes: "⚠️ ДУБЛИКАТ ЧЕК: Бұл скриншот бұрын пайдаланылған!",
        image_hash: imgHash,
      }).eq("id", paymentId);

      return NextResponse.json({
        verdict: "rejected",
        reason: "Дубликат чек анықталды",
      });
    }

    // Convert image to base64 for Claude Vision
    const base64 = Buffer.from(imgBuffer).toString("base64");
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: contentType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: base64,
              },
            },
            {
              type: "text",
              text: `Бұл Kaspi Bank төлем скриншоты. Тексер:

1. Сома ₸990 ма?
2. Карта нөмірінің соңғы 4 цифры ${EXPECTED.cardLast4} ма?
3. Алушының аты "${EXPECTED.recipient}" ма?
4. Бұл нақты Kaspi чегі ме (фейк емес)?

JSON форматта жауап бер (тек JSON, басқа мәтін жазба):
{
  "verdict": "approved" немесе "rejected" немесе "uncertain",
  "amount_correct": true/false,
  "card_correct": true/false,
  "recipient_correct": true/false,
  "is_genuine": true/false,
  "notes": "қысқаша түсіндірме қазақша"
}`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned no JSON");

    const result = JSON.parse(jsonMatch[0]) as {
      verdict: string;
      amount_correct: boolean;
      card_correct: boolean;
      recipient_correct: boolean;
      is_genuine: boolean;
      notes: string;
    };

    // Save AI verdict to payment
    await anonSupabase.from("payments").update({
      ai_verdict: result.verdict,
      ai_notes: result.notes,
      image_hash: imgHash,
    }).eq("id", paymentId);

    // Auto-approve if AI is confident
    if (result.verdict === "approved" && result.is_genuine) {
      // Get payment details
      const { data: payment } = await anonSupabase
        .from("payments")
        .select("user_id, months, bonus_months")
        .eq("id", paymentId)
        .single();

      if (payment) {
        const totalMonths = payment.months + payment.bonus_months;
        const expiresAt = new Date();
        // Check existing VIP
        const { data: userProfile } = await anonSupabase
          .from("profiles")
          .select("vip_expires_at")
          .eq("id", payment.user_id)
          .single();

        if (userProfile?.vip_expires_at && new Date(userProfile.vip_expires_at) > new Date()) {
          expiresAt.setTime(new Date(userProfile.vip_expires_at).getTime());
        }
        expiresAt.setMonth(expiresAt.getMonth() + totalMonths);

        await anonSupabase.from("profiles").update({
          plan: "vip",
          vip_expires_at: expiresAt.toISOString(),
        }).eq("id", payment.user_id);

        await anonSupabase.from("payments").update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
        }).eq("id", paymentId);

        // Send notification
        await anonSupabase.from("notifications").insert({
          user_id: payment.user_id,
          title: "🎉 VIP белсендірілді!",
          message: `Төлеміңіз расталды. VIP мүшелік ${totalMonths} айға белсендірілді.`,
          type: "success",
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("OCR verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
