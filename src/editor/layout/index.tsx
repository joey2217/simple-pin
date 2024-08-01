import React, { useEffect } from 'react'
import Header from './Header'
import { Outlet, useNavigate } from 'react-router-dom'

const Layout: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    return window.messageAPI.onCreatePin((type) => {
      navigate(`/${type}`)
    })
  }, [navigate])

  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
