import React from 'react';

const Pagination = ({ contestsPerPage, totalContests, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalContests / contestsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex list-none">
        {pageNumbers.map((number) => (
          <li key={number} className={`px-3 py-1 mx-1 rounded border-transparent ${currentPage === number ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
            <button className="border-none" onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
