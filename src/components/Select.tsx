import { cn } from '../lib/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'children'
  > {
  options: SelectOption[] | string[]
  ref?: React.Ref<HTMLSelectElement>
}

function normalizeOptions(
  options: SelectOption[] | string[]
): SelectOption[] {
  return options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )
}

export function Select({
  className,
  options,
  ref,
  ...props
}: SelectProps) {
  const items = normalizeOptions(options)
  return (
    <select
      ref={ref}
      className={cn('uk-select', className)}
      {...props}
    >
      {items.map(({ value, label, disabled }) => (
        <option key={value} value={value} disabled={disabled}>
          {label}
        </option>
      ))}
    </select>
  )
}
