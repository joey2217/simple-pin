import fsp from 'fs/promises'
import { dialog, ipcMain, nativeTheme } from 'electron/main'
import { shell } from 'electron/common'
import { checkForUpdates } from './updater'
import type { CreatePinType, PinPayload, UpdateType } from './types'
import { hideMainWidow, setMainTitleBarOverlay } from './windows/main'
import {
  createPinWindow,
  sendToAllPinWindow,
  setPinWindowSize,
} from './windows/pin'
import { closeScreenshot, takeScreenshot } from './windows/screenshot'
import { createEditorPin } from './windows/editor'

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
    (_e, theme: Electron.NativeTheme['themeSource']) => {
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

  ipcMain.handle('SHOW_ITEM_IN_FOLDER', (_e, fullPath: string) => {
    shell.showItemInFolder(fullPath)
  })

  ipcMain.handle('OPEN_PATH', (_e, fullPath: string) => {
    return shell.openPath(fullPath)
  })

  ipcMain.handle('OPEN_DIALOG', (_e, options: Electron.OpenDialogOptions) => {
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

  ipcMain.handle('CLOSE_SCREENSHOT', () => {
    closeScreenshot()
  })

  ipcMain.handle('SAVE_SCREENSHOT', (_e, arrayBuffer: ArrayBuffer) => {
    closeScreenshot()
    return dialog
      .showSaveDialog({
        title: '保存截图',
        defaultPath: `screenshot_${new Date().toLocaleDateString('zh-CN')}.png`,
        filters: [{ name: 'Images', extensions: ['png'] }],
      })
      .then(({ filePath }) => {
        if (filePath) {
          return fsp.writeFile(filePath, Buffer.from(arrayBuffer))
        }
      })
  })

  ipcMain.handle('PIN_SCREENSHOT', (_e, arrayBuffer: ArrayBuffer) => {
    closeScreenshot()
    const url = `data:image/jpeg;base64,${Buffer.from(arrayBuffer).toString('base64')}`
    createPinWindow({
      type: 'screenshot',
      id: 0,
      url,
    })
  })

  ipcMain.handle('CREATE_PIN', (_e, type: CreatePinType) => {
    createEditorPin(type)
  })
}
