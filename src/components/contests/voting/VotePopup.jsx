import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const ZoomedImage = ({ photoUrl, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    onClick={onClose}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <img
      src={photoUrl}
      alt="Zoomed"
      className="max-w-full max-h-full object-contain"
    />
    <button
      className="absolute top-4 right-4 text-white"
      onClick={onClose}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </motion.div>
);

const VotePopup = ({ entries, currentIndex, onClose, isLiked, onLike, onPrevious, onNext }) => {
  const [entry, setEntry] = useState(entries[currentIndex]);
  const [imageOrientation, setImageOrientation] = useState('landscape');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setEntry(entries[currentIndex]);
    const img = new Image();
    img.onload = () => {
      setImageOrientation(img.width > img.height ? 'landscape' : 'portrait');
    };
    img.src = entries[currentIndex].photoUrl;
  }, [currentIndex, entries]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      onPrevious();
    } else if (event.key === 'ArrowRight') {
      onNext();
    } else if (event.key === 'Escape') {
      if (isZoomed) {
        setIsZoomed(false);
      } else {
        onClose();
      }
    }
  }, [onPrevious, onNext, onClose, isZoomed]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onNext(),
    onSwipedRight: () => onPrevious(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const getPopupStyles = () => {
    const isSmallScreen = windowSize.width < 640;
    const isPortrait = windowSize.height > windowSize.width;

    let maxWidth = isSmallScreen ? '95vw' : (imageOrientation === 'landscape' ? '50vw' : '30vw');
    let maxHeight = isSmallScreen ? '95vh' : '90vh';

    if (isPortrait) {
      maxWidth = isSmallScreen ? '95vw' : '85vw';
      maxHeight = '80vh';
    }

    return {
      maxWidth,
      maxHeight,
      width: '100%',
      height: 'auto',
    };
  };

  const getImageContainerStyles = () => {
    const isSmallScreen = windowSize.width < 640;
    const isPortrait = windowSize.height > windowSize.width;

    let height = isSmallScreen ? '50vh' : (imageOrientation === 'landscape' ? '60vh' : '70vh');

    if (isPortrait) {
      height = isSmallScreen ? '40vh' : '50vh';
    }

    return {
      height,
      width: '100%',
    };
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          className="bg-white rounded-lg p-4 overflow-auto relative flex flex-col items-center"
          style={getPopupStyles()}
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button
            className="absolute top-3 right-3 bg-gray-200 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 z-10"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="relative w-full" {...swipeHandlers}>
            <div className="flex items-center justify-center mb-4" style={getImageContainerStyles()}>
              <img
                src={entry.photoUrl}
                alt={entry.userName}
                className="max-w-full max-h-full object-contain"
              />
              {/* Zoom button */}
              <motion.button
                className="absolute top-3 left-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </motion.button>
              <motion.button
                className={`absolute bottom-3 left-3 p-2 rounded-full ${isLiked ? 'bg-red-500' : 'bg-gray-200'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(entry.id);
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: isLiked ? [1, 1.3, 1] : 1,
                    fill: isLiked ? '#ffffff' : 'none',
                    stroke: isLiked ? '#ffffff' : '#374151'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              </motion.button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2 text-center">{entry.userName}</h2>
            <p className="text-gray-700 mb-2 text-center">{entry.quote}</p>
            <span className="text-gray-600 mb-2">Votes: {entry.voteCount || 0}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Zoomed image view */}
      {isZoomed && (
        <ZoomedImage
          photoUrl={entry.photoUrl}
          onClose={toggleZoom}
        />
      )}
    </AnimatePresence>
  );
};

export default VotePopup;
