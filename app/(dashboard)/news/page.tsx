import { Newspaper, ExternalLink, Globe, TrendingUp, Clock, RefreshCcw } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

function parseRSS(xml: string, limit = 8): NewsItem[] {
  const items: NewsItem[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;

  while ((m = re.exec(xml)) !== null && items.length < limit) {
    const b = m[1];
    const get = (tag: string) => {
      const tm = b.match(
        new RegExp(`<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`)
      );
      return (tm?.[1] ?? "")
        .trim()
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#\d+;/g, "");
    };
    const linkM =
      b.match(/<link>([\s\S]*?)<\/link>/) ||
      b.match(/<link[^>]+href="([^"]+)"/);
    const title = get("title");
    if (!title) continue;
    items.push({
      title,
      link: (linkM?.[1] ?? "").trim(),
      pubDate: get("pubDate"),
      description: get("description")
        .replace(/<[^>]+>/g, "")
        .slice(0, 220),
    });
  }
  return items;
}

async function fetchRSS(url: string, limit = 8): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; QadamNews/1.0; +https://qadamkz.vercel.app)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml, limit);
  } catch {
    return [];
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Жаңа ғана";
  if (h < 24) return `${h} сағат бұрын`;
  const days = Math.floor(h / 24);
  if (days === 1) return "Кеше";
  if (days < 7) return `${days} күн бұрын`;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function NewsCard({ item, idx }: { item: NewsItem; idx: number }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <span className="shrink-0 w-7 h-7 rounded-lg bg-[var(--secondary)] flex items-center justify-center text-xs font-bold text-[var(--muted-foreground)]">
        {idx + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mt-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {item.pubDate && (
            <span className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {formatDate(item.pubDate)}
            </span>
          )}
          <ExternalLink className="h-3 w-3 text-[var(--muted-foreground)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </a>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-10 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)]">
      <RefreshCcw className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-3 opacity-40" />
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}

export default async function NewsPage() {
  const [bloomberg, kapital, kursiv] = await Promise.all([
    fetchRSS("https://feeds.bloomberg.com/markets/news.rss", 8),
    fetchRSS("https://kapital.kz/rss/", 8),
    fetchRSS("https://kursiv.media/rss/", 6),
  ]);

  // Merge Kazakhstan sources, deduplicate by title
  const seen = new Set<string>();
  const kazakhNews: NewsItem[] = [];
  for (const item of [...kapital, ...kursiv]) {
    const key = item.title.slice(0, 60);
    if (!seen.has(key)) {
      seen.add(key);
      kazakhNews.push(item);
    }
    if (kazakhNews.length >= 10) break;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
        <div className="absolute top-3 right-6 text-6xl opacity-10">📰</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Newspaper className="h-5 w-5" />
            <h1 className="text-xl font-bold">Қаржылық жаңалықтар</h1>
          </div>
          <p className="text-sm text-white/60">Bloomberg • Kapital.kz • Kursiv.media — 30 минут сайын жаңарады</p>
        </div>
      </div>

      {/* Bloomberg — International */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
            <Globe className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base">Bloomberg</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Халықаралық қаржы жаңалықтары</p>
          </div>
        </div>

        {bloomberg.length > 0 ? (
          <div className="space-y-2">
            {bloomberg.map((item, i) => (
              <NewsCard key={i} item={item} idx={i} />
            ))}
          </div>
        ) : (
          <EmptyState label="Bloomberg жаңалықтары жүктелмеді. Кейінірек қайталап көріңіз." />
        )}
      </section>

      {/* Kazakhstan Finance */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base">Қазақстан жаңалықтары</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Kapital.kz • Kursiv.media — KASE, банктер, экономика</p>
          </div>
        </div>

        {kazakhNews.length > 0 ? (
          <div className="space-y-2">
            {kazakhNews.map((item, i) => (
              <NewsCard key={i} item={item} idx={i} />
            ))}
          </div>
        ) : (
          <EmptyState label="Қазақстан жаңалықтары жүктелмеді. Кейінірек қайталап көріңіз." />
        )}
      </section>

      <p className="text-center text-xs text-[var(--muted-foreground)]">
        Жаңалықтар сыртқы сайттарда жарияланады. Барлық материалдар авторлық құқықтары өздерінің иелеріне тиесілі.
      </p>
    </div>
  );
}
