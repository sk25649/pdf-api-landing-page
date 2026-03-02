import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const { mockUserPlansChain, mockFrom, mockCdpEvm, setAgents } = vi.hoisted(() => {
  // Mutable reference so tests can change what the agents query resolves to
  let agentsResult: { data: unknown[]; error: unknown } = { data: [], error: null }

  const makeChain = () => {
    const c: any = {
      select: vi.fn(),
      eq: vi.fn(),
      not: vi.fn(),
      update: vi.fn(),
    }
    c.select.mockReturnValue(c)
    c.eq.mockReturnValue(c)
    c.not.mockReturnValue(c)
    c.update.mockReturnValue(c)
    // Make chain awaitable — the getter reads from agentsResult at call time
    Object.defineProperty(c, 'then', {
      configurable: true,
      enumerable: false,
      get() {
        return (resolve: Function) => Promise.resolve(agentsResult).then(resolve as any)
      },
    })
    return c
  }

  const mockUserPlansChain = makeChain()
  const mockFrom = vi.fn().mockReturnValue(mockUserPlansChain)

  const mockNetworkAccount = { transfer: vi.fn() }
  const mockSmartAccount = {
    address: '0xsmart123',
    useNetwork: vi.fn().mockReturnValue(mockNetworkAccount),
    owners: [],
  }
  const mockOwner = { address: '0xowner123' }
  const mockCdpEvm = {
    getAccount: vi.fn().mockResolvedValue(mockOwner),
    getSmartAccount: vi.fn().mockResolvedValue(mockSmartAccount),
  }

  // Expose a setter so tests can control the agents query result
  const setAgents = (agents: unknown[], error: unknown = null) => {
    agentsResult = { data: agents, error }
  }

  return { mockUserPlansChain, mockFrom, mockCdpEvm, setAgents }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockFrom })),
}))

vi.mock('@coinbase/cdp-sdk', () => ({
  CdpClient: vi.fn(() => ({ evm: mockCdpEvm })),
}))

import { GET } from '@/app/api/cron/sweep/route'

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------
const CRON_SECRET = 'test-cron-secret'
const TREASURY = '0xtreasury123'

function makeRequest(secret = CRON_SECRET) {
  return new NextRequest('http://localhost/api/cron/sweep', {
    headers: { authorization: `Bearer ${secret}` },
  })
}

function mockRpcBalance(atomicBalance: number) {
  const hex = '0x' + atomicBalance.toString(16).padStart(64, '0')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ result: hex }),
    })
  )
}

const AGENT = {
  user_id: 'f8fe86e0-29df-4262-be9a-7ab2c37fdfd5',
  usdc_address: '0xagentabc',
  credits: 10,
  usdc_credited_atomic: '0',
}

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.CRON_SECRET = CRON_SECRET
  process.env.TREASURY_USDC_ADDRESS = TREASURY
  process.env.CDP_API_KEY_ID = 'test-key-id'
  process.env.CDP_API_KEY_SECRET = 'test-key-secret'
  process.env.CDP_WALLET_SECRET = 'test-wallet-secret'
  process.env.CDP_PAYMASTER_URL = 'https://paymaster.test'
})

