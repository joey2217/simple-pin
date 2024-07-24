import Electron from 'electron'

type DownloadStatus = 'init' | 'downloading' | 'completed' | 'failed'

interface IElectronAPI {
  toggleDevtools: () => Promise<void>
  checkUpdate: (type?: 'auto' | 'hint' | 'manual') => Promise<string>
  openExternal: (url: string) => Promise<void>
  setTheme: (theme: Theme) => Promise<void>
  showItemInFolder: (fullPath: string) => Promise<void>
  openPath: (fullPath: string) => Promise<string>
  showOpenDialog: (
    options: Electron.OpenDialogOptions
  ) => Promise<Electron.OpenDialogReturnValue>
}

type RemoveListener = () => void

interface MessageAPI {
  onNavigate: (callback: (to: string) => void) => RemoveListener
}

interface IDevAPI {
  toggleDevtools: () => Promise<void>
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
