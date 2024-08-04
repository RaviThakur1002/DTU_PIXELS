import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../config/conf.js";
import Images from "./Images";
import Pagination from "./Pagination";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { useGallery } from "../contexts/GalleryContext.jsx";
import './Gallery.css';

const Gallery = ({ userName = null }) => {
  const { galleryData, setGalleryData } = useGallery();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const postPerPage = 10;
  const database = getDatabase(app);

  const funnyQuotes = useMemo(() => [
    "Loading images faster than a cat can knock a glass off a table...",
    "Hang tight! We're developing these photos in our digital darkroom...",
    "Fetching images... and maybe a stick if we have time.",
    "Loading gallery... Please enjoy this virtual moment of zen.",
    "Curating your visual feast... It's like herding pixels!",
  ], []);

  const randomQuote = useMemo(() => 
    funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)],
  [funnyQuotes]);

  const fetchImages = useCallback(async () => {
    console.log("Fetching images for user:", userName);
    setIsLoading(true);
    try {
      const contestsRef = ref(database, "contests");
      const snapshot = await get(contestsRef);
      const allImages = [];
      const currentTime = new Date().getTime();
      const contestsData = snapshot.val();

      for (const contestId in contestsData) {
        const contestData = contestsData[contestId];
        const contestEndTime = new Date(
          `${contestData.contestEndDate} ${contestData.contestEndTime}`
        ).getTime();

        if (currentTime > contestEndTime) {
          const entriesRef = ref(database, `contests/${contestId}/entries`);
          const entriesSnapshot = await get(entriesRef);

          entriesSnapshot.forEach((entrySnapshot) => {
            const entry = entrySnapshot.val();
            if (!userName || entry.userName === userName) {
              allImages.push({
                id: entrySnapshot.key,
                contestId: contestId,
                contestTheme: contestData.theme,
                photoUrl: entry.photoUrl,
                userName: entry.userName,
                quote: entry.quote,
                timestamp: entry.timestamp,
              });
            }
          });
        }
      }
      const sortedImages = allImages.sort((a, b) => b.timestamp - a.timestamp);
      console.log("Fetched and sorted images:", sortedImages);
      setGalleryData(sortedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userName, database, setGalleryData]);

  useEffect(() => {
    if (!galleryData) {
      fetchImages();
    }
  }, [fetchImages, galleryData]);

  useEffect(() => {
    console.log("Current galleryData:", galleryData);
  }, [galleryData]);

  const { currentPosts, totalPosts } = useMemo(() => {
    if (!galleryData) return { currentPosts: [], totalPosts: 0 };
    const lastPostIndex = currentPage * postPerPage;
    const firstPostIndex = lastPostIndex - postPerPage;
    return {
      currentPosts: galleryData.slice(firstPostIndex, lastPostIndex),
      totalPosts: galleryData.length
    };
  }, [galleryData, currentPage, postPerPage]);

  const refreshGallery = () => {
    console.log("Refreshing gallery");
    setGalleryData(null);
    localStorage.removeItem('galleryData');
    fetchImages();
  };

  if (isLoading) {
    return <LoadingSpinner quote={randomQuote} />;
  }

  if (!galleryData || galleryData.length === 0) {
    return (
      <p className="text-center text-gray-500 text-xl">
        No images to display. Check back after contests have ended.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 min-h-screen gallery-container">
      <div className="w-full">
        <Images imageData={currentPosts} />
        <Pagination
          totalPosts={totalPosts}
          postsPerPage={postPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
<button 
  onClick={refreshGallery}
  className="mb-4 px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  Refresh Gallery
</button>


      </div>
    </div>
  );
};

export default Gallery;
