import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_name: body.name,
        customer_phone: body.phone,
        address: body.address,
        delivery_type: body.deliveryType,
        payment: body.payment,
        total: body.total,
        items: body.items,
      })
      .select()
      .single()

    if (error) throw error

    // Telegram уведомление
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (BOT_TOKEN && CHAT_ID) {
      const itemsText = body.items
        .map((i: {name_ru: string; qty: number; price: number}) => 
          `• ${i.name_ru} × ${i.qty} = ${(i.price * i.qty).toLocaleString()} ₸`)
        .join('\n')

      const msg = `⚡ *TEZI — НОВЫЙ ЗАКАЗ #${order.num}*\n\n👤 ${body.name}\n📞 ${body.phone}\n${body.address ? `📍 ${body.address}` : '🏃 Самовывоз'}\n💳 ${body.payment}\n\n${itemsText}\n\n💰 *Итого: ${body.total.toLocaleString()} ₸*`

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: msg,
          parse_mode: 'Markdown',
        }),
      })
    }

    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error('Order error:', err)
    return NextResponse.json({ error: 'Заказ не создан' }, { status: 500 })
  }
}