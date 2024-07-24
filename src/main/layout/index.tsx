import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <main id="main" className="flex">
        <div id="content" className="grow block scrollbar">
          <Outlet />
        </div>
      </main>
    </>
  )
}

export default Layout
