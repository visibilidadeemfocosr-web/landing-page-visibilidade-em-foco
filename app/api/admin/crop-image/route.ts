import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

export async function POST(request: Request) {
  try {
    const { imageUrl, cropData } = await request.json()

    if (!imageUrl || !cropData) {
      console.error('Dados faltando:', { imageUrl: !!imageUrl, cropData: !!cropData })
      return NextResponse.json(
        { error: 'imageUrl e cropData são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar cropData
    if (!cropData.x && cropData.x !== 0 || !cropData.y && cropData.y !== 0 || !cropData.width || !cropData.height) {
      console.error('CropData inválido:', cropData)
      return NextResponse.json(
        { error: 'cropData inválido. x, y, width e height são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('Processando crop:', { imageUrl, cropData })

    // Buscar imagem original
    let imageResponse
    try {
      imageResponse = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ImageProcessor/1.0)',
        },
      })
      
      if (!imageResponse.ok) {
        console.error('Erro ao buscar imagem:', imageResponse.status, imageResponse.statusText)
        throw new Error(`Erro ao buscar imagem original: ${imageResponse.status} ${imageResponse.statusText}`)
      }
    } catch (fetchError: any) {
      console.error('Erro no fetch da imagem:', fetchError)
      throw new Error(`Erro ao buscar imagem: ${fetchError.message}`)
    }

    const imageBlob = await imageResponse.blob()
    
    if (!imageBlob || imageBlob.size === 0) {
      throw new Error('Imagem vazia ou inválida')
    }

    const arrayBuffer = await imageBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    if (buffer.length === 0) {
      throw new Error('Buffer da imagem está vazio')
    }

    // Processar imagem com sharp
    let croppedImageBuffer
    try {
      const extractParams = {
        left: Math.max(0, Math.round(cropData.x)),
        top: Math.max(0, Math.round(cropData.y)),
        width: Math.max(1, Math.round(cropData.width)),
        height: Math.max(1, Math.round(cropData.height))
      }

      console.log('Extraindo imagem com sharp:', extractParams)

      croppedImageBuffer = await sharp(buffer)
        .extract(extractParams)
        .resize(1000, 1000, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 95 })
        .toBuffer()

      if (!croppedImageBuffer || croppedImageBuffer.length === 0) {
        throw new Error('Erro ao processar imagem: buffer vazio após crop')
      }
    } catch (sharpError: any) {
      console.error('Erro no sharp:', sharpError)
      throw new Error(`Erro ao processar imagem com sharp: ${sharpError.message}`)
    }

    // Fazer upload da imagem cropada diretamente do buffer
    let supabase
    try {
      supabase = await createClient()
    } catch (supabaseError: any) {
      console.error('Erro ao criar cliente Supabase:', supabaseError)
      throw new Error(`Erro ao conectar com Supabase: ${supabaseError.message}`)
    }

    const fileName = `cropped-${Date.now()}.jpg`
    const filePath = `artist-images/${fileName}`

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('artist-images')
        .upload(filePath, croppedImageBuffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        })

      if (uploadError) {
        console.error('Erro no upload:', uploadError)
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`)
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('artist-images')
        .getPublicUrl(filePath)

      console.log('Upload concluído:', publicUrl)

      return NextResponse.json({ 
        url: publicUrl,
        path: filePath 
      })
    } catch (uploadError: any) {
      console.error('Erro no upload para Supabase:', uploadError)
      throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`)
    }
  } catch (error: any) {
    console.error('Erro completo ao processar crop:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar imagem',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

