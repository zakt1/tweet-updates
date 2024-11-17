import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigation } from './components/Navigation'
import { Outlet } from 'react-router'

function App() {
  const [count, setCount] = useState(0)

  return (
<div>
  <Navigation />
  <main>
    <Outlet />
  </main>
</div>
  )
}

export default App
