import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import photographerImage from './camera.png';
import Contact from '../Footer/Contact';
import Info from './Info';
import Gallery from './Gallery';

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={stagger}
      className="bg-gradient-to-b from-[#000000] via-[#171717] to-[#2c2c2e]"
    >
      <motion.div 
        className="text-white p-8"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              variants={fadeInUp}
            >
              <motion.p 
                className="text-[#cba6f7] text-2xl font-semibold mb-2"
                variants={fadeInUp}
              >
                UNLEASH YOUR CREATIVITY
              </motion.p>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold leading-tight mb-8 bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text"
                style={{ lineHeight: '1.2', paddingBottom: '0.2em' }}
                variants={fadeInUp}
              >
                Discover the Ultimate Photography Experience.
              </motion.h1>
              <motion.p 
                className="text-gray-300 mb-6 text-xl"
                variants={fadeInUp}
              >
               Join a thriving community, unleash your creativity, connect with like-minded visionaries, and elevate your craft to new heights.
              </motion.p>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              variants={fadeInUp}
            >
              <motion.img 
                src={photographerImage} 
                alt="Photographer" 
                className="w-full h-auto rounded-lg shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
          <motion.div 
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
            variants={fadeInUp}
          >
            {['Contests', 'Community', 'Learning', 'Exhibition'].map((item, index) => (
              <motion.div 
                key={item}
                className="flex items-center justify-center bg-[#171717] px-4 py-2 rounded-full border-2 text-center"
                style={{ 
                  borderColor: index % 2 === 0 ? '#6528d7' : '#b00bef' 
                }}
                variants={fadeInUp}
                custom={index}
              >
                <span 
                  className={`text-${index % 2 === 0 ? '[#6528d7]' : '[#b00bef]'} text-2xl mr-2`}
                >
                  ●
                </span>
                <span className="text-white text-sm sm:text-base">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div>
        <Info />
      </div>
      
      <div>
        <Gallery />
      </div>
      
      <div>
        <Contact />
      </div>
    </motion.div>
  );
};

export default HomeScreen;
