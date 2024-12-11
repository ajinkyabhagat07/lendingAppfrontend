"use client";
import React from "react";

const Pagination = ({ page, setPage }) => {
  const totalPages = 3;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleNextPage = () => {
    const nextPage = page === totalPages ? 1 : page + 1;
    handlePageChange(nextPage);
  };

  const handlePreviousPage = () => {
    const prevPage = page === 1 ? totalPages : page - 1;
    handlePageChange(prevPage);
  };

  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-6 space-x-4">
      <ul className="inline-flex items-center">
        <li>
          <button
            className={`px-4 py-2 rounded-md font-medium transition bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handlePreviousPage}
            
          >
            Previous
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <li key={pageNumber} className="mx-1">
              <button
                className={`px-4 py-2 rounded-md font-medium transition ${
                  page === pageNumber
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-800 hover:bg-blue-400 hover:text-white"
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          )
        )}

        <li>
          <button
            className={"px-4 py-2 rounded-md font-medium  bg-blue-500 text-white hover:bg-blue-600"}
            onClick={handleNextPage}
          
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;