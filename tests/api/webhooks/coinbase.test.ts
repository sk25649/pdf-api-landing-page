import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const { mockUserPlansChain, mockFrom, mockLoopsSend } = vi.hoisted(() => {
  const makeChain = () => {
    const c: any = {
      select: vi.fn(),
      eq: vi.fn(),
      ilike: vi.fn(),
      update: vi.fn(),
      single: vi.fn(),
    }
    c.select.mockReturnValue(c)
    c.eq.mockReturnValue(c)
    c.ilike.mockReturnValue(c)
    c.update.mockReturnValue(c)
    return c
  }

  const mockUserPlansChain = makeChain()
  const mockFrom = vi.fn().mockReturnValue(mockUserPlansChain)
  const mockLoopsSend = vi.fn().mockResolvedValue({})

  return { mockUserPlansChain, mockFrom, mockLoopsSend }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockFrom })),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

vi.mock('loops', () => ({
  LoopsClient: vi.fn(() => ({ sendTransactionalEmail: mockLoopsSend })),
}))

import { POST } from '@/app/api/webhooks/coinbase/route'
import { headers } from 'next/headers'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TEST_SECRET = 'test-webhook-secret'

// The verifySignature function checks `!headerNames` — empty string is falsy and will fail.
// We must include at least one header name. Use "content-type" so it's always present.
async function makeSignature(body: string, contentType = 'application/json'): Promise<string> {
  const timestamp = '1700000000'
  const headerNames = 'content-type'
  const headerValues = contentType
  const signedPayload = `${timestamp}.${headerNames}.${headerValues}.${body}`

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(TEST_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `t=${timestamp},h=${headerNames},v1=${hex}`
}

async function makeRequest(body: unknown, signature?: string) {
  const bodyStr = JSON.stringify(body)
  const contentType = 'application/json'
  const sig = signature ?? (await makeSignature(bodyStr, contentType))

  const reqHeaders = new Headers({
    'content-type': contentType,
    'x-hook0-signature': sig,
  })

  vi.mocked(headers).mockResolvedValue(reqHeaders as any)

  return new Request('http://localhost/api/webhooks/coinbase', {
    method: 'POST',
    headers: reqHeaders,
    body: bodyStr,
  })
}

const CDP_PAYLOAD = (toAddress: string, valueAtomic: number) => ({
  parameters: {
    from: '0xsender',
    to: toAddress,
    value: String(valueAtomic),
  },
  transaction_hash: '0xabc',
  block_number: 1000,
})

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.COINBASE_WEBHOOK_SECRET = TEST_SECRET
  process.env.LOOPS_API_KEY = 'loops-key'
  process.env.LOOPS_LOW_CREDITS_TEMPLATE_ID = 'tmpl-123'
})

beforeEach(() => {
  vi.clearAllMocks()
  mockUserPlansChain.select.mockReturnValue(mockUserPlansChain)
  mockUserPlansChain.eq.mockReturnValue(mockUserPlansChain)
  mockUserPlansChain.ilike.mockReturnValue(mockUserPlansChain)
  mockUserPlansChain.update.mockReturnValue(mockUserPlansChain)
})

