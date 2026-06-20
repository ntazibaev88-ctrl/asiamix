import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Star, Crown, Lock, ExternalLink } from "lucide-react";
import type { Book } from "@/types";

const CATEGORIES = [
  { value: "money", label: "Ақша", emoji: "💰" },
  { value: "business", label: "Бизнес", emoji: "💼" },
  { value: "self_development", label: "Өзін дамыту", emoji: "🚀" },
  { value: "investing", label: "Инвестиция", emoji: "📈" },
];

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user!.id)
    .single();
  const isVip = profile?.plan === "vip";

  let query = supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: books } = await query;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Кітаптар кітапханасы</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Ақша, бизнес және өзін дамыту туралы ең жақсы кітаптар
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/books"
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
            !category
              ? "bg-primary-600 text-white"
              : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Барлығы
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/books?category=${cat.value}`}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              category === cat.value
                ? "bg-primary-600 text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {cat.emoji} {cat.label}
          </Link>
        ))}
      </div>

      {!books || books.length === 0 ? (
        <div className="py-16 text-center">
          <BookOpen className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Кітаптар табылмады</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book: Book) => {
            const cat = CATEGORIES.find((c) => c.value === book.category);
            const isLocked = book.is_premium && !isVip;

            return (
              <div
                key={book.id}
                className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden card-hover"
              >
                {/* Cover */}
                <div className="aspect-[3/4] relative bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/50 dark:to-violet-950/50 flex items-center justify-center">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-primary-300" />
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Lock className="h-10 w-10 text-white" />
                    </div>
                  )}
                  {book.is_premium && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="premium">
                        <Crown className="h-3 w-3" />
                        VIP
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">{cat?.label || book.category}</Badge>
                  <h3 className="font-semibold mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">{book.author}</p>

                  {book.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                  )}

                  {book.description && (
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3">
                      {book.description}
                    </p>
                  )}

                  {isLocked ? (
                    <Link
                      href="/premium"
                      className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                    >
                      <Crown className="h-3.5 w-3.5" />
                      VIP алу
                    </Link>
                  ) : book.buy_url ? (
                    <a
                      href={book.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Сатып алу
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
