import React, { useState, useCallback, useEffect, useRef } from "react";
import Card from "./Card";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Images = ({ imageData }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const popupRef = useRef(null);
  const touchStartX = useRef(null);

  const openPopup = useCallback((index) => {
    setCurrentIndex(index);
    setIsPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageData.length);
  }, [imageData.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imageData.length) % imageData.length
    );
  }, [imageData.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isPopupOpen) return;

      switch (event.key) {
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "Escape":
          closePopup();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopupOpen, nextImage, prevImage, closePopup]);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (!touchStartX.current) return;

      const touchEndX = e.touches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          prevImage();
        } else {
          nextImage();
        }
        touchStartX.current = null;
      }
    };

    const popup = popupRef.current;
    if (isPopupOpen && popup) {
      popup.addEventListener("touchstart", handleTouchStart);
      popup.addEventListener("touchmove", handleTouchMove);
    }

    return () => {
      if (popup) {
        popup.removeEventListener("touchstart", handleTouchStart);
        popup.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [isPopupOpen, nextImage, prevImage]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {imageData.map((pic, index) => (
          <Card
            key={pic.id}
            entry={{
              photoUrl: pic.photoUrl,
              userName: pic.userName,
              quote: pic.quote,
            }}
            onClick={() => openPopup(index)}
          />
        ))}
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
                src={imageData[currentIndex].photoUrl}
                alt={`Image ${currentIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-between">
                <motion.button
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full m-4 hover:bg-opacity-75 transition-colors duration-300"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronLeft className="text-xl" />
                </motion.button>
                <motion.button
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full m-4 hover:bg-opacity-75 transition-colors duration-300"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronRight className="text-xl" />
                </motion.button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 block bg-black bg-opacity-50 text-white p-4 transition-opacity duration-300">
                <h2 className="text-2xl font-bold">
                  {imageData[currentIndex].userName}
                </h2>
              </div>
              <motion.button
                className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors duration-300"
                onClick={closePopup}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="text-2xl" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Images;
