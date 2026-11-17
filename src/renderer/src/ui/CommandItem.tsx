import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'
import { Kbd } from './Kbd'

export interface CommandItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode
  label: ReactNode
  description?: ReactNode
  shortcut?: string | string[]
  selected?: boolean
  disabled?: boolean
  onSelect?: () => void
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  (
    {
      className,
      icon,
      label,
      description,
      shortcut,
      selected = false,
      disabled = false,
      onSelect,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect?.()
      }
      onKeyDown?.(e)
    }

    const shortcuts = Array.isArray(shortcut) ? shortcut : shortcut ? [shortcut] : []

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? undefined : 0}
        aria-disabled={disabled || undefined}
        aria-selected={selected || undefined}
        onClick={disabled ? undefined : onSelect}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center gap-3 px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-transparent transition-colors text-[var(--text)] select-none cursor-pointer',
          'hover:bg-[var(--border)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]',
          selected &&
            'bg-[var(--accent)]/15 text-[var(--text)] border-[var(--accent)]/30 font-medium',
          disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="flex-shrink-0 text-[var(--text-muted)] flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0 flex items-baseline gap-2">
          <span className="truncate">{label}</span>
          {description && (
            <span className="truncate text-xs text-[var(--text-muted)]">{description}</span>
          )}
        </div>
        {shortcuts.length > 0 && (
          <div className="flex-shrink-0 flex items-center gap-1">
            {shortcuts.map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </div>
        )}
      </div>
    )
  }
)
CommandItem.displayName = 'CommandItem'
