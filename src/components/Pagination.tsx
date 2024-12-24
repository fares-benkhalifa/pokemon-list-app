import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
<div className="pagination-items">
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
    <button
      id="previous-button"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded mr-4 disabled:bg-gray-300 disabled:opacity-50"
    >
      Previous
    </button>
    <span id="page-number" className="text-lg font-semibold text-gray-700">
      {`Page ${currentPage} of ${totalPages}`}
    </span>
    <button
      id="next-button"
      disabled={currentPage === totalPages || totalPages === 0}
      onClick={() => onPageChange(currentPage + 1)}
      className="px-4 py-2 bg-green-500 text-white font-semibold rounded ml-4 disabled:bg-gray-300 disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

);

export default Pagination;
