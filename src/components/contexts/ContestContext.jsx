// ContestContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const ContestContext = createContext();

export const ContestProvider = ({ children }) => {
  const [allContestData, setAllContestData] = useState(() => {
    const savedData = localStorage.getItem('allContestData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const [lastFetchTime, setLastFetchTime] = useState(() => {
    return localStorage.getItem('lastContestFetchTime') || null;
  });

  useEffect(() => {
    if (allContestData) {
      localStorage.setItem('allContestData', JSON.stringify(allContestData));
    }
  }, [allContestData]);

  useEffect(() => {
    if (lastFetchTime) {
      localStorage.setItem('lastContestFetchTime', lastFetchTime);
    }
  }, [lastFetchTime]);

  return (
    <ContestContext.Provider value={{ 
      allContestData, 
      setAllContestData,
      lastFetchTime, 
      setLastFetchTime 
    }}>
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = () => useContext(ContestContext);
