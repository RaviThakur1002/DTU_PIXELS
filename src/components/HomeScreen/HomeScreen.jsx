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
    >
      <motion.div 
        className="bg-[#000000] text-white p-8"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              variants={fadeInUp}
            >
              <motion.p 
                className="text-[#5b3dcc] font-semibold mb-2"
                variants={fadeInUp}
              >
                UNLEASH YOUR CREATIVITY
              </motion.p>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold leading-tight mb-4"
                variants={fadeInUp}
              >
                Discover the Ultimate Photography Experience.
              </motion.h1>
              <motion.p 
                className="text-gray-400 mb-6"
                variants={fadeInUp}
              >
                Join a vibrant community where your passion meets creativity. 
                Show off your skills, connect with fellow enthusiasts, and 
                elevate your craft to new heights.
              </motion.p>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              variants={fadeInUp}
            >
              <motion.img 
                src={photographerImage} 
                alt="Photographer" 
                className="w-full h-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
          <motion.div 
            className="mt-8 flex justify-center space-x-8"
            variants={fadeInUp}
          >
            {['Contests', 'Community', 'Learning', 'Exhibition'].map((item, index) => (
              <motion.div 
                key={item}
                className="flex items-center"
                variants={fadeInUp}
                custom={index}
              >
                <span className="text-[#5b3dcc] text-2xl mr-2">●</span>
                <span>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Info />
      </motion.div>
      
      <motion.div variants={fadeInUp}>
        <Gallery />
      </motion.div>
      
      <motion.div variants={fadeInUp}>
        <Contact />
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;

