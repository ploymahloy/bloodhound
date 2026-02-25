import { cn } from '../utils/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  ref?: React.Ref<HTMLButtonElement>
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'uk-btn--primary',
  outline: 'uk-btn--outline',
  ghost: 'uk-btn--ghost',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'uk-btn--sm',
  md: '',
  lg: 'uk-btn--lg',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('uk-btn', variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
