import React, { createContext, useState, useEffect, useContext } from 'react';

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [allGalleryData, setAllGalleryData] = useState(() => {
    const savedData = localStorage.getItem('allGalleryData');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [userGalleryData, setUserGalleryData] = useState(null);

  const [lastFetchTime, setLastFetchTime] = useState(() => {
    return localStorage.getItem('lastGalleryFetchTime') || null;
  });

  useEffect(() => {
    if (allGalleryData) {
      localStorage.setItem('allGalleryData', JSON.stringify(allGalleryData));
    }
  }, [allGalleryData]);

  useEffect(() => {
    if (lastFetchTime) {
      localStorage.setItem('lastGalleryFetchTime', lastFetchTime);
    }
  }, [lastFetchTime]);

  return (
    <GalleryContext.Provider value={{ 
      allGalleryData, 
      setAllGalleryData, 
      userGalleryData, 
      setUserGalleryData,
      lastFetchTime, 
      setLastFetchTime 
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => useContext(GalleryContext);
