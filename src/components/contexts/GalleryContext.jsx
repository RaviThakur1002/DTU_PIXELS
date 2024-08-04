import React, { createContext, useState, useEffect, useContext } from 'react';

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [galleryData, setGalleryData] = useState(() => {
    const savedData = localStorage.getItem('galleryData');
    console.log("Initial galleryData from localStorage:", savedData ? JSON.parse(savedData) : null);
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    if (galleryData) {
      console.log("Saving galleryData to localStorage:", galleryData);
      localStorage.setItem('galleryData', JSON.stringify(galleryData));
    }
  }, [galleryData]);

  return (
    <GalleryContext.Provider value={{ galleryData, setGalleryData }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => useContext(GalleryContext);
