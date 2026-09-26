import React, { useState, useMemo } from "react";
import OrderFilter from "../../components/admin/shared/orders/OrderFilter";
import PageNavigation from "../../components/admin/shared/products/PageNavigation";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import OrderCard from "../../components/admin/shared/orders/OrderCard";
import ConfirmModal from "../../components/admin/shared/shared/ConfirmModal";
import { useGetOrders } from "../../api/admin/hooks";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Basic filtering states to match UI
  const getTodayDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const [statusFilter, setStatusFilter] = useState("");
  const [datePreset, setDatePreset] = useState("today");
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    const date = new Date();
    let start = getTodayDate();
    let end = getTodayDate();
    
    if (preset === "yesterday") {
      date.setDate(date.getDate() - 1);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      start = date.toISOString().split("T")[0];
      end = start;
    } else if (preset === "lastWeek") {
      const startD = new Date(date);
      startD.setDate(date.getDate() - 7);
      startD.setMinutes(startD.getMinutes() - startD.getTimezoneOffset());
      start = startD.toISOString().split("T")[0];
    } else if (preset === "lastMonth") {
      const startD = new Date(date);
      startD.setMonth(date.getMonth() - 1);
      startD.setMinutes(startD.getMinutes() - startD.getTimezoneOffset());
      start = startD.toISOString().split("T")[0];
    } else if (preset === "lastYear") {
      const startD = new Date(date);
      startD.setFullYear(date.getFullYear() - 1);
      startD.setMinutes(startD.getMinutes() - startD.getTimezoneOffset());
      start = startD.toISOString().split("T")[0];
    }
    
    setFromDate(start);
    setToDate(end);
  };

  const [expandedOrders, setExpandedOrders] = useState({});

  const { data: orderData = { orders: [], totalPages: 1 }, isLoading } = useGetOrders({
    pageNo: currentPage,
    pageSize,
    orderStatus: statusFilter || null,
    fromdate: fromDate || null,
    todate: toDate || null,
    // Note: The UI has a generic search which could be ID or email. 
    // If it's an email format, we could pass it to email, otherwise to orderID.
    // For now we'll filter locally for the search term if needed, or pass it to orderID.
  });
  console.log(orderData);
  

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    isDestructive: false,
  });

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleOrderStatus = (orderId, newStatus) => {
    // API integration needed for status update
    console.log("Update status", orderId, newStatus);
  };

  const handleEditOrder = (order) => {
    setConfirmModal({
      isOpen: true,
      title: "Edit Order",
      message: `Are you sure you want to edit order #${order.orderID || order.orderNo}?`,
      isDestructive: false,
      onConfirm: () => {
        // API integration needed for edit
        console.log("Edit order", order.orderID || order.orderNo);
      }
    });
  };

  const handleDeleteOrder = (order) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Order",
      message: `Are you sure you want to completely delete order #${order.orderID || order.orderNo}? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        // API integration needed for delete
        console.log("Delete order", order.orderID || order.orderNo);
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDatePreset("today");
    setFromDate(getTodayDate());
    setToDate(getTodayDate());
    setCurrentPage(1);
  };

  const rawOrders = orderData.orders || [];

  // Filter orders (client-side for searchQuery since the API expects exact orderID or email)
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return rawOrders;
    
    return rawOrders.filter((order) => {
      const query = searchQuery.toLowerCase();
      // Fallbacks in case API returns different property names (e.g., CustomerName, OrderNo)
      const customerName = order.customerName || order.CustomerName || "";
      const orderNo = order.orderNo || order.OrderNo || order.OrderID || "";
      const mobileNo = order.mobileNo || order.MobileNo || "";

      return customerName.toLowerCase().includes(query) ||
             String(orderNo).toLowerCase().includes(query) ||
             String(mobileNo).includes(query);
    });
  }, [rawOrders, searchQuery]);

  // Pagination from API
  const totalPages = orderData.totalPages;
  
  // Since pagination is server-side, filteredOrders should already be the paginated set
  // However, because we are doing client-side searchQuery, we might need to be careful.
  const paginatedOrders = filteredOrders;

  return (
    <div className="w-full flex-1 min-h-0 overflow-hidden gap-y-4 flex flex-col p-5">
      <div className="flex items-center gap-x-2 relative">
        <PageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search order by customer name or ID"
          viewToggle={null}
        >
          {datePreset !== 'today' && (
             <button 
                onClick={() => handleDatePresetChange('today')} 
                className="text-sm px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer transition-colors font-medium mr-2"
             >
               Reset Date Filter
             </button>
          )}

          <div className="flex items-center gap-2">
            <input 
               type="date" 
               className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white text-gray-700"
               value={fromDate}
               onChange={(e) => {
                 setFromDate(e.target.value);
                 setToDate(e.target.value);
                 setDatePreset("custom");
               }} 
            />
            
            <select 
              value={datePreset} 
              onChange={(e) => handleDatePresetChange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white text-gray-700 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastYear">Last Year</option>
              <option value="custom" disabled hidden>Custom</option>
            </select>
          </div>
        </PageHeader>
        <OrderFilter
          filters={{
            orderId: {
              value: searchQuery,
              setValue: setSearchQuery
            },
            dateRange: { // Keep dummy dateRange to avoid crashing OrderFilter
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
          paginatedOrders.map((order) => {
            // Map the API response to what OrderCard expects if needed
            const products = (order.items || order.orderDetails || order.products || []).map(p => ({
              ...p,
              count: p.qty || p.count || 1
            }));

            const mappedOrder = {
              ...order,
              orderNo: order.orderID || order.orderNo,
              address: order.customerAddress || order.address,
              status: order.orderStatus || order.status || "pending",
              totalAmount: order.totalAmount || order.TotalAmount || 0,
              orderDate: order.orderDate || order.createdDate || order.date,
              paymentMethod: order.paymentMode || order.paymentMethod,
              serviceType: order.serviceType,
              products: products,
            };
            
            return (
              <OrderCard
                key={mappedOrder.orderNo}
                order={mappedOrder}
                isExpanded={!!expandedOrders[mappedOrder.orderNo]}
                toggleExpand={() => toggleOrderExpand(mappedOrder.orderNo)}
                onStatusChange={handleOrderStatus}
                onEdit={handleEditOrder}
                onDelete={handleDeleteOrder}
              />
            );
          })
        )}
      </div>
      <PageNavigation
        currentPage={currentPage}
        data={{ hasMore: currentPage < totalPages }}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
      />
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        isDestructive={confirmModal.isDestructive}
      />
    </div>
  );
};

export default Orders;

