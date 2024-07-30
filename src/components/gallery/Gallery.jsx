import React, { useState, useEffect } from "react";
import Images from "./Images";
import Pagination from "./Pagination";
import { getDatabase, ref, query, orderByChild, onValue, get } from "firebase/database";
import app from "../../config/conf.js";
import ContestServiceInstance from "../../firebase/contestServices/ContestService.js";

const Gallery = ({ userName = "/////" }) => {
  const [imageData, setImageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentContest, setCurrentContest] = useState(null);
  const postPerPage = 10;
  const database = getDatabase(app);

  useEffect(() => {
    const fetchCurrentContest = async () => {
      const contest = await ContestServiceInstance.getCurrentContest();
      setCurrentContest(contest);
    };

    fetchCurrentContest();
  }, []);

  useEffect(() => {
    const contestsRef = ref(database, 'contests');

    const unsubscribe = onValue(contestsRef, async (snapshot) => {
      const allImages = [];
      const currentTime = new Date().getTime();

      for (const contestSnapshot of Object.values(snapshot.val())) {
        const contestId = contestSnapshot.id;
        const contestData = contestSnapshot;
        const contestEndTime = new Date(`${contestData.contestEndDate} ${contestData.contestEndTime}`).getTime();

        
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
                ...entry
              });
            }
          });
        }
      }

      setImageData(allImages.sort((a, b) => b.timestamp - a.timestamp));
    }, (error) => {
      console.error("Error fetching images:", error);
    });

    return () => unsubscribe();
  }, [userName]);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = imageData.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
      {currentContest && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Current Contest: {currentContest.theme}</h3>
          <p>End Date: {currentContest.contestEndDate} {currentContest.contestEndTime}</p>
        </div>
      )}
      {imageData.length === 0 ? (
        <p className="text-center text-gray-500">No images to display. Check back after contests have ended.</p>
      ) : (
        <>
          <Images imageData={currentPosts} />
          <Pagination
            totalPosts={imageData.length}
            postsPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

export default Gallery;
