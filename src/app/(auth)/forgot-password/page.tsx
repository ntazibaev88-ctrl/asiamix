'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Mail, ArrowLeft, Check } from 'lucide-react'

export default function ForgotPasswordPage() {
  const t = useT()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {t.auth.checkEmail}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          <strong>{email}</strong> мекенжайына қалпына келтіру сілтемесі жіберілді.
        </p>
        <Link href="/login">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            {t.auth.signIn}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {t.auth.resetPassword}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Email мекенжайыңызды енгізіңіз. Қалпына келтіру сілтемесі жіберіледі.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Сілтеме жіберу
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t.auth.signIn}
        </Link>
      </div>
    </div>
  )
}
