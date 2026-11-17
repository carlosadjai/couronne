import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  trailing?: ReactNode
  selected?: boolean
  disabled?: boolean
  interactive?: boolean
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      className,
      icon,
      title,
      description,
      trailing,
      selected = false,
      disabled = false,
      interactive,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const isInteractive = interactive ?? Boolean(onClick)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (disabled) return
      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
      }
      onKeyDown?.(e)
    }

    return (
      <div
        ref={ref}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        aria-disabled={disabled || undefined}
        aria-selected={selected || undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center gap-3 px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-transparent transition-colors text-[var(--text)] select-none',
          isInteractive &&
            !disabled &&
            'cursor-pointer hover:bg-[var(--border)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]',
          selected && 'bg-[var(--border)]/40 border-[var(--border)] font-medium',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="flex-shrink-0 text-[var(--text-muted)] flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="truncate font-medium leading-snug">{title}</div>
          {description && (
            <div className="truncate text-xs text-[var(--text-muted)] leading-snug mt-0.5">
              {description}
            </div>
          )}
        </div>
        {trailing && (
          <div className="flex-shrink-0 flex items-center gap-2 text-xs text-[var(--text-muted)]">
            {trailing}
          </div>
        )}
      </div>
    )
  }
)
ListItem.displayName = 'ListItem'
