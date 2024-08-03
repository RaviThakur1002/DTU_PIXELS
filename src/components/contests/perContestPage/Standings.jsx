import { getDatabase, ref, get } from 'firebase/database';
import React, { useEffect, useState } from 'react';

function Standings({ contestId }) {
  const [submissions, setSubmissions] = useState([]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Contest Standings</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/3 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="w-1/3 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="w-1/3 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((submission, index) => (
              <tr key={submission.submissionId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="w-1/3 px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${getRankStyle(index)}`}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="w-1/3 px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900">{submission.userName}</div>
                </td>
                <td className="w-1/3 px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900">{submission.voteCount}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {submissions.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No submissions found.</p>
      )}
    </div>
  );
}

function getRankStyle(index) {
  switch (index) {
    case 0:
      return 'bg-yellow-400 text-white font-bold';
    case 1:
      return 'bg-gray-300 text-gray-800 font-bold';
    case 2:
      return 'bg-yellow-600 text-white font-bold';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default Standings;
