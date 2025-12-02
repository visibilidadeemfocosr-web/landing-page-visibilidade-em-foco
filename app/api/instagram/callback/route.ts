import { NextRequest, NextResponse } from 'next/server';

/**
 * Rota de callback OAuth do Instagram
 * Esta rota é chamada após o usuário autorizar o app
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('Erro no OAuth:', error, errorDescription);
      return NextResponse.json(
        { error: 'Erro na autorização', details: errorDescription },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Código de autorização não fornecido' },
        { status: 400 }
      );
    }

    // Aqui você pode trocar o código por um access token se necessário
    // Por enquanto, apenas confirmamos o sucesso
    
    return NextResponse.json({
      success: true,
      message: 'Autorização concedida com sucesso',
      code,
    });
  } catch (error) {
    console.error('Erro no callback do Instagram:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}

