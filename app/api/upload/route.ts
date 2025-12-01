import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo (MIME type)
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Apenas imagens (JPEG, PNG, GIF, WebP) são aceitas.' },
        { status: 400 }
      )
    }

    // Validar tamanho do arquivo (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB em bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. O tamanho máximo permitido é 5MB.' },
        { status: 400 }
      )
    }

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `artist-images/${fileName}`

    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
      .from('artist-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('artist-images')
      .getPublicUrl(filePath)

    return NextResponse.json({ 
      url: publicUrl,
      path: filePath 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer upload' },
      { status: 500 }
    )
  }
}

