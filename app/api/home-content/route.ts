import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const HOME_CONTENT_ID = '00000000-0000-0000-0000-000000000001'

// GET - Carregar conteúdo da home (público, com cache)
export async function GET() {
  try {
    // Usar admin client para bypass RLS (é conteúdo público)
    const adminClient = createAdminClient()
    
    const { data, error } = await adminClient
      .from('home_content')
      .select('content, updated_at')
      .eq('id', HOME_CONTENT_ID)
      .single()
    
    if (error) {
      // Se não existir, retornar objeto vazio
      if (error.code === 'PGRST116') {
        return NextResponse.json({ content: {} })
      }
      throw error
    }
    
    // Retornar com cache reduzido para garantir atualizações mais rápidas
    return NextResponse.json(
      { content: data?.content || {}, updated_at: data?.updated_at },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error: any) {
    console.error('Erro ao carregar conteúdo da home:', error)
    // Em caso de erro, retornar objeto vazio para não quebrar a home
    return NextResponse.json({ content: {} })
  }
}

