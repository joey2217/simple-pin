import { createHashRouter } from 'react-router-dom'
import Layout from './layout'
import Home from './pages/home'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
])

export default router