describe('POST /api/webhooks/coinbase', () => {
  it('returns 400 when X-Hook0-Signature header is missing', async () => {
    vi.mocked(headers).mockResolvedValue(new Headers() as any)

    const req = new Request('http://localhost/api/webhooks/coinbase', {
      method: 'POST',
      body: '{}',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/missing signature/i)
  })

  it('returns 400 when signature is invalid', async () => {
    const reqHeaders = new Headers({
      'x-hook0-signature': 't=1700000000,h=,v1=badhexbadbadhexbad',
    })
    vi.mocked(headers).mockResolvedValue(reqHeaders as any)

    const req = new Request('http://localhost/api/webhooks/coinbase', {
      method: 'POST',
      headers: reqHeaders,
      body: '{"test": true}',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/invalid signature/i)
  })

  it('returns 200 with skipped=unknown address when address is not in our db', async () => {
    mockUserPlansChain.single.mockResolvedValue({ data: null, error: { message: 'not found' } })

    const payload = CDP_PAYLOAD('0xunknown', 1_000_000)
    const req = await makeRequest(payload)
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.skipped).toBe('unknown address')
  })

  it('credits 50 credits per 1 USDC received', async () => {
    mockUserPlansChain.single.mockResolvedValue({
      data: {
        user_id: 'uid-1',
        credits: 10,
        usdc_address: '0xagent123',
        notify_email: null,
        low_balance_notified_at: null,
      },
      error: null,
    })
    mockUserPlansChain.eq.mockResolvedValue({ error: null })

    const payload = CDP_PAYLOAD('0xagent123', 1_000_000) // 1 USDC
    const req = await makeRequest(payload)
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.credits_added).toBe(50)
    expect(body.new_balance).toBe(60) // 10 existing + 50 new
  })

  it('credits correct fractional amounts (0.5 USDC = 25 credits)', async () => {
    mockUserPlansChain.single.mockResolvedValue({
      data: {
        user_id: 'uid-2',
        credits: 0,
        usdc_address: '0xagent456',
        notify_email: null,
        low_balance_notified_at: null,
      },
      error: null,
    })
    mockUserPlansChain.eq.mockResolvedValue({ error: null })

    const payload = CDP_PAYLOAD('0xagent456', 500_000) // 0.5 USDC
    const req = await makeRequest(payload)
    const res = await POST(req)

    const body = await res.json()
    expect(body.credits_added).toBe(25)
    expect(body.new_balance).toBe(25)
  })

  it('returns 500 when Supabase update fails', async () => {
    mockUserPlansChain.single.mockResolvedValue({
      data: {
        user_id: 'uid-1',
        credits: 10,
        usdc_address: '0xagent123',
        notify_email: null,
        low_balance_notified_at: null,
      },
      error: null,
    })
    mockUserPlansChain.eq.mockResolvedValue({ error: { message: 'db error' } })

    const payload = CDP_PAYLOAD('0xagent123', 1_000_000)
    const req = await makeRequest(payload)
    const res = await POST(req)

    expect(res.status).toBe(500)
  })

  it('returns 400 for invalid payload structure', async () => {
    const req = await makeRequest({ completely: 'wrong' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('sends low-balance email when balance stays below threshold after top-up', async () => {
    mockUserPlansChain.single.mockResolvedValue({
      data: {
        user_id: 'uid-3',
        credits: 20,
        usdc_address: '0xagent789',
        notify_email: 'ops@example.com',
        low_balance_notified_at: null,
      },
      error: null,
    })
    // First eq call (update credits) and second eq call (update notified_at)
    mockUserPlansChain.eq
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: null })

    // 0.5 USDC = 25 credits, 20 + 25 = 45 < threshold (50) → should send email
    const payload = CDP_PAYLOAD('0xagent789', 500_000)
    const req = await makeRequest(payload)
    await POST(req)

    // Give fire-and-forget time to execute
    await new Promise((r) => setTimeout(r, 10))
    expect(mockLoopsSend).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'ops@example.com' })
    )
  })

  it('does not send low-balance email when balance is above threshold after top-up', async () => {
    mockUserPlansChain.single.mockResolvedValue({
      data: {
        user_id: 'uid-4',
        credits: 10,
        usdc_address: '0xagenthigh',
        notify_email: 'ops@example.com',
        low_balance_notified_at: null,
      },
      error: null,
    })
    mockUserPlansChain.eq.mockResolvedValue({ error: null })

    // 10 USDC = 500 credits, 10 + 500 = 510 > threshold → no email
    const payload = CDP_PAYLOAD('0xagenthigh', 10_000_000)
    const req = await makeRequest(payload)
    await POST(req)

    await new Promise((r) => setTimeout(r, 10))
    expect(mockLoopsSend).not.toHaveBeenCalled()
  })
})
