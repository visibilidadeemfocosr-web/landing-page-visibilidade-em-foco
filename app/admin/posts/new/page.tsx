import { requireAdmin } from '@/lib/auth'
import AdminNavLayout from '../../admin-nav-layout'
import NewPostClient from './new-post-client'

export default async function NewPostPage() {
  await requireAdmin()
  
  return (
    <AdminNavLayout>
      <NewPostClient />
    </AdminNavLayout>
  )
}
