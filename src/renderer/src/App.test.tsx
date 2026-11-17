// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'
import type { CouronneBridgeApi } from '../../preload/index.d'

const mockAppInfo = {
  name: 'Couronne Test',
  version: '0.1.0-test',
  platform: 'win32' as const,
  electronVersion: '32.1.0'
}

describe('Renderer App Demo Component', () => {
  let mockCouronne: CouronneBridgeApi

  beforeEach(() => {
    mockCouronne = {
      app: {
        info: vi.fn().mockResolvedValue({
          ok: true,
          data: mockAppInfo
        }),
        ping: vi.fn()
      }
    }

    Object.defineProperty(window, 'couronne', {
      value: mockCouronne,
      writable: true,
      configurable: true
    })
  })

  it('loads and displays application information on mount', async () => {
    render(<App />)

    await waitFor(() => {
      expect(mockCouronne.app.info).toHaveBeenCalledTimes(1)
      expect(screen.getByTestId('app-info')).toHaveTextContent('Couronne Test')
      expect(screen.getByTestId('app-info')).toHaveTextContent('v0.1.0-test')
    })
  })

  it('sends valid ping and displays successful response', async () => {
    vi.mocked(mockCouronne.app.ping).mockResolvedValueOnce({
      ok: true,
      data: {
        reply: 'Pong: Ping Couronne',
        receivedAt: '2026-11-16T15:00:00.000Z'
      }
    })

    render(<App />)
    const pingButton = screen.getByTestId('ping-button')
    fireEvent.click(pingButton)

    await waitFor(() => {
      expect(mockCouronne.app.ping).toHaveBeenCalledWith({ message: 'Ping Couronne' })
      const feedback = screen.getByTestId('feedback-container')
      expect(feedback).toHaveTextContent('Réponse reçue : Pong: Ping Couronne')
      expect(feedback).toHaveClass('feedback-success')
    })
  })

  it('sends invalid ping and displays INVALID_INPUT error code', async () => {
    vi.mocked(mockCouronne.app.ping).mockResolvedValueOnce({
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'The provided parameters are invalid.'
      }
    })

    render(<App />)
    const invalidButton = screen.getByTestId('invalid-button')
    fireEvent.click(invalidButton)

    await waitFor(() => {
      expect(mockCouronne.app.ping).toHaveBeenCalledWith({ message: '' })
      const feedback = screen.getByTestId('feedback-container')
      expect(feedback).toHaveTextContent("Code d'erreur : INVALID_INPUT")
      expect(feedback).toHaveClass('feedback-error')
    })
  })
})
