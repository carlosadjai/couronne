import { describe, it, expect } from 'vitest'
import { registerAppHandlers } from './app-handlers'
import type { IpcMainLike } from './register'
import type { IpcMainInvokeEvent } from 'electron'

type MockHandler = (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown> | unknown

function createMockIpc(): {
  ipc: IpcMainLike
  handlers: Map<string, MockHandler>
} {
  const handlers = new Map<string, MockHandler>()
  const ipc: IpcMainLike = {
    handle: (channel, handler): void => {
      handlers.set(channel, handler)
    }
  }
  return { ipc, handlers }
}

const mockTrustedEvent = {
  senderFrame: {
    url: 'http://localhost:5173/index.html'
  }
} as IpcMainInvokeEvent

const devSenderContext = {
  isDev: true,
  devServerUrl: 'http://localhost:5173'
}

describe('registerAppHandlers', () => {
  it('registers both app:ping and app:info channels', () => {
    const { ipc, handlers } = createMockIpc()
    registerAppHandlers({ ipcMain: ipc, senderContext: devSenderContext })

    expect(handlers.has('app:ping')).toBe(true)
    expect(handlers.has('app:info')).toBe(true)
  })

  it('handles app:ping with valid input and returns reply and timestamp', async () => {
    const { ipc, handlers } = createMockIpc()
    registerAppHandlers({ ipcMain: ipc, senderContext: devSenderContext })

    const pingHandler = handlers.get('app:ping')!
    const result = (await pingHandler(mockTrustedEvent, { message: 'Couronne Test' })) as {
      ok: boolean
      data?: { reply: string; receivedAt: string }
    }

    expect(result.ok).toBe(true)
    expect(result.data?.reply).toBe('Pong: Couronne Test')
    expect(new Date(result.data!.receivedAt).getTime()).not.toBeNaN()
  })

  it('handles app:info and returns application information', async () => {
    const { ipc, handlers } = createMockIpc()
    registerAppHandlers({
      ipcMain: ipc,
      senderContext: devSenderContext,
      getAppInfo: () => ({
        name: 'Couronne Custom',
        version: '1.2.3',
        platform: 'win32',
        electronVersion: '32.0.0'
      })
    })

    const infoHandler = handlers.get('app:info')!
    const result = (await infoHandler(mockTrustedEvent, {})) as {
      ok: boolean
      data?: { name: string; version: string; platform: string; electronVersion: string }
    }

    expect(result.ok).toBe(true)
    expect(result.data).toEqual({
      name: 'Couronne Custom',
      version: '1.2.3',
      platform: 'win32',
      electronVersion: '32.0.0'
    })
  })
})
