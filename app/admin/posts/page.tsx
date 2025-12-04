import { requireAdmin } from '@/lib/auth'
import { PostsClient } from './posts-client'
import AdminNavLayout from '../admin-nav-layout'

export default async function PostsPage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <PostsClient />
    </AdminNavLayout>
  )
}

