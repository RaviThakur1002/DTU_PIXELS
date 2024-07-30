import React from 'react';

const VotePopup = ({ entry, onClose, isLiked, onLike }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-3xl max-h-[90vh] overflow-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={entry.photoUrl}
          alt={entry.userName}
          className="w-full h-auto mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{entry.userName}</h2>
        <p className="text-gray-700 mb-4">{entry.quote}</p>
        <div className="flex justify-between items-center">
          <button
            className={`p-2 rounded-full ${
              isLiked ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
            onClick={onLike}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={isLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <span className="text-gray-600">Votes: {entry.voteCount || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default VotePopup;
