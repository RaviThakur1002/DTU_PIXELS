import React, { useState, useEffect } from 'react'

const Hero = () => {
  const images = [
    "https://images.pexels.com/photos/212372/pexels-photo-212372.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ]

  const [currentImg, setCurrImg] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrImg((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className='relative w-full h-screen border-b-2'>
      <img 
        className='w-full h-full object-cover' 
        src={images[currentImg]} 
        alt="/" 
      />
      <div className='absolute top-0 left-0 w-full h-full bg-black/30'/>

      <div className='absolute top-0 w-full h-full flex flex-col justify-center text-white'>
        <div className='md:left-[5%] max-w-[1100px] m-auto absolute p-4'>
          <p >DTU Pixels</p>
          <h1 className='font-bold text-5xl md:text-7xl drop-shadow-2xl mt-4 mb-6'>Unleashing Creativity Through the Lens.</h1>
          <p className='max-w-[600px] drop-shadow-2xl py-2 text-xl mb-5'>
            Here, we celebrate the art of photography through dynamic competitions that inspire creativity, showcase talent, and foster a thriving community of visual storytellers. Whether you are a seasoned photographer or just starting your journey, DTU Pixels offers you the perfect stage to capture and share your unique perspective with the world.
          </p>
          <button className='bg-white text-black'>Contests</button>
        </div>
      </div>
    </div>
  )
}

export default Hero;
