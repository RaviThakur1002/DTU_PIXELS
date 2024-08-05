import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByKey, get } from 'firebase/database';
import FameCard from './FameCard';
import './HallOfFame.css'; 
import LoadingSpinner from '../LoadingSpinner';

const ITEMS_PER_PAGE = 4; 

const HallOfFame = () => {
  const [hallOfFameData, setHallOfFameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchContests = async () => {
    setLoading(true);
    try {
      const db = getDatabase();
      const contestsRef = ref(db, 'contests');
      const contestsQuery = query(contestsRef, orderByKey());

      const snapshot = await get(contestsQuery);
      if (snapshot.exists()) {
        const contests = [];
        const contestPromises = [];

        snapshot.forEach((childSnapshot) => {
          const contestId = childSnapshot.key;
          const contest = childSnapshot.val();

          const entriesPromise = get(ref(db, `contests/${contestId}/entries`))
            .then((entriesSnapshot) => {
              if (entriesSnapshot.exists()) {
                const entries = entriesSnapshot.val();
                const winner = Object.values(entries).reduce((prev, current) => 
                  (prev.likeCount > current.likeCount) ? prev : current
                );

                return {
                  id: contestId,
                  contestNo: contestId,
                  contestName: contest.theme,
                  winnerName: winner.userName,
                  winnerPhoto: winner.photoUrl,
                  likeCount: winner.likeCount
                };
              }
              console.log(`No entries found for contest ${contestId}`);
              return null;
            })
            .catch(err => {
              console.error(`Error fetching entries for contest ${contestId}:`, err);
              return null;
            });

          contestPromises.push(entriesPromise);
        });

        const resolvedContests = await Promise.all(contestPromises);
        contests.push(...resolvedContests.filter(contest => contest !== null));

        // Sort contests by contestNo in descending order
        contests.sort((a, b) => b.contestNo - a.contestNo);

        setHallOfFameData(contests);
      } else {
        console.log('No contests found');
      }
    } catch (err) {
      console.error("Error fetching contest data:", err);
      setError("Failed to load Hall of Fame data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchContests();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = hallOfFameData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hallOfFameData.length / ITEMS_PER_PAGE);

  if (loading) {
    return <LoadingSpinner quote={"Loading Winners Data"} />
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={handleRetry}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-pattern min-h-screen p-4 flex flex-col">
      <div className="flex justify-center items-center min-h-[200px] mb-4">
        <h1 className="text-center text-4xl font-bold py-4 px-6 border-4 border-yellow-500 bg-white bg-opacity-90 text-gray-600 rounded-lg shadow-lg w-full max-w-4xl">
          Hall of Fame
        </h1>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="bg-white bg-opacity-80 p-4 rounded-lg border-4 border-yellow-500 shadow-lg w-full max-w-4xl">
          <div className="flex flex-wrap justify-center">
            {currentItems.map((item) => (
              <div key={item.id} className="m-4">
                <FameCard
                  src={item.winnerPhoto}
                  alt={`Winner of Contest ${item.contestNo}`}
                  name={item.winnerName}
                  subtitle={`Winner of ${item.contestName}`}
                  contestNo={item.contestNo}
                  contestName={item.contestName}
                />
              </div>
            ))}
          </div>
          {hallOfFameData.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No contest data available.</p>
          )}
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                className={`py-2 px-4 border rounded ${currentPage === page + 1 ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-700 border-gray-300'} hover:bg-blue-200 transition`}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;