import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UsageCard } from '@/app/dashboard/UsageCard'

describe('UsageCard', () => {
  it('displays usage count and limit', () => {
    render(<UsageCard current={47} limit={100} plan="free" />)
    expect(screen.getByText('47 / 100')).toBeInTheDocument()
  })

  it('displays formatted numbers with commas', () => {
    render(<UsageCard current={1500} limit={5000} plan="pro" />)
    expect(screen.getByText('1,500 / 5,000')).toBeInTheDocument()
  })

  it('shows upgrade button for free plan', () => {
    render(<UsageCard current={50} limit={100} plan="free" />)
    expect(screen.getByRole('link', { name: /upgrade/i })).toBeInTheDocument()
  })

  it('shows warning when usage > 80%', () => {
    render(<UsageCard current={85} limit={100} plan="starter" />)
    expect(screen.getByText(/approaching your limit/i)).toBeInTheDocument()
  })

  it('does not show warning when usage < 80%', () => {
    render(<UsageCard current={50} limit={100} plan="starter" />)
    expect(screen.queryByText(/approaching your limit/i)).not.toBeInTheDocument()
  })

  it('displays plan name', () => {
    render(<UsageCard current={47} limit={1000} plan="starter" />)
    expect(screen.getByText(/starter/i)).toBeInTheDocument()
  })

  it('shows percentage used', () => {
    render(<UsageCard current={50} limit={100} plan="free" />)
    expect(screen.getByText('50% used')).toBeInTheDocument()
  })

  it('caps percentage at 100%', () => {
    render(<UsageCard current={150} limit={100} plan="free" />)
    expect(screen.getByText('100% used')).toBeInTheDocument()
  })
})
