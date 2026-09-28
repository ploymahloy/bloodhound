import { cn } from '../lib/cn'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Divider = ({ className, ...props }: DividerProps) => {
  return <div className={cn('uk-divider', className)} role="separator" {...props} />
}
