import React, { useState, useMemo } from "react";
import OrderFilter from "../../components/admin/shared/orders/OrderFilter";
import PageNavigation from "../../components/admin/shared/products/PageNavigation";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import OrderCard from "../../components/admin/shared/orders/OrderCard";
import { DUMMY_ORDERS } from "../../constants/dummyOrders";

const Orders = () => {
  const [orders, setOrders] = useState(DUMMY_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Basic filtering states to match UI
  const [statusFilter, setStatusFilter] = useState("");
  const [datePreset, setDatePreset] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderNo === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDatePreset("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Basic Search by customer name, mobile, or order no
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
          order.customerName.toLowerCase().includes(query) ||
          order.orderNo.toLowerCase().includes(query) ||
          order.mobileNo.includes(query);
        if (!matches) return false;
      }
      
      // Basic Status Filter
      if (statusFilter && order.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full flex-1 min-h-0 overflow-hidden gap-y-4 flex flex-col p-5">
      <div className="flex items-center gap-x-2 relative">
        <PageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search order by customer name or ID"
          viewToggle={null}
        />
        <OrderFilter
          filters={{
            orderId: {
              value: searchQuery,
              setValue: setSearchQuery
            },
            dateRange: {
              preset: datePreset,
              setPreset: setDatePreset,
              fromDate: fromDate,
              toDate: toDate,
              setFromDate: setFromDate,
              setToDate: setToDate,
            },
            status: {
              setValue: setStatusFilter,
              value: statusFilter,
            },
            clearAll: clearFilters,
          }}
        />
      </div>
      {/* Orders List */}
      <div className="space-y-4 flex-1 overflow-y-auto min-h-0 pb-4 pr-1">
        {paginatedOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No orders found.</div>
        ) : (
          paginatedOrders.map((order) => (
            <OrderCard
              key={order.orderNo}
              order={order}
              isExpanded={!!expandedOrders[order.orderNo]}
              toggleExpand={() => toggleOrderExpand(order.orderNo)}
              onStatusChange={handleOrderStatus}
            />
          ))
        )}
      </div>
      <PageNavigation
        currentPage={currentPage}
        data={{ hasMore: currentPage < totalPages }}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </div>
  );
};

export default Orders;

