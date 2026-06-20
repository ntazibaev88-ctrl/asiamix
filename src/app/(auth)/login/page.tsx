'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/dashboard'
  const [showPw, setShowPw] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Неверный email или пароль'
        : error.message)
      return
    }
    toast.success('Добро пожаловать!')
    router.push(redirect)
    router.refresh()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Вход в Jinaq</CardTitle>
        <CardDescription>Введите данные для входа в аккаунт</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            placeholder="••••••••"
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
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Войти
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-[var(--border)] pt-5">
        <p className="text-sm text-[var(--text-secondary)]">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-[var(--accent)] font-medium hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm h-80 bg-[var(--bg)] rounded-[var(--radius)] border border-[var(--border)] animate-pulse" />}>
      <LoginForm />
    </Suspense>
  )
}
