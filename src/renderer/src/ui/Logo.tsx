import { forwardRef, type SVGProps } from 'react'
import { cn } from './cn'

export interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

export const Logo = forwardRef<SVGSVGElement, LogoProps>(
  ({ size = 32, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        className={cn('text-[var(--accent-text)] inline-block flex-shrink-0', className)}
        aria-label="Couronne Logo"
        role="img"
        {...props}
      >
        <path
          d="M4 22L7 10L12.5 16L16 6L19.5 16L25 10L28 22H4Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect x="4" y="24" width="24" height="3" rx="1.5" fill="currentColor" />
        <circle cx="7" cy="8.5" r="1.5" fill="currentColor" />
        <circle cx="16" cy="4.5" r="1.75" fill="currentColor" />
        <circle cx="25" cy="8.5" r="1.5" fill="currentColor" />
      </svg>
    )
  }
)
Logo.displayName = 'Logo'
