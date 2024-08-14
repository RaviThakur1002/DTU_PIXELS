import React from 'react';

const abstractPhoto = "https://mrwallpaper.com/images/hd/black-and-purple-aesthetic-abstract-art-br99a45xe2krqtdu.jpg";

const Contest = ({ contest, isCurrent }) => {
  return (
    <div className={`relative ${isCurrent ? 'bg-[#000000]' : 'bg-[#000000]'} rounded-lg shadow-md overflow-hidden ${isCurrent ? '' : 'mb-6'} transition-all duration-300 hover:shadow-lg hover:scale-105`}>
      <div className="absolute top-0 left-0 bg-[#b00bef] text-white px-2 py-1 rounded-br font-semibold">
        #{contest.id}
      </div>
      <img src={abstractPhoto} alt="Contest" className={`${isCurrent ? 'h-48 w-full' : 'w-24 h-24 float-left mr-4'} object-cover`} />
      <div className="p-4 text-gray-200">
        <h3 className="text-lg font-bold mb-2 text-[#cba6f7]">{contest.theme}</h3>
        {isCurrent ? (
          <>
            <p className="text-sm mb-1 text-gray-300">Registration End: <span className="text-[#a9a9ff]">{contest.registrationEndDate} {contest.registrationEndTime}</span></p>
            <p className="text-sm mb-1 text-gray-300">Contest Start: <span className="text-[#a9a9ff]">{contest.contestStartDate} {contest.contestStartTime}</span></p>
            <p className="text-sm text-gray-300">Contest End: <span className="text-[#a9a9ff]">{contest.contestEndDate} {contest.contestEndTime}</span></p>
          </>
        ) : (
          <p className="text-sm text-gray-300">Contest Ended: <span className="text-[#a9a9ff]">{contest.contestEndDate} {contest.contestEndTime}</span></p>
        )}
      </div>
    </div>
  );
};

export default Contest;
