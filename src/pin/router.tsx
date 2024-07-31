import { createHashRouter } from 'react-router-dom'
import Layout from './layout'
import ImagePage from './pages/image'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'image',
        element: <ImagePage />,
      },
    ],
  },
])

export default router
