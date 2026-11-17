import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'
import { Tooltip } from './Tooltip'

const iconButtonVariants = cva(
  'inline-flex items-center justify-center transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--accent)] text-[var(--accent-fg)] hover:brightness-105 active:brightness-95 border border-transparent',
        secondary:
          'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--border)]/20',
        ghost:
          'bg-transparent text-[var(--text)] hover:bg-[var(--surface)] border border-transparent',
        danger:
          'bg-[var(--danger)] text-white hover:brightness-110 active:brightness-95 border border-transparent'
      },
      size: {
        sm: 'h-7 w-7 rounded-[var(--radius-sm)]',
        md: 'h-9 w-9 rounded-[var(--radius-sm)]',
        lg: 'h-11 w-11 rounded-[var(--radius-md)]'
      }
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md'
    }
  }
)

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonVariants> {
  /** Required accessible label, used for aria-label and the automatic tooltip */
  label: string
  children: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, label, children, ...props }, ref) => {
    return (
      <Tooltip content={label}>
        <button
          ref={ref}
          aria-label={label}
          className={cn(iconButtonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </button>
      </Tooltip>
    )
  }
)

IconButton.displayName = 'IconButton'
