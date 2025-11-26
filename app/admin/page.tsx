import { requireAdmin } from '@/lib/auth'
import AdminDashboardClient from './dashboard-client'
import AdminNavLayout from './admin-nav-layout'

export default async function AdminDashboard() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <AdminDashboardClient />
    </AdminNavLayout>
  )
}
