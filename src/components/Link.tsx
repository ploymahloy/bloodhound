import { cn } from '../lib/cn'

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
}

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <a className={cn(className)} {...props}>
      {children}
    </a>
  )
}
