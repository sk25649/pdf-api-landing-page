import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@vercel/kv', () => ({
  kv: {
    incr: vi.fn(),
    expire: vi.fn(),
  },
}))

import { kv } from '@vercel/kv'
import { checkRateLimit } from '@/lib/ratelimit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows the first request and sets TTL', async () => {
    vi.mocked(kv.incr).mockResolvedValue(1)
    vi.mocked(kv.expire).mockResolvedValue(1)

    const result = await checkRateLimit('1.2.3.4', 5, 3600, 'test')

    expect(result).toBe(true)
    expect(kv.incr).toHaveBeenCalledWith('ratelimit:test:1.2.3.4')
    expect(kv.expire).toHaveBeenCalledWith('ratelimit:test:1.2.3.4', 3600)
  })

  it('allows request exactly at the limit', async () => {
    vi.mocked(kv.incr).mockResolvedValue(5)
    expect(await checkRateLimit('1.2.3.4', 5, 3600, 'test')).toBe(true)
  })

  it('blocks request one over the limit', async () => {
    vi.mocked(kv.incr).mockResolvedValue(6)
    expect(await checkRateLimit('1.2.3.4', 5, 3600, 'test')).toBe(false)
  })

  it('does not reset TTL on subsequent requests (count > 1)', async () => {
    vi.mocked(kv.incr).mockResolvedValue(3)
    await checkRateLimit('1.2.3.4', 5, 3600, 'test')
    expect(kv.expire).not.toHaveBeenCalled()
  })

  it('uses correct key including prefix and IP', async () => {
    vi.mocked(kv.incr).mockResolvedValue(1)
    await checkRateLimit('9.9.9.9', 10, 86400, 'register')
    expect(kv.incr).toHaveBeenCalledWith('ratelimit:register:9.9.9.9')
  })

  it('uses default prefix "tools" when not specified', async () => {
    vi.mocked(kv.incr).mockResolvedValue(1)
    await checkRateLimit('1.2.3.4', 10, 3600)
    expect(kv.incr).toHaveBeenCalledWith('ratelimit:tools:1.2.3.4')
  })

  it('fails open (returns true) when KV throws', async () => {
    vi.mocked(kv.incr).mockRejectedValue(new Error('KV connection refused'))
    expect(await checkRateLimit('1.2.3.4', 5, 3600, 'test')).toBe(true)
  })
})
