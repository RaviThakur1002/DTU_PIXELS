import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const VotePopup = ({ entry, onClose, isLiked, onLike }) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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
        transition={{ duration: 0.3 }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={entry.photoUrl}
          alt={entry.userName}
          className="w-full h-auto max-h-[50vh] object-contain mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{entry.userName}</h2>
        <p className="text-gray-700 mb-4">{entry.quote}</p>
        <div className="flex justify-between items-center">
          <motion.button
            className={`p-2 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={isLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ scale: 1 }}
              animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </motion.svg>
          </motion.button>
          <span className="text-gray-600">Votes: {entry.voteCount || 0}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VotePopup;
