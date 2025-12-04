import { requireAdmin } from '@/lib/auth'
import AdminNavLayout from '../../admin-nav-layout'
import PostDetailClient from './post-detail-client'

export default async function PostDetailPage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <PostDetailClient />
    </AdminNavLayout>
  )
}
