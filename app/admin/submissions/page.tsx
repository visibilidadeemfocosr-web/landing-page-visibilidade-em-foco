import { requireAdmin } from '@/lib/auth'
import AdminSubmissionsClient from './submissions-client'
import AdminNavLayout from '../admin-nav-layout'

export default async function AdminSubmissionsPage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <AdminSubmissionsClient />
    </AdminNavLayout>
  )
}
