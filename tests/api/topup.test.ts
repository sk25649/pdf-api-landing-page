import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Hoisted mocks — must be created before vi.mock factories run
// ---------------------------------------------------------------------------
const { mockChain, mockFrom } = vi.hoisted(() => {
  const mockChain: Record<string, ReturnType<typeof vi.fn>> & { _result: unknown } = {
    _result: { data: null, error: null },
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    single: vi.fn(),
  }
  mockChain.select.mockReturnValue(mockChain)
  mockChain.eq.mockReturnValue(mockChain)
  mockChain.is.mockReturnValue(mockChain)

  const mockFrom = vi.fn().mockReturnValue(mockChain)
  return { mockChain, mockFrom }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockFrom })),
}))

import { GET } from '@/app/api/topup/route'

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
})

beforeEach(() => {
  vi.clearAllMocks()
  mockChain.select.mockReturnValue(mockChain)
  mockChain.eq.mockReturnValue(mockChain)
  mockChain.is.mockReturnValue(mockChain)
})

function makeRequest(apiKey?: string) {
  const headers: Record<string, string> = {}
  if (apiKey) headers['x-api-key'] = apiKey
  return new NextRequest('http://localhost/api/topup', { headers })
}

describe('GET /api/topup', () => {
  it('returns 401 when x-api-key header is missing', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/missing/i)
  })

  it('returns 401 when API key is not found in db', async () => {
    mockChain.single.mockResolvedValueOnce({ data: null, error: { message: 'not found' } })

    const res = await GET(makeRequest('pk_invalid'))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/invalid api key/i)
  })

  it('returns 404 when user_plans row does not exist', async () => {
    mockChain.single
      .mockResolvedValueOnce({ data: { user_id: 'uid-1' }, error: null }) // api_keys
      .mockResolvedValueOnce({ data: null, error: { message: 'not found' } }) // user_plans

    const res = await GET(makeRequest('pk_valid'))
    expect(res.status).toBe(404)
  })

  it('returns 403 for non-agent plan accounts', async () => {
    mockChain.single
      .mockResolvedValueOnce({ data: { user_id: 'uid-1' }, error: null })
      .mockResolvedValueOnce({ data: { credits: 1000, usdc_address: null, plan: 'pro' }, error: null })

    const res = await GET(makeRequest('pk_pro_user'))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/agent accounts only/i)
  })

  it('returns 200 with credits and usdc_address for agent accounts', async () => {
    mockChain.single
      .mockResolvedValueOnce({ data: { user_id: 'uid-1' }, error: null })
      .mockResolvedValueOnce({
        data: { credits: 60, usdc_address: '0xagent123', plan: 'agent' },
        error: null,
      })

    const res = await GET(makeRequest('pk_agent_key'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.credits).toBe(60)
    expect(body.usdc_address).toBe('0xagent123')
    expect(body.rate).toMatch(/\$0\.02/)
    expect(body.suggested_topup_usdc).toBe(10)
  })

  it('returns 200 with zero credits when agent is exhausted', async () => {
    mockChain.single
      .mockResolvedValueOnce({ data: { user_id: 'uid-2' }, error: null })
      .mockResolvedValueOnce({
        data: { credits: 0, usdc_address: '0xagent456', plan: 'agent' },
        error: null,
      })

    const res = await GET(makeRequest('pk_empty_agent'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.credits).toBe(0)
  })
})
