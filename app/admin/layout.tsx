import { requireAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificação básica - em produção, use Supabase Auth
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h1 className="text-lg sm:text-2xl font-bold">Admin - Visibilidade em Foco</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <a href="/admin" className="px-2 py-1 rounded hover:bg-muted touch-manipulation min-h-[36px] flex items-center">Dashboard</a>
              <a href="/admin/questions" className="px-2 py-1 rounded hover:bg-muted touch-manipulation min-h-[36px] flex items-center">Perguntas</a>
              <a href="/admin/stats" className="px-2 py-1 rounded hover:bg-muted touch-manipulation min-h-[36px] flex items-center">Estatísticas</a>
              <a href="/admin/submissions" className="px-2 py-1 rounded hover:bg-muted touch-manipulation min-h-[36px] flex items-center">Submissões</a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

