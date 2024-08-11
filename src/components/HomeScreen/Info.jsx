import React from 'react';
import { FaCameraRetro, FaUsers, FaGraduationCap } from 'react-icons/fa';

const Info = () => {
  return (
    <div className="bg-gray-800 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="bg-gray-700 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide">What We Do</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Explore our comprehensive range of photography services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<FaCameraRetro className="w-12 h-12" />}
            title="Exciting Contests"
            description="Participate in thrilling photography contests and challenge yourself to capture the perfect shot. Win amazing prizes and get recognized by the community."
          />
          <ServiceCard 
            icon={<FaUsers className="w-12 h-12" />}
            title="Vibrant Community"
            description="Join a community of passionate photographers, share your work, get feedback, and connect with like-minded individuals who share your love for photography."
          />
          <ServiceCard 
            icon={<FaGraduationCap className="w-12 h-12" />}
            title="Learning Opportunities"
            description="Enhance your skills with our curated learning resources and workshops. Whether you're a beginner or a pro, there's always something new to learn."
          />
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default Info;