import { describe, expect, it } from 'vitest'
import { isAllowedExternalUrl, isTrustedSender } from './security'

describe('Security Utilities', () => {
  describe('isAllowedExternalUrl()', () => {
    it('accepts valid https URLs', () => {
      expect(isAllowedExternalUrl('https://github.com')).toBe(true)
      expect(isAllowedExternalUrl('https://example.com/path?foo=bar#hash')).toBe(true)
    })

    it('rejects non-https URLs', () => {
      expect(isAllowedExternalUrl('http://example.com')).toBe(false)
      expect(isAllowedExternalUrl('javascript:alert(1)')).toBe(false)
      expect(isAllowedExternalUrl('file:///C:/Windows/System32/cmd.exe')).toBe(false)
      expect(isAllowedExternalUrl('data:text/html,<b>hello</b>')).toBe(false)
      expect(isAllowedExternalUrl('ftp://ftp.example.com')).toBe(false)
    })

    it('rejects malformed or empty URLs', () => {
      expect(isAllowedExternalUrl('')).toBe(false)
      expect(isAllowedExternalUrl('not a url')).toBe(false)
      expect(isAllowedExternalUrl('//relative/path')).toBe(false)
    })
  })

  describe('isTrustedSender()', () => {
    it('in dev mode, accepts dev server and localhost origins', () => {
      const devCtx = { isDev: true, devServerUrl: 'http://localhost:5173' }
      expect(isTrustedSender('http://localhost:5173/index.html', devCtx)).toBe(true)
      expect(isTrustedSender('http://localhost:5174/subpath', devCtx)).toBe(true)
      expect(isTrustedSender('http://127.0.0.1:5173/', devCtx)).toBe(true)
    })

    it('in dev mode, rejects remote origins and untrusted protocols', () => {
      const devCtx = { isDev: true, devServerUrl: 'http://localhost:5173' }
      expect(isTrustedSender('https://malicious.com', devCtx)).toBe(false)
      expect(isTrustedSender('http://attacker.com', devCtx)).toBe(false)
      expect(isTrustedSender('javascript:void(0)', devCtx)).toBe(false)
    })

    it('in prod mode, accepts file: protocol and rejects remote/http origins', () => {
      const prodCtx = { isDev: false }
      expect(isTrustedSender('file:///C:/app/out/renderer/index.html', prodCtx)).toBe(true)
      expect(
        isTrustedSender('file:///Applications/Couronne.app/Contents/Resources/index.html', prodCtx)
      ).toBe(true)

      expect(isTrustedSender('http://localhost:5173', prodCtx)).toBe(false)
      expect(isTrustedSender('https://example.com', prodCtx)).toBe(false)
      expect(isTrustedSender('data:text/html,test', prodCtx)).toBe(false)
    })

    it('rejects undefined, null or empty inputs', () => {
      const ctx = { isDev: false }
      expect(isTrustedSender(undefined, ctx)).toBe(false)
      expect(isTrustedSender(null, ctx)).toBe(false)
      expect(isTrustedSender('', ctx)).toBe(false)
    })
  })
})
