import { createHashRouter } from 'react-router-dom'
import Layout from './layout'
import TodoPage from './pages/todo'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/todo',
        element: <TodoPage />,
      },
    ],
  },
])

export default router
