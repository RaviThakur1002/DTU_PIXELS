import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import authService from './firbase/auth/auth.js'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1 className='text-white bg-black border-sky-50 underline'>DTU PIXELS</h1> 
      <button onClick={authService.googleSignIn}>sign in</button>
    </>
  )
}

export default App
