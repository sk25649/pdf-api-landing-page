import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const { mockUserPlansChain, mockFrom, mockConstructEvent, mockRevalidatePath } = vi.hoisted(() => {
  const makeChain = () => {
    const c: any = {
      eq: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    }
    c.eq.mockReturnValue(c)
    c.update.mockReturnValue(c)
    return c
  }

  const mockUserPlansChain = makeChain()
  const mockFrom = vi.fn().mockReturnValue(mockUserPlansChain)
  const mockConstructEvent = vi.fn()
  const mockRevalidatePath = vi.fn()

  return { mockUserPlansChain, mockFrom, mockConstructEvent, mockRevalidatePath }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockFrom })),
}))

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}))

import { POST } from '@/app/api/webhooks/stripe/route'
import { headers } from 'next/headers'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeStripeRequest(body: string, signature = 'valid-sig') {
  vi.mocked(headers).mockResolvedValue(
    new Headers({ 'stripe-signature': signature }) as any
  )
  return new Request('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'stripe-signature': signature },
    body,
  })
}

function makeEvent(type: string, data: unknown) {
  return { type, data: { object: data } }
}

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
  process.env.STRIPE_STARTER_PRICE_ID = 'price_starter'
  process.env.STRIPE_PRO_PRICE_ID = 'price_pro'
  process.env.STRIPE_BUSINESS_PRICE_ID = 'price_business'
})

beforeEach(() => {
  vi.clearAllMocks()
  mockUserPlansChain.eq.mockReturnValue(mockUserPlansChain)
  mockUserPlansChain.update.mockReturnValue(mockUserPlansChain)
})

describe('POST /api/webhooks/stripe', () => {
  it('returns 400 when stripe-signature header is missing', async () => {
    vi.mocked(headers).mockResolvedValue(new Headers() as any)

    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: '{}',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/no signature/i)
  })

  it('returns 400 when stripe signature verification fails', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('No signatures found matching the expected signature')
    })

    const res = await POST(makeStripeRequest('{}', 'bad-sig'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/invalid signature/i)
  })

  describe('checkout.session.completed', () => {
    it('upserts user_plans with correct plan and stripe_customer_id', async () => {
      const session = {
        metadata: { user_id: 'uid-1', plan_name: 'starter' },
        customer: 'cus_test123',
      }
      mockConstructEvent.mockReturnValue(makeEvent('checkout.session.completed', session))
      mockUserPlansChain.upsert.mockResolvedValue({ error: null })

      const res = await POST(makeStripeRequest('{}'))
      expect(res.status).toBe(200)
      expect(mockUserPlansChain.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'uid-1',
          plan: 'starter',
          stripe_customer_id: 'cus_test123',
        }),
        expect.objectContaining({ onConflict: 'user_id' })
      )
      expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
    })

    it('returns 400 when metadata is missing user_id or plan_name', async () => {
      const session = { metadata: {}, customer: 'cus_test123' }
      mockConstructEvent.mockReturnValue(makeEvent('checkout.session.completed', session))

      const res = await POST(makeStripeRequest('{}'))
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toMatch(/missing metadata/i)
    })

    it('returns 400 when customer ID is missing', async () => {
      const session = {
        metadata: { user_id: 'uid-1', plan_name: 'pro' },
        customer: null,
      }
      mockConstructEvent.mockReturnValue(makeEvent('checkout.session.completed', session))

      const res = await POST(makeStripeRequest('{}'))
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toMatch(/missing customer/i)
    })

    it('returns 500 when Supabase upsert fails', async () => {
      const session = {
        metadata: { user_id: 'uid-1', plan_name: 'pro' },
        customer: 'cus_test123',
      }
      mockConstructEvent.mockReturnValue(makeEvent('checkout.session.completed', session))
      mockUserPlansChain.upsert.mockResolvedValue({ error: { message: 'db error' } })

      const res = await POST(makeStripeRequest('{}'))
      expect(res.status).toBe(500)
    })
  })

  describe('customer.subscription.updated', () => {
    it('updates plan based on price ID', async () => {
      const subscription = {
        customer: 'cus_test456',
        items: { data: [{ price: { id: 'price_pro' } }] },
      }
      mockConstructEvent.mockReturnValue(makeEvent('customer.subscription.updated', subscription))
      mockUserPlansChain.eq.mockResolvedValue({ error: null, count: 1 })

      const res = await POST(makeStripeRequest('{}'))
      expect(res.status).toBe(200)
      expect(mockUserPlansChain.update).toHaveBeenCalledWith(
        expect.objectContaining({ plan: 'pro' })
      )
      expect(mockUserPlansChain.eq).toHaveBeenCalledWith('stripe_customer_id', 'cus_test456')
    })

    it('falls back to "free" for unknown price ID', async () => {
      const subscription = {
        customer: 'cus_test456',
        items: { data: [{ price: { id: 'price_unknown' } }] },
      }
      mockConstructEvent.mockReturnValue(makeEvent('customer.subscription.updated', subscription))
      mockUserPlansChain.eq.mockResolvedValue({ error: null, count: 1 })

      await POST(makeStripeRequest('{}'))
      expect(mockUserPlansChain.update).toHaveBeenCalledWith(
        expect.objectContaining({ plan: 'free' })
      )
    })
  })

  describe('customer.subscription.deleted', () => {
    it('downgrades user to free plan', async () => {
      const subscription = { customer: 'cus_delete789' }
      mockConstructEvent.mockReturnValue(makeEvent('customer.subscription.deleted', subscription))
      mockUserPlansChain.eq.mockResolvedValue({ error: null, count: 1 })

      const res = await POST(makeStripeRequest('{}'))
      expect(res.status).toBe(200)
      expect(mockUserPlansChain.update).toHaveBeenCalledWith(
        expect.objectContaining({ plan: 'free' })
      )
      expect(mockUserPlansChain.eq).toHaveBeenCalledWith('stripe_customer_id', 'cus_delete789')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('returns 200 for unhandled event types (no-op)', async () => {
    mockConstructEvent.mockReturnValue(makeEvent('invoice.paid', {}))

    const res = await POST(makeStripeRequest('{}'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.received).toBe(true)
  })
})
