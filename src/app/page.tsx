'use client'
import { useState } from 'react'

const categories = [
  { slug: 'all', name_ru: 'Все', name_kk: 'Барлығы', emoji: '🍽️' },
  { slug: 'rolls', name_ru: 'Роллы', name_kk: 'Роллдар', emoji: '🍱' },
  { slug: 'burgers', name_ru: 'Бургеры', name_kk: 'Бургерлер', emoji: '🍔' },
  { slug: 'pizza', name_ru: 'Пицца', name_kk: 'Пицца', emoji: '🍕' },
  { slug: 'wok', name_ru: 'Вок', name_kk: 'Вок', emoji: '🥢' },
  { slug: 'drinks', name_ru: 'Напитки', name_kk: 'Сусындар', emoji: '🥤' },
]

const products = [
  { id: 1, cat: 'rolls', name_ru: 'Филадельфия', name_kk: 'Филадельфия', desc_ru: 'Лосось, сливочный сыр, авокадо', desc_kk: 'Лосось, кілегей ірімшік, авокадо', price: 2900, tag: 'HIT', emoji: '🍱' },
  { id: 2, cat: 'rolls', name_ru: 'Дракон', name_kk: 'Дракон', desc_ru: 'Тунец, авокадо, японский соус', desc_kk: 'Тунец, авокадо, жапондық сос', price: 3200, tag: 'HOT', emoji: '🍣' },
  { id: 3, cat: 'rolls', name_ru: 'Калифорния', name_kk: 'Калифорния', desc_ru: 'Краб, авокадо, огурец', desc_kk: 'Краб, авокадо, қияр', price: 2600, tag: null, emoji: '🫙' },
  { id: 4, cat: 'burgers', name_ru: 'Классик Бургер', name_kk: 'Классик Бургер', desc_ru: 'Говядина, салат, горчица, кетчуп', desc_kk: 'Сиыр еті, салат, қыша, кетчуп', price: 1800, tag: 'NEW', emoji: '🍔' },
  { id: 5, cat: 'burgers', name_ru: 'Чикен Бургер', name_kk: 'Чикен Бургер', desc_ru: 'Курица, картофель, соус', desc_kk: 'Тауық, картофель, сос', price: 1600, tag: null, emoji: '🍗' },
  { id: 6, cat: 'pizza', name_ru: 'Маргарита', name_kk: 'Маргарита', desc_ru: 'Классические томаты, моцарелла', desc_kk: 'Классикалық помидор, моцарелла', price: 2400, tag: null, emoji: '🍕' },
  { id: 7, cat: 'pizza', name_ru: 'Пепперони', name_kk: 'Пепперони', desc_ru: 'Пепперони, моцарелла, итальянские травы', desc_kk: 'Пепперони, моцарелла, итальян шөп', price: 2700, tag: 'HIT', emoji: '🍕' },
  { id: 8, cat: 'wok', name_ru: 'Вок с курицей', name_kk: 'Вок с курицей', desc_ru: 'Курица, лапша, азиатский соус', desc_kk: 'Тауық, нудл, азиаттық сос', price: 2100, tag: 'HIT', emoji: '🥢' },
  { id: 9, cat: 'wok', name_ru: 'Вок с говядиной', name_kk: 'Вок с говядиной', desc_ru: 'Говядина, лапша, устричный соус', desc_kk: 'Сиыр еті, нудл, устрица сосы', price: 2400, tag: null, emoji: '🥢' },
  { id: 10, cat: 'drinks', name_ru: 'Кола 0.5', name_kk: 'Кола 0.5', desc_ru: 'Охлаждённая', desc_kk: 'Суытылған', price: 400, tag: null, emoji: '🥤' },
  { id: 11, cat: 'drinks', name_ru: 'Апельсиновый сок', name_kk: 'Апельсин шырыны', desc_ru: 'Натуральный, 330мл', desc_kk: 'Табиғи, 330мл', price: 550, tag: null, emoji: '🧃' },
]

const reviews = [
  { name: 'Айгерим', rating: 5, text: 'Роллы очень вкусные, доставка быстрая!', role: 'Постоянный клиент' },
  { name: 'Дамир', rating: 5, text: 'Бургер отлично приготовлен. Цена хорошая.', role: 'Клиент' },
  { name: 'Зарина', rating: 4, text: 'Вок вкусный, немного подождали. В целом хорошо!', role: 'Клиент' },
  { name: 'Алибек', rating: 5, text: 'Asia Mix — мой любимый сервис доставки!', role: 'Постоянный клиент' },
]

interface CartItem { id: number; name_ru: string; price: number; qty: number; emoji: string }
'use client'
import { useState } from 'react'

