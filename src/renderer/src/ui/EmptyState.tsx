import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center p-8 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface)]/40',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] mb-3">
            {icon}
          </div>
        )}
        <h4 className="text-sm font-semibold text-[var(--text)] mb-1">{title}</h4>
        {description && (
          <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4">{description}</p>
        )}
        {action && <div className="mt-1">{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'
