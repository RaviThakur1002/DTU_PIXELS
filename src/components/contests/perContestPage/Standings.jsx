import { getDatabase, ref, get } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import Pagination from '../../Utilities/Pagination';

function Standings({ contestId }) {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); 

  useEffect(() => {
    const fetchSubmissions = async () => {
      const db = getDatabase();
      const contestRef = ref(db, `contests/${contestId}/entries`);
      const snapshot = await get(contestRef);
      if (snapshot.exists()) {
        const submissionsData = snapshot.val();
        const sortedSubmissions = Object.entries(submissionsData)
          .map(([submissionId, data]) => ({ submissionId, ...data }))
          .sort((a, b) => b.voteCount - a.voteCount);
        setSubmissions(sortedSubmissions);
      } else {
        console.log('No submissions found');
      }
    };
    fetchSubmissions();
  }, [contestId]);

  // Get current submissions
  const indexOfLastSubmission = currentPage * postsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - postsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-[#000000] via-[#171717] to-[#2c2c2e] text-white">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text">Contest Standings</h2>
      <div className="overflow-x-auto bg-[#171717] rounded-lg shadow">
        <table className="min-w-full table-fixed">
          <thead className="bg-[#2c2c2e]">
            <tr>
              <th className="w-1/3 px-6 py-3 text-center text-xs font-medium text-[#cba6f7] uppercase tracking-wider">Rank</th>
              <th className="w-1/3 px-6 py-3 text-center text-xs font-medium text-[#cba6f7] uppercase tracking-wider">User</th>
              <th className="w-1/3 px-6 py-3 text-center text-xs font-medium text-[#cba6f7] uppercase tracking-wider">Likes</th>
            </tr>
          </thead>
         <tbody className="divide-y divide-[#2c2c2e]">
            {currentSubmissions.map((submission, index) => (
              <tr key={submission.submissionId} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                <td className="w-1/3 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${getRankStyle(indexOfFirstSubmission + index)}`}>
                      {indexOfFirstSubmission + index + 1}
                    </span>
                  </div>
                </td>
                <td className="w-1/3 px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-300">{submission.userName}</div>
                </td>
                <td className="w-1/3 px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-300">{submission.voteCount}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
{submissions.length === 0 && (
        <p className="text-center text-[#cba6f7] mt-4">No submissions found.</p>
      )}
      
      {submissions.length > postsPerPage && (
        <Pagination
          totalPosts={submissions.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}

function getRankStyle(index) {
  switch (index) {
    case 0:
      return 'bg-[#b00bef] text-white font-bold';
    case 1:
      return 'bg-[#c638ab] text-white font-bold';
    case 2:
      return 'bg-[#6528d7] text-white font-bold';
    default:
      return 'bg-[#2c2c2e] text-gray-300';
  }
}

export default Standings;

