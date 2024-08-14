import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGallery } from '../contexts/GalleryContext';
import { NavLink } from 'react-router-dom';

const HallOfFame = () => {
  const { allGalleryData, isLoading, error } = useGallery();
  const [hallOfFameData, setHallOfFameData] = useState([]);

  useEffect(() => {
    if (allGalleryData) {
      const winners = [];

      const contestWinners = allGalleryData.reduce((acc, image) => {
        const { contestId, userName, photoUrl, likeCount, contestTheme } = image;

        if (!acc[contestId] || acc[contestId].likeCount < likeCount) {
          acc[contestId] = { contestId, userName, photoUrl, likeCount, contestTheme };
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Left side - static content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-8 md:p-12">
        <h1 className="bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text text-4xl md:text-6xl font-bold mb-4 md:mb-6">Winners</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
          Celebrating the artistry and creativity of our top photographers. Discover the winning moments that captured the essence of excellence.
        </p>
        <NavLink to={"/"}>
          <button className="bg-gradient-to-r from-[#6528d7] to-[#7b3ee0] text-white py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg font-semibold hover:from-[#7b3ee0] hover:to-[#8f55e9] transition duration-300 shadow-md hover:shadow-lg">
            Home
          </button>
        </NavLink>
      </div>

      {/* Right side */}
      <div className="w-full md:w-1/2 overflow-hidden h-[calc(100vh-300px)] md:h-screen">
        <motion.div
          className="grid grid-cols-1 gap-4"
          animate={{ y: [-hallOfFameData.length * 240, 0] }}
          transition={{ repeat: Infinity, duration: hallOfFameData.length * 5, ease: "linear" }}
        >
          {hallOfFameData.concat(hallOfFameData).map((winner, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={winner.winnerPhoto}
                alt={winner.winnerName}
                className="w-full h-48 md:h-60 object-cover"
              />
              <div className="text-white mt-2 text-center">
                <h2 className="text-[#cba6f7] text-lg md:text-xl font-semibold">{winner.winnerName}</h2>
                <p className="text-base md:text-lg">{winner.contestName}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HallOfFame;