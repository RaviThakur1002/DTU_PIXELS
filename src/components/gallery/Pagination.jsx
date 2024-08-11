import React from "react";

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const maxVisibleButtons = 5;

  const getPageNumbers = () => {
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center mt-8">
      <ul className="flex items-center space-x-2">
        <li>
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &laquo;
          </button>
        </li>
        {pageNumbers[0] > 1 && (
          <>
            <li>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                1
              </button>
            </li>
            {pageNumbers[0] > 2 && <li className="text-gray-500">...</li>}
          </>
        )}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-2 rounded-md ${
                currentPage === number
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <li className="text-gray-500">...</li>}
            <li>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        <li>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
