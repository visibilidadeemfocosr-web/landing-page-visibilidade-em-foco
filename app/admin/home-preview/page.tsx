import { requireAdmin } from '@/lib/auth'
import HomePreviewClient from './home-preview-client'
import AdminNavLayout from '../admin-nav-layout'

export default async function AdminHomePreviewPage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <HomePreviewClient />
    </AdminNavLayout>
  )
}

