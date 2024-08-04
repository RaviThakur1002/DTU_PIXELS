import { React, useState, useEffect } from 'react';
import Contest from './Contest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import Pagination from './Pagination';
import ContestServiceInstance from '../../../firebase/contestServices/ContestService';

const contestsPerPage = 3;

const ContestPage = () => {
  const [currentContests, setCurrentContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [pastPage, setPastPage] = useState(1);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const contests = await ContestServiceInstance.getAllContests();
        const now = new Date();

        const current = contests.filter(contest => new Date(contest.contestEndDate + ' ' + contest.contestEndTime) >= now);
        const past = contests.filter(contest => new Date(contest.contestEndDate + ' ' + contest.contestEndTime) < now);


        setCurrentContests(current);
        setPastContests(past);
      } catch (error) {
        console.error('Error fetching contests: ', error);
      }
    };
    fetchContests();
  }, []);


  const getPastContests = () => {
    const indexOfLast = pastPage * contestsPerPage;
    const indexOfFirst = indexOfLast - contestsPerPage;
    return pastContests.slice(indexOfFirst, indexOfLast);
  };


  const paginatePast = (pageNumber) => setPastPage(pageNumber);


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
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Current/Upcoming Contests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentContests.map((contest, index) => (
              <Contest key={index} contest={contest} isCurrent={true} />
            ))}
          </div>
        </section>


        <section>
          <h2 className="text-2xl font-semibold mb-6">Past Contests</h2>
          <div>
            {getPastContests().map((contest, index) => (
              <Contest key={index} contest={contest} isCurrent={false} />
            ))}
          </div>
          <Pagination
            contestsPerPage={contestsPerPage}
            totalContests={pastContests.length}
            paginate={paginatePast}
            currentPage={pastPage}
          />
        </section>
      </div>
    </>
  );
};

export default ContestPage;
