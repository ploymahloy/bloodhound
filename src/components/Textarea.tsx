import { forwardRef } from 'react'
import { cn } from '../lib/cn'

export type TextareaState = 'default' | 'success' | 'error'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: TextareaState
}

const stateClass: Record<TextareaState, string> = {
  default: '',
  success: 'uk-input--success',
  error: 'uk-input--error',
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state = 'default', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn('uk-textarea', stateClass[state], className)}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
