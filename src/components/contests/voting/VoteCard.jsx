import React from 'react';

const VoteCard = ({ entry, isLiked, onLike, onClick }) => {
  return (
    <div className="relative h-96 w-72 rounded-md overflow-hidden cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <img
        src={entry.photoUrl}
        alt={entry.userName}
        className="z-0 h-full w-full object-cover transition duration-300 ease-in-out hover:opacity-90"
        onClick={onClick}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-left">
        <h1 className="text-lg font-semibold text-white">{entry.userName}</h1>
      </div>
      <button
        className={`absolute top-4 right-4 p-2 rounded-full ${
          isLiked ? 'bg-red-500' : 'bg-white'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onLike();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={isLiked ? 'white' : 'none'}
          viewBox="0 0 24 24"
          stroke={isLiked ? 'white' : 'currentColor'}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default VoteCard;
