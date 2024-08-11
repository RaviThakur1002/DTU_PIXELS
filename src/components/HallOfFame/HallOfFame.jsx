import React, { useState, useEffect, useMemo } from 'react';
import FameCard from './FameCard';
import './HallOfFame.css'; 
import LoadingSpinner from '../LoadingSpinner';
import { useGallery } from '../contexts/GalleryContext';

const ITEMS_PER_PAGE = 6;

const HallOfFame = () => {
  const { allGalleryData, isLoading, error } = useGallery();
  const [hallOfFameData, setHallOfFameData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (allGalleryData) {
      const winners = [];

      const contestWinners = allGalleryData.reduce((acc, image) => {
        const { contestId, userName, photoUrl, likeCount } = image;

        if (!acc[contestId] || acc[contestId].likeCount < likeCount) {
          acc[contestId] = { contestId, userName, photoUrl, likeCount };
        }
        
        return acc;
      }, {});

      for (const contestId in contestWinners) {
        const winner = contestWinners[contestId];
        winners.push({
          id: contestId,
          contestNo: contestId,
          contestName: winner.contestTheme,
          winnerName: winner.userName,
          winnerPhoto: winner.photoUrl,
          likeCount: winner.likeCount,
        });
      }

      winners.sort((a, b) => b.contestNo - a.contestNo);
      setHallOfFameData(winners);
    }
  }, [allGalleryData]);

  useEffect(() => {
    // Scroll to top when currentPage changes
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = hallOfFameData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hallOfFameData.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return <LoadingSpinner quote={"Loading Winners Data"} />;
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => fetchContests()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-pattern min-h-screen p-4 flex flex-col">
      <div className="flex justify-center items-center min-h-[200px] mb-4">
        <h1 className="text-center text-4xl font-bold py-4 px-6 border-4 border-yellow-500 bg-white bg-opacity-90 text-gray-600 rounded-lg shadow-lg w-full max-w-6xl">
          Hall of Fame
        </h1>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="bg-white bg-opacity-80 p-4 rounded-lg border-4 border-yellow-500 shadow-lg w-full max-w-6xl">
          <div className="flex flex-wrap justify-between">
            {currentItems.map((item) => (
              <div key={item.id} className="w-1/3 p-4">
                <FameCard
                  src={item.winnerPhoto}
                  alt={`Winner of Contest ${item.contestNo}`}
                  name={item.winnerName}
                  contestNo={item.contestNo}
                  contestName={item.contestName}
                />
              </div>
            ))}
          </div>
          {hallOfFameData.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No contest data available.</p>
          )}
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                className={`py-2 px-4 border rounded ${currentPage === page + 1 ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-700 border-gray-300'} hover:bg-blue-200 transition`}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;
