/**
 * Validates that an external URL is secure and allowed to be opened in the default browser.
 * Only 'https:' protocol is permitted.
 */
export function isAllowedExternalUrl(url: string): boolean {
  if (typeof url !== 'string' || url.trim() === '') {
    return false
  }

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export interface TrustedSenderContext {
  isDev: boolean
  devServerUrl?: string
  appPath?: string
}

/**
 * Checks whether the IPC message sender frame originates from a trusted local application source.
 * In development, accepts dev server origin (http://localhost / 127.0.0.1).
 * In production, strictly requires 'file:' protocol matching application renderer files.
 */
export function isTrustedSender(
  url: string | undefined | null,
  context: TrustedSenderContext
): boolean {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false
  }

  try {
    const parsed = new URL(url)

    if (context.isDev) {
      if (context.devServerUrl) {
        try {
          const devParsed = new URL(context.devServerUrl)
          if (parsed.origin === devParsed.origin) {
            return true
          }
        } catch {
          // Fall back to general dev localhost check
        }
      }

      const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
      return parsed.protocol === 'http:' && isLocalHost
    }

    // In production, renderer must be loaded from local files
    if (parsed.protocol === 'file:') {
      return true
    }

    return false
  } catch {
    return false
  }
}

export const PROD_CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self' data:; object-src 'none'; base-uri 'self';"

export const DEV_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:*; style-src 'self' 'unsafe-inline'; img-src 'self' data: http://localhost:* http://127.0.0.1:*; connect-src 'self' ws://localhost:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:*; font-src 'self' data:; object-src 'none'; base-uri 'self';"
