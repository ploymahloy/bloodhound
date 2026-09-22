import { cn } from '../utils/cn'

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  disabled?: boolean
  children: React.ReactNode
}

export function Text({
  disabled = false,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <p
      className={cn(disabled && 'text-disabled', className)}
      {...props}
    >
      {children}
    </p>
  )
}
