import React from 'react';

export const Modal = ({ isOpen, onClose, children }) => {

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div onClick={handleModalClick} className="rounded-lg shadow-lg w-full max-w-lg">
          {children}
      </div>
    </div>
  );
};

export default Modal;
