'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Code2, Palette, Zap, Award, Globe, ChevronRight, Star, Send, Users, CheckCircle, Play, Lock } from 'lucide-react';
import { CounterAnimation } from '@/components/ui/CounterAnimation';

const courses = [
  { icon: '🌐', title: 'HTML Fundamentals', slug: 'html', lessons: 15, price: 4990, salePrice: 1990, free: 3, color: '#e34c26', desc: 'Веб-беттердің негізін үйреніңіз. Тегтер, атрибуттар, семантикалық HTML.' },
  { icon: '🎨', title: 'CSS Fundamentals', slug: 'css', lessons: 15, price: 4990, salePrice: 1990, free: 3, color: '#264de4', desc: 'Flexbox, Grid, анимациялар, responsive дизайн.' },
  { icon: '⚡', title: 'JavaScript Fundamentals', slug: 'javascript', lessons: 15, price: 7990, salePrice: 1990, free: 3, color: '#f7df1e', desc: 'DOM, Events, Fetch API, Async/Await.' },
];

const benefits = [
  { icon: Globe, title: 'Қазақ тілінде', desc: 'Барлық курстар толықтай қазақ тілінде' },
  { icon: BookOpen, title: 'Қадамдап оқыту', desc: 'Нөлден бастап, бірте-бірте үйренесіз' },
  { icon: Code2, title: 'Практикалық жобалар', desc: 'Нақты жобалар арқылы тәжірибе' },
  { icon: Award, title: 'Сертификат', desc: 'PDF сертификат жүктеп алыңыз' },
];

const testimonials = [
  { name: 'Арман С.', role: 'Junior Frontend', text: 'CodeOrda арқасында Frontend developer болдым! Қазақша түсіндіруі өте жақсы.', rating: 5 },
  { name: 'Айгерім Н.', role: 'Студент', text: 'HTML мен CSS-ті үйреніп, өз сайтымды жасадым. Рахмет!', rating: 5 },
  { name: 'Бекзат Ж.', role: 'Web Developer', text: 'JavaScript курсы өте сапалы. Практикалық тапсырмалар ең жақсысы.', rating: 5 },
  { name: 'Дана М.', role: 'UI/UX студент', text: '3 айда нөлден курстарды аяқтадым. Сертификат алдым!', rating: 5 },
  { name: 'Нурлан К.', role: 'Freelancer', text: 'Фрилансер болдым CodeOrda арқасында. Ай сайын 200к+ табамын.', rating: 5 },
  { name: 'Сабина Т.', role: 'QA Engineer', text: 'Бастауыш деңгейден кәсіпқойға дейін жеттіру үшін тамаша платформа.', rating: 5 },
];

const futureCourses = [
  { icon: '⚛️', title: 'React', status: 'Жақында' },
  { icon: '🟢', title: 'Node.js', status: 'Жақында' },
  { icon: '🐍', title: 'Python', status: 'Жақында' },
  { icon: '🔷', title: 'TypeScript', status: 'Жақында' },
  { icon: '▲', title: 'Next.js', status: 'Жақында' },
  { icon: '🌿', title: 'Git/GitHub', status: 'Жақында' },
];

