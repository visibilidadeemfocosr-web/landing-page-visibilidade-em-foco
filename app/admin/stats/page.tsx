import { requireAdmin } from '@/lib/auth'
import AdminStatsClient from './stats-client'
import AdminNavLayout from '../admin-nav-layout'

export default async function AdminStatsPage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <AdminStatsClient />
    </AdminNavLayout>
  )
}
