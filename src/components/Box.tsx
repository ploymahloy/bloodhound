import { cn } from '../utils/cn'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Box({ className, children, ...props }: BoxProps) {
  return (
    <div className={cn('uk-border', className)} {...props}>
      {children}
    </div>
  )
}
