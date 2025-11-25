import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkAdminAccess() {
  // Verificação simples por email - pode ser melhorado com Supabase Auth
  const adminEmail = process.env.ADMIN_EMAIL
  
  // Por enquanto, retornamos true se ADMIN_EMAIL estiver configurado
  // Em produção, você deve usar Supabase Auth para verificar o usuário autenticado
  return !!adminEmail
}

export async function requireAdmin() {
  const hasAccess = await checkAdminAccess()
  if (!hasAccess) {
    redirect('/admin/login')
  }
}

