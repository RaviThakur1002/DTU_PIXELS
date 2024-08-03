import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { FaExpand, FaTimes } from 'react-icons/fa';

const VotePopup = ({ entries, currentIndex, onClose, isLiked, onLike, onPrevious, onNext, showLikeButton }) => {
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
          className="relative sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] w-90vw overflow-hidden rounded-lg bg-white shadow-2xl"
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
                <FaExpand className="h-5 w-5 md:h-6 md:w-6" />
              </motion.button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{entry.userName}</h2>
                </div>
                {showLikeButton && (
                  <motion.button
                    className={`p-2 md:p-3 rounded-full ${isLiked ? 'bg-red-500' : 'bg-white'} shadow-lg overflow-hidden`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(entry.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.05 }}
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
                      <motion.path
                        strokeWidth="2"
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.svg>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
          <motion.button 
            className="absolute top-4 right-4 text-2xl md:text-3xl text-white bg-black bg-opacity-50 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300 shadow-lg"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VotePopup;
