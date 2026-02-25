import { cn } from '../utils/cn'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Divider({ className, ...props }: DividerProps) {
  return <div className={cn('uk-divider', className)} role="separator" {...props} />
}