const categories = [
  { slug: 'all', name_ru: 'Все', name_kk: 'Барлығы', emoji: '🍽️' },
  { slug: 'rolls', name_ru: 'Роллы', name_kk: 'Роллдар', emoji: '🍱' },
  { slug: 'burgers', name_ru: 'Бургеры', name_kk: 'Бургерлер', emoji: '🍔' },
  { slug: 'pizza', name_ru: 'Пицца', name_kk: 'Пицца', emoji: '🍕' },
  { slug: 'wok', name_ru: 'Вок', name_kk: 'Вок', emoji: '🥢' },
  { slug: 'drinks', name_ru: 'Напитки', name_kk: 'Сусындар', emoji: '🥤' },
]

const products = [
  { id: 1, cat: 'rolls', name_ru: 'Филадельфия', name_kk: 'Филадельфия', desc_ru: 'Лосось, сливочный сыр, авокадо', desc_kk: 'Лосось, кілегей ірімшік, авокадо', price: 2900, tag: 'HIT', emoji: '🍱' },
  { id: 2, cat: 'rolls', name_ru: 'Дракон', name_kk: 'Дракон', desc_ru: 'Тунец, авокадо, японский соус', desc_kk: 'Тунец, авокадо, жапондық сос', price: 3200, tag: 'HOT', emoji: '🍣' },
  { id: 3, cat: 'rolls', name_ru: 'Калифорния', name_kk: 'Калифорния', desc_ru: 'Краб, авокадо, огурец', desc_kk: 'Краб, авокадо, қияр', price: 2600, tag: null, emoji: '🫙' },
  { id: 4, cat: 'burgers', name_ru: 'Классик Бургер', name_kk: 'Классик Бургер', desc_ru: 'Говядина, салат, горчица, кетчуп', desc_kk: 'Сиыр еті, салат, қыша, кетчуп', price: 1800, tag: 'NEW', emoji: '🍔' },
  { id: 5, cat: 'burgers', name_ru: 'Чикен Бургер', name_kk: 'Чикен Бургер', desc_ru: 'Курица, картофель, соус', desc_kk: 'Тауық, картофель, сос', price: 1600, tag: null, emoji: '🍗' },
  { id: 6, cat: 'pizza', name_ru: 'Маргарита', name_kk: 'Маргарита', desc_ru: 'Классические томаты, моцарелла', desc_kk: 'Классикалық помидор, моцарелла', price: 2400, tag: null, emoji: '🍕' },
  { id: 7, cat: 'pizza', name_ru: 'Пепперони', name_kk: 'Пепперони', desc_ru: 'Пепперони, моцарелла, итальянские травы', desc_kk: 'Пепперони, моцарелла, итальян шөп', price: 2700, tag: 'HIT', emoji: '🍕' },
  { id: 8, cat: 'wok', name_ru: 'Вок с курицей', name_kk: 'Вок с курицей', desc_ru: 'Курица, лапша, азиатский соус', desc_kk: 'Тауық, нудл, азиаттық сос', price: 2100, tag: 'HIT', emoji: '🥢' },
  { id: 9, cat: 'wok', name_ru: 'Вок с говядиной', name_kk: 'Вок с говядиной', desc_ru: 'Говядина, лапша, устричный соус', desc_kk: 'Сиыр еті, нудл, устрица сосы', price: 2400, tag: null, emoji: '🥢' },
  { id: 10, cat: 'drinks', name_ru: 'Кола 0.5', name_kk: 'Кола 0.5', desc_ru: 'Охлаждённая', desc_kk: 'Суытылған', price: 400, tag: null, emoji: '🥤' },
  { id: 11, cat: 'drinks', name_ru: 'Апельсиновый сок', name_kk: 'Апельсин шырыны', desc_ru: 'Натуральный, 330мл', desc_kk: 'Табиғи, 330мл', price: 550, tag: null, emoji: '🧃' },
]

const reviews = [
  { name: 'Айгерим', rating: 5, text: 'Роллы очень вкусные, доставка быстрая!', role: 'Постоянный клиент' },
  { name: 'Дамир', rating: 5, text: 'Бургер отлично приготовлен. Цена хорошая.', role: 'Клиент' },
  { name: 'Зарина', rating: 4, text: 'Вок вкусный, немного подождали. В целом хорошо!', role: 'Клиент' },
  { name: 'Алибек', rating: 5, text: 'Asia Mix — мой любимый сервис доставки!', role: 'Постоянный клиент' },
]

