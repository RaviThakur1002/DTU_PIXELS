import React, { useState, useCallback, useEffect, useRef } from "react";
import Card from "./Card";

const Images = ({ imageData }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const touchStartX = useRef(null);

  const openPopup = useCallback((index) => {
    setCurrentIndex(index);
    setIsPopupOpen(true);
    setTimeout(() => setPopupVisible(true), 10); // Delay to ensure transition works
  }, []);

  const closePopup = useCallback(() => {
    setPopupVisible(false);
    setTimeout(() => setIsPopupOpen(false), 300); // Duration should match the transition
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageData.length);
  }, [imageData.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageData.length) % imageData.length);
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
      popup.addEventListener('touchstart', handleTouchStart);
      popup.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (popup) {
        popup.removeEventListener('touchstart', handleTouchStart);
        popup.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isPopupOpen, nextImage, prevImage]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {imageData.map((pic, index) => (
          <Card
            key={pic.id}
            src={pic.urls.regular}
            alt={`Image ${index + 1}`}
            name={pic.user.name}
            onClick={() => openPopup(index)}
          />
        ))}
      </div>

      {isPopupOpen && (
        <div 
          ref={popupRef}
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm transition-opacity duration-300 ${popupVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={closePopup}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg transition-transform duration-300 transform ${popupVisible ? 'scale-100' : 'scale-95'}"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageData[currentIndex].urls.regular}
              alt={`Image ${currentIndex + 1}`}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex items-center justify-between">
              <button
                className="bg-black bg-opacity-50 text-white p-2 rounded-full m-4 hover:bg-opacity-75 transition-opacity duration-300"
                onClick={prevImage}
              >
                &#10094;
              </button>
              <button
                className="bg-black bg-opacity-50 text-white p-2 rounded-full m-4 hover:bg-opacity-75 transition-opacity duration-300"
                onClick={nextImage}
              >
                &#10095;
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 transition-opacity duration-300">
              <h2 className="text-2xl font-bold">{imageData[currentIndex].user.name}</h2>
            </div>
            <button 
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-opacity duration-300"
              onClick={closePopup}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Images;

