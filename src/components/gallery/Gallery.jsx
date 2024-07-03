import React, { useState, useEffect } from "react";
import Images from "./Images";
import Pagination from "./Pagination";
import { getDatabase, ref, query, orderByChild, limitToLast, onValue } from "firebase/database";
import app from "../../config/conf.js";

const Gallery = () => {
  const [imageData, setImageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 10;
  const database = getDatabase(app);

  useEffect(() => {
    const imagesRef = ref(database, 'images');
    const recentImagesQuery = query(imagesRef, orderByChild('timestamp'), limitToLast(50));

    const unsubscribe = onValue(recentImagesQuery, (snapshot) => {
      const images = [];
      snapshot.forEach((childSnapshot) => {
        images.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      setImageData(images.reverse()); // Reverse to get newest first
    }, (error) => {
      console.error("Error fetching images:", error);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = imageData.slice(firstPostIndex, lastPostIndex);

  return (
    <div>
      <Images imageData={currentPosts} />
      <Pagination
        totalPosts={imageData.length}
        postsPerPage={postPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Gallery;
