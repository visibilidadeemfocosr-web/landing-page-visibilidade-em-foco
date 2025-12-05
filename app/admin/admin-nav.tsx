'use client'

import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Home, 
  HelpCircle, 
  BarChart3, 
  FileText, 
  Shield, 
  Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/home-preview', label: 'Home', icon: Home },
  { href: '/admin/questions', label: 'Perguntas', icon: HelpCircle },
  { href: '/admin/stats', label: 'Estatísticas', icon: BarChart3 },
  { href: '/admin/submissions', label: 'Submissões', icon: FileText },
  { href: '/admin/moderate', label: 'Moderação', icon: Shield },
  { href: '/admin/posts', label: 'Posts', icon: ImageIcon },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
        
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              isActive
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{item.label}</span>
          </a>
        )
      })}
    </div>
  )
}

