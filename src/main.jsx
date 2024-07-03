import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import Gallery from './components/gallery/Gallery.jsx'
import { galleryImgLoader } from './components/gallery/GalleryImgLoader.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        loader: galleryImgLoader,
        path: 'gallery',
        element: <Gallery />
      },
      {
        path: 'contest',
        element: <Home />
      },
      {
        path: '*',
        element: <Home />,
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
