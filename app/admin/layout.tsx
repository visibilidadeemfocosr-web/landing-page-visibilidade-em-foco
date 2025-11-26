// Layout base para admin - não protege aqui, cada página protege individualmente
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
