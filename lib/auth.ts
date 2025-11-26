import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkAdminAccess() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return false
  }

  // Verificar se o email está na lista de admins permitidos
  const adminEmail = process.env.ADMIN_EMAIL || 'visibilidade.emfocosr@gmail.com'
  
  return user.email === adminEmail
}

export async function requireAdmin() {
  const hasAccess = await checkAdminAccess()
  if (!hasAccess) {
    redirect('/admin/login')
  }
}

