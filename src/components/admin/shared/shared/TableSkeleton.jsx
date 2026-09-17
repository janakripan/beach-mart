import React from "react";

const TableSkeleton = () => {
  // Create an array of 5 items to represent loading rows
  const skeletonRows = Array(5).fill(0);

  return (
    <div className="w-full overflow-hidden bg-white rounded-lg h-full   border-gray-200">
      <div className="animate-pulse">
        {/* Table header skeleton */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-6 px-6 py-3">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Table body skeleton rows */}
        <div className="divide-y divide-gray-200">
          {skeletonRows.map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-6 px-6 py-4 items-center"
            >
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-8 bg-gray-200 rounded"></div>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="flex pl-4">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
