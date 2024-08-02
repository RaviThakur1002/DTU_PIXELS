import { React, useState, useEffect } from 'react';
import Contest from './Contest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import Pagination from './Pagination';

const contestsPerPage = 3;


const ContestPage = () => {
  const [currentContests, setCurrentContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [pastPage, setPastPage] = useState(1);

  useEffect(() => {
    const data = [
      {
        registrationEndDate: '2023-08-01',
        registrationEndTime: '23:59',
        contestStartDate: '2023-08-05',
        contestStartTime: '10:00',
        contestEndDate: '2023-08-10',
        contestEndTime: '18:00',
        theme: 'Nature Photography',
        photo: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        registrationEndDate: '2023-09-01',
        registrationEndTime: '23:59',
        contestStartDate: '2023-09-05',
        contestStartTime: '10:00',
        contestEndDate: '2023-09-10',
        contestEndTime: '18:00',
        theme: 'Wildlife Photography',
        photo: 'https://images.pexels.com/photos/459449/pexels-photo-459449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        registrationEndDate: '2023-10-01',
        registrationEndTime: '23:59',
        contestStartDate: '2023-10-05',
        contestStartTime: '10:00',
        contestEndDate: '2023-10-10',
        contestEndTime: '18:00',
        theme: 'Urban Photography',
        photo: 'https://images.pexels.com/photos/3584283/pexels-photo-3584283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        registrationEndDate: '2023-11-01',
        registrationEndTime: '23:59',
        contestStartDate: '2023-11-05',
        contestStartTime: '10:00',
        contestEndDate: '2023-11-10',
        contestEndTime: '18:00',
        theme: 'Portrait Photography',
        photo: 'https://images.pexels.com/photos/5648107/pexels-photo-5648107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        registrationEndDate: '2024-12-01',
        registrationEndTime: '23:59',
        contestStartDate: '2024-12-05',
        contestStartTime: '10:00',
        contestEndDate: '2024-12-10',
        contestEndTime: '18:00',
        theme: 'Astrophotography',
        photo: 'https://images.pexels.com/photos/365633/pexels-photo-365633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      // Add more sample data as needed
    ];

    const now = new Date();
    const current = data.filter(contest => new Date(contest.contestEndDate) >= now);
    const past = data.filter(contest => new Date(contest.contestEndDate) < now);

    setCurrentContests(current);
    setPastContests(past);
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