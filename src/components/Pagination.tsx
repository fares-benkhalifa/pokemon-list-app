import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center mt-4">
    <button
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      className="px-4 py-2 bg-gray-200 rounded mr-2 disabled:opacity-50"
    >
      Previous
    </button>
    <span>{`Page ${currentPage} of ${totalPages}`}</span>
    <button
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      className="px-4 py-2 bg-gray-200 rounded ml-2 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default Pagination;
