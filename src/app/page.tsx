import Link from 'next/link';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { BookOpen, Code2, Palette, Zap, Award, Globe, ChevronRight, Star } from 'lucide-react';

const courses = [
  {
    icon: Code2,
    title: 'HTML Fundamentals',
    slug: 'html',
    lessons: 15,
    price: 4990,
    color: '#e34c26',
    desc: 'Веб-беттердің негізін үйреніңіз. Тегтер, атрибуттар, семантикалық HTML.',
  },
  {
    icon: Palette,
    title: 'CSS Fundamentals',
    slug: 'css',
    lessons: 15,
    price: 4990,
    color: '#264de4',
    desc: 'Веб-беттерді стильдеу. Flexbox, Grid, анимациялар, responsive дизайн.',
  },
  {
    icon: Zap,
    title: 'JavaScript Fundamentals',
    slug: 'javascript',
    lessons: 15,
    price: 7990,
    color: '#f7df1e',
    desc: 'Бағдарламалаудың негіздерін үйреніңіз. DOM, Events, Fetch API, Async/Await.',
  },
];

const benefits = [
  { icon: Globe, title: 'Қазақ тілінде', desc: 'Барлық курстар толықтай қазақ тілінде түсіндіріледі' },
  { icon: BookOpen, title: 'Қадамдап оқыту', desc: 'Нөлден бастап, бірте-бірте күрделене бере отырып оқисыз' },
  { icon: Code2, title: 'Практикалық жобалар', desc: 'Нақты жобалар арқылы тәжірибе жинайсыз' },
  { icon: Award, title: 'Сертификат', desc: 'Курсты аяқтаған соң сертификат аласыз' },
];

const testimonials = [
  {
    name: 'Арман Сейткали',
    role: 'Junior Frontend Developer',
    text: 'CodeOrda арқасында Frontend разработчик болдым! Қазақ тілінде түсіндіргені өте жақсы.',
  },
  {
    name: 'Айгерім Нұрланова',
    role: 'Студент',
    text: 'HTML және CSS курстарын аяқтадым. Менің алғашқы сайтым дайын! Рахмет CodeOrda!',
  },
  {
    name: 'Бекзат Жұмабеков',
    role: 'Web Developer',
    text: 'JavaScript курсы өте сапалы. Практикалық жобалар арқылы нақты тәжірибе алдым.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--brand)] opacity-[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-800 opacity-[0.04] blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-soft)] bg-[var(--brand-soft)] text-[var(--brand)] text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Қазақстанның №1 IT платформасы
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Бағдарламалауды<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              нөлден үйрен
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            HTML, CSS, JavaScript және болашақта React, Node.js, Python курстарын қазақ тілінде оқыңыз.
            Практикалық жобалар, сертификаттар.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand)] text-white font-semibold text-lg hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_40px_var(--brand-glow)] hover:shadow-[0_0_60px_var(--brand-glow)] hover:scale-105 active:scale-95"
            >
              Курстарды көру <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[var(--border-strong)] text-[var(--fg)] font-semibold text-lg hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all hover:scale-105 active:scale-95"
            >
              Тіркелу
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--success)]">✓</span> Тегін тіркелу
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--success)]">✓</span> Сертификат
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--success)]">✓</span> Практикалық жобалар
            </span>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Курстар</h2>
            <p className="text-[var(--muted)] text-lg">Қазақ тілінде сапалы IT білім</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.slug}
                className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--brand)] transition-all duration-300 hover:shadow-[0_0_40px_var(--brand-glow)] hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: course.color + '20' }}
                >
                  <course.icon className="w-6 h-6" style={{ color: course.color }} />
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-[var(--muted)] text-sm mb-5 leading-relaxed">{course.desc}</p>
                <div className="flex items-center justify-between mb-5 text-sm text-[var(--muted)]">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />{course.lessons} сабақ
                  </span>
                  <span className="font-bold text-lg text-[var(--fg)]">{course.price.toLocaleString()} ₸</span>
                </div>
                <Link
                  href={`/courses/${course.slug}`}
                  className="block w-full text-center py-2.5 px-4 rounded-lg border border-[var(--brand)] text-[var(--brand)] font-medium text-sm group-hover:bg-[var(--brand)] group-hover:text-white transition-all"
                >
                  Толығырақ
                </Link>
              </div>
            ))}
          </div>

          {/* Bundle */}
          <div className="mt-8 rounded-2xl border border-[var(--brand)] bg-gradient-to-r from-[var(--brand-soft)] to-transparent p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-2">
                Жинақ бумасы
              </div>
              <h3 className="text-2xl font-bold mb-2">Барлық курстар</h3>
              <p className="text-[var(--muted)]">HTML + CSS + JavaScript — барлығы бір бумада</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-[var(--muted)] line-through mb-1">17 970 ₸</div>
              <div className="text-3xl font-bold text-[var(--brand)] mb-3">14 990 ₸</div>
              <Link
                href="/courses"
                className="inline-block px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)]"
              >
                Сатып алу
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-[var(--bg-elevated)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Артықшылықтары</h2>
            <p className="text-[var(--muted)] text-lg">Неліктен CodeOrda-ны таңдайды?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--brand)] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-[var(--brand)]" />
                </div>
                <h3 className="font-bold mb-2">{b.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Пікірлер</h2>
            <p className="text-[var(--muted)] text-lg">Оқушыларымыз не айтады?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--warning)] text-[var(--warning)]" />
                  ))}
                </div>
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-[var(--muted)]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl border border-[var(--brand)] bg-gradient-to-b from-[var(--brand-soft)] to-transparent p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Бастауға дайынсыз ба?</h2>
            <p className="text-[var(--muted)] text-lg mb-8">Бүгін тіркеліп, бірінші сабаққа қатысыңыз</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand)] text-white font-semibold text-lg hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_40px_var(--brand-glow)]"
            >
              Тегін тіркелу <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
