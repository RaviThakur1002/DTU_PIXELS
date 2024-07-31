import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const VotePopup = ({ entries, currentIndex, onClose, isLiked, onLike, onPrevious, onNext }) => {
  const [entry, setEntry] = useState(entries[currentIndex]);

  useEffect(() => {
    setEntry(entries[currentIndex]);
  }, [currentIndex, entries]);

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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-auto relative"
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="absolute top-3 right-3 bg-gray-200 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 z-10"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="relative" {...swipeHandlers}>
            <img
              src={entry.photoUrl}
              alt={entry.userName}
              className="w-full h-auto max-h-[50vh] object-contain mb-4"
            />
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 transition-all duration-200 p-2"
              onClick={onPrevious}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 transition-all duration-200 p-2"
              onClick={onNext}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-bold mb-2">{entry.userName}</h2>
          <p className="text-gray-700 mb-4">{entry.quote}</p>
          <div className="flex justify-between items-center">
            <motion.button
              className={`p-2 rounded-full ${isLiked ? 'bg-red-500' : 'bg-gray-200'}`}
              onClick={(e) => {
                e.stopPropagation();
                onLike(entry.id);
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            <span className="text-gray-600">Votes: {entry.voteCount || 0}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VotePopup;
