import { cn } from '../lib/cn'

export type InputState = 'default' | 'success' | 'error'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState
  ref?: React.Ref<HTMLInputElement>
}

const stateClass: Record<InputState, string> = {
  default: '',
  success: 'uk-input--success',
  error: 'uk-input--error',
}

export function Input({
  className,
  state = 'default',
  ref,
  ...props
}: InputProps) {
  return (
    <input
      ref={ref}
      className={cn('uk-input', stateClass[state], className)}
      {...props}
    />
  )
}
