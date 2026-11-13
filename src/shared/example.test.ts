import { describe, expect, it } from 'vitest'
import { sum } from './example'

describe('sum', () => {
  it('adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
