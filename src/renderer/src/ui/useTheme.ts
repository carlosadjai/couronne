import { useState, useEffect, useCallback } from 'react'

export type Theme = 'system' | 'dark' | 'light'
export type ResolvedTheme = 'dark' | 'light'

export interface UseThemeReturn {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark'
}

export function useTheme(initialTheme: Theme = 'system'): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent): void => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return (): void => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolvedTheme)
    }
  }, [resolvedTheme])

  const setTheme = useCallback((newTheme: Theme): void => {
    setThemeState(newTheme)
  }, [])

  return { theme, resolvedTheme, setTheme }
}
