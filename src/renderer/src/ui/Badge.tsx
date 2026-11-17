import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { cn } from './cn'

const badgeVariants = cva(
  'inline-flex items-center font-medium border select-none transition-colors',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]',
        success: 'bg-[var(--success-surface)] text-[var(--success)] border-[var(--success)]/40',
        warning: 'bg-[var(--warning-surface)] text-[var(--warning)] border-[var(--warning)]/40',
        danger: 'bg-[var(--danger-surface)] text-[var(--danger)] border-[var(--danger)]/40',
        info: 'bg-[var(--info-surface)] text-[var(--info)] border-[var(--info)]/40'
      },
      size: {
        sm: 'text-[11px] px-2 py-0.5 rounded-[var(--radius-sm)] gap-1',
        md: 'text-xs px-2.5 py-1 rounded-[var(--radius-sm)] gap-1.5'
      }
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'sm'
    }
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  icon?: ReactNode
  hideIcon?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = 'neutral', size = 'sm', icon, hideIcon = false, children, ...props },
    ref
  ) => {
    const iconSize = size === 'sm' ? 12 : 14

    const renderDefaultIcon = (): ReactNode => {
      if (hideIcon) return null
      if (icon) return icon

      switch (variant) {
        case 'success':
          return <CheckCircle2 size={iconSize} className="flex-shrink-0" aria-hidden="true" />
        case 'warning':
          return <AlertTriangle size={iconSize} className="flex-shrink-0" aria-hidden="true" />
        case 'danger':
          return <AlertCircle size={iconSize} className="flex-shrink-0" aria-hidden="true" />
        case 'info':
          return <Info size={iconSize} className="flex-shrink-0" aria-hidden="true" />
        default:
          return null
      }
    }

    return (
      <span ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props}>
        {renderDefaultIcon()}
        <span>{children}</span>
      </span>
    )
  }
)
Badge.displayName = 'Badge'
