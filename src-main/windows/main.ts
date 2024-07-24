import { BrowserWindow, nativeTheme } from 'electron/main'
import * as path from 'node:path'
import { ROOT } from '../constant'

let win: BrowserWindow = null!
let quit = false

const DARK_BACK_COLOR = '#0c0a09'

export function create() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: nativeTheme.shouldUseDarkColors ? DARK_BACK_COLOR : '#fff',
      // symbolColor: nativeTheme.shouldUseDarkColors ? '#7480ff' : '#641AE6',
      // symbolColor: nativeTheme.shouldUseDarkColors ? '#cccccccc' : '#000000cc',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#fff' : DARK_BACK_COLOR,
      height: 40,
    },
    webPreferences: {
      preload: path.join(ROOT, 'preload.cjs'),
      webSecurity: import.meta.env.PROD,
    },
  })
  win.once('ready-to-show', () => {
    win.show()
    if (import.meta.env.DEV || process.argv.includes('--dev')) {
      win.webContents.openDevTools({ mode: 'bottom' })
    }
  })

  win.on('close', (e) => {
    if (!quit) {
      e.preventDefault()
      win.hide()
    }
  })

  if (import.meta.env.DEV) {
    win.loadURL('http://localhost:5174')
  } else {
    win.loadFile(path.join(ROOT, 'renderer/index.html'))
  }
}

export function focus() {
  if (win) {
    if (win.isMinimized()) {
      win.restore()
    }
    win.show()
    win.focus()
  }
}

export function send(channel: string, ...args: unknown[]) {
  win.webContents.send(channel, ...args)
}

export function setMainTitleBarOverlay() {
  if (win) {
    win.setTitleBarOverlay({
      color: nativeTheme.shouldUseDarkColors ? DARK_BACK_COLOR : '#fff',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#fff' : DARK_BACK_COLOR,
    })
  }
}

export function mainNavigate(to: string) {
  send('NAVIGATE', to)
}

export function musicControl(type: 'prev' | 'play' | 'pause' | 'next') {
  return () => win.webContents.send('MUSIC_CONTROL', type)
}

export function beforeQuit() {
  quit = true
}
