import React, { useState, useEffect } from 'react';
import FameCard from './FameCard';
import './HallOfFame.css'; 
import LoadingSpinner from '../../components/Utilities/LoadingSpinner';
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
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-pattern min-h-screen p-4 flex flex-col">
      <div className="flex justify-center items-center min-h-[200px] mb-4">
        <h1 className="text-center text-4xl font-bold py-4 px-6 border-2 border-orange-400 bg-[#111827] bg-opacity-90 text-orange-400 rounded-lg shadow-lg w-full max-w-6xl">
          Hall of Fame
        </h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        <div className="bg-[#111827] bg-opacity-90 p-4 rounded-lg border-2 border-orange-400 shadow-lg w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <div key={item.id} className="w-full">
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
          <div className="mt-8 flex justify-center space-x-2 flex-wrap">
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                className={`py-2 px-4 border rounded mb-2 ${currentPage === page + 1 ? 'bg-orange-400 text-white border-orange-400' : 'bg-white text-[#1f2927] border-[#1f2927]'} hover:bg-orange-200 transition`}
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
