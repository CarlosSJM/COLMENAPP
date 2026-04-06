import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

// Mock the api module
vi.mock('../../services/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
  },
}))

import { api } from '../../services/api'

function TestConsumer() {
  const { user, isLoading, isOnline, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <span data-testid="user">{user ? user.name : 'no-user'}</span>
      <span data-testid="online">{isOnline ? 'online' : 'offline'}</span>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('starts with no user when no token in localStorage', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('loads user from token on mount', async () => {
    localStorage.setItem('token', 'valid-token')
    vi.mocked(api.me).mockResolvedValueOnce({ id: '1', name: 'Carlos', email: 'c@t.com', created_at: '' })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Carlos')
    })
  })

  it('clears token if me() fails on mount', async () => {
    localStorage.setItem('token', 'expired-token')
    vi.mocked(api.me).mockRejectedValueOnce(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  it('logout clears user and token', async () => {
    localStorage.setItem('token', 'valid-token')
    vi.mocked(api.me).mockResolvedValueOnce({ id: '1', name: 'Carlos', email: 'c@t.com', created_at: '' })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Carlos')
    })

    await act(async () => {
      screen.getByText('Logout').click()
    })

    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('reflects online status', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('online')).toHaveTextContent('online')
    })
  })

  it('throws if useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within AuthProvider')

    consoleSpy.mockRestore()
  })
})