const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Navbar inline for client component */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="w-7 h-7 text-[var(--brand)]" />
            <span>Code<span className="text-[var(--brand)]">Orda</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#courses" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">Курстар</Link>
            <Link href="#about" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">Артықшылықтар</Link>
            <Link href="#testimonials" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">Пікірлер</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">Кіру</Link>
            <Link href="/register" className="text-sm px-4 py-2 rounded-lg bg-[var(--brand)] text-white font-medium hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)]">Тіркелу</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[var(--brand)] opacity-[0.07] blur-[140px] animate-glow" />
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-800 opacity-[0.04] blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-900 opacity-[0.04] blur-[80px]" />
        </div>

        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-soft)] bg-[var(--brand-soft)] text-[var(--brand)] text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Қазақстанның №1 IT платформасы
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Бағдарламалауды<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500">нөлден үйрен</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            HTML, CSS, JavaScript курстарын қазақ тілінде оқыңыз. Практикалық жобалар, тестілер, PDF сертификат.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand)] text-white font-semibold text-lg hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_40px_var(--brand-glow)] hover:shadow-[0_0_60px_var(--brand-glow)] hover:scale-105 active:scale-95">
              Тегін бастау <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="#courses" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[var(--border-strong)] font-semibold text-lg hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all hover:scale-105 active:scale-95">
              <Play className="w-5 h-5" /> Курстарды көру
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[var(--success)]" />Алғашқы 3 сабақ тегін</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[var(--success)]" />PDF Сертификат</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[var(--success)]" />Телефоннан оқу</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Counter */}
      <section className="py-16 px-4 border-y border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: 1000, suffix: '+', label: 'Студент' },
            { value: 45, suffix: '+', label: 'Сабақ' },
            { value: 95, suffix: '%', label: 'Қанағаттану' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-bold text-[var(--brand)] mb-1">
                <CounterAnimation target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-[var(--muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">Курстар</motion.h2>
            <motion.p variants={fadeUp} className="text-[var(--muted)] text-lg">Алғашқы 3 сабақ тегін!</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <motion.div key={course.slug} variants={fadeUp} className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--brand)] transition-all duration-300 hover:shadow-[0_0_40px_var(--brand-glow)] hover:-translate-y-2 flex flex-col">
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--success-soft)] text-[var(--success)]">
                    {course.free} сабақ тегін
                  </span>
                </div>
                <div className="text-4xl mb-5">{course.icon}</div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-[var(--muted)] text-sm mb-5 leading-relaxed flex-1">{course.desc}</p>
                <div className="flex items-center justify-between mb-5 text-sm text-[var(--muted)]">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{course.lessons} сабақ</span>
                  <div className="text-right">
                    <div className="font-bold text-xl text-[var(--brand)]">{course.salePrice.toLocaleString()} ₸</div>
                    <div className="text-xs text-[var(--faint)] line-through">{course.price.toLocaleString()} ₸</div>
                  </div>
                </div>
                <Link href={`/courses/${course.slug}`} className="block w-full text-center py-3 px-4 rounded-xl bg-[var(--brand)] text-white font-medium group-hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)]">
                  Бастау →
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Bundle */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-[var(--brand)] bg-gradient-to-r from-[var(--brand-soft)] to-transparent p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-2">🔥 Үнемді жинақ</div>
              <h3 className="text-2xl font-bold mb-2">Толық пакет</h3>
              <p className="text-[var(--muted)]">HTML + CSS + JavaScript — барлығы бір бумада</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-[var(--muted)] line-through mb-1">17 970 ₸</div>
              <div className="text-3xl font-bold text-[var(--brand)] mb-3">14 990 ₸</div>
              <Link href="/register" className="inline-block px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)]">
                Сатып алу
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="about" className="py-20 px-4 bg-[var(--bg-elevated)]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Неліктен CodeOrda?</h2>
              <p className="text-[var(--muted)] text-lg">Қазақстандағы ең жақсы IT платформасы</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b) => (
                <motion.div key={b.title} variants={fadeUp} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--brand)] transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <b.icon className="w-6 h-6 text-[var(--brand)]" />
                  </div>
                  <h3 className="font-bold mb-2">{b.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Оқушылар пікірлері</h2>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_,i) => <Star key={i} className="w-5 h-5 fill-[var(--warning)] text-[var(--warning)]" />)}
                <span className="ml-2 text-[var(--muted)] text-sm">4.9 / 5.0</span>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <motion.div key={t.name} variants={fadeUp} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--brand)] transition-all">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_,i) => <Star key={i} className="w-4 h-4 fill-[var(--warning)] text-[var(--warning)]" />)}
                  </div>
                  <p className="text-[var(--muted)] text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] font-bold text-sm flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-[var(--muted)]">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Future Courses */}
      <section className="py-20 px-4 bg-[var(--bg-elevated)]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Болашақ курстар</h2>
              <p className="text-[var(--muted)]">Жақын арада қосылады</p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {futureCourses.map((c) => (
                <motion.div key={c.title} variants={fadeUp} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center opacity-70 hover:opacity-100 transition-all group">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <div className="font-semibold text-sm mb-1">{c.title}</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-[var(--muted)]">
                    <Lock className="w-3 h-3" /> {c.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Telegram */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#0088cc]/10 to-transparent p-8 text-center">
            <Send className="w-12 h-12 text-[#0088cc] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Telegram-ға қосылыңыз</h2>
            <p className="text-[var(--muted)] mb-6">Жаңа курстар мен жеңілдіктер туралы бірінші болып біліңіз</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/codeorda" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0088cc] text-white font-semibold hover:bg-[#0077bb] transition-all">
                <Send className="w-4 h-4" /> Канал
              </a>
              <a href="https://t.me/codeorda_chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#0088cc] text-[#0088cc] font-semibold hover:bg-[#0088cc] hover:text-white transition-all">
                <Users className="w-4 h-4" /> Чат
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="rounded-3xl border border-[var(--brand)] bg-gradient-to-b from-[var(--brand-soft)] to-transparent p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Бастауға дайынсыз ба?</h2>
            <p className="text-[var(--muted)] text-lg mb-8">Алғашқы 3 сабақ тегін. Тіркелу 1 минут.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand)] text-white font-semibold text-lg hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_40px_var(--brand-glow)] hover:scale-105">
              Тегін бастау <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
                <Code2 className="w-6 h-6 text-[var(--brand)]" />
                <span>Code<span className="text-[var(--brand)]">Orda</span></span>
              </Link>
              <p className="text-[var(--muted)] text-sm">Қазақстанның IT мамандарын дайындайтын платформа</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li><Link href="/courses" className="hover:text-[var(--brand)] transition-colors">Курстар</Link></li>
                <li><Link href="/register" className="hover:text-[var(--brand)] transition-colors">Тіркелу</Link></li>
                <li><Link href="/login" className="hover:text-[var(--brand)] transition-colors">Кіру</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Байланыс</h3>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li><a href="https://t.me/codeorda" className="hover:text-[var(--brand)] transition-colors flex items-center gap-2"><Send className="w-4 h-4" />Telegram</a></li>
                <li><a href="mailto:info@codeorda.kz" className="hover:text-[var(--brand)] transition-colors">info@codeorda.kz</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--faint)]">
            © 2024 CodeOrda. Барлық құқықтар қорғалған.
          </div>
        </div>
      </footer>
    </div>
  );
}
