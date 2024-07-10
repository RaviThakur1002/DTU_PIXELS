// App.jsx
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Home from './components/Home/Home.jsx'
import Gallery from './components/gallery/Gallery.jsx'
import Profile from './components/Profile/Profile.jsx'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<Home />} />
        <Route path="/contest" element={<Home />} />
        <Route path="/submissions" element={<Profile />} />
      </Routes>
    </Router>

  )
}

export default App
