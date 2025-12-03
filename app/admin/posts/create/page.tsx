import { Suspense } from 'react'
import { CreatePostClient } from './create-post-client'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Criar Post | Admin',
  description: 'Criar novo post para Instagram',
}

export default function CreatePostPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <CreatePostClient />
      </Suspense>
    </div>
  )
}

