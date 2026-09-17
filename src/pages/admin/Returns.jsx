import React, { useState } from "react";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import ReturnsFilter from "../../components/admin/shared/returns/RetunrsFilter";
import ReturnCard from "../../components/admin/shared/returns/ReturnCard";
import PageNavigation from "../../components/admin/shared/products/PageNavigation";
import { useReturnData } from "../../api/admin/useReturnData";

const Returns = () => {
  const {
    returns,   // now an object
    statusState: { isLoading, isError },
    pagination: { currentPage, pageSize, totalPages, handlePageChange },
    filters: {
      search: { query: searchQuery, setQuery: setSearchQuery },
      clearAll,
      dateRange,
      status,
      orderId,
    },
    operations: { handleReturnStatus },
  } = useReturnData({ initialPage: 1, pageSize: 6 });

  const [expandedReturns, setExpandedReturns] = useState({});

  const toggleReturnExpand = (ReturnId) => {
    setExpandedReturns((prev) => ({
      ...prev,
      [ReturnId]: !prev[ReturnId],
    }));
  };


  return (
    <div className="w-full h-full overflow-hidden gap-y-4 flex flex-col p-5">
      <div className="flex items-center gap-x-2 relative">
        <PageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search return by user name"
          viewToggle={null}
        />

        <ReturnsFilter
          filters={{
            orderId: orderId,
            dateRange: {
              preset: dateRange.preset,
              setPreset: dateRange.setPreset,
              fromDate: dateRange.from,
              toDate: dateRange.to,
              setFromDate: dateRange.setFrom,
              setToDate: dateRange.setTo,
            },
            status: {
              setValue: status.setValue,
              value: status.value,
            },
            clearAll: clearAll,
          }}
        />
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="flex justify-center items-center h-full text-gray-500">
          Loading returns...
        </div>
      )}

      {isError && (
        <div className="flex justify-center items-center h-full text-red-500">
          Failed to load returns.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Optional: Show total count */}
          <div className="text-sm text-gray-500 mb-2">
            Total Returns: {returns?.totalCount || 0}
          </div>

          {/* Returns List */}
          <div className="space-y-4 flex-1 overflow-y-auto">
            {returns?.returns?.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No returns found.
              </div>
            ) : (
              returns?.returns?.map((item) => (
                <ReturnCard
                  key={item.ReturnId}
                  returnItem={item}
                  isExpanded={!!expandedReturns[item.ReturnId]}
                  toggleExpand={() =>
                    toggleReturnExpand(item.ReturnId)
                  }
                  onStatusChange={handleReturnStatus}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <PageNavigation
              currentPage={currentPage}
              data={returns}
              setCurrentPage={handlePageChange}
              totalPages={totalPages}
              pageSize={pageSize}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Returns;
