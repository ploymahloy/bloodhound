import { cn } from '../lib/cn'

export type TextareaState = 'default' | 'success' | 'error'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: TextareaState
  ref?: React.Ref<HTMLTextAreaElement>
}

const stateClass: Record<TextareaState, string> = {
  default: '',
  success: 'uk-input--success',
  error: 'uk-input--error',
}

export function Textarea({
  className,
  state = 'default',
  ref,
  ...props
}: TextareaProps) {
  return (
    <textarea
      ref={ref}
      className={cn('uk-textarea', stateClass[state], className)}
      {...props}
    />
  )
}
