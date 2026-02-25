import { cn } from '../utils/cn'

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  ref?: React.Ref<HTMLInputElement>
}

export function Radio({
  className,
  label,
  id,
  ref,
  ...props
}: RadioProps) {
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
