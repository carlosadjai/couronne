/**
 * Utility functions for computing relative luminance and WCAG 2.1 contrast ratios.
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '').trim()
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16)
    const g = parseInt(cleanHex[1] + cleanHex[1], 16)
    const b = parseInt(cleanHex[2] + cleanHex[2], 16)
    return { r, g, b }
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return { r, g, b }
  }
  throw new Error(`Invalid hex color: "${hex}"`)
}

export function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculates the WCAG 2.1 contrast ratio between two hex colors.
 * Returns a number between 1 and 21.
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const rgbA = hexToRgb(hexA)
  const rgbB = hexToRgb(hexB)
  const l1 = relativeLuminance(rgbA.r, rgbA.g, rgbA.b)
  const l2 = relativeLuminance(rgbB.r, rgbB.g, rgbB.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export interface ThemeTokens {
  bg: string
  surface: string
  border: string
  text: string
  textMuted: string
  accent: string
  accentFg: string
  accentText: string
  success: string
  warning: string
  danger: string
  info: string
  focusRing: string
}

/**
 * Validated color tokens for Couronne.
 * Calibrated to strictly satisfy WCAG AA contrast ratios:
 * - Text >= 4.5:1
 * - Component borders, icons, and focus rings >= 3.0:1
 */
export const darkThemeTokens: ThemeTokens = {
  bg: '#0F1115',
  surface: '#171A21',
  border: '#616D86', // Calibrated to satisfy >= 3.0:1 against both #0F1115 and #171A21
  text: '#E6E8EE',
  textMuted: '#9AA3B2',
  accent: '#E3B341', // Gold fill for buttons/badges
  accentFg: '#171A21', // Dark text on gold button (>= 4.5:1)
  accentText: '#E3B341', // Gold text on dark bg (>= 4.5:1)
  success: '#3FB950',
  warning: '#E0A32A', // Lightened to pass 4.5:1 on dark surface
  danger: '#F85149',
  info: '#58A6FF',
  focusRing: '#E3B341'
}

export const lightThemeTokens: ThemeTokens = {
  bg: '#FAFAF7',
  surface: '#FFFFFF',
  border: '#858C98', // Calibrated to satisfy >= 3.0:1 on #FAFAF7 / #FFFFFF
  text: '#1B1E24',
  textMuted: '#525B6A', // Adjusted slightly to satisfy >= 4.5:1
  accent: '#D49B0E', // Gold background for buttons
  accentFg: '#171A21', // Dark text on gold button
  accentText: '#7A5200', // Darker gold passing >= 4.5:1 as text on light background
  success: '#1A7F37',
  warning: '#7F5200', // Darkened to pass >= 4.5:1 on light background
  danger: '#CF222E',
  info: '#0969DA',
  focusRing: '#946600' // Darkened gold to pass >= 3.0:1 on light background
}
