import { forwardRef, type ElementRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { cn } from './cn'

export const ToastProvider = ToastPrimitive.Provider

export const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 p-2 outline-none',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-[var(--radius-md)] border p-4 shadow-lg transition-all text-sm',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]',
        success: 'bg-[var(--surface)] text-[var(--text)] border-[var(--success)]/50',
        warning: 'bg-[var(--surface)] text-[var(--text)] border-[var(--warning)]/50',
        danger: 'bg-[var(--surface)] text-[var(--text)] border-[var(--danger)]/50',
        info: 'bg-[var(--surface)] text-[var(--text)] border-[var(--info)]/50'
      }
    },
    defaultVariants: {
      variant: 'neutral'
    }
  }
)

export interface ToastProps
  extends ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, VariantProps<typeof toastVariants> {
  icon?: ReactNode
  hideIcon?: boolean
}

export const Toast = forwardRef<ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = 'neutral', icon, hideIcon = false, children, ...props }, ref) => {
    const renderIcon = (): ReactNode => {
      if (hideIcon) return null
      if (icon) return icon

      switch (variant) {
        case 'success':
          return (
            <CheckCircle2
              size={18}
              className="text-[var(--success)] flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )
        case 'warning':
          return (
            <AlertTriangle
              size={18}
              className="text-[var(--warning)] flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )
        case 'danger':
          return (
            <AlertCircle
              size={18}
              className="text-[var(--danger)] flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )
        case 'info':
          return (
            <Info
              size={18}
              className="text-[var(--info)] flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )
        default:
          return null
      }
    }

    return (
      <ToastPrimitive.Root
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {renderIcon()}
        <div className="flex-1 min-w-0">{children}</div>
      </ToastPrimitive.Root>
    )
  }
)
Toast.displayName = ToastPrimitive.Root.displayName

export const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitive.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-7 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 text-xs font-medium text-[var(--text)] transition-colors hover:bg-[var(--border)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitive.Action.displayName

export const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    aria-label="Fermer la notification"
    className={cn(
      'absolute right-2 top-2 rounded-[var(--radius-sm)] p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer',
      className
    )}
    toast-close=""
    {...props}
  >
    <X size={14} aria-hidden="true" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

export const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold text-[var(--text)] leading-none', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

export const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-xs text-[var(--text-muted)] mt-1 leading-normal', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName
