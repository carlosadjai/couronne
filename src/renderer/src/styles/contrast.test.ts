import { describe, it, expect } from 'vitest'
import { contrastRatio, darkThemeTokens, lightThemeTokens, type ThemeTokens } from './contrast'

describe('Contrast calculation utility', () => {
  it('computes expected ratios for black and white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 1)
  })

  function verifyThemeContrast(themeName: string, tokens: ThemeTokens): void {
    describe(`${themeName} theme contrast`, () => {
      it('satisfies WCAG AA text contrast ratio >= 4.5:1 on background and surface', () => {
        expect(contrastRatio(tokens.text, tokens.bg)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.text, tokens.surface)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.textMuted, tokens.bg)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.textMuted, tokens.surface)).toBeGreaterThanOrEqual(4.5)
      })

      it('satisfies WCAG AA accent contrast ratios (accent-fg on accent >= 4.5, accent-text on bg/surface >= 4.5)', () => {
        expect(contrastRatio(tokens.accentFg, tokens.accent)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.accentText, tokens.bg)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.accentText, tokens.surface)).toBeGreaterThanOrEqual(4.5)
      })

      it('satisfies WCAG AA status colors contrast ratio >= 4.5:1 on surface for text', () => {
        expect(contrastRatio(tokens.success, tokens.surface)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.warning, tokens.surface)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.danger, tokens.surface)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.info, tokens.surface)).toBeGreaterThanOrEqual(4.5)
      })

      it('satisfies WCAG UI component borders and focus ring contrast ratio >= 3.0:1 on bg and surface', () => {
        expect(contrastRatio(tokens.border, tokens.bg)).toBeGreaterThanOrEqual(3.0)
        expect(contrastRatio(tokens.border, tokens.surface)).toBeGreaterThanOrEqual(3.0)
        expect(contrastRatio(tokens.focusRing, tokens.bg)).toBeGreaterThanOrEqual(3.0)
        expect(contrastRatio(tokens.focusRing, tokens.surface)).toBeGreaterThanOrEqual(3.0)
      })
    })
  }

  verifyThemeContrast('Dark', darkThemeTokens)
  verifyThemeContrast('Light', lightThemeTokens)
})
