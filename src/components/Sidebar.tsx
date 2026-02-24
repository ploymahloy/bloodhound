import { cn } from '../lib/cn'

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <aside className={cn('uk-sidebar', className)} {...props}>
      {children}
    </aside>
  )
}
