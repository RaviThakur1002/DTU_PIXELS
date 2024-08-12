import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoadingSpinner = ({ quote = "ruko jara sabar karo 😘" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-100 z-50">
      <div className="flex flex-col items-center">
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
        <p className="text-xl text-gray-600 font-semibold mt-4 max-w-md text-center">
          {quote}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

