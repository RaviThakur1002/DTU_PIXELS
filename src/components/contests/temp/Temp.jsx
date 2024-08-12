import React, { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import roleService from '../../../firebase/roleAssigning/RoleService';
import ContestPage from '../contestPage/ContestPage';
import LoadingSpinner from '../../Utilities/LoadingSpinner.jsx';
import { useContest } from '../../contexts/ContestContext';
import app from '../../../config/conf.js';

function Temp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const database = getDatabase(app);
  const { allContestData, setAllContestData, lastFetchTime, setLastFetchTime } = useContest();

  const fetchContests = useCallback(() => {
    console.log("Fetching contests");
    setIsLoading(true);
    const contestsRef = ref(database, "contests");

    const contestListener = onValue(contestsRef, (snapshot) => {
      const contestsData = snapshot.val();
      
      if (contestsData) {
        const processedData = Object.entries(contestsData).map(([id, contest]) => ({
          id,
          ...contest,
        }));

        processedData.sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate));

        setAllContestData(processedData);
        setLastFetchTime(new Date().toISOString());
      } else {
        setAllContestData([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching contests:", error);
      setIsLoading(false);
    });

    return () => off(contestsRef, 'value', contestListener);
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
    const cleanup = fetchContests();
    return () => cleanup();
  }, [fetchContests]);

  if (isLoading) {
    return <LoadingSpinner quote="Loading contests... Get your voting fingers ready!" />;
  }

  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] to-[#171717] text-white min-h-screen">
      <ContestPage />
    </div>
  );
}

export default Temp;
