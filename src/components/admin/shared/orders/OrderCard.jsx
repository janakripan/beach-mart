import ProductRow from "./ProductRow";
import { useState } from "react";

// Order Card Component
const OrderCard  = ({ order, isExpanded, toggleExpand, onStatusChange }) => {
  const productCount = order.orderDetails.length;
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Available status options
  const statusOptions = [
    { value: "ordered", label: "Ordered", color: "bg-blue-100 text-blue-800" },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
    },
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
    if (newStatus === order.orderStatus) return; // No change needed

    setIsUpdatingStatus(true);
    try {
      // Use the onStatusChange prop if provided, otherwise fallback to direct API call
      if (onStatusChange) {
        await onStatusChange(order.orderId, newStatus);
      } else {
        console.error("No status change handler provided");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      // You could add a toast notification here
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
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
      switch (status.toLowerCase()) {
        case "ordered":
          return "bg-blue-100 text-blue-800";
        case "shipped":
          return "bg-purple-100 text-purple-800";
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Order Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-4">
          <div className="font-medium">
            <span className="text-gray-900">Order #{order.orderId}</span>
            <span className="ml-2 text-xs text-gray-500">
              ({formatDate(order.orderDate)})
            </span>
          </div>
          <StatusBadge status={order.orderStatus} />
          <div className="text-sm text-gray-500">
            {productCount} {productCount === 1 ? "Product" : "Products"}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="font-medium text-gray-900">
              AED {order.orderAmount.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {order.paymentMode !== "null"
                ? order.paymentMode
                : "Pending payment"}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
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
        <div className="border-t border-gray-200">
          {/* Customer Info */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Customer:
                </span>
                <span className="ml-2 text-sm text-gray-900">
                  {order.userName}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  (ID: {order.userId})
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Transaction ID:
                </span>
                <span className="ml-2 text-sm text-gray-900">
                  {order.transactionId}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
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
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-gray-700">
                    {(() => {
                      try {
                        const addressData = JSON.parse(order.shippingAddress);
                        return (
                          <div className="space-y-1">
                            <div className="font-medium">
                              {addressData.UserName}
                            </div>
                            <div>{addressData.Address}</div>
                            <div>{addressData.District}</div>
                            <div>
                              {addressData.City} - {addressData.PinCode}
                            </div>
                            <div className="text-gray-600">
                              {addressData.PhoneNumber}
                            </div>
                            {addressData.LandMark && (
                              <div className="text-gray-600">
                                Landmark: {addressData.LandMark}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Label: {addressData.AddressLabel}
                            </div>
                          </div>
                        );
                      } catch (error) {
                        return (
                          <div className="text-gray-600">
                            <div className="font-medium">Address:</div>
                            <div className="text-sm">
                              {order.shippingAddress}
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
          {
            order.addresd_Data && (
              <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
                <div className="flex items-start">
                  <div className="shrink-0">
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
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-700">
                      {order.addresd_Data}
                    </div>
                  </div>
                  </div>
                </div>
              )
          }
          {/* Products List */}
          <div className="divide-y divide-gray-100">
            {order.orderDetails.map((product, index) => (
              <ProductRow
                key={`${order.orderId}-${product.productId}-${index}`}
                product={product}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span>Payment Method: </span>
                <span className="font-medium text-gray-700">
                  {order.paymentMode !== "null"
                    ? order.paymentMode
                    : "Not specified"}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total Amount</div>
                <div className="text-lg font-medium text-gray-900">
                  AED {order.orderAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Status Change Section */}
          <div
            className="px-4 py-3 bg-white border-t border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  Update Status:
                </span>
                <StatusBadge status={order.orderStatus} />
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
