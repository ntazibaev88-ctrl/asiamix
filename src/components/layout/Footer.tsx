import Link from 'next/link';
import { Code2, Send, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <Code2 className="w-6 h-6 text-[var(--brand)]" />
              <span>Code<span className="text-[var(--brand)]">Orda</span></span>
            </Link>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Қазақстанның IT мамандарын дайындайтын платформа
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[var(--fg)]">Навигация</h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link href="/" className="hover:text-[var(--brand)] transition-colors">
                  Басты бет
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[var(--brand)] transition-colors">
                  Курстар
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[var(--brand)] transition-colors">
                  Тіркелу
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[var(--fg)]">Байланыс</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://t.me/codeorda"
                  className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
                >
                  <Send className="w-4 h-4" />Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/codeorda"
                  className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
                >
                  <span className="w-4 h-4 text-center text-xs font-bold">IG</span>Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@codeorda.kz"
                  className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--brand)] transition-colors"
                >
                  <Mail className="w-4 h-4" />info@codeorda.kz
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--border)] mt-8 pt-8 text-center text-sm text-[var(--faint)]">
          <p>© 2024 CodeOrda. Барлық құқықтар қорғалған.</p>
        </div>
      </div>
    </footer>
  );
}
