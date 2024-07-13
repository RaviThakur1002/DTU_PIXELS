import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1 
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div ref={heroRef} className='relative w-full h-screen flex items-center' style={{ backgroundColor: '#031320' }}>
      <div className='w-full max-w-[1100px] mx-auto p-4 text-white'>
             <h1 className={`font-bold text-5xl md:text-7xl mt-4 mb-6 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '600ms' }}>
          Unleashing Creativity Through the Lens.
        </h1>
        <p className={`max-w-[600px] py-2 text-2xl md:text-3xl lg:text-3xl xl:text-4xl  mb-5 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '900ms' }}>
          Here, we celebrate the art of photography through dynamic competitions that inspire creativity, showcase talent, and foster a thriving community of visual storytellers. Whether you are a seasoned photographer or just starting your journey, DTU Pixels offers you the perfect stage to capture and share your unique perspective with the world.
        </p> 
      </div>
    </div>
  );
};

export default Hero;
