import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const Article = ({ id, photoUrl, userName, quote, onClick }) => {
  return (
    <div className="p-2 rounded-3xl shadow-md bg-[#171717]">
      <article key={id} className="rounded-3xl">
        <img
          src={photoUrl}
          alt={userName}
          className="h-52 object-fit object-cover w-full lg:h-80 rounded-3xl cursor-pointer"
          onClick={onClick}
        />
        <div className="p-5 pb-0 flex flex-col md:flex-row items-start md:items-center justify-between">
          <article className="flex items-center justify-start">
            <ul>
              <li className="text-[#cba6f7] font-bold">{userName}</li>
            </ul>
          </article>
        </div>
      </article>
    </div>
  );
};

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
      (prevIndex) => (prevIndex - 1 + imageData.length) % imageData.length,
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
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 pb-10 lg:container">
        {imageData.map((pic, index) => (
          <Article
            key={pic.id}
            id={pic.id}
            photoUrl={pic.photoUrl}
            userName={pic.userName}
            quote={pic.quote}
            contestTheme={pic.contestTheme}
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
              className="relative sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] w-90vw overflow-hidden rounded-lg "
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
              <div className="absolute bottom-1 left-1 px-3 py-2">
                <div className="inline-block bg-black bg-opacity-50 text-white px-4 py-2 rounded-full transition-opacity duration-300">
                  <h2 className="text-xl font-bold leading-none">
                    {imageData[currentIndex].quote}
                  </h2>
                </div>
              </div>
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
