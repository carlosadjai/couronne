import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { registerHandler, type IpcMainLike, type LoggerLike } from './register'
import { defineChannel } from '../../shared/ipc/contract'
import type { IpcMainInvokeEvent } from 'electron'

describe('IPC Handler Registration (registerHandler)', () => {
  const testChannel = defineChannel(
    'test:action',
    z.object({ value: z.string().min(3) }),
    z.object({ result: z.string() })
  )

  const createMockIpc = (): {
    ipcMock: IpcMainLike
    invoke: (event: unknown, input: unknown) => Promise<unknown>
  } => {
    let registeredListener: ((event: unknown, ...args: unknown[]) => Promise<unknown>) | null = null
    const ipcMock: IpcMainLike = {
      handle: (_channel, listener) => {
        registeredListener = listener as (event: unknown, ...args: unknown[]) => Promise<unknown>
      }
    }
    return {
      ipcMock,
      invoke: (event: unknown, input: unknown) => {
        if (!registeredListener) throw new Error('No listener registered')
        return registeredListener(event, input)
      }
    }
  }

  const createMockLogger = (): LoggerLike => ({
    error: vi.fn()
  })

  const trustedContext = {
    isDev: true,
    devServerUrl: 'http://localhost:5173'
  }

  const trustedEvent = {
    senderFrame: { url: 'http://localhost:5173/index.html' }
  } as unknown as IpcMainInvokeEvent

  const untrustedEvent = {
    senderFrame: { url: 'http://attacker.com/evil.html' }
  } as unknown as IpcMainInvokeEvent

  it('returns ok: true with valid input from trusted sender', async () => {
    const { ipcMock, invoke } = createMockIpc()
    const handler = vi.fn().mockResolvedValue({ result: 'SUCCESS' })

    registerHandler(testChannel, handler, {
      ipcMain: ipcMock,
      senderContext: trustedContext,
      logger: createMockLogger()
    })

    const res = await invoke(trustedEvent, { value: 'valid-input' })
    expect(res).toEqual({
      ok: true,
      data: { result: 'SUCCESS' }
    })
    expect(handler).toHaveBeenCalledWith({ value: 'valid-input' }, trustedEvent)
  })

  it('rejects invalid input with INVALID_INPUT and does not call handler', async () => {
    const { ipcMock, invoke } = createMockIpc()
    const handler = vi.fn()

    registerHandler(testChannel, handler, {
      ipcMain: ipcMock,
      senderContext: trustedContext,
      logger: createMockLogger()
    })

    const res = await invoke(trustedEvent, { value: 'no' }) // min length is 3
    expect(res).toEqual({
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'The provided parameters are invalid.'
      }
    })
    expect(handler).not.toHaveBeenCalled()
  })

  it('transforms handler exceptions into INTERNAL without leaking stack trace', async () => {
    const { ipcMock, invoke } = createMockIpc()
    const logger = createMockLogger()
    const handler = vi.fn().mockImplementation(() => {
      throw new Error('Database password was 123456 at /var/secret.ts:42')
    })

    registerHandler(testChannel, handler, {
      ipcMain: ipcMock,
      senderContext: trustedContext,
      logger
    })

    const res = await invoke(trustedEvent, { value: 'valid' })
    expect(res).toEqual({
      ok: false,
      error: {
        code: 'INTERNAL',
        message: 'An internal error occurred.'
      }
    })
    // Ensure stack trace or secret is logged, but not leaked to the renderer response
    expect((res as { error: { message: string } }).error.message).not.toContain('/var/secret')
    expect(logger.error).toHaveBeenCalled()
  })

  it('rejects untrusted sender with FORBIDDEN_SENDER and does not call handler', async () => {
    const { ipcMock, invoke } = createMockIpc()
    const handler = vi.fn()

    registerHandler(testChannel, handler, {
      ipcMain: ipcMock,
      senderContext: trustedContext,
      logger: createMockLogger()
    })

    const res = await invoke(untrustedEvent, { value: 'valid' })
    expect(res).toEqual({
      ok: false,
      error: {
        code: 'FORBIDDEN_SENDER',
        message: 'Access denied: sender is not authorized.'
      }
    })
    expect(handler).not.toHaveBeenCalled()
  })
})
