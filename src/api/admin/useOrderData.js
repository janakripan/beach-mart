/**
 * This is custome hook for manage order data, filtering and operations
 *
 *
 */

import { useEffect, useState } from "react";
import { useGetOrders } from "../../api/admin/hooks";

export function useOrderData({ initialPage = 1, pageSize = 10 } = {}) {
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [processedOrder, setProcessedOrder] = useState([]);

  //filter state for order
  const [orderFilter, setOrderFilter] = useState("");
  const [fromDate, setFromDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);
  const [preset, setPreset] = useState("all");
  const [status, setSatatus] = useState(undefined);

  // API queries
  const {
    data: orderData,
    refetch,
    isLoading,
    isError,
  } = useGetOrders({
    isAdmin : true,
    pageNo: currentPage,
    pageSize,
    fromdate: fromDate || undefined,
    todate: toDate || undefined,
    email: searchQuery || undefined,
    orderID: orderFilter || undefined,
    orderStatus: status || undefined,
  });

  // Mutations
  const editOrderStatus = { mutateAsync: async () => {} };

  // Process products data
  useEffect(() => {
    if (!orderData) return;
    // Update total pages
    setTotalPages(orderData.totalPages || 1);
    setProcessedOrder(orderData);
  }, [orderData]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset to first page when search query changes
      if (currentPage !== 1 && searchQuery.trim() !== "") {
        setCurrentPage(1);
      } else {
        refetch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    currentPage,
    refetch,
    orderFilter,
    fromDate,
    toDate,
    preset,
    status,
  ]);

  /**
   * Function to handle pagination page change
   * @param {number} newPage - New page number
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  /**
   * Function to handle order filter change
   * @param {string} orderId - Order ID to filter by
   */
  const handleOrderFilter = (orderId) => {
    setOrderFilter(orderId);
  };

  /**
   * Function to clear all filters
   */
  const clearFilters = () => {
    setSearchQuery("");
    setOrderFilter("");
  };

  /**
   * Function to edit order status
   * @param {number} orderId -  id of the order
   * @param {string} orderStatus -  status of the order
   */
  const handleOrderStatus = async (orderId, orderStatus) => {
    const prevOrder = orderData;
    try {
      const filterd = orderData.orders.map((item) =>
        item.orderId === orderId ? { ...item, orderStatus: orderStatus } : item
      );
      setProcessedOrder({ ...orderData, orders: filterd });
      await editOrderStatus.mutateAsync({
        OrderId: orderId,
        OrderStatus: orderStatus,
      });
    } catch (error) {
      setProcessedOrder(prevOrder);
    }
  };

  // Return all the data and functions needed by components
  return {
    orders: processedOrder,
    // Pagination
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      handlePageChange,
    },

    // Search and filters
    filters: {
      search: {
        query: searchQuery,
        setQuery: setSearchQuery,
      },
      dateRange: {
        preset: preset,
        from: fromDate,
        to: toDate,
        setPreset: setPreset,
        setFrom: setFromDate,
        setTo: setToDate,
      },
      status: {
        value: status,
        setValue: setSatatus,
      },
      order: {
        value: orderFilter,
        setValue: handleOrderFilter,
      },

      clearAll: clearFilters,
    },
    // Status
    status: {
      isLoading,
      isError,
    },
    // Operations
    operations: {
      refetch,
      handleOrderStatus,
    },
  };
}
