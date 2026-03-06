import { NextRequest, NextResponse } from 'next/server';
import { publishInstagramPost, publishInstagramCarousel } from '@/lib/instagram';

/**
 * Rota para publicar posts no Instagram
 * POST /api/instagram/publish
 * 
 * Body:
 * {
 *   imageUrl: string | string[],  // URL da imagem ou array de URLs para carousel
 *   caption: string,               // Legenda do post
 *   isCarousel?: boolean           // Se é um carousel (múltiplas imagens)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, caption, isCarousel } = body;

    // Validações
    if (!imageUrl || !caption) {
      return NextResponse.json(
        { error: 'imageUrl e caption são obrigatórios' },
        { status: 400 }
      );
    }

    // Verifica se o token está configurado (trim para evitar espaços/quebras de linha da env)
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access Token do Instagram não configurado' },
        { status: 500 }
      );
    }

    let result;

    if (isCarousel && Array.isArray(imageUrl)) {
      // Publicar carousel (múltiplas imagens)
      console.log('📸 Publicando carousel no Instagram...');
      console.log(`   ${imageUrl.length} imagens`);
      console.log(`   Caption: ${caption.substring(0, 50)}...`);
      
      result = await publishInstagramCarousel(
        imageUrl,
        caption,
        accessToken
      );
    } else {
      // Publicar post único
      const singleImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
      
      console.log('📸 Publicando post no Instagram...');
      console.log(`   Imagem: ${singleImageUrl}`);
      console.log(`   Caption: ${caption.substring(0, 50)}...`);
      
      result = await publishInstagramPost(
        singleImageUrl,
        caption,
        accessToken
      );
    }

    console.log('✅ Post publicado com sucesso!');
    console.log(`   ID: ${result.id}`);
    if (result.permalink) {
      console.log(`   Link: ${result.permalink}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Post publicado no Instagram com sucesso',
      data: result,
    });
  } catch (error: any) {
    console.error('❌ Erro ao publicar no Instagram:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    // Verificar se o erro contém um ID (pode ter publicado antes do erro)
    // Isso pode acontecer se a publicação funcionou mas houve erro ao buscar permalink
    if (error.id || (error as any).data?.id) {
      const postId = error.id || (error as any).data?.id;
      console.warn('⚠️ Erro ao publicar, mas ID do post encontrado:', postId);
      console.warn('   Considerando como sucesso parcial - post pode ter sido publicado');
      
      return NextResponse.json({
        success: true,
        message: 'Post pode ter sido publicado (com avisos)',
        data: {
          id: postId,
          permalink: null
        },
        warning: errorMessage
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao publicar no Instagram', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

