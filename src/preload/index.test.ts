import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

describe('Preload bundle isolation and security', () => {
  const bundlePath = resolve(__dirname, '../../out/preload/index.js')

  beforeAll(() => {
    if (!existsSync(bundlePath)) {
      execSync('npx electron-vite build', { stdio: 'pipe' })
    }
  })

  it('contains strictly no external require() other than "electron"', () => {
    expect(existsSync(bundlePath)).toBe(true)
    const bundleContent = readFileSync(bundlePath, 'utf-8')

    // Find all require statements like require("...") or require('...')
    const requireMatches = [...bundleContent.matchAll(/require\(["']([^"']+)["']\)/g)].map(
      (m) => m[1]
    )

    const nonElectronRequires = requireMatches.filter((mod) => mod !== 'electron')
    expect(nonElectronRequires).toEqual([])
  })

  it('does not bundle or require zod runtime in sandboxed preload', () => {
    const bundleContent = readFileSync(bundlePath, 'utf-8')
    expect(bundleContent).not.toMatch(/require\(["']zod["']\)/)
  })
})
