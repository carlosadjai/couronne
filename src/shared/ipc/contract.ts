import { z } from 'zod'

export type ErrorCode = 'INVALID_INPUT' | 'FORBIDDEN_SENDER' | 'INTERNAL'

export interface IpcError {
  code: ErrorCode
  message: string
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: IpcError }

export interface ChannelDef<
  I extends z.ZodTypeAny = z.ZodTypeAny,
  O extends z.ZodTypeAny = z.ZodTypeAny
> {
  readonly name: `${string}:${string}`
  readonly input: I
  readonly output: O
}

export const defineChannel = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>(
  name: `${string}:${string}`,
  input: I,
  output: O
): ChannelDef<I, O> => ({
  name,
  input,
  output
})
