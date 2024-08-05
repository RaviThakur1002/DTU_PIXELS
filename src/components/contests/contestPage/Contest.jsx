import React from 'react';

const abstractPhoto = "https://img.freepik.com/free-vector/abstract-organic-shapes-background_23-2148411563.jpg?t=st=1722842944~exp=1722846544~hmac=91b999eca448da7f4130c2c892a8c3ed8c2e600ca543ea89077cd33f1a40593f&w=996";

const Contest = ({ contest, isCurrent }) => {
  return (
    <div className={`relative ${isCurrent ? 'bg-gray-100' : 'bg-gray-100'} rounded-lg shadow-md overflow-hidden ${isCurrent ? '' : 'mb-6'}`}>
      <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-br">
        #{contest.id}
      </div>
      <img src={abstractPhoto} alt="Contest" className={`${isCurrent ? 'h-48 w-full' : 'w-24 h-24 float-left mr-4'} object-cover`} />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{contest.theme}</h3>
        {isCurrent ? (
          <>
            <p className="text-sm mb-1">Registration End: {contest.registrationEndDate} {contest.registrationEndTime}</p>
            <p className="text-sm mb-1">Contest Start: {contest.contestStartDate} {contest.contestStartTime}</p>
            <p className="text-sm">Contest End: {contest.contestEndDate} {contest.contestEndTime}</p>
          </>
        ) : (
          <p className="text-sm">Contest Ended: {contest.contestEndDate} {contest.contestEndTime}</p>
        )}
      </div>
    </div>
  );
};

export default Contest;