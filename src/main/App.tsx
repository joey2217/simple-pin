import React from 'react'
import Header from './layout/Header'
import { Button } from '@/components/ui/button'

const App: React.FC = () => {
  const onPinImage = () => {
    window.electronAPI
      .showOpenDialog({
        title: '选择Pin图片',
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
      })
      .then(({ filePaths }) => {
        const [filePath] = filePaths
        if (filePath) {
          window.electronAPI.pin({
            type: 'image',
            id: 0,
            filePath,
          })
        }
      })
  }

  return (
    <>
      <Header />
      <main id="main" className="space-y-2 container py-2">
        <Button className="w-full" onClick={onPinImage}>
          Pin 图片
        </Button>
        <Button className="w-full" onClick={window.electronAPI.screenshot}>
          Pin 截图
        </Button>
        {/* todo */}
        <Button
          className="w-full"
          onClick={() => window.electronAPI.createPin('todo')}
        >
          Pin 待办
        </Button>
        {/* 便签 */}
        <Button
          className="w-full"
          onClick={() => window.electronAPI.createPin('note')}
        >
          Pin 便签
        </Button>
      </main>
    </>
  )
}

export default App
