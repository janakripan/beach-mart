import ProductRow from "./ProductRow";
import { useState } from "react";

// Order Card Component
const OrderCard  = ({ order, isExpanded, toggleExpand, onStatusChange }) => {
  const productCount = order.products?.length || 0;
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Available status options
  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) return; // No change needed

    setIsUpdatingStatus(true);
    try {
      if (onStatusChange) {
        await onStatusChange(order.orderNo, newStatus);
      } else {
        console.error("No status change handler provided");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status Badge Component with dropdown
  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch ((status || "").toLowerCase()) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "delivered":
          return "bg-green-100 text-green-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="relative inline-block">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          disabled={isUpdatingStatus}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer border-0 outline-none ${getStatusColor(
            status
          )} ${
            isUpdatingStatus
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-80"
          }`}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isUpdatingStatus && (
          <div className="absolute -top-1 -right-1">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#F8FCF8] rounded-[12px] shadow-sm border border-[#E3F0E2] mb-4 overflow-hidden hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
      {/* Order Header */}
      <div
        className="flex items-center justify-between px-4 py-4 bg-white cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-4">
          <div className="font-medium">
            <span className="text-[#00380E] font-bold">Order #{order.orderNo}</span>
            <span className="ml-2 text-xs text-gray-500">
              ({formatDate(order.orderDate)})
            </span>
          </div>
          <StatusBadge status={order.status} />
          <div className="text-sm text-gray-500">
            {productCount} {productCount === 1 ? "Product" : "Products"}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="font-bold text-[#1A1A2E]">
              AED {(order.totalAmount || 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {order.paymentMethod !== "null"
                ? order.paymentMethod
                : "Pending payment"}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-[#1A1A2E] transition-transform ${
              isExpanded ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Order Details (Expanded) */}
      {isExpanded && (
        <div className="border-t border-[#E3F0E2]">
          {/* Customer Info */}
          <div className="px-4 py-3 bg-[#F8FCF8] border-b border-[#E3F0E2] flex justify-between">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Customer:
              </span>
              <span className="ml-2 text-sm text-[#1A1A2E] font-semibold">
                {order.customerName}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Mobile No:
              </span>
              <span className="ml-2 text-sm text-[#1A1A2E]">
                {order.mobileNo}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-gray-700">
                    {order.address}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="divide-y divide-gray-100">
            {order.products?.map((product, index) => (
              <ProductRow
                key={`${order.orderNo}-${index}`}
                product={product}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="px-4 py-3 bg-[#F8FCF8] border-t border-[#E3F0E2]">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span>Payment Method: </span>
                <span className="font-medium text-[#1A1A2E]">
                  {order.paymentMethod !== "null"
                    ? order.paymentMethod
                    : "Not specified"}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total Amount</div>
                <div className="text-lg font-bold text-[#1A1A2E]">
                  AED {(order.totalAmount || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Status Change Section */}
          <div
            className="px-4 py-3 bg-white border-t border-[#E3F0E2]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-[#1A1A2E]">
                  Update Status:
                </span>
                <StatusBadge status={order.status} />
              </div>
              {isUpdatingStatus && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Updating...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
