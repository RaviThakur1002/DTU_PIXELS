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
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={isLiked ? 'white' : 'none'}
          viewBox="0 0 24 24"
          stroke={isLiked ? 'white' : 'currentColor'}
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
    </motion.div>
  );
};

export default VoteCard;
