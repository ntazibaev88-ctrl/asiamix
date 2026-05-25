import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createClient()

    const { data: customer } = await supabase
      .from('customers')
      .upsert({ name: body.name, phone: body.phone }, { onConflict: 'phone' })
      .select()
      .single()

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
        note: body.note,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error('Order error:', err)
    return NextResponse.json({ error: 'Заказ не создан' }, { status: 500 })
  }
}