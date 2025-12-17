import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ApiKeyCard } from '@/app/dashboard/ApiKeyCard'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock the server action
vi.mock('@/app/dashboard/actions', () => ({
  regenerateApiKey: vi.fn().mockResolvedValue({ key: 'pk_new_key_123' }),
}))

describe('ApiKeyCard', () => {
  const mockApiKey = 'pk_live_abc123xyz789def456'

  it('renders masked API key by default', () => {
    render(<ApiKeyCard initialApiKey={mockApiKey} />)
    // Should show masked version (first 10 + ... + last 4)
    expect(screen.queryByText(mockApiKey)).not.toBeInTheDocument()
    expect(screen.getByText(/pk_live_ab/)).toBeInTheDocument()
  })

  it('reveals full key when show button clicked', async () => {
    const user = userEvent.setup()
    render(<ApiKeyCard initialApiKey={mockApiKey} />)

    // Find and click the show/hide button (eye icon)
    const buttons = screen.getAllByRole('button')
    const showButton = buttons.find((btn) => btn.getAttribute('title') === 'Show key')
    expect(showButton).toBeDefined()

    await user.click(showButton!)
    expect(screen.getByText(mockApiKey)).toBeInTheDocument()
  })

  it('copies key to clipboard', async () => {
    const user = userEvent.setup()
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    })

    render(<ApiKeyCard initialApiKey={mockApiKey} />)

    // Find and click the copy button
    const buttons = screen.getAllByRole('button')
    const copyButton = buttons.find((btn) => btn.getAttribute('title') === 'Copy key')
    expect(copyButton).toBeDefined()

    await user.click(copyButton!)
    expect(mockWriteText).toHaveBeenCalledWith(mockApiKey)
  })

  it('shows generate button when no API key', () => {
    render(<ApiKeyCard initialApiKey={null} />)
    expect(screen.getByText('No API key found')).toBeInTheDocument()
    expect(screen.getByText('Generate API Key')).toBeInTheDocument()
  })

  it('shows regenerate button when API key exists', () => {
    render(<ApiKeyCard initialApiKey={mockApiKey} />)
    expect(screen.getByText('Regenerate API Key')).toBeInTheDocument()
  })
})
