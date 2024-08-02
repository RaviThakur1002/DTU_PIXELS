import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactCardFlip from "react-card-flip";
import { FaSync } from "react-icons/fa";

const VoteCard = ({ entry, isLiked, onLike, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 mb-4">
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
        containerStyle={{ height: "100%" }}
      >
        {/* Front Side */}
        <div className="w-full h-full cursor-pointer" onClick={onClick}>
          <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg">
            <img
              src={entry.photoUrl}
              alt={entry.userName}
              className="z-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 text-left z-10">
              <h1 className="text-xl font-bold text-white shadow-text">
                {entry.userName}
              </h1>
              <p className="text-sm text-gray-200 shadow-text">
                Votes: {entry.voteCount || 0}
              </p>
            </div>
            <motion.button
              className="absolute bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg"
              onClick={handleFlip}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <FaSync />
            </motion.button>
          </div>
        </div>

        {/* Back Side */}
        <div className="w-full h-full cursor-pointer">
          <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col justify-center items-center p-6">
            <div className="text-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400 mb-4 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-600 italic text-lg">{entry.quote}</p>
            </div>
            <motion.button
              className="absolute bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg"
              onClick={handleFlip}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <FaSync />
            </motion.button>
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default VoteCard;
