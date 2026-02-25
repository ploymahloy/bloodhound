import { cn } from '../utils/cn'

export type MessageVariant = 'success' | 'error'

export interface MessageProps {
  variant: MessageVariant
  className?: string
  children: React.ReactNode
}

const variantClass: Record<MessageVariant, string> = {
  success: 'uk-message--success',
  error: 'uk-message--error',
}

export function Message({
  variant,
  className,
  children,
}: MessageProps) {
  return (
    <span className={cn(variantClass[variant], className)}>
      {children}
    </span>
  )
}
