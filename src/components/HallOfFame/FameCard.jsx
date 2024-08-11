import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from "framer-motion";
import medalImage from '../../assets/medal.png';

const FameCard = ({ src, alt, name, subtitle, contestNo, contestName, onClick }) => {
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

  return (
    <>
      <motion.div 
        className="w-full h-64 sm:h-72 md:h-80 lg:h-96 mb-4 mt-5 border-2 border-orange-400 rounded-lg shadow-lg overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={onClick || openPopup}
      >
        <div className="relative h-full w-full">
          <div className="absolute top-2 left-2 z-20">
            <span className="bg-orange-400 text-white px-2 py-1 text-xs font-bold rounded-full transform rotate-12">
              Contest#{contestNo}
            </span>
          </div>
          <div className="absolute top-2 right-2 z-20">
            <div 
              className="rounded-full p-2 shadow-lg transform hover:scale-110 transition-transform duration-300"
              style={{ transform: 'perspective(1000px) rotateY(-15deg)' }}
            >
              <img 
                src={medalImage} 
                alt="Winner's Medal"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
            </div>
          </div>
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover transition duration-300 ease-in-out hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2927] to-transparent"></div>
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
            <p className="text-lg font-bold text-white text-center">{name}</p>
            <p
              className="bg-gradient-to-r from-[#1f2927] to-orange-400 text-white text-sm font-semibold px-3 py-1 rounded-md shadow-lg backdrop-blur-sm"
            >
              Winner of {contestName}
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            ref={popupRef}
            className="fixed inset-0 bg-[#1f2927] bg-opacity-70 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm"
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
              <div className="absolute bottom-2 left-2 right-0">
                <span className="inline-block bg-gradient-to-r from-[#1f2927] to-orange-400 text-white px-3 py-2 rounded-full transition-opacity duration-300">
                  <h2 className="text-xl font-bold text-left">{` 🏆 ${name}`}</h2>
                </span>
              </div>

              <motion.button
                className="absolute top-2 right-2 text-white text-xl bg-orange-400 bg-opacity-70 w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors duration-300"
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

