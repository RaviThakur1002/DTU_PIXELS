import React, { useState, useMemo, useEffect } from 'react';
import Contest from './Contest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../Utilities/Pagination';
import { NavLink } from 'react-router-dom';
import { useContest } from '../../contexts/ContestContext';

const contestsPerPage = 4;

const ContestPage = () => {
  const { allContestData } = useContest();
  const [pastPage, setPastPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const { currentContests, pastContests } = useMemo(() => {
    if (!allContestData) return { currentContests: [], pastContests: [] };

    return allContestData.reduce((acc, contest) => {
      const contestEndTime = new Date(`${contest.contestEndDate} ${contest.contestEndTime}`).getTime();
      if (currentTime <= contestEndTime) {
        acc.currentContests.push(contest);
      } else {
        acc.pastContests.push(contest);
      }
      return acc;
    }, { currentContests: [], pastContests: [] });
  }, [allContestData, currentTime]);

  const getPastContests = () => {
    const indexOfLast = pastPage * contestsPerPage;
    const indexOfFirst = indexOfLast - contestsPerPage;
    return pastContests.slice(indexOfFirst, indexOfLast);
  };

  if (!allContestData || allContestData.length === 0) {
    return <p className="text-center text-gray-500 text-xl">No contests available.</p>;
  }

  return (
    <>
      <div className="bg-gradient-to-b from-[#000000] to-[#171717] text-white py-20">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <FontAwesomeIcon icon={faTrophy} className="text-[#cba6f7] text-8xl mb-4" />
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text">Contests</h1>
          <p className="text-lg text-gray-300">Showcase your photography skills!</p>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <section className="mt-5 mb-12">
          <div className="bg-[#171717] text-[#cba6f7] py-2 px-4 rounded-lg inline-block mb-6">
            <h2 className="text-2xl font-semibold">Current/Upcoming Contests</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentContests.map((contest) => (
              <NavLink key={contest.id} to={`/contest/${contest.id}`}>
                <Contest contest={contest} isCurrent={true} />
              </NavLink>
            ))}
          </div>
        </section>
        <section>
          <div className="bg-[#101010] text-[#cba6f7] py-2 px-4 rounded-lg inline-block mb-6">
            <h2 className="text-2xl font-semibold">Past Contests</h2>
          </div>
          <div>
            {getPastContests().map((contest) => (
              <NavLink key={contest.id} to={`/contest/${contest.id}`} className="block mb-6">
                <Contest contest={contest} isCurrent={false} />
              </NavLink>
            ))}
          </div>
          <Pagination
            totalPosts={pastContests.length}
            postsPerPage={contestsPerPage}
            setCurrentPage={setPastPage}
            currentPage={pastPage}
          />
        </section>
      </div>
    </>
  );
};

export default ContestPage;
