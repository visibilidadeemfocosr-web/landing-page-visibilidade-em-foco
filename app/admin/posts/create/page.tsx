import { requireAdmin } from '@/lib/auth'
import { CreatePostClient } from './create-post-client'
import AdminNavLayout from '../../admin-nav-layout'

export default async function CreatePostPage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <CreatePostClient />
    </AdminNavLayout>
  )
}

