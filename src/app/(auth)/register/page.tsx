'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  full_name: z.string().min(2, 'Введите имя (минимум 2 символа)'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Пароли не совпадают',
  path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
      },
    })
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Аккаунт создан! Проверьте почту для подтверждения.')
    router.push('/login')
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Создать аккаунт</CardTitle>
        <CardDescription>Начните свой путь к личному росту</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Имя"
            placeholder="Иван Иванов"
            icon={<User size={15} />}
            error={errors.full_name?.message}
            {...register('full_name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={15} />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Пароль"
            type={showPw ? 'text' : 'password'}
            placeholder="Минимум 8 символов"
            icon={<Lock size={15} />}
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            {...register('password')}
          />
          <Input
            label="Подтвердите пароль"
            type={showPw ? 'text' : 'password'}
            placeholder="Повторите пароль"
            icon={<Lock size={15} />}
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />
          <p className="text-xs text-[var(--text-tertiary)]">
            Регистрируясь, вы принимаете условия использования и политику конфиденциальности.
          </p>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Создать аккаунт
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-[var(--border)] pt-5">
        <p className="text-sm text-[var(--text-secondary)]">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-[var(--accent)] font-medium hover:underline">
            Войти
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
