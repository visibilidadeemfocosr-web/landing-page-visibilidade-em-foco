import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
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
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Arquivo não fornecido' }, { status: 400 })
    }
    
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
    }
    
    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Arquivo muito grande (máximo 5MB)' }, { status: 400 })
    }
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `hero-image-${timestamp}-${randomString}.${fileExt}`
    
    // Usar admin client para upload
    const adminClient = createAdminClient()
    
    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('home-content')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })
    
    if (uploadError) {
      console.error('Erro ao fazer upload:', uploadError)
      return NextResponse.json({ error: 'Erro ao fazer upload da imagem' }, { status: 500 })
    }
    
    // Obter URL pública
    const { data: urlData } = adminClient.storage
      .from('home-content')
      .getPublicUrl(fileName)
    
    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName,
    })
  } catch (error: any) {
    console.error('Erro ao fazer upload da imagem:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

