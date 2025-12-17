import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CodeExample } from '@/components/CodeExample'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe('CodeExample', () => {
  it('renders all language tabs', () => {
    render(<CodeExample />)
    expect(screen.getByRole('tab', { name: /curl/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /node/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /python/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /php/i })).toBeInTheDocument()
  })

  it('shows curl code by default', () => {
    render(<CodeExample />)
    expect(screen.getByText(/curl -X POST/i)).toBeInTheDocument()
  })

  it('switches to Python code when tab is clicked', async () => {
    const user = userEvent.setup()
    render(<CodeExample />)

    await user.click(screen.getByRole('tab', { name: /python/i }))
    expect(screen.getByText(/import requests/i)).toBeInTheDocument()
  })

  it('switches to Node.js code when tab is clicked', async () => {
    const user = userEvent.setup()
    render(<CodeExample />)

    await user.click(screen.getByRole('tab', { name: /node/i }))
    expect(screen.getByText(/const response = await fetch/i)).toBeInTheDocument()
  })

  it('copies code to clipboard when copy button clicked', async () => {
    const user = userEvent.setup()
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    })

    render(<CodeExample />)
    await user.click(screen.getByRole('button'))

    expect(mockWriteText).toHaveBeenCalled()
  })

  it('displays the section heading', () => {
    render(<CodeExample />)
    expect(screen.getByText('Simple integration')).toBeInTheDocument()
  })
})
