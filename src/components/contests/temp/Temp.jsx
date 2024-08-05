import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import roleService from '../../../firebase/roleAssigning/RoleService';
import ContestPage from '../contestPage/ContestPage';
import LoadingSpinner from '../../LoadingSpinner.jsx';
import { useContest } from '../../contexts/ContestContext';
import app from '../../../config/conf.js';

function Temp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const database = getDatabase(app);
  const { allContestData, setAllContestData, lastFetchTime, setLastFetchTime } = useContest();

  const fetchContests = useCallback(async () => {
    console.log("Fetching contests");
    setIsLoading(true);
    try {
      const contestsRef = ref(database, "contests");
      const snapshot = await get(contestsRef);
      const contestsData = snapshot.val();
      
      const processedData = Object.entries(contestsData).map(([id, contest]) => ({
        id,
        ...contest,
      }));

      setAllContestData(processedData);
      setLastFetchTime(new Date().toISOString());
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [database, setAllContestData, setLastFetchTime]);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const role = await roleService.getRole();
          setIsAdmin(role === 'admin');
        } catch (error) {
          console.error(error);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unregisterAuthObserver();
  }, [auth]);

  useEffect(() => {
    const checkAndFetchContests = () => {
      const currentTime = new Date().getTime();
      const fetchTimeThreshold = 60 * 60 * 1000; // 1 hour in milliseconds

      if (!lastFetchTime || !allContestData || (currentTime - new Date(lastFetchTime).getTime() > fetchTimeThreshold)) {
        fetchContests();
      } else {
        console.log("Using cached contest data");
        setIsLoading(false);
      }
    };

    checkAndFetchContests();
  }, [fetchContests, lastFetchTime, allContestData]);

  if (isLoading) {
    return <LoadingSpinner quote="Loading contests... Get your voting fingers ready!" />;
  }

  return (
    <div> 
      <ContestPage />
    </div>
  );
}

export default Temp;
