'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button 
      onClick={handleLogout} 
      variant="ghost" 
      size="sm" 
      className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    >
      <LogOut className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Sair</span>
    </Button>
  )
}

