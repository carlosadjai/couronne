import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { Logger, redact } from './logger'

describe('Logger', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'couronne-logger-test-'))
  })

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  describe('redact()', () => {
    it('redacts Bearer tokens in strings', () => {
      const input = 'Authorization header: Bearer ghp_1234567890abcdef'
      expect(redact(input)).toBe('Authorization header: Bearer [REDACTED]')
    })

    it('redacts sensitive JSON keys', () => {
      const obj = {
        token: 'secret-token-123',
        password: 'my-password',
        user: 'carlos',
        nested: {
          key: 'ssh-key-value',
          authorization: 'Basic dXNlcjpwYXNz'
        }
      }
      const redacted = redact(obj)
      expect(redacted).not.toContain('secret-token-123')
      expect(redacted).not.toContain('my-password')
      expect(redacted).not.toContain('ssh-key-value')
      expect(redacted).toContain('"user":"carlos"')
      expect(redacted).toContain('[REDACTED]')
    })

    it('redacts key=value and key: value pairs in strings', () => {
      expect(redact('Connect with password=supersecret now')).toContain('password= [REDACTED]')
      expect(redact('Using secret: supersecret in call')).toContain('secret: [REDACTED]')
    })
  })

  describe('Logger file rotation', () => {
    it('creates log file and writes sanitized logs', () => {
      const logger = new Logger({ logDir: tempDir, isDev: false })
      logger.info('System started with token: secret123')

      const logPath = logger.getLogPath()
      expect(fs.existsSync(logPath)).toBe(true)

      const content = fs.readFileSync(logPath, 'utf-8')
      expect(content).toContain('[INFO] System started with token: [REDACTED]')
      expect(content).not.toContain('secret123')
    })

    it('rotates log files when size exceeds threshold and retains maxFiles', () => {
      // Small threshold for testing: 100 bytes, maxFiles: 3
      const logger = new Logger({
        logDir: tempDir,
        isDev: false,
        maxSizeBytes: 150,
        maxFiles: 3
      })

      // Write enough messages to trigger rotation multiple times
      for (let i = 0; i < 10; i++) {
        logger.info(`Message number ${i} with padding text to exceed bytes`)
      }

      const mainLog = path.join(tempDir, 'couronne.log')
      const rot1 = path.join(tempDir, 'couronne.1.log')
      const rot2 = path.join(tempDir, 'couronne.2.log')
      const rot3 = path.join(tempDir, 'couronne.3.log')

      expect(fs.existsSync(mainLog)).toBe(true)
      expect(fs.existsSync(rot1)).toBe(true)
      expect(fs.existsSync(rot2)).toBe(true)
      // Since maxFiles is 3 (couronne.log, couronne.1.log, couronne.2.log), couronne.3.log should not exist
      expect(fs.existsSync(rot3)).toBe(false)
    })
  })
})
