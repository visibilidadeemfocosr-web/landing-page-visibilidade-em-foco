'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data.user) {
        toast.success('Login realizado com sucesso!')
        window.location.href = '/admin'
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
      toast.error('Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden flex items-center justify-center p-8">
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600 opacity-20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-pink-500 opacity-30" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-blue-600 opacity-30 rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
              <Image 
                src="/logoN.png"
                alt="Visibilidade em Foco"
                width={96}
                height={96}
                className="w-full h-full object-contain drop-shadow-2xl"
                unoptimized
              />
              <div className="absolute -top-2 -right-6 w-6 h-6 bg-yellow-400 rounded-full" />
              <div className="absolute -bottom-2 -left-4 w-8 h-8 bg-purple-600 rounded-full" />
            </div>
          </div>
          <div className="text-sm tracking-widest text-gray-500 mb-2">ACESSO ADMINISTRATIVO</div>
          <h1 className="text-4xl md:text-5xl tracking-tight leading-tight mb-2">
            <div className="text-black">LOGIN</div>
          </h1>
        </div>

        {/* Card de login */}
        <div className="bg-white p-8 md:p-10 shadow-xl border-l-4 border-purple-600">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold tracking-tight">E-MAIL</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="min-h-[48px] text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold tracking-tight">SENHA</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="min-h-[48px] text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-base font-semibold min-h-[56px] tracking-wide"
              disabled={loading}
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

