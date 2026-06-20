'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Mail, Lock, User, Check } from 'lucide-react'

export default function RegisterPage() {
  const t = useT()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Құпия сөз кемінде 8 таңбадан тұруы керек')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {t.auth.checkEmail}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <strong>{email}</strong> мекенжайына растау сілтемесі жіберілді.
        </p>
        <Link href="/login" className="inline-block mt-6">
          <Button variant="outline">{t.auth.signIn}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <Badge variant="gold" className="mb-3 inline-flex">Алғашқы 2 ай тегін</Badge>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {t.auth.createAccount}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Тіркеліп, алғашқы қадамыңызды жасаңыз
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.fullName}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Аты-жөні"
              icon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label={t.auth.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              icon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />
            <Input
              label={t.auth.password}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              hint="Кемінде 8 таңба"
              required
              autoComplete="new-password"
            />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {t.auth.signUp}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-zinc-400 mt-4">
        Тіркелу арқылы сіз{' '}
        <Link href="/terms" className="underline hover:text-zinc-600">шарттармен</Link>
        {' '}келісесіз
      </p>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
        {t.auth.haveAccount}{' '}
        <Link href="/login" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
          {t.auth.signIn}
        </Link>
      </p>
    </div>
  )
}
