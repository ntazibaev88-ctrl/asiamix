'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const schema = z.object({
  title: z.string().min(2, 'Минимум 2 символа'),
  description: z.string().optional(),
  category: z.string().min(1),
  target_amount: z.string().optional(),
  target_date: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const categories = [
  { value: 'House', label: '🏠 Жильё' },
  { value: 'Car', label: '🚗 Автомобиль' },
  { value: 'Business', label: '💼 Бизнес' },
  { value: 'Travel', label: '✈️ Путешествия' },
  { value: 'Education', label: '🎓 Образование' },
  { value: 'Family', label: '👨‍👩‍👧 Семья' },
  { value: 'Health', label: '❤️ Здоровье' },
  { value: 'Other', label: '⭐ Другое' },
]

export default function NewGoalPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'Other' },
  })

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('goals').insert({
      user_id: user!.id,
      title: data.title,
      description: data.description || null,
      category: data.category,
      target_amount: data.target_amount ? parseFloat(data.target_amount) : null,
      target_date: data.target_date || null,
      current_amount: 0,
      is_completed: false,
    })

    if (error) { toast.error('Ошибка при создании'); return }
    toast.success('Цель добавлена!')
    router.push('/goals')
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Новая цель"
        actions={
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            Отмена
          </Button>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Название цели"
                  placeholder="Например: Купить квартиру"
                  error={errors.title?.message}
                  {...register('title')}
                />
                <Textarea
                  label="Описание (необязательно)"
                  placeholder="Опишите свою цель подробнее..."
                  rows={3}
                  {...register('description')}
                />
                <Select
                  label="Категория"
                  options={categories}
                  {...register('category')}
                />
                <Input
                  label="Целевая сумма (необязательно)"
                  type="number"
                  placeholder="0"
                  {...register('target_amount')}
                />
                <Input
                  label="Целевая дата (необязательно)"
                  type="date"
                  {...register('target_date')}
                />
                <Button type="submit" className="w-full" loading={isSubmitting}>
                  Добавить цель
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
