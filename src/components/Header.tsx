import { cn } from '../utils/cn'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header className={cn('uk-header', className)} {...props}>
      {children}
    </header>
  )
}