interface CartItem { id: number; name_ru: string; price: number; qty: number; emoji: string }
export default function Home() {return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', color: '#F5F5F5', fontFamily: 'Manrope, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');`}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${B}` }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', lineHeight: 0.9, letterSpacing: 1 }}>
          ASIA <span style={{ color: Y }}>MIX</span>
          <small style={{ display: 'block', fontFamily: 'Space Grotesk', fontSize: '0.5rem', letterSpacing: 3, color: '#8A8A8A', fontWeight: 600 }}>STREET FOOD</small>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: `1px solid ${B}`, borderRadius: 50, overflow: 'hidden' }}>
            {(['ru', 'kk'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '0.35rem 0.7rem', fontFamily: 'Space Grotesk', fontSize: '0.7rem', fontWeight: 700, background: lang === l ? Y : 'transparent', color: lang === l ? '#000' : '#8A8A8A', border: 'none', cursor: 'pointer' }}>
                {l === 'ru' ? 'РУС' : 'ҚАЗ'}
              </button>
            ))}
          </div>
          <button onClick={() => { setCartOpen(true); setStep('cart') }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: Y, color: '#000', border: 'none', borderRadius: 50, padding: '0.6rem 1.2rem', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
            🛒 {t('Корзина', 'Себет')}
            {cartCount > 0 && <span style={{ background: '#FF4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: '5rem 1.5rem 3rem', maxWidth: 1280, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,214,10,0.3) 0%, transparent 70%)', top: '-10%', right: '-5%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,214,10,0.1)', border: `1px solid ${B}`, padding: '0.4rem 1rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, color: Y, marginBottom: '1.5rem' }}>
          ⚡ {t('Доставка за 45 минут', '45 минутта жеткізу')}
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3.5rem, 13vw, 8rem)', lineHeight: 0.88, letterSpacing: 1, marginBottom: '1.5rem' }}>
          {t('БЫСТРАЯ', 'ЖЫЛДАМ')}
          <span style={{ color: Y, textShadow: '0 0 40px rgba(255,214,10,0.4)', display: 'block' }}>{t('ДОСТАВКА', 'ЖЕТКІЗУ')}</span>
          {t('ЕДЫ', 'ТАМАҚ')}
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#8A8A8A', maxWidth: 480, lineHeight: 1.7, marginBottom: '2.5rem', fontWeight: 300 }}>
          {t('Роллы, Бургеры, Пицца, Вок — горячо и вкусно прямо к вашей двери', 'Роллдар, Бургерлер, Пицца, Вок — есігіңізге дейін ыстық және дәмді')}
        </p>
        <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: Y, color: '#000', padding: '1rem 2rem', borderRadius: 50, fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}>
          🍱 {t('Смотреть меню', 'Мәзірді көру')}
        </button>
      </div>

      {/* TICKER */}
      <div style={{ background: Y, color: '#000', padding: '0.8rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '3rem', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem' }}>
          {['⚡ Доставка 45 мин', '🍱 Роллы от 2600₸', '🍔 Бургеры от 1600₸', '🍕 Пицца от 2400₸', '🥢 Вок от 2100₸', '⭐ Рейтинг 4.8'].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
      {/* MENU */}
      <div id="menu" style={{ padding: '5rem 1.5rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: Y, marginBottom: '0.8rem' }}>— {t('МЕНЮ', 'МӘЗІР')}</div>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', lineHeight: 0.95, letterSpacing: 1, marginBottom: '2.5rem' }}>
          {t('ВЫБЕРИ', 'ТАҢДА')} <span style={{ color: Y }}>{t('СВОЁ', 'ӨЗІҢНІҢ')}</span>
        </h2>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: '2rem', scrollbarWidth: 'none' }}>
          {categories.map(c => (
            <button key={c.slug} onClick={() => setActiveCat(c.slug)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '0.7rem 1.3rem', background: activeCat === c.slug ? Y : C, border: `1px solid ${activeCat === c.slug ? Y : B}`, borderRadius: 50, color: activeCat === c.slug ? '#000' : '#8A8A8A', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Manrope' }}>
              <span>{c.emoji}</span>{lang === 'ru' ? c.name_ru : c.name_kk}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(p => {
            const qty = cart[p.id]?.qty || 0
            return (
              <div key={p.id} style={{ background: C, border: `1px solid ${B}`, borderRadius: 24, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, background: '#161616', position: 'relative' }}>
                  {p.emoji}
                  {p.tag && <div style={{ position: 'absolute', top: 12, left: 12, background: p.tag === 'HOT' ? '#FF4444' : Y, color: p.tag === 'HOT' ? '#fff' : '#000', padding: '0.25rem 0.7rem', borderRadius: 50, fontSize: '0.68rem', fontWeight: 800, fontFamily: 'Space Grotesk', textTransform: 'uppercase' }}>{p.tag}</div>}
                </div>
                <div style={{ padding: '1.3rem' }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{lang === 'ru' ? p.name_ru : p.name_kk}</div>
                  <div style={{ fontSize: '0.82rem', color: '#8A8A8A', lineHeight: 1.6, marginBottom: '1rem', fontWeight: 300 }}>{lang === 'ru' ? p.desc_ru : p.desc_kk}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: Y, letterSpacing: 1 }}>{p.price.toLocaleString()} ₸</div>
                    {qty === 0 ? (
                      <button onClick={() => addItem(p)} style={{ background: Y, color: '#000', border: 'none', padding: '0.6rem 1.1rem', borderRadius: 50, fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Manrope' }}>+ {t('В корзину', 'Себетке')}</button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => removeItem(p.id)} style={{ background: '#222', border: `1px solid ${B}`, borderRadius: 50, width: 30, height: 30, fontSize: 18, cursor: 'pointer', color: Y, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                        <button onClick={() => addItem(p)} style={{ background: Y, border: 'none', borderRadius: 50, width: 30, height: 30, fontSize: 18, cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* REVIEWS */}
      <div style={{ padding: '0 1.5rem 5rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: Y, marginBottom: '0.8rem' }}>— {t('ОТЗЫВЫ', 'ПІКІРЛЕР')}</div>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', lineHeight: 0.95, letterSpacing: 1, marginBottom: '2.5rem' }}>
          {t('ЧТО ГОВОРЯТ', 'НЕ ДЕЙДІ')} <span style={{ color: Y }}>{t('КЛИЕНТЫ', 'КЛИЕНТТЕР')}</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: C, border: `1px solid ${B}`, borderRadius: 20, padding: '1.8rem' }}>
              <div style={{ color: Y, fontSize: '1rem', marginBottom: 12, letterSpacing: 2 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <div style={{ fontSize: '0.9rem', color: '#F5F5F5', lineHeight: 1.7, marginBottom: '1.2rem', fontWeight: 300 }}>{r.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: Y, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: 'Space Grotesk', fontSize: 14 }}>{r.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8A8A8A' }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${B}`, padding: '3rem 1.5rem', textAlign: 'center', background: '#121212' }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '1rem', letterSpacing: 1 }}>ASIA <span style={{ color: Y }}>MIX</span></div>
        <div style={{ fontSize: '0.82rem', color: '#8A8A8A' }}>{t('© 2026 Asia Mix. Все права защищены.', '© 2026 Asia Mix. Барлық құқықтар қорғалған.')}</div>
      </footer>
      {/* CART PANEL */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', justifyContent: 'flex-end' }} onClick={e => e.target === e.currentTarget && setCartOpen(false)}>
          <div style={{ background: '#121212', width: '100%', maxWidth: 420, height: '100%', overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 16, borderLeft: `1px solid ${B}` }}>

            {step === 'cart' && <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: 1 }}>{t('КОРЗИНА', 'СЕБЕТ')}</span>
                <button onClick={() => setCartOpen(false)} style={{ background: C, border: `1px solid ${B}`, borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: 'pointer', color: '#8A8A8A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A8A8A' }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>🛒</div>
                  <div style={{ fontWeight: 600 }}>{t('Корзина пуста', 'Себет бос')}</div>
                </div>
              ) : <>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: `1px solid rgba(255,214,10,0.08)` }}>
                    <div style={{ fontSize: 28, width: 48, height: 48, background: C, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13 }}>{item.name_ru}</div>
                      <div style={{ fontSize: 12, color: '#8A8A8A' }}>{item.price.toLocaleString()} ₸</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => removeItem(item.id)} style={{ background: '#222', border: `1px solid ${B}`, borderRadius: 50, width: 28, height: 28, fontSize: 16, cursor: 'pointer', color: Y, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => { const p = products.find(x => x.id === item.id)!; addItem(p) }} style={{ background: Y, border: 'none', borderRadius: 50, width: 28, height: 28, fontSize: 16, cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{ background: C, borderRadius: 16, padding: 16, border: `1px solid ${B}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#8A8A8A', marginBottom: 6 }}><span>{t('Товары', 'Тауарлар')}</span><span>{cartTotal.toLocaleString()} ₸</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#8A8A8A', marginBottom: 6 }}><span>{t('Доставка', 'Жеткізу')}</span><span>300 ₸</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${B}`, paddingTop: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem' }}>{t('ИТОГО', 'ЖАЛПЫ')}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', color: Y }}>{(cartTotal + 300).toLocaleString()} ₸</span>
                  </div>
                </div>
                <button onClick={() => setStep('checkout')} style={{ background: Y, color: '#000', border: 'none', borderRadius: 16, padding: '1.2rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', marginTop: 'auto', fontFamily: 'Manrope' }}>
                  {t('Оформить заказ →', 'Тапсырыс беру →')}
                </button>
              </>}
            </>}

            {step === 'checkout' && <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setStep('cart')} style={{ background: C, border: `1px solid ${B}`, borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: 'pointer', color: Y, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: '2rem' }}>{t('ЗАКАЗ', 'ТАПСЫРЫС')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[{ label: t('Ваше имя', 'Атыңыз'), value: name, setter: setName, placeholder: t('Имя и фамилия', 'Аты-жөн') },
                  { label: 'Телефон', value: phone, setter: setPhone, placeholder: '+7 (___) ___-__-__' }].map((f, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 4, fontFamily: 'Space Grotesk', letterSpacing: 1 }}>{f.label}</div>
                    <input value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', background: C, border: `1px solid ${B}`, borderRadius: 14, padding: '0.9rem 1.1rem', color: '#F5F5F5', fontFamily: 'Manrope', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 4, fontFamily: 'Space Grotesk', letterSpacing: 1 }}>{t('Тип доставки', 'Жеткізу түрі')}</div>
                  <div style={{ display: 'flex', background: C, border: `1px solid ${B}`, borderRadius: 14, overflow: 'hidden' }}>
                    {(['delivery', 'pickup'] as const).map(d => (
                      <button key={d} onClick={() => setDeliveryType(d)} style={{ flex: 1, padding: '0.9rem', border: 'none', background: deliveryType === d ? Y : 'transparent', color: deliveryType === d ? '#000' : '#8A8A8A', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Manrope' }}>
                        {d === 'delivery' ? t('Доставка', 'Жеткізу') : t('Самовывоз', 'Өзі алу')}
                      </button>
                    ))}
                  </div>
                </div>
                {deliveryType === 'delivery' && (
                  <div>
                    <div style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 4, fontFamily: 'Space Grotesk', letterSpacing: 1 }}>{t('Адрес', 'Мекенжай')}</div>
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('Улица, дом №', 'Көше, үй №')} style={{ width: '100%', background: C, border: `1px solid ${B}`, borderRadius: 14, padding: '0.9rem 1.1rem', color: '#F5F5F5', fontFamily: 'Manrope', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 4, fontFamily: 'Space Grotesk', letterSpacing: 1 }}>{t('Оплата', 'Төлем')}</div>
                  <div style={{ display: 'flex', background: C, border: `1px solid ${B}`, borderRadius: 14, overflow: 'hidden' }}>
                    {(['cash', 'card'] as const).map(pay => (
                      <button key={pay} onClick={() => setPaymentType(pay)} style={{ flex: 1, padding: '0.9rem', border: 'none', background: paymentType === pay ? Y : 'transparent', color: paymentType === pay ? '#000' : '#8A8A8A', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Manrope' }}>
                        {pay === 'cash' ? t('Наличные', 'Қолма-қол') : t('Картой', 'Картамен')}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ background: C, borderRadius: 16, padding: 16, border: `1px solid ${B}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem' }}>{t('ИТОГО', 'ЖАЛПЫ')}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', color: Y }}>{(cartTotal + delivery).toLocaleString()} ₸</span>
                  </div>
                </div>
                <button onClick={submitOrder} disabled={loading} style={{ background: loading ? '#555' : Y, color: '#000', border: 'none', borderRadius: 16, padding: '1.2rem', fontSize: '1rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Manrope' }}>
                  {loading ? t('Отправляем...', 'Жіберілуде...') : t('Подтвердить ✓', 'Растау ✓')}
                </button>
              </div>
            </>}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '60px 16px' }}>
                <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', marginBottom: 12, color: Y }}>{t('ЗАКАЗ ПРИНЯТ!', 'ТАПСЫРЫС ҚАБЫЛДАНДЫ!')}</h3>
                <p style={{ fontSize: 14, color: '#8A8A8A', marginBottom: 32, lineHeight: 1.7 }}>{t('Оператор свяжется с вами в ближайшее время', 'Оператор сізге жақын арада хабарласады')}</p>
                <button onClick={() => { setCart({}); setCartOpen(false); setStep('cart') }} style={{ background: Y, color: '#000', border: 'none', borderRadius: 50, padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Manrope' }}>
                  {t('Отлично!', 'Керемет!')}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}