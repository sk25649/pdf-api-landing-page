import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const { mockAuthAdmin, mockUserPlansChain, mockApiKeysChain, mockFrom, mockCdpEvm } = vi.hoisted(() => {
  const makeChain = () => {
    const c: any = {
      select: vi.fn(),
      eq: vi.fn(),
      upsert: vi.fn(),
      insert: vi.fn(),
      single: vi.fn(),
    }
    c.select.mockReturnValue(c)
    c.eq.mockReturnValue(c)
    return c
  }

  const mockUserPlansChain = makeChain()
  const mockApiKeysChain = makeChain()
  const mockFrom = vi.fn().mockImplementation((table: string) => {
    if (table === 'user_plans') return mockUserPlansChain
    if (table === 'api_keys') return mockApiKeysChain
    return makeChain()
  })

  const mockAuthAdmin = {
    createUser: vi.fn(),
    deleteUser: vi.fn(),
  }

  const mockNetworkAccount = { transfer: vi.fn() }
  const mockSmartAccount = {
    address: '0xsmartabc123',
    useNetwork: vi.fn().mockReturnValue(mockNetworkAccount),
    owners: [],
  }
  const mockOwner = { address: '0xownerabc123' }
  const mockCdpEvm = {
    createAccount: vi.fn().mockResolvedValue(mockOwner),
    createSmartAccount: vi.fn().mockResolvedValue(mockSmartAccount),
  }

  return { mockAuthAdmin, mockUserPlansChain, mockApiKeysChain, mockFrom, mockCdpEvm }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
    auth: { admin: mockAuthAdmin },
  })),
}))

vi.mock('@coinbase/cdp-sdk', () => ({
  CdpClient: vi.fn(() => ({ evm: mockCdpEvm })),
}))

vi.mock('@/lib/ratelimit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
}))

import { POST } from '@/app/api/register/route'
import { checkRateLimit } from '@/lib/ratelimit'

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.CDP_API_KEY_ID = 'test-cdp-key-id'
  process.env.CDP_API_KEY_SECRET = 'test-cdp-key-secret'
  process.env.CDP_WALLET_SECRET = 'test-cdp-wallet-secret'
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(checkRateLimit).mockResolvedValue(true)
  mockCdpEvm.createAccount.mockResolvedValue({ address: '0xownerabc123' })
  mockCdpEvm.createSmartAccount.mockResolvedValue({ address: '0xsmartabc123', useNetwork: vi.fn(), owners: [] })
  mockAuthAdmin.createUser.mockResolvedValue({ data: { user: { id: 'user-uuid-1' } }, error: null })
  mockAuthAdmin.deleteUser.mockResolvedValue({ error: null })
  mockUserPlansChain.upsert.mockResolvedValue({ error: null })
  mockApiKeysChain.insert.mockResolvedValue({ error: null })
})

function makeRequest(body: unknown = {}, ip = '1.2.3.4') {
  return new NextRequest('http://localhost/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

describe('POST /api/register', () => {
  it('returns 429 when IP rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue(false)

    const res = await POST(makeRequest())
    expect(res.status).toBe(429)
    const body = await res.json()
    expect(body.error).toMatch(/too many/i)
  })

  it('returns 400 for invalid email format', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('returns 201 with api_key and usdc_address on success (no email = 3 credits)', async () => {
    const res = await POST(makeRequest())
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.api_key).toMatch(/^pk_/)
    expect(body.usdc_address).toBe('0xsmartabc123')
    expect(body.free_calls).toBe(3)
    expect(body.credits_per_usdc).toBe(50)
    expect(body.network).toBe('base-mainnet')
  })

  it('returns 10 free credits when email is provided', async () => {
    const res = await POST(makeRequest({ email: 'dev@example.com' }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.free_calls).toBe(10)
  })

  it('includes notifications block when notify_email is provided', async () => {
    const res = await POST(makeRequest({ notify_email: 'ops@example.com' }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.notifications.low_balance_email).toBe('ops@example.com')
    expect(body.notifications.threshold).toBe(50)
  })

  it('omits notifications block when notify_email is not provided', async () => {
    const res = await POST(makeRequest())
    const body = await res.json()
    expect(body.notifications).toBeUndefined()
  })

  it('auto-generates agent email when none provided', async () => {
    const res = await POST(makeRequest())
    expect(res.status).toBe(201)
    // The email passed to createUser should be auto-generated
    const createUserCall = mockAuthAdmin.createUser.mock.calls[0][0]
    expect(createUserCall.email).toMatch(/^agent-.+@docapi\.co$/)
  })

  it('uses provided email when given', async () => {
    const res = await POST(makeRequest({ email: 'myagent@example.com' }))
    expect(res.status).toBe(201)
    const createUserCall = mockAuthAdmin.createUser.mock.calls[0][0]
    expect(createUserCall.email).toBe('myagent@example.com')
  })

  it('returns 500 and rolls back auth user when CDP wallet creation fails', async () => {
    mockCdpEvm.createAccount.mockRejectedValue(new Error('CDP API down'))

    const res = await POST(makeRequest())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toMatch(/payment wallet/i)
    // Auth user should be deleted on rollback
    expect(mockAuthAdmin.deleteUser).toHaveBeenCalledWith('user-uuid-1')
  })

  it('returns 500 and rolls back when user_plans upsert fails', async () => {
    mockUserPlansChain.upsert.mockResolvedValue({ error: { message: 'db error' } })

    const res = await POST(makeRequest())
    expect(res.status).toBe(500)
    expect(mockAuthAdmin.deleteUser).toHaveBeenCalledWith('user-uuid-1')
  })

  it('returns 500 and rolls back when api_keys insert fails', async () => {
    mockApiKeysChain.insert.mockResolvedValue({ error: { message: 'db error' } })

    const res = await POST(makeRequest())
    expect(res.status).toBe(500)
    expect(mockAuthAdmin.deleteUser).toHaveBeenCalledWith('user-uuid-1')
  })

  it('uses first 24 hex chars of UUID (no hyphens) for CDP account names', async () => {
    // UUID: 'user-uuid-1' is not a real UUID so let's configure a proper one
    mockAuthAdmin.createUser.mockResolvedValue({
      data: { user: { id: 'f8fe86e0-29df-4262-be9a-7ab2c37fdfd5' } },
      error: null,
    })

    await POST(makeRequest())

    const ownerCall = mockCdpEvm.createAccount.mock.calls[0][0]
    expect(ownerCall.name).toBe('agent-owner-f8fe86e029df4262be9a7ab2') // 36 chars
    expect(ownerCall.name.length).toBeLessThanOrEqual(36)

    const smartCall = mockCdpEvm.createSmartAccount.mock.calls[0][0]
    expect(smartCall.name).toBe('agent-f8fe86e029df4262be9a7ab2') // 30 chars
    expect(smartCall.name.length).toBeLessThanOrEqual(36)
  })

  it('upserts user_plans with agent plan and 3 free credits when no email', async () => {
    await POST(makeRequest())
    expect(mockUserPlansChain.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ plan: 'agent', credits: 3, usdc_address: '0xsmartabc123' }),
      expect.objectContaining({ onConflict: 'user_id' })
    )
  })

  it('upserts user_plans with 10 free credits when email is provided', async () => {
    await POST(makeRequest({ email: 'dev@example.com' }))
    expect(mockUserPlansChain.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ plan: 'agent', credits: 10, usdc_address: '0xsmartabc123' }),
      expect.objectContaining({ onConflict: 'user_id' })
    )
  })
})
