import React from 'react';
import { FaCameraRetro, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Info = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <div className="bg-gray-800 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.span 
            className="bg-gray-700 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide text-orange-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            What We Do
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mt-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Explore our comprehensive range of photography services
          </motion.h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ServiceCard 
            icon={<FaCameraRetro className="w-12 h-12 text-orange-500" />}
            title="Exciting Contests"
            description="Participate in thrilling photography contests and challenge yourself to capture the perfect shot. Win amazing prizes and get recognized by the community."
            variants={cardVariants}
          />
          <ServiceCard 
            icon={<FaUsers className="w-12 h-12 text-orange-500" />}
            title="Vibrant Community"
            description="Join a community of passionate photographers, share your work, get feedback, and connect with like-minded individuals who share your love for photography."
            variants={cardVariants}
          />
          <ServiceCard 
            icon={<FaGraduationCap className="w-12 h-12 text-orange-500" />}
            title="Learning Opportunities"
            description="Enhance your skills with our curated learning resources and workshops. Whether you're a beginner or a pro, there's always something new to learn."
            variants={cardVariants}
          />
        </motion.div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description, variants }) => {
  return (
    <motion.div className="text-center" variants={variants}>
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
};

export default Info;
