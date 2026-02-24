import { forwardRef } from 'react'
import { cn } from '../lib/cn'

export type InputState = 'default' | 'success' | 'error'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState
}

const stateClass: Record<InputState, string> = {
  default: '',
  success: 'uk-input--success',
  error: 'uk-input--error',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, state = 'default', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('uk-input', stateClass[state], className)}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
