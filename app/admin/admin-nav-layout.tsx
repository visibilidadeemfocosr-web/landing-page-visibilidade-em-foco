import { createClient } from '@/lib/supabase/server'
import AdminNav from './admin-nav'

export default async function AdminNavLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h1 className="text-lg sm:text-2xl font-bold">Admin - Visibilidade em Foco</h1>
            <AdminNav userEmail={user?.email} />
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

