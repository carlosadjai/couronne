import { z } from 'zod'
import { defineChannel } from './contract'

export const pingInputSchema = z.object({
  message: z.string().min(1).max(100)
})

export const pingOutputSchema = z.object({
  reply: z.string(),
  receivedAt: z.string()
})

export const pingChannel = defineChannel('app:ping', pingInputSchema, pingOutputSchema)

export const infoInputSchema = z.object({})

export const infoOutputSchema = z.object({
  name: z.string(),
  version: z.string(),
  platform: z.enum(['win32', 'darwin', 'linux']),
  electronVersion: z.string()
})

export const infoChannel = defineChannel('app:info', infoInputSchema, infoOutputSchema)

export type PingInput = z.infer<typeof pingInputSchema>
export type PingOutput = z.infer<typeof pingOutputSchema>
export type InfoInput = z.infer<typeof infoInputSchema>
export type InfoOutput = z.infer<typeof infoOutputSchema>
