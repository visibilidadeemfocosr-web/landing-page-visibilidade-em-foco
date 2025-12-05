import { createClient } from '@/lib/supabase/server'
import AdminNav from './admin-nav'
import { LogoutButton } from './logout-button'

export default async function AdminNavLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 py-4">
            {/* Header Principal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">Visibilidade em Foco</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Área Administrativa</p>
                </div>
              </div>
              {user?.email && (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600 font-medium">{user.email}</span>
                  </div>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <LogoutButton />
                </div>
              )}
            </div>
            
            {/* Navegação */}
            <AdminNav />
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

