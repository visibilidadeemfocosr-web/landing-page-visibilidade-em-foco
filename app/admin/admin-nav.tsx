'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav({ userEmail }: { userEmail?: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm items-center">
      <a href="/admin" className="px-2 py-1 rounded hover:bg-muted touch-manipulation min-h-[36px] flex items-center">Dashboard</a>
      <a href="/admin/questions" className="px-2 py-1 rounded hover:bg-muted touch-manipulation min-h-[36px] flex items-center">Perguntas</a>
      <a href="/admin/stats" className="px-2 py-1 rounded hover:bg-muted touch-manipulation min-h-[36px] flex items-center">Estatísticas</a>
      <a href="/admin/submissions" className="px-2 py-1 rounded hover:bg-muted touch-manipulation min-h-[36px] flex items-center">Submissões</a>
      {userEmail && (
        <>
          <span className="text-muted-foreground text-xs px-2">{userEmail}</span>
          <Button onClick={handleLogout} variant="outline" size="sm" className="min-h-[36px]">
            Sair
          </Button>
        </>
      )}
    </div>
  )
}

