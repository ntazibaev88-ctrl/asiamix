import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Сен Qadam платформасының AI қаржы кеңесшісісің. Qadam — қазақстандықтарға арналған жеке қаржыны басқару платформасы.

Платформада мыналар бар:
- Мақсат қою (үй, көлік, бизнес, білім, саяхат, отбасы, денсаулық)
- Жинақ жоспарлау (жинақ шоттары, пайыздық есептеулер)
- Қаржылық білім (мақалалар: инвестиция, облигациялар, алтын, күміс, жинақ, бизнес, жеке қаржы)
- Кітаптар кітапханасы (қаржы, бизнес, өзін дамыту)
- Фильмдер (мотивациялық, бизнес, қаржы туралы)
- Күнделік (қаржылық жазбалар, ойлар)
- VIP мүшелік — 990 теңге/ай, Kaspi арқылы төлеу

Ережелер:
- Тек қазақ тілінде жауап бер
- Жауаптар қысқа, пайдалы, нақты болсын (3-5 сөйлем)
- Қазақстан жағдайына бейімдел (теңге, Kaspi, казахстандық реалиялар)
- Пайдаланушыға мотивация бер, позитивті бол
- Нақты сандар мен мысалдар кел
- Qadam-ның мүмкіндіктерін кеңес ретінде ұсын`;

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI қол жетімді емес" }, { status: 500 });
  }

  const { messages } = await request.json() as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "Қате орын алды" }, { status: 500 });
  }
}
