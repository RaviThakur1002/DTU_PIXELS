import React from 'react';

const Contest = ({ contest, isCurrent }) => {
  if (isCurrent) {
    return (
      <div className="bg-blue-100 rounded-lg shadow-md overflow-hidden">
        <img src={contest.photo} alt="Contest" className="h-48 w-full object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{contest.theme}</h3>
          <p className="text-sm mb-1">Registration End: {contest.registrationEndDate} {contest.registrationEndTime}</p>
          <p className="text-sm mb-1">Contest Start: {contest.contestStartDate} {contest.contestStartTime}</p>
          <p className="text-sm">Contest End: {contest.contestEndDate} {contest.contestEndTime}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center border p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
        <img src={contest.photo} alt="Contest" className="w-24 h-24 mr-4 rounded object-cover" />
        <div>
          <h3 className="text-lg font-bold">{contest.theme}</h3>
          <p className="text-sm">Registration End: {contest.registrationEndDate} {contest.registrationEndTime}</p>
          <p className="text-sm">Contest Start: {contest.contestStartDate} {contest.contestStartTime}</p>
          <p className="text-sm">Contest End: {contest.contestEndDate} {contest.contestEndTime}</p>
        </div>
      </div>
    );
  }
};

export default Contest;
