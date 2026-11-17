import { contextBridge, ipcRenderer } from 'electron'
import { APP_PING_CHANNEL, APP_INFO_CHANNEL } from '../shared/ipc/names'
import type { PingInput, PingOutput, InfoOutput } from '../shared/ipc/channels'
import type { Result } from '../shared/ipc/contract'

export interface CouronneBridgeApi {
  app: {
    ping: (data: PingInput) => Promise<Result<PingOutput>>
    info: () => Promise<Result<InfoOutput>>
  }
}

const api: CouronneBridgeApi = {
  app: {
    ping: (data: PingInput): Promise<Result<PingOutput>> => {
      return ipcRenderer.invoke(APP_PING_CHANNEL, data)
    },
    info: (): Promise<Result<InfoOutput>> => {
      return ipcRenderer.invoke(APP_INFO_CHANNEL, {})
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('couronne', api)
  } catch (error) {
    console.error('Failed to expose Couronne API via contextBridge', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.couronne = api
}
