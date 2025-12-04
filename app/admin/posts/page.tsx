import { Suspense } from 'react'
import { PostsClient } from './posts-client'
import { Loader2 } from 'lucide-react'
import AdminNavLayout from '../admin-nav-layout'

export const metadata = {
  title: 'Posts Instagram | Admin',
  description: 'Gerenciar posts do Instagram',
}

export default function PostsPage() {
  return (
    <AdminNavLayout>
      <div className="container mx-auto py-8 px-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }
        >
          <PostsClient />
        </Suspense>
      </div>
    </AdminNavLayout>
  )
}

