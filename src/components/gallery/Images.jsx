import React, { useState, useCallback, useEffect } from "react";
import Card from "./Card";

const Images = ({ imageData }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageData.length) % imageData.length);
  }, [imageData.length]);

  // Keyboard navigation
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

  // Touch support
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (event) => {
      touchStartX = event.changedTouches[0].screenX;
    };

    const handleTouchMove = (event) => {
      touchEndX = event.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
      if (touchStartX - touchEndX > 50) {
        nextImage();
      } else if (touchEndX - touchStartX > 50) {
        prevImage();
      }
    };

    if (isPopupOpen) {
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPopupOpen, nextImage, prevImage]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {imageData.map((pic, index) => (
          <Card
            key={pic.id}
            src={pic.urls.regular}
            alt={`Photo by ${pic.user.name}`}
            name={pic.user.name}
            onClick={() => openPopup(index)}
          />
        ))}
      </div>

      {isPopupOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm"
          onClick={closePopup}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageData[currentIndex].urls.regular}
              alt={`Photo by ${imageData[currentIndex].user.name}`}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex items-center justify-between">
              <button
                className="bg-black bg-opacity-50 text-white p-2 rounded-full m-4 hover:bg-opacity-75"
                onClick={prevImage}
              >
                &#10094;
              </button>
              <button
                className="bg-black bg-opacity-50 text-white p-2 rounded-full m-4 hover:bg-opacity-75"
                onClick={nextImage}
              >
                &#10095;
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-2xl font-bold">{imageData[currentIndex].user.name}</h2>
            </div>
            <button 
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-75"
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

