import { dialog, ipcMain, nativeTheme } from 'electron/main'
import { shell } from 'electron/common'
import { checkForUpdates } from './updater'
import type { PinPayload, Theme, UpdateType } from './types'
import { hideMainWidow, setMainTitleBarOverlay } from './windows/main'
import {
  createPinWindow,
  sendToAllPinWindow,
  setPinWindowSize,
} from './windows/pin'
import { takeScreenshot } from './windows/screenshot'

export default function handleIPC() {
  ipcMain.handle('TOGGLE_DEVTOOLS', (event) => {
    event.sender.toggleDevTools()
  })

  ipcMain.handle('CHECK_FOR_UPDATE', (_e, type: UpdateType = 'auto') => {
    return checkForUpdates(type).then((res) =>
      res ? res.updateInfo.version : ''
    )
  })

  ipcMain.handle(
    'SET_THEME',
    (e, theme: Electron.NativeTheme['themeSource']) => {
      nativeTheme.themeSource = theme
      if (process.platform === 'win32') {
        setMainTitleBarOverlay()
      }
      sendToAllPinWindow('ON_THEME_CHANGE', theme)
    }
  )

  ipcMain.handle('OPEN_EXTERNAL', (_e, url: string) => {
    return shell.openExternal(url)
  })

  ipcMain.handle('SHOW_ITEM_IN_FOLDER', (e, fullPath: string) => {
    shell.showItemInFolder(fullPath)
  })

  ipcMain.handle('OPEN_PATH', (e, fullPath: string) => {
    return shell.openPath(fullPath)
  })

  ipcMain.handle('OPEN_DIALOG', (e, options: Electron.OpenDialogOptions) => {
    return dialog.showOpenDialog(options)
  })

  ipcMain.handle('PIN', (_e, payload: PinPayload) => {
    createPinWindow(payload)
  })

  ipcMain.handle(
    'SET_PIN_WINDOW_SIZE',
    (_e, id: number, width: number, height: number) => {
      setPinWindowSize(id, width, height)
    }
  )

  ipcMain.handle('SCREENSHOT', () => {
    hideMainWidow()
    takeScreenshot()
  })
}
