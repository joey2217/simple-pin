import React, { useEffect, useRef, useState } from 'react'

const App: React.FC = () => {
  const [screenshot, setScreenshot] = useState('')

  const videoEl = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    return window.messageAPI.onScreenshot(() => {
      const video = videoEl.current
      if (video) {
        navigator.mediaDevices
          .getDisplayMedia({
            audio: false,
            video: {
              width: window.innerWidth,
              height: window.innerHeight,
              frameRate: 30,
            },
          })
          .then((stream) => {
            video.srcObject = stream
            video.onloadedmetadata = (e) => {
              video.play()
              video.pause()
            }
          })
          .catch((e) => console.log(e))
      }
    })
  }, [])
  return (
    <div>
      <video
        ref={videoEl}
        className="w-screen h-screen absolute top-0 left-0"
        controls={false}
      ></video>
    </div>
  )
}

export default App
