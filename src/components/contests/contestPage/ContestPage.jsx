import React, { useState, useMemo } from 'react';
import Contest from './Contest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import Pagination from './Pagination';
import { NavLink } from 'react-router-dom';
import { useContest } from '../../contexts/ContestContext';

const contestsPerPage = 4;

const ContestPage = () => {
  const { allContestData } = useContest();
  const [pastPage, setPastPage] = useState(1);

  const { currentContests, pastContests } = useMemo(() => {
    if (!allContestData) return { currentContests: [], pastContests: [] };
    const currentTime = new Date().getTime();
    return allContestData.reduce((acc, contest) => {
      const contestEndTime = new Date(`${contest.contestEndDate} ${contest.contestEndTime}`).getTime();
      if (currentTime <= contestEndTime) {
        acc.currentContests.push(contest);
      } else {
        acc.pastContests.push(contest);
      }
      return acc;
    }, { currentContests: [], pastContests: [] });
  }, [allContestData]);

  const getPastContests = () => {
    const indexOfLast = pastPage * contestsPerPage;
    const indexOfFirst = indexOfLast - contestsPerPage;
    return pastContests.slice(indexOfFirst, indexOfLast);
  };

  const paginatePast = (pageNumber) => setPastPage(pageNumber);

  if (!allContestData) {
    return <p className="text-center text-gray-500 text-xl">No contests available.</p>;
  }

  return (
    <>
      <div className="bg-gray-800 text-white py-20">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-6xl mb-4" />
          <h1 className="text-4xl font-bold mb-2">Contests</h1>
          <p className="text-lg text-gray-300">Showcase your photography skills!</p>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <section className="mt-5 mb-12">
          <div className="bg-gray-100 text-gray-800 py-2 px-4 rounded-lg inline-block mb-6">
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
          <div className="bg-gray-100 text-gray-800 py-2 px-4 rounded-lg inline-block mb-6">
            <h2 className="text-2xl font-semibold">Past Contests</h2>
          </div>
          <div>
            {getPastContests().map((contest) => (
              <NavLink key={contest.id} to={`/contest/${contest.id}`} className="block mb-6">
                <Contest contest={contest} isCurrent={false} />
              </NavLink>
            ))}
          </div>
          <div className="mt-6">
            <Pagination
              contestsPerPage={contestsPerPage}
              totalContests={pastContests.length}
              paginate={paginatePast}
              currentPage={pastPage}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ContestPage;
