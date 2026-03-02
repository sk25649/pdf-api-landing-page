import { describe, it, expect } from 'vitest'
import { generateApiKey } from '@/lib/api-keys'

describe('generateApiKey', () => {
  it('generates key with pk_ prefix', () => {
    expect(generateApiKey()).toMatch(/^pk_/)
  })

  it('generates key of correct length (49 chars: 3 prefix + 46 hex)', () => {
    // 3 bytes prefix "pk_" + 23 random bytes * 2 hex chars = 3 + 46 = 49
    expect(generateApiKey()).toHaveLength(49)
  })

  it('only contains lowercase hex chars after prefix', () => {
    const key = generateApiKey()
    expect(key.slice(3)).toMatch(/^[0-9a-f]{46}$/)
  })

  it('generates unique keys on each call', () => {
    const keys = new Set(Array.from({ length: 20 }, generateApiKey))
    expect(keys.size).toBe(20)
  })
})
