import { requireAdmin } from '@/lib/auth'
import AdminQuestionsClient from './questions-client'
import AdminNavLayout from '../admin-nav-layout'

export default async function AdminQuestionsPage() {
  await requireAdmin()
  return (
    <AdminNavLayout>
      <AdminQuestionsClient />
    </AdminNavLayout>
  )
}
