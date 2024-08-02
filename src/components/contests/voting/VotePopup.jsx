import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const VotePopup = ({ entries, currentIndex, onClose, isLiked, onLike, onPrevious, onNext }) => {
  const [entry, setEntry] = useState(entries[currentIndex]);

  useEffect(() => {
    setEntry(entries[currentIndex]);
  }, [currentIndex, entries]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      onPrevious();
    } else if (event.key === 'ArrowRight') {
      onNext();
    } else if (event.key === 'Escape') {
      onClose();
    }
  }, [onPrevious, onNext, onClose]);

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

  const openFullView = () => {
    window.open(entry.photoUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative max-w-4xl max-h-[90vh] w-full overflow-hidden rounded-lg bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative" {...swipeHandlers}>
            <img
              src={entry.photoUrl}
              alt={entry.userName}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <motion.button 
                className="text-white bg-black bg-opacity-50 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300 shadow-lg"
                onClick={openFullView}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </motion.button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{entry.userName}</h2>
                  <p className="text-xs md:text-sm text-gray-300">Votes: {entry.voteCount || 0}</p>
                </div>
                <motion.button
                  className={`p-2 md:p-3 rounded-full ${isLiked ? 'bg-red-500' : 'bg-white'} shadow-lg`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(entry.id);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 md:h-8 md:w-8"
                    viewBox="0 0 20 20"
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: isLiked ? [1, 1.3, 1] : 1,
                      fill: isLiked ? '#ffffff' : 'none',
                      stroke: isLiked ? '#ffffff' : '#ef4444'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeWidth="2"
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </motion.button>
              </div>
            </div>
          </div>
          <motion.button 
            className="absolute top-4 right-4 text-2xl md:text-3xl text-white bg-black bg-opacity-50 p-2 md:p-3 rounded-md hover:bg-opacity-75 transition-all duration-300 shadow-lg"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            &times;
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VotePopup;

