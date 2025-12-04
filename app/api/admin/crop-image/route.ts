import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

export async function POST(request: Request) {
  try {
    const { imageUrl, cropData } = await request.json()

    if (!imageUrl || !cropData) {
      return NextResponse.json(
        { error: 'imageUrl e cropData são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar imagem original
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Erro ao buscar imagem original')
    }

    const imageBlob = await imageResponse.blob()
    const arrayBuffer = await imageBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Processar imagem com sharp
    const croppedImageBuffer = await sharp(buffer)
      .extract({
        left: Math.round(cropData.x),
        top: Math.round(cropData.y),
        width: Math.round(cropData.width),
        height: Math.round(cropData.height)
      })
      .resize(1000, 1000, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 95 })
      .toBuffer()

    // Fazer upload da imagem cropada diretamente do buffer
    const supabase = await createClient()
    const fileName = `cropped-${Date.now()}.jpg`
    const filePath = `artist-images/${fileName}`

    const { data, error: uploadError } = await supabase.storage
      .from('artist-images')
      .upload(filePath, croppedImageBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
      })

    if (uploadError) throw uploadError

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('artist-images')
      .getPublicUrl(filePath)

    return NextResponse.json({ 
      url: publicUrl,
      path: filePath 
    })
  } catch (error: any) {
    console.error('Erro ao processar crop:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar imagem' },
      { status: 500 }
    )
  }
}

