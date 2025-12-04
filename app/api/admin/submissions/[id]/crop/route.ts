import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { photo_crop, cropped_photo_url } = await request.json()
    const { id } = await params

    const updateData: any = { photo_crop }
    
    // Se tiver URL da foto cropada, atualizar também
    if (cropped_photo_url) {
      updateData.cropped_photo_url = cropped_photo_url
    }

    // Atualizar crop da foto
    const { error } = await supabase
      .from('submissions')
      .update(updateData)
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

