import React from 'react';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="rounded-lg shadow-lg w-full max-w-lg">
        <div className="p-4">
          {/* <button */}
          {/*   onClick={onClose} */}
          {/*   className="text-gray-500 hover:text-gray-700 float-right" */}
          {/* > */}
          {/*   &times; */}
          {/* </button> */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
