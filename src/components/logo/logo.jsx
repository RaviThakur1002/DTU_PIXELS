import React, { useEffect, useState } from 'react';
import image1 from './camera.jpg';
import image2 from './image2.jpg';
import image3 from './image3.jpg';
import image4 from './image4.jpg';
import image5 from './image5.jpg';

const SimpleText = () => {
  const [offset, setOffset] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [image1 , image2, image3, image4, image5];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffset(window.pageYOffset);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);

    const loadTimer = setTimeout(() => setIsLoaded(true), 100);

   
    const rotationTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(loadTimer);
      clearInterval(rotationTimer);
    };
  }, []);

  return (
    <header className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
          transform: `translateY(${offset * 0.5}px)`,
        }}
      ></div>
      <div className="flex-col absolute inset-0 flex items-center justify-center">
        <h1
          className={`text-4xl md:text-8xl lg:text-32xl xl:text-9xl font-oswald text-white text-center transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ fontSize: '15vw', color: '#EF9C66' }}
        >
          DTU Pixels
        </h1>
      </div>
    </header>
  );
};

export default SimpleText;
