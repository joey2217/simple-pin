import * as path from 'node:path'
import { BrowserWindow, nativeTheme } from 'electron/main'
import { DARK_BACK_COLOR, ROOT } from '../constant'
import type { PinPayload } from '../types'

let count = 0
const map = new Map<number, BrowserWindow>()

export function createPinWindow(payload: PinPayload) {
  const win = new BrowserWindow({
    width: 400,
    height: 800,
    show: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    minimizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    // resizable: false,
    titleBarOverlay: {
      color: nativeTheme.shouldUseDarkColors ? DARK_BACK_COLOR : '#fff',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#fff' : DARK_BACK_COLOR,
      height: 40,
    },
    webPreferences: {
      preload: path.join(ROOT, 'pin-preload.cjs'),
      webSecurity: import.meta.env.PROD,
    },
  })
  map.set(count, win)
  count += 1
  payload.id = count
  win.once('ready-to-show', () => {
    win.webContents.send('PIN', payload)
    win.show()
    if (import.meta.env.DEV || process.argv.includes('--dev')) {
      win.webContents.openDevTools({ mode: 'bottom' })
    }
  })

  if (import.meta.env.DEV) {
    win.loadURL('http://localhost:5174/pin.html')
  } else {
    win.loadFile(path.join(ROOT, 'renderer/pin.html'))
  }
}

export function sendToAllPinWindow(channel: string, ...args: any[]) {
  Array.from(map.values()).forEach((w) => {
    w.webContents.send(channel, ...args)
  })
}

export function setPinWindowSize(id: number, width: number, height: number) {
  const win = map.get(id)
  if (win) {
    win.setSize(width, height)
  }
}
