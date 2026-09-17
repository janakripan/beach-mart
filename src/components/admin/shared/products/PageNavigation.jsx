import React from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";

const PageNavigation = ({
  currentPage,
  totalPages,
  setCurrentPage,
  data,
  pageSize,
}) => {
  // Handle page changes
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 3;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-2 py-1 mx-1 cursor-pointer border ${
            currentPage === i
              ? "border-gray-300  bg-gray-100"
              : "border-transparent hover:border-gray-300"
          } rounded-sm`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  // Calculate display counts
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, data?.totalCount || 0);
  const totalItems = data?.totalCount || 0;
  return (
    <section className="flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center gap-x-2 font-medium">
        <span className="font-normal">Displaying </span>
        {startItem}-{endItem}
        <span className="font-normal">Out of </span>
        {totalItems}
      </div>
      <div className="flex items-center justify-end">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`flex items-center gap-x-1 ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "cursor-pointer group"
          }`}
        >
          <MdKeyboardArrowLeft className="text-lg" />
          <span className={currentPage !== 1 ? "group-hover:underline" : ""}>
            Previous
          </span>
        </button>
        <div className="mx-2">{renderPaginationButtons()}</div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-x-1 ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "cursor-pointer group"
          }`}
        >
          <span
            className={
              currentPage !== totalPages ? "group-hover:underline" : ""
            }
          >
            Next
          </span>
          <MdKeyboardArrowLeft className="text-lg rotate-180" />
        </button>
      </div>
    </section>
  );
};

export default PageNavigation;
