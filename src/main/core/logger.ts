import fs from 'node:fs'
import path from 'node:path'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const SENSITIVE_KEY_REGEX = /^(token|secret|password|authorization|key)$/i
const BEARER_REGEX = /(Bearer\s+)[A-Za-z0-9\-._~+/]+=*/gi
const JSON_SECRET_REGEX = /"(token|secret|password|authorization|key)"\s*:\s*"([^"]*)"/gi
const KV_SECRET_REGEX = /(token|secret|password|authorization|key)\s*([:=])\s*([^\s,;]+)/gi

/**
 * Pure function that sanitizes any sensitive credentials or secrets.
 */
export function redact(input: unknown): string {
  if (input === null || input === undefined) {
    return String(input)
  }

  if (typeof input === 'string') {
    return input
      .replace(BEARER_REGEX, '$1[REDACTED]')
      .replace(JSON_SECRET_REGEX, '"$1": "[REDACTED]"')
      .replace(KV_SECRET_REGEX, '$1$2 [REDACTED]')
  }

  if (typeof input === 'object') {
    try {
      const sanitized = sanitizeObject(input)
      return JSON.stringify(sanitized)
    } catch {
      return String(input)
    }
  }

  return String(input)
}

function sanitizeObject(obj: unknown): unknown {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEY_REGEX.test(key)) {
      result[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value)
    } else if (typeof value === 'string') {
      result[key] = redact(value)
    } else {
      result[key] = value
    }
  }
  return result
}

export interface LoggerOptions {
  logDir: string
  isDev?: boolean
  maxSizeBytes?: number
  maxFiles?: number
}

export class Logger {
  private readonly logDir: string
  private readonly isDev: boolean
  private readonly maxSizeBytes: number
  private readonly maxFiles: number
  private readonly mainLogPath: string

  constructor(options: LoggerOptions) {
    this.logDir = options.logDir
    this.isDev = options.isDev ?? false
    this.maxSizeBytes = options.maxSizeBytes ?? 1024 * 1024 // 1 MB
    this.maxFiles = options.maxFiles ?? 3
    this.mainLogPath = path.join(this.logDir, 'couronne.log')

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  public debug(message: string, ...args: unknown[]): void {
    this.write('debug', message, args)
  }

  public info(message: string, ...args: unknown[]): void {
    this.write('info', message, args)
  }

  public warn(message: string, ...args: unknown[]): void {
    this.write('warn', message, args)
  }

  public error(message: string, ...args: unknown[]): void {
    this.write('error', message, args)
  }

  private write(level: LogLevel, message: string, args: unknown[]): void {
    const timestamp = new Date().toISOString()
    const formattedArgs = args.length > 0 ? ' ' + args.map(redact).join(' ') : ''
    const line = `[${timestamp}] [${level.toUpperCase()}] ${redact(message)}${formattedArgs}\n`

    if (this.isDev) {
      const consoleMsg = `[${level.toUpperCase()}] ${redact(message)}${formattedArgs}`
      if (level === 'error') {
        console.error(consoleMsg)
      } else if (level === 'warn') {
        console.warn(consoleMsg)
      } else {
        console.log(consoleMsg)
      }
    }

    this.rotateIfNeeded(Buffer.byteLength(line, 'utf-8'))
    fs.appendFileSync(this.mainLogPath, line, 'utf-8')
  }

  public rotateIfNeeded(incomingBytes: number = 0): void {
    if (!fs.existsSync(this.mainLogPath)) {
      return
    }

    try {
      const stats = fs.statSync(this.mainLogPath)
      if (stats.size + incomingBytes < this.maxSizeBytes) {
        return
      }

      // Perform rotation:
      // Remove oldest file if reached maxFiles
      const oldestIndex = this.maxFiles - 1
      const oldestPath = path.join(this.logDir, `couronne.${oldestIndex}.log`)
      if (fs.existsSync(oldestPath)) {
        fs.unlinkSync(oldestPath)
      }

      // Shift numbered files: e.g. couronne.1.log -> couronne.2.log
      for (let i = oldestIndex - 1; i >= 1; i--) {
        const currentPath = path.join(this.logDir, `couronne.${i}.log`)
        const nextPath = path.join(this.logDir, `couronne.${i + 1}.log`)
        if (fs.existsSync(currentPath)) {
          fs.renameSync(currentPath, nextPath)
        }
      }

      // Rename current main log to couronne.1.log
      const firstRotatedPath = path.join(this.logDir, 'couronne.1.log')
      fs.renameSync(this.mainLogPath, firstRotatedPath)
    } catch {
      // Avoid throwing during log rotation
    }
  }

  public getLogPath(): string {
    return this.mainLogPath
  }
}
