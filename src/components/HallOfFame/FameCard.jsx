import React from 'react';

const FameCard = ({ src, alt, name, subtitle, onClick }) => {
  return (
    <div
      className="relative h-96 w-72 rounded-md overflow-hidden cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="absolute top-2 left-2 z-20">
        <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full transform rotate-12">
          Contest#45
        </span>
      </div>
      <img
        src={src}
        alt={alt}
        className="z-0 h-full w-full object-cover transition duration-300 ease-in-out hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-left">
        <h1 className="text-lg font-semibold text-white">{name}</h1>
        <p className="text-sm text-gray-300">{subtitle}</p>
      </div>
    </div>
  );
};

export default FameCard;