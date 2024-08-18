import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery } from "../contexts/GalleryContext";
import { NavLink } from "react-router-dom";
import LoadingSpinner from "../Utilities/LoadingSpinner";
import Masonry from "react-masonry-css";

const HallOfFame = () => {
  const { allGalleryData, isLoading, error } = useGallery();
  const [hallOfFameData, setHallOfFameData] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (allGalleryData) {
      const winners = allGalleryData.filter(image => image.isWinner);
      winners.sort((a, b) => b.voteCount - a.voteCount);
      setHallOfFameData(winners);
    }
  }, [allGalleryData]);

  useEffect(() => {
    if (hallOfFameData.length > 0) {
      const imagePromises = hallOfFameData.map((winner) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = winner.photoUrl;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      Promise.all(imagePromises).then(() => setImagesLoaded(true));
    } else {
      setImagesLoaded(true);
    }
  }, [hallOfFameData]);

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

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Left side - static content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-8 md:p-12">
        <h1 className="bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text text-4xl md:text-6xl font-bold mb-4 md:mb-6">
          Winners
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
          Celebrating the artistry and creativity of our top photographers.
          Discover the winning moments that captured the essence of excellence.
        </p>
        <NavLink to={"/"}>
          <button className="bg-gradient-to-r from-[#6528d7] to-[#7b3ee0] text-white py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg font-semibold hover:from-[#7b3ee0] hover:to-[#8f55e9] transition duration-300 shadow-md hover:shadow-lg">
            Home
          </button>
        </NavLink>
      </div>

      {/* Right side */}
      <div className="w-full md:w-1/2 overflow-y-auto h-[calc(100vh-64px)]">
        <AnimatePresence>
          {isLoading && <LoadingSpinner />}
          {!isLoading && imagesLoaded && hallOfFameData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="flex justify-center items-center h-full"
            >
              <p className="text-gray-300 text-xl">No images in the Hall of Fame yet.</p>
            </motion.div>
          )}
          {!isLoading && imagesLoaded && hallOfFameData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {hallOfFameData.map((winner, index) => (
                  <motion.div
                    key={index}
                    className="winner-card bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl mb-4"
                    initial={{ opacity: 1, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                      ease: "easeOut",
                      y: { duration: 0.8 },
                    }}
                  >
                    <img
                      src={winner.photoUrl}
                      alt={winner.userName}
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-[#cba6f7] text-xl font-semibold">
                        {winner.userName}
                      </h2>
                      <p className="text-gray-300">{winner.contestTheme}</p>
                    
                    </div>
                  </motion.div>
                ))}
              </Masonry>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HallOfFame;
