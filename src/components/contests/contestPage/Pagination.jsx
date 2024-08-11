import React from "react";

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  const maxVisibleButtons = 3;
  const pageNumbers = [];

  if (pages.length <= maxVisibleButtons) {
    pageNumbers.push(...pages);
  } else {
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(pages.length, startPage + maxVisibleButtons - 1);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < pages.length) {
      if (endPage < pages.length - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(pages.length);
    }
  }

  return (
    <div className="pagination">
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return <span key={index} className="ellipsis">...</span>;
        }
        return (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className={page == currentPage ? "active" : ""}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;