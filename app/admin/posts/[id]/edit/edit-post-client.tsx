'use client'

import { useParams } from 'next/navigation'
import { CreatePostClient } from '../../create/create-post-client'

export default function EditPostClient() {
  const params = useParams()
  const postId = params.id as string
  
  return <CreatePostClient editPostId={postId} />
}
