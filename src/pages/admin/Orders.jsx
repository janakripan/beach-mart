import React, { useState } from "react";
import OrderFilter from "../../components/admin/shared/orders/OrderFilter";
import PageNavigation from "../../components/admin/shared/products/PageNavigation";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import { useOrderData } from "../../api/admin/useOrderData";
import OrderCard from "../../components/admin/shared/orders/OrderCard";


const Orders = () => {
  const {
    orders,
    status: { isLoading, isError },
    pagination: { currentPage, pageSize, totalPages, handlePageChange },
    filters: {
      search: { query: searchQuery, setQuery: setSearchQuery },
      clearAll: clearFilters,
      dateRange,
      status,
      order,
    },
    operations: { refetch, handleOrderStatus },
  } = useOrderData({ initialPage: 1, pageSize: 10 });

  const [expandedOrders, setExpandedOrders] = useState({});
  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };
  
  return (
    <div className="w-full h-full overflow-hidden gap-y-4 flex flex-col p-5">
      <div className="flex items-center gap-x-2 relative">
        <PageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search order by user email"
          viewToggle={null}
        />
        <OrderFilter
          filters={{
            orderId: order,
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
            clearAll: clearFilters,
          }}
        />
      </div>
      {/* Orders List */}
      <div className="space-y-4 h-full overflow-y-auto">
        {orders?.orders?.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            isExpanded={!!expandedOrders[order.orderId]}
            toggleExpand={() => toggleOrderExpand(order.orderId)}
            onStatusChange={handleOrderStatus}
          />
        ))}
      </div>
      <PageNavigation
        currentPage={currentPage}
        data={orders}
        setCurrentPage={handlePageChange}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </div>
  );
};

export default Orders;
