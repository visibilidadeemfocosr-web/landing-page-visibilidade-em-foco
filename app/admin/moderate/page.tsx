import { requireAdmin } from '@/lib/auth'
import AdminModerateClient from './moderate-client'
import AdminNavLayout from '../admin-nav-layout'

export default async function AdminModeratePage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <AdminModerateClient />
    </AdminNavLayout>
  )
}

