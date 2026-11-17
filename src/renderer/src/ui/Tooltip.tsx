import { forwardRef, type ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from './cn'

export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipRoot = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, side = 'top', align = 'center', sideOffset = 4, className }, ref) => {
    return (
      <TooltipProvider delayDuration={200}>
        <TooltipRoot>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              ref={ref}
              side={side}
              align={align}
              sideOffset={sideOffset}
              className={cn(
                'z-50 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] border border-[var(--border)] shadow-md animate-in fade-in-0 zoom-in-95',
                className
              )}
            >
              {content}
              <TooltipPrimitive.Arrow className="fill-[var(--surface)]" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipRoot>
      </TooltipProvider>
    )
  }
)

Tooltip.displayName = 'Tooltip'
