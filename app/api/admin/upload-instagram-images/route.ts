import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET_NAME = 'artist-images';
const FOLDER = 'instagram-posts';

/**
 * Rota para fazer upload de imagens base64 para o Supabase Storage
 * POST /api/admin/upload-instagram-images
 * 
 * Body:
 * {
 *   post1Image: string,  // Base64 do Post 1
 *   post2Image: string,  // Base64 do Post 2
 *   artistName: string   // Nome do artista (para o nome do arquivo)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post1Image, post2Image, artistName } = body;

    // Validações
    if (!post1Image || !post2Image || !artistName) {
      return NextResponse.json(
        { error: 'post1Image, post2Image e artistName são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Função auxiliar para fazer upload de uma imagem base64
    const uploadBase64 = async (base64Image: string, fileName: string): Promise<string> => {
      // Remove o prefixo data:image/... se existir
      const base64Data = base64Image.includes(',') 
        ? base64Image.split(',')[1] 
        : base64Image;

      // Converte base64 para Buffer (Node.js)
      const buffer = Buffer.from(base64Data, 'base64');

      // Define o caminho do arquivo no bucket
      const timestamp = Date.now();
      const sanitizedName = artistName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const filePath = `${FOLDER}/${timestamp}-${sanitizedName}-${fileName}`;

      console.log(`📤 Fazendo upload: ${filePath} (${(buffer.length / 1024).toFixed(2)}KB)`);

      // Faz upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, buffer, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('❌ Erro ao fazer upload:', error);
        throw new Error(`Erro ao fazer upload: ${error.message}`);
      }

      // Obtém a URL pública da imagem
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Erro ao obter URL pública da imagem');
      }

      console.log(`✅ Upload concluído: ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    };

    // Upload das duas imagens
    console.log('📸 Iniciando upload das imagens para o Supabase...');
    
    const post1Url = await uploadBase64(post1Image, 'post1.png');
    const post2Url = await uploadBase64(post2Image, 'post2.png');

    console.log('✅ Upload concluído com sucesso!');
    console.log(`   Post 1: ${post1Url}`);
    console.log(`   Post 2: ${post2Url}`);

    return NextResponse.json({
      success: true,
      message: 'Upload concluído com sucesso',
      post1Url,
      post2Url,
    });
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return NextResponse.json(
      { 
        error: 'Erro ao fazer upload das imagens', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

