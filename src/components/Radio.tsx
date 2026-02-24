import { forwardRef } from 'react'
import { cn } from '../lib/cn'

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId =
      id ?? `radio-${Math.random().toString(36).slice(2)}`
    return (
      <label className="uk-label" htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={cn('uk-radio', className)}
          {...props}
        />
        {label != null && <span>{label}</span>}
      </label>
    )
  }
)

Radio.displayName = 'Radio'
