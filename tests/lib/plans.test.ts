import { describe, it, expect } from 'vitest'
import {
  PLANS,
  PLAN_PRICES,
  PLAN_FEATURES,
  getPlanLimit,
  getPlanPrice,
  getPlanFeatures,
  formatPlanName,
} from '@/lib/plans'

describe('PLANS constant', () => {
  it('has all tiers', () => {
    expect(PLANS).toHaveProperty('free')
    expect(PLANS).toHaveProperty('starter')
    expect(PLANS).toHaveProperty('pro')
    expect(PLANS).toHaveProperty('business')
  })

  it('has correct limits', () => {
    expect(PLANS.free).toBe(100)
    expect(PLANS.starter).toBe(1000)
    expect(PLANS.pro).toBe(5000)
    expect(PLANS.business).toBe(20000)
  })
})

describe('PLAN_PRICES constant', () => {
  it('has correct prices', () => {
    expect(PLAN_PRICES.free).toBe(0)
    expect(PLAN_PRICES.starter).toBe(19)
    expect(PLAN_PRICES.pro).toBe(49)
    expect(PLAN_PRICES.business).toBe(99)
  })
})

describe('getPlanLimit', () => {
  it('returns correct limits for each plan', () => {
    expect(getPlanLimit('free')).toBe(100)
    expect(getPlanLimit('starter')).toBe(1000)
    expect(getPlanLimit('pro')).toBe(5000)
    expect(getPlanLimit('business')).toBe(20000)
  })

  it('handles uppercase plan names', () => {
    expect(getPlanLimit('FREE')).toBe(100)
    expect(getPlanLimit('STARTER')).toBe(1000)
  })

  it('handles mixed case plan names', () => {
    expect(getPlanLimit('Starter')).toBe(1000)
    expect(getPlanLimit('Pro')).toBe(5000)
  })

  it('defaults to free plan limit for unknown plan', () => {
    expect(getPlanLimit('unknown')).toBe(100)
    expect(getPlanLimit('')).toBe(100)
  })
})

describe('getPlanPrice', () => {
  it('returns correct prices for each plan', () => {
    expect(getPlanPrice('free')).toBe(0)
    expect(getPlanPrice('starter')).toBe(19)
    expect(getPlanPrice('pro')).toBe(49)
    expect(getPlanPrice('business')).toBe(99)
  })

  it('handles case insensitivity', () => {
    expect(getPlanPrice('FREE')).toBe(0)
    expect(getPlanPrice('Starter')).toBe(19)
  })

  it('defaults to free price for unknown plan', () => {
    expect(getPlanPrice('unknown')).toBe(0)
  })
})

describe('getPlanFeatures', () => {
  it('returns features for each plan', () => {
    expect(getPlanFeatures('free')).toContain('100 calls/month')
    expect(getPlanFeatures('starter')).toContain('1,000 calls/month')
    expect(getPlanFeatures('pro')).toContain('5,000 calls/month')
    expect(getPlanFeatures('business')).toContain('20,000 calls/month')
  })

  it('returns array of features', () => {
    const features = getPlanFeatures('free')
    expect(Array.isArray(features)).toBe(true)
    expect(features.length).toBeGreaterThan(0)
  })

  it('defaults to free features for unknown plan', () => {
    expect(getPlanFeatures('unknown')).toEqual(PLAN_FEATURES.free)
  })
})

describe('formatPlanName', () => {
  it('capitalizes first letter', () => {
    expect(formatPlanName('free')).toBe('Free')
    expect(formatPlanName('starter')).toBe('Starter')
    expect(formatPlanName('pro')).toBe('Pro')
    expect(formatPlanName('business')).toBe('Business')
  })

  it('handles uppercase input', () => {
    expect(formatPlanName('FREE')).toBe('Free')
    expect(formatPlanName('STARTER')).toBe('Starter')
  })

  it('handles mixed case input', () => {
    expect(formatPlanName('sTaRtEr')).toBe('Starter')
  })
})
