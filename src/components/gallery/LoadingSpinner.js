import React from 'react';

const LoadingSpinner = ({ quote }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
      <p className="mt-4 text-white text-lg">{quote}</p>
    </div>
  );
};

export default LoadingSpinner;
