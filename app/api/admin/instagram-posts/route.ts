import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET - Listar todos os posts (admin)
export async function GET(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let query = adminClient
      .from('instagram_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Filtrar por status se fornecido
    if (status && (status === 'draft' || status === 'published')) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Erro ao buscar posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Erro ao buscar posts:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

