import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Buscar perguntas ativas
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('active', true)

    if (error) throw error

    // Buscar ordem customizada das seções usando admin client (bypass RLS)
    let sectionOrder: Record<string, number> = {}
    try {
      const adminClient = createAdminClient()
      const { data: sections, error: sectionsError } = await adminClient
        .from('sections')
        .select('name, order')
        .order('order', { ascending: true })
      
      if (sectionsError) {
        console.error('Erro ao buscar ordem das seções:', sectionsError)
        // Se a tabela não existir, continuar sem ordem customizada
      } else if (sections && sections.length > 0) {
        sections.forEach((section: { name: string; order: number }) => {
          sectionOrder[section.name] = section.order
        })
        // Debug: log da ordem carregada
        console.log('✅ Ordem das seções carregada:', sectionOrder)
      }
    } catch (error: any) {
      // Se não houver ordem salva ou tabela não existir, continuar sem ela
      console.log('Ordem de seções não encontrada ou tabela não existe, usando ordem padrão:', error?.message)
    }

    // Ordenar perguntas: primeiro por ordem da seção, depois por ordem dentro da seção
    const sortedQuestions = [...(questions || [])].sort((a, b) => {
      const sectionA = a.section || 'Sem seção'
      const sectionB = b.section || 'Sem seção'
      
      // "Sem seção" sempre por último
      if (sectionA === 'Sem seção' && sectionB !== 'Sem seção') return 1
      if (sectionA !== 'Sem seção' && sectionB === 'Sem seção') return -1
      
      // Se ambas têm ordem customizada, usar essa ordem
      const orderA = sectionOrder[sectionA]
      const orderB = sectionOrder[sectionB]
      
      if (orderA !== undefined && orderB !== undefined) {
        if (orderA !== orderB) {
          return orderA - orderB
        }
      } else if (orderA !== undefined) {
        return -1 // Seção com ordem vem primeiro
      } else if (orderB !== undefined) {
        return 1 // Seção com ordem vem primeiro
      } else {
        // Se nenhuma tem ordem, ordenar alfabeticamente
        if (sectionA !== sectionB) {
          return sectionA.localeCompare(sectionB)
        }
      }
      
      // Se mesma seção, ordenar por order
      return a.order - b.order
    })

    // Garantir que as perguntas estão realmente agrupadas por seção na ordem correta
    // Isso é importante para que o componente possa extrair a ordem das seções corretamente
    
    // Debug: verificar seções únicas na ordem final
    const finalSections = Array.from(new Set(sortedQuestions.map(q => q.section || 'Sem seção')))
    console.log('✅ Seções na ordem final retornada:', finalSections)
    console.log('✅ Primeiras 3 perguntas:', sortedQuestions.slice(0, 3).map(q => ({ 
      section: q.section, 
      order: q.order,
      text: q.text.substring(0, 30) + '...'
    })))

    return NextResponse.json(sortedQuestions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar perguntas' },
      { status: 500 }
    )
  }
}

