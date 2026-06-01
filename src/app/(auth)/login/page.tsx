'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

export default function LoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    toast.success('Demo: Login successful')
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-secondary)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <Zap size={32} className="text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">TEZI</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Fast Delivery</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">{t.auth.login_title}</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={t.auth.email}
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />
            <Input
              label={t.auth.password}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              required
            />
            <div className="flex justify-end">
              <Link href="#" className="text-xs text-[var(--color-primary)] hover:underline">
                {t.auth.forgot_password}
              </Link>
            </div>
            <Button type="submit" fullWidth loading={loading}>
              {t.auth.login_btn}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
            {t.auth.no_account}{' '}
            <Link href="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
              {t.auth.register_btn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
