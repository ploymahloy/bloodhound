import { cn } from '../lib/cn'

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export const Sidebar = ({ className, children, ...props }: SidebarProps) => {
  return (
    <aside className={cn('uk-sidebar', className)} {...props}>
      {children}
    </aside>
  )
}
