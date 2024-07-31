/// <reference types="vite/client" />
import Electron from 'electron'

interface ImportMetaEnv {
  // readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type DownloadStatus = 'init' | 'downloading' | 'completed' | 'failed'

type Theme = Electron.NativeTheme['themeSource']

export type PinType = 'image'

interface PinBasePayload {
  type: PinType
  id: number
}

interface PinImagePayload extends PinBasePayload {
  filePath: string
}

type PinPayload = PinImagePayload

interface IElectronAPI {
  // main
  toggleDevtools: () => Promise<void>
  checkUpdate: (type?: 'auto' | 'hint' | 'manual') => Promise<string>
  openExternal: (url: string) => Promise<void>
  setTheme: (theme: Theme) => Promise<void>
  showItemInFolder: (fullPath: string) => Promise<void>
  openPath: (fullPath: string) => Promise<string>
  showOpenDialog: (
    options: Electron.OpenDialogOptions
  ) => Promise<Electron.OpenDialogReturnValue>
  pin: (payload: PinPayload) => Promise<void>
  screenshot: () => Promise<void>
  // screenshot
  closeScreenshot: () => Promise<void>
}

type RemoveListener = () => void

interface MessageAPI {
  // main
  // pin
  onPin: (callback: (payload: PinPayload) => void) => RemoveListener
  onThemeChange: (
    callback: (theme: Electron.NativeTheme['themeSource']) => void
  ) => RemoveListener
  // screenshot
  onScreenshot: (callback: (thumbnailURL:string) => void) => RemoveListener
}

interface Argv {
  node: string
  chrome: string
  electron: string
  version: string
  dev: boolean
  platform:
    | 'aix'
    | 'darwin'
    | 'freebsd'
    | 'linux'
    | 'openbsd'
    | 'sunos'
    | 'win32'
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
    messageAPI: MessageAPI
    argv: Argv
  }
}
