import React, { useState, useEffect } from "react";
import Images from "./Images";
import Pagination from "./Pagination";
const Gallery = () => {
  const [imageData, setImageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  

  useEffect(() => {
    fetch("https://api.unsplash.com/photos/random?count=30", {
      headers: {
        Authorization: "Client-ID r44OcdTVIj6wgDTdHRXB3nW-kfWDYxT6Y1f__CYhzME",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setImageData(data);
      })
      .catch((error) => {
        console.error("Error fetching image data:", error);
      });
  }, []);

    const lastPostIndex = currentPage* postPerPage;
    const firstPostIndex = lastPostIndex- postPerPage;
    const currentPosts =  imageData.slice(firstPostIndex,lastPostIndex)


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
