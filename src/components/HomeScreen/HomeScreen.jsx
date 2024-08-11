import React from 'react';
import photographerImage from './camera.png'; // Assume we have this image
import Contact from '../Footer/Contact';

import Info from './Info';
import Gallery from './Gallery';

const HomeScreen = () => {
  return (
    <>
    <div className=" bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <p className="text-indigo-600 font-semibold mb-2">READY TO INSPIRE YOU</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              The best platform for every photography enthusiast.
            </h1>
            <p className="text-gray-600 mb-6">
              Our open, creative, and competitive approach helps us showcase talent
              and align your perspective with the world of visual storytelling.
            </p>
            <div className="flex space-x-4">
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300">
                Enter Contest
              </button>
              <button className="bg-white text-gray-800 px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src={photographerImage} 
              alt="Photographer" 
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-8">
          <div className="flex items-center">
            <span className="text-indigo-600 text-2xl mr-2">●</span>
            <span>Contests</span>
          </div>
          <div className="flex items-center">
            <span className="text-indigo-600 text-2xl mr-2">●</span>
            <span>Community</span>
          </div>
          <div className="flex items-center">
            <span className="text-indigo-600 text-2xl mr-2">●</span>
            <span>Learning</span>
          </div>
          <div className="flex items-center">
            <span className="text-indigo-600 text-2xl mr-2">●</span>
            <span>Exhibition</span>
          </div>
        </div>
      </div>
    </div>


    <Info/>
    <Gallery />
    <Contact />
    </>
  );
};

export default HomeScreen;