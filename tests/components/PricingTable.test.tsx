import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PricingTable } from '@/components/PricingTable'

describe('PricingTable', () => {
  it('renders all 4 pricing tiers', () => {
    render(<PricingTable />)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Starter')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('displays correct prices', () => {
    render(<PricingTable />)
    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('$19')).toBeInTheDocument()
    expect(screen.getByText('$49')).toBeInTheDocument()
    expect(screen.getByText('$99')).toBeInTheDocument()
  })

  it('highlights Starter tier as most popular', () => {
    render(<PricingTable />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('shows correct API call limits', () => {
    render(<PricingTable />)
    expect(screen.getByText('100 API calls/month')).toBeInTheDocument()
    expect(screen.getByText('1,000 API calls/month')).toBeInTheDocument()
    expect(screen.getByText('5,000 API calls/month')).toBeInTheDocument()
    expect(screen.getByText('20,000 API calls/month')).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    render(<PricingTable />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getAllByText('Start Free Trial')).toHaveLength(2)
    expect(screen.getByText('Contact Sales')).toBeInTheDocument()
  })
})
