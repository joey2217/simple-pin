import { createHashRouter } from 'react-router-dom'
import Layout from './layout'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
  },
])

export default router
