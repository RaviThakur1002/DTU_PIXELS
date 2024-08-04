import React, { useState, useEffect, useMemo } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../config/conf.js";
import ContestServiceInstance from "../../firebase/contestServices/ContestService.js";
import Images from "./Images";
import Pagination from "./Pagination";
import LoadingSpinner from "../LoadingSpinner.jsx";
const Gallery = ({ userName = "/////" }) => {
  const [imageData, setImageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentContest, setCurrentContest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const postPerPage = 10;
  const database = getDatabase(app);

  const funnyQuotes = [
    "Loading images faster than a cat can knock a glass off a table...",
    "Hang tight! We're developing these photos in our digital darkroom...",
    "Fetching images... and maybe a stick if we have time.",
    "Loading gallery... Please enjoy this virtual moment of zen.",
    "Curating your visual feast... It's like herding pixels!",
  ];

  const randomQuote = useMemo(() => {
    return funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
  }, []);

  useEffect(() => {
    const fetchCurrentContest = async () => {
      const contest = await ContestServiceInstance.getCurrentContest();
      setCurrentContest(contest);
    };
    fetchCurrentContest();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
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
            if (userName === "/////" || entry.userName === userName) {
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
      setImageData(allImages.sort((a, b) => b.timestamp - a.timestamp));
      setIsLoading(false);
    };
    fetchImages();
  }, [userName, database]);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = imageData.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="container mx-auto px-4 min-h-screen">
      {isLoading ? (
        <LoadingSpinner quote={randomQuote} />
      ) : imageData.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          No images to display. Check back after contests have ended.
        </p>
      ) : (
        <div className="w-full">
          <Images imageData={currentPosts} />
          <Pagination
            totalPosts={imageData.length}
            postsPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;

