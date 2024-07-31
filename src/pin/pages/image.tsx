import React from 'react'
import { useLocation } from 'react-router-dom'

const ImagePage: React.FC = () => {
  const location = useLocation()

  return (
    <img
      src={`file://${location.state.filePath}`}
      alt="pin 图片"
      className="w-full object-cover"
    />
  )
}

export default ImagePage
