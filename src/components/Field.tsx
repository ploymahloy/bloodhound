import { cn } from '../lib/cn'

export interface FieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  label?: React.ReactNode
  hint?: React.ReactNode
  error?: boolean
  htmlFor?: string
  children: React.ReactNode
}

export function Field({
  label,
  hint,
  error = false,
  htmlFor,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div className={cn('uk-field', className)} {...props}>
      {label != null && (
        <label className="uk-field__label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint != null && (
        <span
          className={cn(
            'uk-field__hint',
            error && 'uk-message--error'
          )}
        >
          {hint}
        </span>
      )}
    </div>
  )
}
