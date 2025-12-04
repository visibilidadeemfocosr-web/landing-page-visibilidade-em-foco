import { requireAdmin } from '@/lib/auth'
import AdminNavLayout from '../admin-nav-layout'

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()
  
  return (
    <AdminNavLayout>
      {children}
    </AdminNavLayout>
  )
}

