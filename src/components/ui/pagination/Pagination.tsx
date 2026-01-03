'use client'

import React from 'react';
import LeftArrow from './icons/LeftArrow';
import RightArrow from './icons/RightArrow';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  showFirstLast?: boolean;
  className?: string;
};

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  showPageInfo = true,
  showFirstLast = true,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = (): React.ReactElement[] => {
    const pages: React.ReactElement[] = [];
    const maxVisiblePages = 5;

    // Calculate the range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const createPageButton = (pageNum: number, isActive: boolean = false) => (
      <button
        key={pageNum}
        onClick={() => onPageChange(pageNum)}
        className={`
          min-w-[40px] h-[40px] px-3 rounded-lg
          flex items-center justify-center
          transition-all duration-200
          ${isActive 
            ? 'bg-primary text-white font-medium' 
            : 'hover:bg-primary/10 text-gray-600 hover:text-primary'
          }
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        {pageNum}
      </button>
    );

    const createEllipsis = (key: string) => (
      <span 
        key={key}
        className="min-w-[40px] h-[40px] flex items-center justify-center text-gray-500"
      >
        ...
      </span>
    );

    // First page
    if (showFirstLast && startPage > 1) {
      pages.push(createPageButton(1));
      if (startPage > 2) {
        pages.push(createEllipsis('start-ellipsis'));
      }
    }

    // Main page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(createPageButton(i, i === currentPage));
    }

    // Last page
    if (showFirstLast && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(createEllipsis('end-ellipsis'));
      }
      pages.push(createPageButton(totalPages));
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        className={`
          min-w-[40px] h-[40px] rounded-lg
          flex items-center justify-center
          transition-all duration-200
          ${isPreviousDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-primary/10 text-gray-600 hover:text-primary'
          }
        `}
        aria-label="Previous Page"
      >
        <LeftArrow className={`w-5 h-5 ${!isPreviousDisabled && 'group-hover:stroke-primary'}`} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {renderPageNumbers()}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`
          min-w-[40px] h-[40px] rounded-lg
          flex items-center justify-center
          transition-all duration-200
          ${isNextDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-primary/10 text-gray-600 hover:text-primary'
          }
        `}
        aria-label="Next Page"
      >
        <RightArrow className={`w-5 h-5 ${!isNextDisabled && 'group-hover:stroke-primary'}`} />
      </button>
    </div>
  );
};

export default Pagination;
