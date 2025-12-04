import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { photo_crop } = await request.json()
    const { id } = await params

    // Atualizar crop da foto
    const { error } = await supabase
      .from('submissions')
      .update({ photo_crop })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao salvar crop:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao salvar crop' },
      { status: 500 }
    )
  }
}

