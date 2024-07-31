import React, { useEffect } from 'react'
import Header from './Header'
import { Outlet, useNavigate } from 'react-router-dom'
import useTheme from '@/hooks/useTheme'

const Layout: React.FC = () => {
  const navigate = useNavigate()

  useTheme()

  useEffect(() => {
    return window.messageAPI.onPin((payload) => {
      console.log('omPin', payload)
      switch (payload.type) {
        case 'image':
          navigate('/image', {
            state: payload,
          })
          break

        default:
          break
      }
    })
  }, [])

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
