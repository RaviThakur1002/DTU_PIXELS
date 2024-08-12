import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoadingSpinner = ({ quote = "ruko jara sabar karo 😘" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#171717] bg-opacity-100 z-50">
      <div className="flex flex-col items-center">
        <Oval
          height={80}
          width={80}
          color="#cba6f7"  // Match with the text color from the HomeScreen
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#b00bef" // Match with the gradient color from the HomeScreen
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
        <p className="text-xl text-[#cba6f7] font-semibold mt-4 max-w-md text-center">
          {quote}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

