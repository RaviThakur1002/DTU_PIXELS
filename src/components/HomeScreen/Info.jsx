import React from 'react';
import { FaCameraRetro, FaUsers, FaGraduationCap } from 'react-icons/fa';

const Info = () => {
  return (
    <div className="bg-[#000000] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="bg-[#2c2c2e] text-lg font-semibold px-3 py-1 rounded-full uppercase tracking-wide text-[#c061cb]">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-[#cba6f7]">
            Explore our comprehensive range of photography services
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<FaCameraRetro className="w-12 h-12 text-[#6528d7]" />}
            title="Exciting Contests"
            description="Participate in thrilling photography contests and challenge yourself to capture the perfect shot. Win amazing prizes and get recognized by the community."
            gradientFrom="#6528d7"
            gradientTo="#c061cb"
          />
          <ServiceCard 
            icon={<FaUsers className="w-12 h-12 text-[#c638ab]" />}
            title="Vibrant Community"
            description="Join a community of passionate photographers, share your work, get feedback, and connect with like-minded individuals who share your love for photography."
            gradientFrom="#c638ab"
            gradientTo="#6528d7"
          />
          <ServiceCard 
            icon={<FaGraduationCap className="w-12 h-12 text-[#b00bef]" />}
            title="Learning Opportunities"
            description="Enhance your skills with our curated learning resources and workshops. Whether you're a beginner or a pro, there's always something new to learn."
            gradientFrom="#b00bef"
            gradientTo="#c638ab"
          />
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description, gradientFrom, gradientTo }) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      ></div>
      <div className="relative z-10 p-6 bg-[#171717] bg-opacity-90 h-full flex flex-col">
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#cba6f7]">{title}</h3>
        <p className="text-gray-300 text-sm flex-grow">{description}</p>
        <div className="mt-4">
          <button className="bg-[#2c2c2e] text-[#cba6f7] px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-80 transition-colors duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;

