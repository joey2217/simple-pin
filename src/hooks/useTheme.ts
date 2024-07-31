import { useEffect } from 'react'

type Theme = Electron.NativeTheme['themeSource']
const LOCAL_THEME = 'local_theme'

function getTheme(): Theme {
  const localData = localStorage.getItem(LOCAL_THEME)
  if (localData != null) {
    return localData as Theme
  }
  return 'system'
}

function setLocalTheme(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  let systemTheme = theme
  if (theme === 'system') {
    systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  root.classList.add(systemTheme)
}

export default function useTheme() {
  useEffect(() => {
    setLocalTheme(getTheme())
  }, [])

  useEffect(() => {
    return window.messageAPI.onThemeChange(setLocalTheme)
  }, [])
}
