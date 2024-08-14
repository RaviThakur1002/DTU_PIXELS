import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { openDB } from 'idb';
import { getDatabase, ref, get } from "firebase/database";
import app from "../../config/conf.js";

const GalleryContext = createContext();

const dbPromise = openDB('GalleryDB', 1, {
  upgrade(db) {
    db.createObjectStore('gallery');
  },
});

export const GalleryProvider = ({ children }) => {
  const [allGalleryData, setAllGalleryData] = useState([]);
  const [userGalleryData, setUserGalleryData] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchImages = useCallback(async () => {
    console.log("Fetching images");
    const database = getDatabase(app);
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
      setAllGalleryData(sortedImages);
      setLastFetchTime(new Date().toISOString());
      return sortedImages;
    } catch (error) {
      console.error("Error fetching images:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const db = await dbPromise;
      const tx = db.transaction('gallery', 'readonly');
      const store = tx.objectStore('gallery');
      const savedData = await store.get('allGalleryData');
      const savedTime = await store.get('lastFetchTime');
      
      if (savedData) {
        setAllGalleryData(savedData);
        setIsDataLoaded(true);
      } else {
        const newData = await fetchImages();
        if (newData) {
          setAllGalleryData(newData);
          setIsDataLoaded(true);
        }
      }
      if (savedTime) setLastFetchTime(savedTime);
    };
    loadData();
  }, [fetchImages]);

  useEffect(() => {
    const saveData = async () => {
      if (isDataLoaded) {
        const db = await dbPromise;
        const tx = db.transaction('gallery', 'readwrite');
        const store = tx.objectStore('gallery');
        await store.put(allGalleryData, 'allGalleryData');
        await store.put(lastFetchTime, 'lastFetchTime');
      }
    };
    saveData();
  }, [allGalleryData, lastFetchTime, isDataLoaded]);

  return (
    <GalleryContext.Provider value={{ 
      allGalleryData, 
      setAllGalleryData, 
      userGalleryData, 
      setUserGalleryData,
      lastFetchTime, 
      setLastFetchTime,
      isDataLoaded,
      fetchImages
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => useContext(GalleryContext);
