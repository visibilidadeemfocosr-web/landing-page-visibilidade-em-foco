/**
 * Supabase Storage Helper Functions
 * Funções para upload de imagens para o Supabase Storage
 */

import { createClient } from '@/lib/supabase/client'

const BUCKET_NAME = 'artist-images'

/**
 * Faz upload de uma imagem base64 para o Supabase Storage
 * @param base64Image - String base64 da imagem (com ou sem prefixo data:image/...)
 * @param fileName - Nome do arquivo (incluir extensão .png, .jpg, etc)
 * @param folder - Pasta dentro do bucket (opcional)
 * @returns URL pública da imagem
 */
export async function uploadBase64Image(
  base64Image: string,
  fileName: string,
  folder: string = 'instagram-posts'
): Promise<string> {
  try {
    const supabase = createClient()

    // Remove o prefixo data:image/... se existir
    const base64Data = base64Image.includes(',') 
      ? base64Image.split(',')[1] 
      : base64Image

    // Converte base64 para Blob
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/png' })

    // Define o caminho do arquivo no bucket
    const filePath = `${folder}/${Date.now()}-${fileName}`

    // Faz upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Erro ao fazer upload:', error)
      throw new Error(`Erro ao fazer upload: ${error.message}`)
    }

    // Obtém a URL pública da imagem
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    if (!publicUrlData?.publicUrl) {
      throw new Error('Erro ao obter URL pública da imagem')
    }

    console.log('✅ Upload concluído:', publicUrlData.publicUrl)
    return publicUrlData.publicUrl
  } catch (error) {
    console.error('Erro no uploadBase64Image:', error)
    throw error
  }
}

/**
 * Faz upload de uma imagem a partir de uma URL
 * @param imageUrl - URL da imagem
 * @param fileName - Nome do arquivo (incluir extensão)
 * @param folder - Pasta dentro do bucket (opcional)
 * @returns URL pública da imagem no Supabase
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  fileName: string,
  folder: string = 'instagram-posts'
): Promise<string> {
  try {
    const supabase = createClient()

    // Baixa a imagem
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Erro ao baixar imagem: ${response.statusText}`)
    }

    const blob = await response.blob()

    // Define o caminho do arquivo no bucket
    const filePath = `${folder}/${Date.now()}-${fileName}`

    // Faz upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: blob.type || 'image/png',
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Erro ao fazer upload:', error)
      throw new Error(`Erro ao fazer upload: ${error.message}`)
    }

    // Obtém a URL pública da imagem
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    if (!publicUrlData?.publicUrl) {
      throw new Error('Erro ao obter URL pública da imagem')
    }

    console.log('✅ Upload concluído:', publicUrlData.publicUrl)
    return publicUrlData.publicUrl
  } catch (error) {
    console.error('Erro no uploadImageFromUrl:', error)
    throw error
  }
}

/**
 * Deleta uma imagem do Supabase Storage
 * @param imageUrl - URL completa da imagem ou caminho relativo
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const supabase = createClient()

    // Extrai o caminho do arquivo da URL
    const urlParts = imageUrl.split(`/storage/v1/object/public/${BUCKET_NAME}/`)
    if (urlParts.length < 2) {
      throw new Error('URL inválida')
    }

    const filePath = urlParts[1]

    // Deleta o arquivo
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Erro ao deletar imagem:', error)
      throw new Error(`Erro ao deletar imagem: ${error.message}`)
    }

    console.log('✅ Imagem deletada:', filePath)
  } catch (error) {
    console.error('Erro no deleteImage:', error)
    throw error
  }
}

/**
 * Lista todas as imagens em uma pasta
 * @param folder - Pasta dentro do bucket
 */
export async function listImages(folder: string = 'instagram-posts') {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('Erro ao listar imagens:', error)
      throw new Error(`Erro ao listar imagens: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Erro no listImages:', error)
    throw error
  }
}

