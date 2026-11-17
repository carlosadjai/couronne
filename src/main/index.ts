import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createSecureWindow, setupSecurityHeaders } from './core/window'
import { registerAppHandlers } from './ipc/app-handlers'
import { Logger } from './core/logger'

let logger: Logger | null = null

app.whenReady().then(() => {
  // Set app user model id for Windows notifications/taskbar
  electronApp.setAppUserModelId('com.carlosadjai.couronne')

  // Initialize secure rotating logger
  logger = new Logger({
    logDir: app.getPath('logs'),
    isDev: is.dev
  })

  logger.info('Couronne application ready, initializing core services', {
    version: app.getVersion(),
    platform: process.platform,
    electronVersion: process.versions.electron
  })

  // Watch shortcuts in dev (F12) and block reload in prod
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Setup Content Security Policy headers
  setupSecurityHeaders()

  // Register typed IPC handlers
  registerAppHandlers({ logger })

  // Create primary secure window
  createSecureWindow()

  app.on('activate', () => {
    // On macOS re-create a window when dock icon is clicked and no windows open
    if (BrowserWindow.getAllWindows().length === 0) {
      createSecureWindow()
    }
  })
})

app.on('window-all-closed', () => {
  logger?.info('All windows closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  logger?.info('Application will quit')
})
