import path from 'node:path'
import { BrowserWindow, dialog, nativeTheme } from 'electron/main'
import { DARK_BACK_COLOR, ROOT } from '../constant'
import type { CreatePinType } from '../types'

let win: BrowserWindow = null!
const quit = false

function createEditorWindow(type: CreatePinType) {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: nativeTheme.shouldUseDarkColors ? DARK_BACK_COLOR : '#fff',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#fff' : DARK_BACK_COLOR,
    },
    webPreferences: {
      preload: path.join(ROOT, 'editor-preload.cjs'),
      webSecurity: import.meta.env.PROD,
    },
  })

  win.once('ready-to-show', () => {
    createEditorPin(type)
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
    win.loadURL('http://localhost:5174/editor.html')
  } else {
    win.loadFile(path.join(ROOT, 'renderer/editor.html'))
  }
}

function showEditorWindow(type: CreatePinType) {
  win.show()
  win.once('show', () => {
    win.webContents.send('ON_CREATE_PIN', type)
  })
}

export function createEditorPin(type: CreatePinType) {
  if (win == null) {
    createEditorWindow(type)
    return
  }
  if (win.isVisible()) {
    dialog
      .showMessageBox({
        type: 'question',
        title: '提示',
        message: '是否覆盖当前编辑内容？',
        buttons: ['是', '否'],
      })
      .then(({ response }) => {
        if (response === 0) {
          showEditorWindow(type)
        } else {
          win.focus()
        }
      })
  } else {
    showEditorWindow(type)
  }
}
