'use client'
import { useState } from 'react'

const categories = [
  { slug: 'all', name_ru: 'Все', name_kk: 'Барлығы' },
  { slug: 'rolls', name_ru: 'Роллы', name_kk: 'Роллдар' },
  { slug: 'burgers', name_ru: 'Бургеры', name_kk: 'Бургерлер' },
  { slug: 'pizza', name_ru: 'Пицца', name_kk: 'Пицца' },
  { slug: 'wok', name_ru: 'Вок', name_kk: 'Вок' },
  { slug: 'drinks', name_ru: 'Напитки', name_kk: 'Сусындар' },
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
  { name: 'Айгерим', rating: 5, text: 'Роллы очень вкусные, доставка быстрая. Закажу снова!' },
  { name: 'Дамир', rating: 5, text: 'Бургер отлично приготовлен. Цена тоже хорошая.' },
  { name: 'Зарина', rating: 4, text: 'Вок вкусный, немного подождали. В целом хорошо!' },
  { name: 'Алибек', rating: 5, text: 'Asia Mix — мой любимый сервис доставки. Рекомендую!' },
]

interface CartItem {
  id: number
  name_ru: string
  price: number
  qty: number
  emoji: string
}

export default function Home() {
  const [activeCat, setActiveCat] = useState('all')
  const [cart, setCart] = useState<Record<number, CartItem>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [paymentType, setPaymentType] = useState<'cash' | 'card'>('cash')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [lang, setLang] = useState<'ru' | 'kk'>('ru')
  const [loading, setLoading] = useState(false)

  const filtered = activeCat === 'all' ? products : products.filter(p => p.cat === activeCat)
  const cartItems = Object.values(cart)
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0)
  const delivery = deliveryType === 'delivery' ? 300 : 0

  const addItem = (p: typeof products[0]) => {
    setCart(prev => ({
      ...prev,
      [p.id]: prev[p.id]
        ? { ...prev[p.id], qty: prev[p.id].qty + 1 }
        : { id: p.id, name_ru: p.name_ru, price: p.price, qty: 1, emoji: p.emoji }
    }))
  }

  const removeItem = (id: number) => {
    setCart(prev => {
      const updated = { ...prev }
      if (updated[id].qty <= 1) delete updated[id]
      else updated[id] = { ...updated[id], qty: updated[id].qty - 1 }
      return updated
    })
  }

  const submitOrder = async () => {
    if (!name || !phone) return alert('Заполните имя и телефон')
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          address,
          deliveryType,
          payment: paymentType,
          total: cartTotal + delivery,
          items: cartItems,
        })
      })
      if (!res.ok) throw new Error('Ошибка')
      setStep('success')
    } catch {
      alert('Ошибка при отправке заказа. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const t = (ru: string, kk: string) => lang === 'ru' ? ru : kk

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>ASIA <span style={{ color: '#D85A30' }}>MIX</span></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'ru' ? 'kk' : 'ru')} style={{ background: '#f0f0f0', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>
            {lang === 'ru' ? 'KK' : 'RU'}
          </button>
          <button onClick={() => { setCartOpen(true); setStep('cart') }} style={{ background: '#D85A30', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            🛒 {t('Корзина', 'Себет')}
            {cartCount > 0 && <span style={{ background: '#fff', color: '#D85A30', borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a0500 0%, #3d1200 100%)', padding: '32px 16px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
          {t('Быстрая доставка еды', 'Тамақты жылдам жеткізу')}
        </h1>
        <p style={{ color: '#F5C4B3', fontSize: 14, margin: '0 0 16px' }}>
          {t('Роллы, Бургеры, Пицца, Вок — за 45 минут', 'Роллдар, Бургерлер, Пицца, Вок — 45 минутта')}
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['⏱ 45 мин', '🚗 ' + t('Доставка', 'Жеткізу'), '⭐ 4.8'].map(b => (
            <span key={b} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#FAC775' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 16px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {categories.map(c => (
          <button key={c.slug} onClick={() => setActiveCat(c.slug)} style={{ flexShrink: 0, padding: '10px 14px', fontSize: 13, border: 'none', background: 'none', cursor: 'pointer', color: activeCat === c.slug ? '#D85A30' : '#666', borderBottom: activeCat === c.slug ? '2px solid #D85A30' : '2px solid transparent', fontWeight: activeCat === c.slug ? 600 : 400 }}>
            {lang === 'ru' ? c.name_ru : c.name_kk}
          </button>
        ))}
      </div>

      {/* Products */}
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {filtered.map(p => {
          const qty = cart[p.id]?.qty || 0
          return (
            <div key={p.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee' }}>
              <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: '#fafafa' }}>{p.emoji}</div>
              <div style={{ padding: '10px 12px 12px' }}>
                {p.tag && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, display: 'inline-block', marginBottom: 4, background: p.tag === 'HOT' ? '#FAECE7' : p.tag === 'NEW' ? '#EAF3DE' : '#FAEEDA', color: p.tag === 'HOT' ? '#993C1D' : p.tag === 'NEW' ? '#3B6D11' : '#854F0B' }}>{p.tag}</span>
                )}
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{lang === 'ru' ? p.name_ru : p.name_kk}</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8, lineHeight: 1.4 }}>{lang === 'ru' ? p.desc_ru : p.desc_kk}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{p.price.toLocaleString()} ₸</span>
                  {qty === 0 ? (
                    <button onClick={() => addItem(p)} style={{ background: '#D85A30', color: '#fff', border: 'none', borderRadius: 8, width: 30, height: 30, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => removeItem(p.id)} style={{ background: '#f0f0f0', border: 'none', borderRadius: 6, width: 26, height: 26, fontSize: 16, cursor: 'pointer' }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => addItem(p)} style={{ background: '#f0f0f0', border: 'none', borderRadius: 6, width: 26, height: 26, fontSize: 16, cursor: 'pointer' }}>+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reviews */}
      <div style={{ padding: '0 16px 32px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{t('Отзывы', 'Пікірлер')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 12, border: '1px solid #eee' }}>
              <div style={{ color: '#EF9F27', fontSize: 13, marginBottom: 4 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 8, lineHeight: 1.5 }}>{r.text}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }} onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 400, height: '100%', overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {step === 'cart' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{t('Корзина', 'Себет')}</span>
                  <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>✕</button>
                </div>
                {cartItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
                    {t('Корзина пуста', 'Себет бос')}
                  </div>
                ) : (
                  <>
                    {cartItems.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: 28, width: 44, height: 44, background: '#fafafa', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name_ru}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{item.price.toLocaleString()} ₸ × {item.qty}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button onClick={() => removeItem(item.id)} style={{ background: '#f0f0f0', border: 'none', borderRadius: 6, width: 26, height: 26, fontSize: 16, cursor: 'pointer' }}>−</button>
                          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => { const p = products.find(x => x.id === item.id)!; addItem(p) }} style={{ background: '#f0f0f0', border: 'none', borderRadius: 6, width: 26, height: 26, fontSize: 16, cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    ))}
                    <div style={{ background: '#f9f9f9', borderRadius: 10, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888', marginBottom: 4 }}>
                        <span>{t('Товары', 'Тауарлар')}</span><span>{cartTotal.toLocaleString()} ₸</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888', marginBottom: 4 }}>
                        <span>{t('Доставка', 'Жеткізу')}</span><span>300 ₸</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                        <span>{t('Итого', 'Жалпы')}</span><span>{(cartTotal + 300).toLocaleString()} ₸</span>
                      </div>
                    </div>
                    <button onClick={() => setStep('checkout')} style={{ background: '#D85A30', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 'auto' }}>
                      {t('Оформить заказ →', 'Тапсырыс беру →')}
                    </button>
                  </>
                )}
              </>
            )}

            {step === 'checkout' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setStep('cart')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>←</button>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{t('Оформление', 'Тапсырыс')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{t('Ваше имя', 'Атыңыз')}</div>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder={t('Имя и фамилия', 'Аты-жөніңіз')} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{t('Телефон', 'Телефон')}</div>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{t('Тип доставки', 'Жеткізу түрі')}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['delivery', 'pickup'] as const).map(d => (
                        <button key={d} onClick={() => setDeliveryType(d)} style={{ flex: 1, padding: 8, fontSize: 13, border: '1px solid #ddd', borderRadius: 8, background: deliveryType === d ? '#D85A30' : 'none', color: deliveryType === d ? '#fff' : '#555', cursor: 'pointer' }}>
                          {d === 'delivery' ? t('Доставка', 'Жеткізу') : t('Самовывоз', 'Өзі алу')}
                        </button>
                      ))}
                    </div>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div>
                      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{t('Адрес', 'Мекенжай')}</div>
                      <input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('Улица, дом №', 'Көше, үй №')} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{t('Оплата', 'Төлем')}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['cash', 'card'] as const).map(pay => (
                        <button key={pay} onClick={() => setPaymentType(pay)} style={{ flex: 1, padding: 8, fontSize: 13, border: '1px solid #ddd', borderRadius: 8, background: paymentType === pay ? '#D85A30' : 'none', color: paymentType === pay ? '#fff' : '#555', cursor: 'pointer' }}>
                          {pay === 'cash' ? t('Наличные', 'Қолма-қол') : t('Картой', 'Картамен')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: 10, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                      <span>{t('Итого', 'Жалпы')}</span>
                      <span>{(cartTotal + delivery).toLocaleString()} ₸</span>
                    </div>
                  </div>
                  <button onClick={submitOrder} style={{ background: '#D85A30', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                    {t('Подтвердить', 'Растау')}
                  </button>
                </div>
              </>
            )}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '60px 16px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{t('Заказ принят!', 'Тапсырыс қабылданды!')}</h3>
                <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>{t('Оператор свяжется с вами в ближайшее время', 'Оператор сізге жақын арада хабарласады')}</p>
                <button onClick={() => { setCart({}); setCartOpen(false); setStep('cart') }} style={{ background: '#D85A30', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  {t('Хорошо', 'Жарайды')}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
