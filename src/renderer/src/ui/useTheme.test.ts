// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme hook', () => {
  let listeners: ((e: MediaQueryListEvent) => void)[] = []
  let matchesDark = true

  beforeEach(() => {
    listeners = []
    matchesDark = true

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: matchesDark,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_, cb) => listeners.push(cb)),
        removeEventListener: vi.fn((_, cb) => {
          listeners = listeners.filter((l) => l !== cb)
        }),
        dispatchEvent: vi.fn()
      }))
    })

    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to system theme and sets data-theme to resolved system theme', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('system')
    expect(result.current.resolvedTheme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('switches to light theme and updates data-theme attribute', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('light')
    })

    expect(result.current.theme).toBe('light')
    expect(result.current.resolvedTheme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('switches to dark theme and updates data-theme attribute', () => {
    const { result } = renderHook(() => useTheme('light'))

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(result.current.resolvedTheme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('responds to system theme preference changes when theme is system', () => {
    const { result } = renderHook(() => useTheme('system'))

    act(() => {
      matchesDark = false
      listeners.forEach((l) => l({ matches: false } as MediaQueryListEvent))
    })

    expect(result.current.resolvedTheme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
