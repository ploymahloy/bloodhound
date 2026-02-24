import { forwardRef } from 'react'
import { cn } from '../lib/cn'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? `checkbox-${Math.random().toString(36).slice(2)}`
    return (
      <label className="uk-label" htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn('uk-checkbox', className)}
          {...props}
        />
        {label != null && <span>{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
