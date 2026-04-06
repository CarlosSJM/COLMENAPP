import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock fetch globally before importing api
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Mock import.meta.env
vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api/v1')

const { api } = await import('../api')

describe('api service', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mockResponse(data: unknown, ok = true, status = 200) {
    mockFetch.mockResolvedValueOnce({
      ok,
      status,
      json: () => Promise.resolve(data),
    })
  }

  describe('request helper (via api methods)', () => {
    it('includes Content-Type header', async () => {
      mockResponse({ access_token: 'tok123' })
      await api.login({ email: 'test@test.com', password: '123456' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      )
    })

    it('includes Authorization header when token exists', async () => {
      localStorage.setItem('token', 'mytoken123')
      mockResponse([])
      await api.getApiaries()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mytoken123',
          }),
        }),
      )
    })

    it('does not include Authorization header when no token', async () => {
      mockResponse([])
      await api.getApiaries()

      const headers = mockFetch.mock.calls[0][1].headers
      expect(headers.Authorization).toBeUndefined()
    })

    it('throws on non-ok response with server message', async () => {
      mockResponse({ message: 'Email ya registrado' }, false, 409)
      await expect(api.register({ name: 'T', email: 'a@b.c', password: '123456' }))
        .rejects.toThrow('Email ya registrado')
    })

    it('throws generic error when response has no message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(),
      })
      await expect(api.getApiaries()).rejects.toThrow('Error de red')
    })
  })

  describe('auth endpoints', () => {
    it('login sends POST with email and password', async () => {
      mockResponse({ access_token: 'tok' })
      await api.login({ email: 'a@b.c', password: '123' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('register sends POST with name, email and password', async () => {
      mockResponse({ access_token: 'tok' })
      await api.register({ name: 'Test', email: 'a@b.c', password: '123' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('me sends GET to /auth/me', async () => {
      localStorage.setItem('token', 'tok')
      mockResponse({ id: '1', name: 'Test', email: 'a@b.c' })
      const user = await api.me()

      expect(user.name).toBe('Test')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.any(Object),
      )
    })
  })

  describe('CRUD endpoints', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'tok')
    })

    it('getApiaries sends GET', async () => {
      mockResponse([{ id: '1', name: 'Apiario 1' }])
      const result = await api.getApiaries()
      expect(result).toHaveLength(1)
    })

    it('createApiary sends POST with body', async () => {
      mockResponse({ id: '1', name: 'Nuevo' })
      await api.createApiary({ name: 'Nuevo', location: 'Madrid' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/apiaries'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Nuevo', location: 'Madrid' }),
        }),
      )
    })

    it('updateApiary sends PUT with id', async () => {
      mockResponse({ id: '1', name: 'Updated' })
      await api.updateApiary('1', { name: 'Updated' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/apiaries/1'),
        expect.objectContaining({ method: 'PUT' }),
      )
    })

    it('deleteApiary sends DELETE with id', async () => {
      mockResponse({})
      await api.deleteApiary('1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/apiaries/1'),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })

    it('toggleTask sends PATCH', async () => {
      mockResponse({ id: '1', completed: true })
      await api.toggleTask('1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/tasks/1/toggle'),
        expect.objectContaining({ method: 'PATCH' }),
      )
    })

    it('getDashboardStats sends GET to /dashboard/stats', async () => {
      mockResponse({ total_hives: 10 })
      const stats = await api.getDashboardStats()
      expect(stats.total_hives).toBe(10)
    })
  })
})