beforeEach(() => {
  vi.clearAllMocks()
  setAgents([])
  mockUserPlansChain.select.mockReturnValue(mockUserPlansChain)
  mockUserPlansChain.not.mockReturnValue(mockUserPlansChain)
  mockUserPlansChain.update.mockReturnValue(mockUserPlansChain)
  // Route uses .eq("plan","agent") for the agents fetch (must keep chain for .not),
  // and .eq("user_id", ...) for updates (must resolve as a Promise).
  mockUserPlansChain.eq.mockImplementation((col: string) => {
    if (col === 'plan') return mockUserPlansChain
    return Promise.resolve({ error: null })
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('GET /api/cron/sweep', () => {
  it('returns 401 when Authorization header is missing', async () => {
    const req = new NextRequest('http://localhost/api/cron/sweep')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('returns 401 when CRON_SECRET is wrong', async () => {
    const res = await GET(makeRequest('wrong-secret'))
    expect(res.status).toBe(401)
  })

  it('returns 500 when TREASURY_USDC_ADDRESS is not set', async () => {
    const saved = process.env.TREASURY_USDC_ADDRESS
    delete process.env.TREASURY_USDC_ADDRESS
    const res = await GET(makeRequest())
    expect(res.status).toBe(500)
    process.env.TREASURY_USDC_ADDRESS = saved
  })

  it('returns 500 when Supabase query fails', async () => {
    setAgents([], { message: 'db error' })
    const res = await GET(makeRequest())
    expect(res.status).toBe(500)
  })

  it('returns empty results when no agent wallets exist', async () => {
    setAgents([])
    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.swept_wallets).toBe(0)
    expect(body.results).toEqual([])
  })

  it('skips wallets with balance below 0.5 USDC minimum', async () => {
    setAgents([{ ...AGENT }])
    mockRpcBalance(100_000) // 0.1 USDC < 0.5 USDC min

    const res = await GET(makeRequest())
    const body = await res.json()
    expect(body.results[0].swept).toBe('0')
    expect(body.results[0].credits_added).toBe(5) // 0.1 USDC → floor(0.1 * 50) = 5 credits, but no sweep
  })

  it('credits new USDC received since last run (delta calculation)', async () => {
    setAgents([{ ...AGENT, credits: 60, usdc_credited_atomic: '1000000' }])
    mockRpcBalance(2_000_000) // 2 USDC on-chain, 1 already credited → delta = 1 USDC = 50 credits

    const mockTransfer = vi.fn().mockResolvedValue({ userOpHash: '0xhash123' })
    mockCdpEvm.getAccount.mockResolvedValue({ address: '0xowner' })
    mockCdpEvm.getSmartAccount.mockResolvedValue({
      address: '0xsmart',
      useNetwork: vi.fn().mockReturnValue({ transfer: mockTransfer }),
      owners: [],
    })

    const res = await GET(makeRequest())
    const body = await res.json()
    expect(body.total_credits_added).toBe(50)
    expect(body.results[0].credits_added).toBe(50)
  })

  it('does not double-credit when balance has not changed since last run', async () => {
    setAgents([{ ...AGENT, credits: 60, usdc_credited_atomic: '1000000' }])
    mockRpcBalance(1_000_000) // same as usdc_credited_atomic → delta = 0

    const mockTransfer = vi.fn().mockResolvedValue({ userOpHash: '0xhash123' })
    mockCdpEvm.getAccount.mockResolvedValue({ address: '0xowner' })
    mockCdpEvm.getSmartAccount.mockResolvedValue({
      address: '0xsmart',
      useNetwork: vi.fn().mockReturnValue({ transfer: mockTransfer }),
      owners: [],
    })

    const res = await GET(makeRequest())
    const body = await res.json()
    expect(body.results[0].credits_added).toBe(0)
  })

  it('performs gasless sweep via smart account and resets usdc_credited_atomic', async () => {
    setAgents([{ ...AGENT }])
    mockRpcBalance(1_000_000) // 1 USDC

    const mockTransfer = vi.fn().mockResolvedValue({ userOpHash: '0xuserophash' })
    mockCdpEvm.getAccount.mockResolvedValue({ address: '0xowner' })
    mockCdpEvm.getSmartAccount.mockResolvedValue({
      address: '0xsmart',
      useNetwork: vi.fn().mockReturnValue({ transfer: mockTransfer }),
      owners: [],
    })

    const res = await GET(makeRequest())
    const body = await res.json()

    expect(body.swept_wallets).toBe(1)
    expect(body.results[0].txHash).toBe('0xuserophash')
    expect(body.results[0].swept).toBe('1000000')
    expect(body.total_usdc_swept).toBe('1.000000')
    // Verify usdc_credited_atomic is reset to "0" after sweep
    expect(mockUserPlansChain.update).toHaveBeenCalledWith({ usdc_credited_atomic: '0' })
  })

  it('passes paymasterUrl to the transfer call', async () => {
    setAgents([{ ...AGENT }])
    mockRpcBalance(1_000_000)

    const mockTransfer = vi.fn().mockResolvedValue({ userOpHash: '0xhash' })
    mockCdpEvm.getAccount.mockResolvedValue({ address: '0xowner' })
    mockCdpEvm.getSmartAccount.mockResolvedValue({
      address: '0xsmart',
      useNetwork: vi.fn().mockReturnValue({ transfer: mockTransfer }),
      owners: [],
    })

    await GET(makeRequest())
    expect(mockTransfer).toHaveBeenCalledWith(
      expect.objectContaining({ paymasterUrl: 'https://paymaster.test' })
    )
  })

  it('records sweep error but preserves credits when sweep fails', async () => {
    setAgents([{ ...AGENT }])
    mockRpcBalance(1_000_000)

    mockCdpEvm.getAccount.mockRejectedValue(new Error('CDP API down'))

    const res = await GET(makeRequest())
    const body = await res.json()

    expect(body.swept_wallets).toBe(0)
    expect(body.results[0].swept).toBe('0')
    expect(body.results[0].error).toMatch(/sweep failed/i)
    // Credits were still added before the sweep attempt
    expect(body.results[0].credits_added).toBe(50)
  })

  it('uses correct safeId naming for CDP account lookup', async () => {
    const userId = 'f8fe86e0-29df-4262-be9a-7ab2c37fdfd5'
    setAgents([{ ...AGENT, user_id: userId }])
    mockRpcBalance(1_000_000)

    const mockTransfer = vi.fn().mockResolvedValue({ userOpHash: '0xhash' })
    mockCdpEvm.getAccount.mockResolvedValue({ address: '0xowner' })
    mockCdpEvm.getSmartAccount.mockResolvedValue({
      address: '0xsmart',
      useNetwork: vi.fn().mockReturnValue({ transfer: mockTransfer }),
      owners: [],
    })

    await GET(makeRequest())

    const safeId = userId.replace(/-/g, '').slice(0, 24) // 'f8fe86e029df4262be9a7ab2'
    expect(mockCdpEvm.getAccount).toHaveBeenCalledWith({ name: `agent-owner-${safeId}` })
    expect(mockCdpEvm.getSmartAccount).toHaveBeenCalledWith(
      expect.objectContaining({ name: `agent-${safeId}` })
    )
    expect(`agent-owner-${safeId}`.length).toBeLessThanOrEqual(36)
  })
})
