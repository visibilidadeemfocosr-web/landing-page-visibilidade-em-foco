import { requireAdmin } from '@/lib/auth'
import AdminModeratePreviewClient from './moderate-preview-client'
import AdminNavLayout from '../admin-nav-layout'

export default async function AdminModeratePreviewPage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <AdminModeratePreviewClient />
    </AdminNavLayout>
  )
}

