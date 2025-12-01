import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - Obter ordem das seções
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    const adminEmail = process.env.ADMIN_EMAIL || 'visibilidade.emfocosr@gmail.com'
    if (user.email !== adminEmail) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }
    
    const adminClient = createAdminClient()
    
    // Buscar seções ordenadas
    const { data: sections, error } = await adminClient
      .from('sections')
      .select('name, order')
      .order('order', { ascending: true })
    
    if (error) {
      console.error('Erro ao buscar seções:', error)
      // Se a tabela não existir ainda, retornar array vazio
      return NextResponse.json([])
    }
    
    return NextResponse.json(sections || [])
  } catch (error: any) {
    console.error('Erro ao buscar seções:', error)
    return NextResponse.json([], { status: 200 }) // Retornar vazio se houver erro
  }
}

// PUT - Atualizar ordem das seções
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    const adminEmail = process.env.ADMIN_EMAIL || 'visibilidade.emfocosr@gmail.com'
    if (user.email !== adminEmail) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }
    
    const { sections } = await request.json()
    
    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    }
    
    const adminClient = createAdminClient()
    
    // Atualizar ordem de cada seção
    const updatePromises = sections.map((section: { name: string; order: number }, index: number) => {
      return adminClient
        .from('sections')
        .upsert({
          name: section.name,
          order: section.order !== undefined ? section.order : index,
        }, {
          onConflict: 'name'
        })
    })
    
    await Promise.all(updatePromises)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao atualizar ordem das seções:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar ordem das seções' },
      { status: 500 }
    )
  }
}

