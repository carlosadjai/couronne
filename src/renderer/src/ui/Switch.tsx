import { forwardRef } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from './cn'

export interface SwitchProps extends SwitchPrimitive.SwitchProps {
  label?: string
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const switchElement = (
      <SwitchPrimitive.Root
        ref={ref}
        id={id}
        aria-label={label}
        className={cn(
          'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--accent)] data-[state=unchecked]:bg-[var(--border)]',
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-[var(--surface)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:bg-[var(--accent-fg)]'
          )}
        />
      </SwitchPrimitive.Root>
    )

    if (label) {
      return (
        <label
          htmlFor={id}
          className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[var(--text)] select-none"
        >
          {switchElement}
          <span>{label}</span>
        </label>
      )
    }

    return switchElement
  }
)

Switch.displayName = 'Switch'
