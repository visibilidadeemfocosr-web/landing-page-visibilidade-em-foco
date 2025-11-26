import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - Listar todas as submissões (admin)
export async function GET() {
  try {
    // Verificar autenticação
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    // Verificar se é admin
    const adminEmail = process.env.ADMIN_EMAIL || 'visibilidade.emfocosr@gmail.com'
    if (user.email !== adminEmail) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }
    
    // Usar admin client para bypass RLS
    const adminClient = createAdminClient()
    
    const { data: submissions, error } = await adminClient
      .from('submissions')
      .select(`
        *,
        answers (
          *,
          questions (
            id,
            text,
            field_type
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(submissions)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar submissões' },
      { status: 500 }
    )
  }
}

