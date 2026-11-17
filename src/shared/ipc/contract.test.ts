import { describe, expect, it } from 'vitest'
import { pingInputSchema, infoOutputSchema, pingChannel } from './channels'

describe('IPC contract schemas', () => {
  it('validates ping input correctly', () => {
    expect(pingInputSchema.safeParse({ message: 'hello' }).success).toBe(true)
    expect(pingInputSchema.safeParse({ message: '' }).success).toBe(false)
    expect(pingInputSchema.safeParse({ message: 'a'.repeat(101) }).success).toBe(false)
    expect(pingInputSchema.safeParse({}).success).toBe(false)
  })

  it('validates app:info output correctly', () => {
    const valid = {
      name: 'Couronne',
      version: '0.1.0',
      platform: 'win32',
      electronVersion: '44.11.1'
    }
    expect(infoOutputSchema.safeParse(valid).success).toBe(true)
    expect(infoOutputSchema.safeParse({ ...valid, platform: 'solaris' }).success).toBe(false)
  })

  it('defines channel metadata correctly', () => {
    expect(pingChannel.name).toBe('app:ping')
    expect(pingChannel.input).toBe(pingInputSchema)
  })
})
