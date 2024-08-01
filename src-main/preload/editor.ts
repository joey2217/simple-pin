import { contextBridge, ipcRenderer } from 'electron/renderer'
import type { CreatePinType, Theme } from '../types'

contextBridge.exposeInMainWorld('electronAPI', {
  setTheme: (theme: Theme) => ipcRenderer.invoke('SET_THEME', theme),
})

function addListener(channel: string, callback: (...args: any[]) => void) {
  const listener = (_event: Electron.IpcRendererEvent, ...args: any[]) =>
    callback(...args)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.off(channel, listener)
}

contextBridge.exposeInMainWorld('messageAPI', {
  onCreatePin: (callback: (type: CreatePinType) => void) =>
    addListener('ON_CREATE_PIN', callback),
})
