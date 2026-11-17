import type { PingInput, PingOutput, InfoOutput, Result } from '../shared/ipc'

export interface CouronneBridgeApi {
  app: {
    ping: (data: PingInput) => Promise<Result<PingOutput>>
    info: () => Promise<Result<InfoOutput>>
  }
}

declare global {
  interface Window {
    couronne: CouronneBridgeApi
  }
}
