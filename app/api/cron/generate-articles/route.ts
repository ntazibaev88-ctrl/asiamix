import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://qmwbofntuccgblfsdtcd.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtd2JvZm50dWNjZ2JsZnNkdGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMTY5MDgsImV4cCI6MjA5NzU5MjkwOH0.hVKsJdOzvFW21gS7iT4UD6VZ_TFQve2fiDtroGlh2io";

const CATEGORIES = [
  { key: "investing", label: "Инвестиция", topic: "инвестиция және қор нарығы" },
  { key: "bonds", label: "Облигациялар", topic: "облигациялар және мемлекеттік бағалы қағаздар" },
  { key: "gold", label: "Алтын", topic: "алтынға инвестиция және бағалы металдар" },
  { key: "silver", label: "Күміс", topic: "күмісті сатып алу және инвестиция" },
  { key: "savings", label: "Жинақ", topic: "ақша жинақтау стратегиялары" },
  { key: "business", label: "Бизнес", topic: "шағын бизнес және кәсіпкерлік" },
  { key: "personal_finance", label: "Жеке қаржы", topic: "жеке қаржыны басқару және бюджет" },
];

const COVER_IMAGES: Record<string, string> = {
  investing: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  bonds: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
  gold: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
  silver: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=800&q=80",
  savings: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  business: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  personal_finance: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\sа-яёәіңғүұқөһ]/gi, "")
    .replace(/\s+/g, "-")
    .substring(0, 60) + "-" + Date.now();
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "qadam-cron-secret-2026";
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Pick a random category
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Сен қазақстандық қаржы сарапшысысың. ${category.topic} тақырыбына қазақ тілінде пайдалы мақала жаз.

Мақаланы JSON форматында қайтар (басқа мәтін жазба, тек JSON):
{
  "title": "Мақала тақырыбы (ұтымды, қызықты)",
  "excerpt": "Қысқаша сипаттама 1-2 сөйлем",
  "content": "Толық мақала мәтіні (кемінде 500 сөз, markdown форматта, ## тақырыптары бар)"
}

Талаптар:
- Нақты, пайдалы ақпарат
- Қазақстан жағдайына бейімделген
- Мысалдар мен сандар болсын
- Оқырманға іс жүзінде пайдалы болсын`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned no JSON");

    const article = JSON.parse(jsonMatch[0]) as {
      title: string;
      excerpt: string;
      content: string;
    };

    // Save to Supabase using service role (skip RLS)
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: { getAll: () => [], setAll: () => {} },
    });

    const { data, error } = await supabase.from("articles").insert({
      title: article.title,
      slug: slugify(article.title),
      excerpt: article.excerpt,
      content: article.content,
      cover_url: COVER_IMAGES[category.key],
      category: category.key,
      is_premium: false,
      published: true,
      ai_generated: true,
    }).select("id").single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      articleId: data.id,
      title: article.title,
      category: category.key,
    });
  } catch (error) {
    console.error("Article generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
