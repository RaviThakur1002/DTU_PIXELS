import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSync, FaTimes } from "react-icons/fa";
import "./Gallery.css";

const Article = ({ id, photoUrl, userName, quote, onClick, isProfile }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="p-2 rounded-xl shadow-md bg-[#101010] border border-[#525252]">
      <div className="relative w-full h-52 lg:h-80 perspective-1000">
        <motion.div
          className="w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ 
            duration: 0.5,
            ease: "linear"
          }}
        >
          {/* Front of the card */}
          <div className="absolute w-full h-full backface-hidden">
            <img
              src={photoUrl}
              alt={userName}
              className="h-full w-full object-cover rounded-xl cursor-pointer"
              onClick={onClick}
            />
          </div>

          {/* Back of the card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-black flex items-center justify-center p-4 rounded-xl">
            <div className="text-center mb-4">
              <svg
                className="w-8 h-8 text-[#cba6f7] mb-4 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-[#cba6f7] italic text-lg font-fira-sans">"{quote}"</p>
            </div>
          </div>
        </motion.div>

        {/* Flip button */}
        <button
          className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 z-10"
          onClick={handleFlip}
        >
          <FaSync />
        </button>
      </div>

      <div className="p-5 pb-0 flex flex-col md:flex-row items-start md:items-center justify-between">
        {!isProfile && (
          <article className="flex items-center justify-start">
            <ul>
              <li className="text-[#cba6f7] font-bold">{userName}</li>
            </ul>
          </article>
        )}
      </div>
    </div>
  );
};

const Images = ({ imageData, isProfile, gridColumns }) => {
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
 <div className={`grid grid-cols-1 gap-7 ${
        gridColumns === 2 ? 'md:grid-cols-2' : 
        gridColumns === 3 ? 'md:grid-cols-2 xl:grid-cols-3' :
        ''
      } pb-10 lg:container`}>
        {imageData.map((pic, index) => (
          <Article
            key={pic.id}
            id={pic.id}
            photoUrl={pic.photoUrl}
            userName={pic.userName}
            quote={pic.quote}
            contestTheme={pic.contestTheme}
            onClick={() => openPopup(index)}
            isProfile={isProfile}
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
              className="relative sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] w-90vw overflow-hidden rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageData[currentIndex].photoUrl}
                alt={`Image ${currentIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <motion.button
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 w-9 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300 shadow-lg"
                onClick={closePopup}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                }}
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
