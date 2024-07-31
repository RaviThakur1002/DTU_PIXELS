import React from 'react';
import { motion } from 'framer-motion';

const VoteCard = ({ entry, isLiked, onLike, onClick }) => {
  return (
    <motion.div
      className="relative h-64 sm:h-72 md:h-80 lg:h-96 w-full rounded-md overflow-hidden cursor-pointer shadow-md"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={entry.photoUrl}
        alt={entry.userName}
        className="z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-left">
        <h1 className="text-lg font-semibold text-white">{entry.userName}</h1>
      </div>
      <motion.button
        className={`absolute top-4 right-4 p-2 rounded-full ${
          isLiked ? 'bg-red-500' : 'bg-white'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onLike();
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
    </motion.div>
  );
};

export default VoteCard;
