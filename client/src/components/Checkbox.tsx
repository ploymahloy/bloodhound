import { cn } from '../lib/cn'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  ref?: React.Ref<HTMLInputElement>
}

export function Checkbox({
  className,
  label,
  id,
  ref,
  ...props
}: CheckboxProps) {
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
