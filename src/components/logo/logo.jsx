import React, { useEffect, useState, useRef } from 'react';
import image2 from './image2.jpg';

const SimpleText = () => {
  const [offset, setOffset] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      setOffset(window.pageYOffset);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      cancelAnimationFrame(requestRef.current);
      clearTimeout(loadTimer);
    };
  }, []);

  return (
    <header className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform transition-all duration-500 ease-out"
        style={{
          backgroundImage: `url(${image2})`,
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

