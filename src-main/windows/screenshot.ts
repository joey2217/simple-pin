import path from 'node:path'
import { BrowserWindow, desktopCapturer, screen, session } from 'electron/main'
import { ROOT } from '../constant'

let win: BrowserWindow = null!
let quit = false

export function createScreenshotWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    show: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    resizable: false,
    skipTaskbar: import.meta.env.PROD,
    frame: false,
    fullscreen: true,
    transparent: true,
    webPreferences: {
      preload: path.join(ROOT, 'screenshot-preload.cjs'),
      webSecurity: import.meta.env.PROD,
    },
  })

  win.once('ready-to-show', () => {
    win.show()
    win.webContents.send('SCREENSHOT')
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
    win.loadURL('http://localhost:5174/screenshot.html')
  } else {
    win.loadFile(path.join(ROOT, 'renderer/screenshot.html'))
  }
}

export function takeScreenshot() {
  if (win === null) {
    createScreenshotWindow()
  } else {
    win.webContents.send('SCREENSHOT')
  }
  session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => {
    desktopCapturer
      .getSources({ types: ['screen', 'window'] })
      .then((sources) => {
        const cursor = screen.getCursorScreenPoint()
        const displays = screen.getAllDisplays()
        const currentDisplay = displays.find((d) => inArea(cursor, d))
        if (currentDisplay) {
          const source = sources.find(
            (s) => Number(s.display_id) === currentDisplay.id
          )
          if (source) {
            return source
          }
        }
        return sources[0]
      })
      .then((source: Electron.DesktopCapturerSource) => {
        callback({ video: source })
      })
  })
}

function inArea(point: Electron.Point, display: Electron.Display) {
  return (
    point.x >= display.bounds.x &&
    point.x <= display.bounds.x + display.bounds.width &&
    point.y >= display.bounds.y &&
    point.y <= display.bounds.y + display.bounds.height
  )
}

export function beforeScreenshotQuit() {
  quit = true
}
