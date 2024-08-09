import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from "framer-motion";

const FameCard = ({ src, alt, name, subtitle, contestNo, contestName }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);

  const openPopup = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isPopupOpen) return;

      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopupOpen, closePopup]);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isPopupOpen]);

  return (
    <>
      <div 
        className="relative h-96 w-72 rounded-md overflow-hidden cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg border-4 border-brown-700 bg-white"
        onClick={openPopup}
      >
        <div className="absolute top-2 left-2 z-20">
          <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full transform rotate-12">
            Contest#{contestNo}
          </span>
        </div>
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-white rounded-full p-1">
            <FontAwesomeIcon icon={faMedal} className="text-yellow-500" />
          </div>
        </div>
        <img
          src={src}
          alt={alt}
          className="z-0 h-full w-full object-cover transition duration-300 ease-in-out hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-left">
          <h1 className="text-lg font-semibold text-white">{contestName}</h1>
          <p className="text-sm text-gray-300">{name}</p>
        </div>
      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            ref={popupRef}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closePopup}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[70vh] object-contain"
              />
              <motion.button
                className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors duration-300"
                onClick={closePopup}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FameCard;