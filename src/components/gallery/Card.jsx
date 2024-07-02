import React, { useState, useCallback } from "react";

function Card({ src, alt, name, onClick }) {
  return (
    <div 
      className="relative h-96 w-72 rounded-md overflow-hidden cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="z-0 h-full w-full object-cover transition duration-300 ease-in-out hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-left">
        <h1 className="text-lg font-semibold text-white">{name}</h1>
      </div>
    </div>
  );
}

export default Card;
