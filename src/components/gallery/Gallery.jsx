import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../config/conf.js";
import Images from "./Images";
import Pagination from "../Utilities/Pagination.jsx";
import LoadingSpinner from "../Utilities/LoadingSpinner.jsx";
import { useGallery } from "../contexts/GalleryContext.jsx";
import './Gallery.css';

const Gallery = ({ userName = null }) => {
  const { 
    allGalleryData, 
    setAllGalleryData, 
    userGalleryData, 
    setUserGalleryData,
    lastFetchTime, 
    setLastFetchTime 
  } = useGallery();
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
    console.log("Fetching images");
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
            allImages.push({
              id: entrySnapshot.key,
              contestId: contestId,
              contestTheme: contestData.theme,
              photoUrl: entry.photoUrl,
              userName: entry.userName,
              quote: entry.quote,
              timestamp: entry.timestamp,
            });
          });
        }
      }
      const sortedImages = allImages.sort((a, b) => b.timestamp - a.timestamp);
      console.log("Fetched and sorted images:", sortedImages);
      setAllGalleryData(sortedImages);
      setLastFetchTime(new Date().toISOString());
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [database, setAllGalleryData, setLastFetchTime]);

  useEffect(() => {
    const checkAndFetchImages = () => {
      const currentTime = new Date().getTime();
      const fetchTimeThreshold = 60 * 60 * 1000; // 1 hour in milliseconds

      if (!lastFetchTime || !allGalleryData || (currentTime - new Date(lastFetchTime).getTime() > fetchTimeThreshold)) {
        fetchImages();
      } else {
        console.log("Using cached gallery data");
      }
    };

    checkAndFetchImages();
  }, [fetchImages, lastFetchTime, allGalleryData]);

  useEffect(() => {
    if (allGalleryData && userName) {
      const filteredData = allGalleryData.filter(image => image.userName === userName);
      setUserGalleryData(filteredData);
    } else if (allGalleryData) {
      setUserGalleryData(null);
    }
  }, [allGalleryData, userName, setUserGalleryData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const galleryData = userName ? userGalleryData : allGalleryData;

  const { currentPosts, totalPosts } = useMemo(() => {
    if (!galleryData) return { currentPosts: [], totalPosts: 0 };
    const lastPostIndex = currentPage * postPerPage;
    const firstPostIndex = lastPostIndex - postPerPage;
    return {
      currentPosts: galleryData.slice(firstPostIndex, lastPostIndex),
      totalPosts: galleryData.length
    };
  }, [galleryData, currentPage, postPerPage]);

  if (isLoading) {
    return <LoadingSpinner quote={randomQuote} />;
  }

  if (!galleryData || galleryData.length === 0) {
    return (
      <p className="text-center text-gray-400 text-xl">
        No images to display. Check back after contests have ended.
      </p>
    );
  }

  return (
    <>
    <div className="bg-gradient-to-b from-[#000000] to-[#171717] text-white py-10">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text">Gallery</h1>
        <p className="text-lg text-gray-300">Explore our curated collection of captivating images!</p>
      </div>
    </div>

    <div className="w-full mx-auto px-12 min-h-screen gallery-container bg-[#000000] flex justify-center items-start pt-10">
      <div className="w-full max-w-6xl m-1">
        <Images imageData={currentPosts} />
        <Pagination 
          totalPosts={totalPosts}
          postsPerPage={postPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  </>
  );
};

export default Gallery;
