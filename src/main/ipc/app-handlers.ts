import { registerHandler } from './register'
import type { IpcMainLike } from './register'
import { pingChannel, infoChannel } from '../../shared/ipc/channels'
import type { InfoOutput } from '../../shared/ipc/channels'
import type { Logger } from '../core/logger'

import type { TrustedSenderContext } from '../core/security'

export interface RegisterAppHandlersOptions {
  logger?: Logger
  ipcMain?: IpcMainLike
  senderContext?: TrustedSenderContext
  getAppInfo?: () => InfoOutput
}

function resolveAppInfo(): InfoOutput {
  const platform = (
    ['win32', 'darwin', 'linux'].includes(process.platform) ? process.platform : 'win32'
  ) as 'win32' | 'darwin' | 'linux'

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const electron = require('electron')
    if (electron && typeof electron === 'object' && electron.app) {
      return {
        name: electron.app.name || 'Couronne',
        version: electron.app.getVersion ? electron.app.getVersion() : '0.1.0',
        platform,
        electronVersion: process.versions.electron || '0.0.0'
      }
    }
  } catch {
    // Fallback when running outside electron main runtime (e.g. unit tests)
  }

  return {
    name: 'Couronne',
    version: '0.1.0',
    platform,
    electronVersion: process.versions.electron || '0.0.0'
  }
}

export function registerAppHandlers(options?: RegisterAppHandlersOptions): void {
  const logger = options?.logger
  const ipcMain = options?.ipcMain
  const senderContext = options?.senderContext
  const getAppInfo = options?.getAppInfo ?? resolveAppInfo

  registerHandler(
    pingChannel,
    async (input) => {
      logger?.debug('Executing app:ping handler', input)
      return {
        reply: `Pong: ${input.message}`,
        receivedAt: new Date().toISOString()
      }
    },
    { logger, ipcMain, senderContext }
  )

  registerHandler(
    infoChannel,
    async () => {
      logger?.debug('Executing app:info handler')
      return getAppInfo()
    },
    { logger, ipcMain, senderContext }
  )
}
