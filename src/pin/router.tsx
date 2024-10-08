import { createHashRouter } from 'react-router-dom'
import Layout from './layout'
import ImagePage from './pages/image'
import ScreenshotPage from './pages/screenshot'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'image',
        element: <ImagePage />,
      },
      {
        path: 'screenshot',
        element: <ScreenshotPage />,
      },
    ],
  },
])

export default router
