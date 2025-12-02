/**
 * Instagram API Helper Functions
 * Documentação: https://developers.facebook.com/docs/instagram-api
 */

const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com';
const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v18.0';

export interface InstagramAccount {
  id: string;
  username: string;
}

export interface InstagramMediaContainer {
  id: string;
}

export interface InstagramPublishResult {
  id: string;
  permalink?: string;
}

/**
 * Obtém o ID da conta do Instagram Business conectada
 */
export async function getInstagramAccountId(accessToken: string): Promise<string> {
  try {
    // Primeiro, obtém o ID do usuário do Facebook
    const userResponse = await fetch(
      `${FACEBOOK_GRAPH_API}/me?access_token=${accessToken}`
    );
    
    if (!userResponse.ok) {
      throw new Error('Erro ao obter ID do usuário');
    }
    
    const userData = await userResponse.json();
    
    // Obtém as páginas do Facebook do usuário
    const pagesResponse = await fetch(
      `${FACEBOOK_GRAPH_API}/${userData.id}/accounts?access_token=${accessToken}`
    );
    
    if (!pagesResponse.ok) {
      throw new Error('Erro ao obter páginas do Facebook');
    }
    
    const pagesData = await pagesResponse.json();
    
    if (!pagesData.data || pagesData.data.length === 0) {
      throw new Error('Nenhuma página do Facebook encontrada');
    }
    
    // Pega a primeira página
    const pageId = pagesData.data[0].id;
    const pageAccessToken = pagesData.data[0].access_token;
    
    // Obtém a conta do Instagram conectada à página
    const igResponse = await fetch(
      `${FACEBOOK_GRAPH_API}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );
    
    if (!igResponse.ok) {
      throw new Error('Erro ao obter conta do Instagram');
    }
    
    const igData = await igResponse.json();
    
    if (!igData.instagram_business_account) {
      throw new Error('Nenhuma conta do Instagram Business conectada à página');
    }
    
    return igData.instagram_business_account.id;
  } catch (error) {
    console.error('Erro ao obter ID da conta do Instagram:', error);
    throw error;
  }
}

/**
 * Cria um container de mídia (preparação para publicação)
 * Para carousel: usa children para múltiplas imagens
 */
export async function createMediaContainer(
  instagramAccountId: string,
  accessToken: string,
  imageUrl: string,
  caption: string,
  isCarousel: boolean = false,
  children?: string[]
): Promise<string> {
  try {
    const params = new URLSearchParams({
      access_token: accessToken,
    });
    
    if (isCarousel && children && children.length > 0) {
      // Carousel post
      params.append('media_type', 'CAROUSEL');
      params.append('caption', caption);
      children.forEach(childId => {
        params.append('children', childId);
      });
    } else {
      // Single image post
      params.append('image_url', imageUrl);
      params.append('caption', caption);
    }
    
    const response = await fetch(
      `${FACEBOOK_GRAPH_API}/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Erro na resposta da API:', error);
      throw new Error(`Erro ao criar container de mídia: ${error.error?.message || 'Erro desconhecido'}`);
    }
    
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Erro ao criar container de mídia:', error);
    throw error;
  }
}

/**
 * Cria um container de mídia filho para carousel
 */
export async function createCarouselChild(
  instagramAccountId: string,
  accessToken: string,
  imageUrl: string
): Promise<string> {
  try {
    const params = new URLSearchParams({
      image_url: imageUrl,
      is_carousel_item: 'true',
      access_token: accessToken,
    });
    
    const response = await fetch(
      `${FACEBOOK_GRAPH_API}/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao criar item do carousel: ${error.error?.message || 'Erro desconhecido'}`);
    }
    
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Erro ao criar item do carousel:', error);
    throw error;
  }
}

/**
 * Publica o container de mídia no Instagram
 */
export async function publishMedia(
  instagramAccountId: string,
  accessToken: string,
  creationId: string
): Promise<InstagramPublishResult> {
  try {
    const params = new URLSearchParams({
      creation_id: creationId,
      access_token: accessToken,
    });
    
    const response = await fetch(
      `${FACEBOOK_GRAPH_API}/${instagramAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ao publicar mídia: ${error.error?.message || 'Erro desconhecido'}`);
    }
    
    const data = await response.json();
    
    // Obtém o permalink do post publicado
    const mediaResponse = await fetch(
      `${FACEBOOK_GRAPH_API}/${data.id}?fields=permalink&access_token=${accessToken}`
    );
    
    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      return {
        id: data.id,
        permalink: mediaData.permalink,
      };
    }
    
    return { id: data.id };
  } catch (error) {
    console.error('Erro ao publicar mídia:', error);
    throw error;
  }
}

/**
 * Função principal para publicar um post no Instagram
 */
export async function publishInstagramPost(
  imageUrl: string,
  caption: string,
  accessToken?: string
): Promise<InstagramPublishResult> {
  const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error('Access Token do Instagram não configurado');
  }
  
  try {
    // 1. Obtém o ID da conta do Instagram
    const instagramAccountId = await getInstagramAccountId(token);
    
    // 2. Cria o container de mídia
    const creationId = await createMediaContainer(
      instagramAccountId,
      token,
      imageUrl,
      caption
    );
    
    // 3. Aguarda alguns segundos para o Instagram processar a imagem
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 4. Publica o post
    const result = await publishMedia(instagramAccountId, token, creationId);
    
    return result;
  } catch (error) {
    console.error('Erro ao publicar post no Instagram:', error);
    throw error;
  }
}

/**
 * Função para publicar um carousel (múltiplas imagens) no Instagram
 */
export async function publishInstagramCarousel(
  imageUrls: string[],
  caption: string,
  accessToken?: string
): Promise<InstagramPublishResult> {
  const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error('Access Token do Instagram não configurado');
  }
  
  if (imageUrls.length < 2 || imageUrls.length > 10) {
    throw new Error('Carousel deve ter entre 2 e 10 imagens');
  }
  
  try {
    // 1. Obtém o ID da conta do Instagram
    const instagramAccountId = await getInstagramAccountId(token);
    
    // 2. Cria os containers de mídia filhos (cada imagem do carousel)
    const childrenIds: string[] = [];
    for (const imageUrl of imageUrls) {
      const childId = await createCarouselChild(
        instagramAccountId,
        token,
        imageUrl
      );
      childrenIds.push(childId);
    }
    
    // 3. Cria o container do carousel
    const creationId = await createMediaContainer(
      instagramAccountId,
      token,
      '', // imageUrl vazio para carousel
      caption,
      true, // isCarousel
      childrenIds
    );
    
    // 4. Aguarda alguns segundos para o Instagram processar as imagens
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // 5. Publica o carousel
    const result = await publishMedia(instagramAccountId, token, creationId);
    
    return result;
  } catch (error) {
    console.error('Erro ao publicar carousel no Instagram:', error);
    throw error;
  }
}

