import { cn } from '../utils/cn'

export interface ItemActiveProps
  extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  children: React.ReactNode
}

export function ItemActive({
  active = false,
  className,
  children,
  ...props
}: ItemActiveProps) {
  return (
    <div
      className={cn(
        'uk-item-active',
        active && 'is-active',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
