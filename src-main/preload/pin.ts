import { contextBridge, ipcRenderer } from 'electron/renderer'
import type { PinPayload } from '../types'

contextBridge.exposeInMainWorld('electronAPI', {})

function addListener(channel: string, callback: (...args: any[]) => void) {
  const listener = (_event: Electron.IpcRendererEvent, ...args: any[]) =>
    callback(...args)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.off(channel, listener)
}

contextBridge.exposeInMainWorld('messageAPI', {
  onPin: (callback: (payload: PinPayload) => void) =>
    addListener('PIN', callback),
  onThemeChange: (
    callback: (theme: Electron.NativeTheme['themeSource']) => void
  ) => addListener('ON_THEME_CHANGE', callback),
})
