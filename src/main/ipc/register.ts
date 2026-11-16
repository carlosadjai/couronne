import type { IpcMainInvokeEvent } from 'electron'
import type { z } from 'zod'
import type { ChannelDef, Result } from '../../shared/ipc/contract'
import { isTrustedSender, type TrustedSenderContext } from '../core/security'

export interface IpcMainLike {
  handle: (
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown> | unknown
  ) => void
}

export interface LoggerLike {
  error: (message: string, ...args: unknown[]) => void
}

export type ChannelHandler<I, O> = (input: I, event: IpcMainInvokeEvent) => Promise<O> | O

export interface RegisterOptions {
  ipcMain?: IpcMainLike
  logger?: LoggerLike
  senderContext?: TrustedSenderContext
}

const defaultLogger: LoggerLike = {
  error: (msg, ...args) => console.error(msg, ...args)
}

function getElectronIpcMain(): IpcMainLike {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const electron = require('electron')
    return electron.ipcMain as IpcMainLike
  } catch {
    throw new Error('electron.ipcMain is not available in the current environment.')
  }
}

/**
 * Registers an IPC handler with strict sender verification, Zod input/output validation,
 * and sanitized error handling.
 */
export function registerHandler<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(
  channel: ChannelDef<I, O>,
  handler: ChannelHandler<z.infer<I>, z.infer<O>>,
  options?: RegisterOptions
): void {
  const ipc = options?.ipcMain ?? getElectronIpcMain()
  const logger = options?.logger ?? defaultLogger
  const senderContext: TrustedSenderContext = options?.senderContext ?? {
    isDev: process.env.NODE_ENV === 'development' || Boolean(process.env['ELECTRON_RENDERER_URL']),
    devServerUrl: process.env['ELECTRON_RENDERER_URL']
  }

  ipc.handle(channel.name, async (event, rawInput): Promise<Result<z.infer<O>>> => {
    // 1. Verify sender origin
    const senderUrl =
      event?.senderFrame?.url ||
      (typeof event?.sender?.getURL === 'function' ? event.sender.getURL() : undefined)

    if (!isTrustedSender(senderUrl, senderContext)) {
      logger.error(
        `IPC call rejected: untrusted sender "${senderUrl}" for channel "${channel.name}"`
      )
      return {
        ok: false,
        error: {
          code: 'FORBIDDEN_SENDER',
          message: 'Access denied: sender is not authorized.'
        }
      }
    }

    // 2. Validate input schema
    const parsedInput = channel.input.safeParse(rawInput)
    if (!parsedInput.success) {
      logger.error(
        `IPC call rejected: invalid input for channel "${channel.name}"`,
        parsedInput.error.format()
      )
      return {
        ok: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'The provided parameters are invalid.'
        }
      }
    }

    // 3. Execute handler and validate output
    try {
      const handlerResult = await handler(parsedInput.data, event)
      const parsedOutput = channel.output.safeParse(handlerResult)

      if (!parsedOutput.success) {
        logger.error(
          `IPC handler error: output failed schema validation for channel "${channel.name}"`,
          parsedOutput.error.format()
        )
        return {
          ok: false,
          error: {
            code: 'INTERNAL',
            message: 'An internal error occurred.'
          }
        }
      }

      return {
        ok: true,
        data: parsedOutput.data
      }
    } catch (err: unknown) {
      // 4. Catch exceptions, log details, return generic INTERNAL error
      logger.error(
        `IPC handler exception on channel "${channel.name}":`,
        err instanceof Error ? err.stack : err
      )
      return {
        ok: false,
        error: {
          code: 'INTERNAL',
          message: 'An internal error occurred.'
        }
      }
    }
  })
}
