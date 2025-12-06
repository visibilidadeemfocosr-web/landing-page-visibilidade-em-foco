import { HomeContentWrapper } from "@/components/home-content-wrapper"
import { createAdminClient } from '@/lib/supabase/admin'

const HOME_CONTENT_ID = '00000000-0000-0000-0000-000000000001'

async function getHomeContent() {
  try {
    const adminClient = createAdminClient()
    
    const { data, error } = await adminClient
      .from('home_content')
      .select('content, updated_at')
      .eq('id', HOME_CONTENT_ID)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Erro ao carregar conteúdo da home:', error)
      return null
    }
    
    return data?.content || null
  } catch (error) {
    console.error('Erro ao carregar conteúdo da home:', error)
    return null
  }
}

export default async function Home() {
  // Buscar dados no servidor (SSR)
  const homeContent = await getHomeContent()
  
  return <HomeContentWrapper initialContent={homeContent} />
}
