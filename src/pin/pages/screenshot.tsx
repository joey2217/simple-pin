import React from 'react'
import { useLocation } from 'react-router-dom'

const ScreenshotPage: React.FC = () => {
  const location = useLocation()

  return (
    <img
      src={location.state.url}
      alt="pin 图片"
      className="w-full object-cover"
    />
  )
}

export default ScreenshotPage
