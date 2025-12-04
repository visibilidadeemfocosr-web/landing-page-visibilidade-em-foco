import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export default function EditPostPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">🚧 Página em Desenvolvimento</h2>
            <p className="text-muted-foreground mb-4">
              A funcionalidade de edição de posts está em desenvolvimento.
            </p>
            <p className="text-sm text-muted-foreground">
              Por enquanto, você pode criar novos posts ou excluir rascunhos existentes.
            </p>
          </div>
        </div>
      </Suspense>
    </div>
  )
}

