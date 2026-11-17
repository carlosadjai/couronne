import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface KbdProps extends HTMLAttributes<HTMLElement> {}

export const Kbd = forwardRef<HTMLElement, KbdProps>(({ className, children, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-mono text-[11px] font-medium px-1.5 py-0.5 min-w-[20px] rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] shadow-[0_1px_0_0_var(--border)] select-none',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
})
Kbd.displayName = 'Kbd'
