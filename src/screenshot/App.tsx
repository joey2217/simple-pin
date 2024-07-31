import React, { useCallback, useEffect, useRef, useState } from 'react'
import Screenshots from './Screenshots'
import type { Bounds } from './Screenshots/types'

const width = window.innerWidth
const height = window.innerHeight

const App: React.FC = () => {
  const [screenshot, setScreenshot] = useState('')

  const onSave = useCallback((blob: Blob, bounds: Bounds) => {
    console.log('save', blob, bounds)
    console.log(URL.createObjectURL(blob))
  }, [])
  const onCancel = useCallback(() => {
    console.log('cancel')
  }, [])
  const onOk = useCallback((blob: Blob, bounds: Bounds) => {
    console.log('ok', blob, bounds)
    console.log(URL.createObjectURL(blob))
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e.key)
      if (e.key === 'Escape') {
        setScreenshot('')
        window.electronAPI.closeScreenshot()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    setScreenshot('')
    return window.messageAPI.onScreenshot((thumbnailURL) => {
      setScreenshot(thumbnailURL)
    })
  }, [])

  if (screenshot) {
    return (
      <Screenshots
        url={screenshot}
        width={width}
        height={height}
        onSave={onSave}
        onCancel={onCancel}
        onOk={onOk}
      />
    )
  }
  return null
}

export default App
