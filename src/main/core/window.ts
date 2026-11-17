import { BrowserWindow, shell, session } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
import { isAllowedExternalUrl, DEV_CSP, PROD_CSP } from './security'

let mainWindowInstance: BrowserWindow | null = null

export function getMainWindow(): BrowserWindow | null {
  return mainWindowInstance
}

export function setupSecurityHeaders(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [is.dev ? DEV_CSP : PROD_CSP]
      }
    })
  })
}

export function createSecureWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  })

  mainWindowInstance = mainWindow

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindowInstance = null
  })

  // Prevent in-app navigation, open valid external links in default browser
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault()
    if (isAllowedExternalUrl(url)) {
      shell.openExternal(url).catch(() => {})
    }
  })

  // Disallow new windows creation, open valid external links in default browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    if (isAllowedExternalUrl(details.url)) {
      shell.openExternal(details.url).catch(() => {})
    }
    return { action: 'deny' }
  })

  // HMR for renderer based on electron-vite cli
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
