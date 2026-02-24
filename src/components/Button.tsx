import { forwardRef } from 'react'
import { cn } from '../lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
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
)

Button.displayName = 'Button'
