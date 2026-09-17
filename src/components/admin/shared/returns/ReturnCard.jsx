import { useState } from "react";

const ReturnCard = ({
  returnItem,
  isExpanded,
  toggleExpand,
  onStatusChange,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === returnItem.ReturnStatus) return;

    setIsUpdatingStatus(true);

    try {
      if (onStatusChange) {
        await onStatusChange(returnItem.ReturnId, newStatus);
      }
    } catch (error) {
      console.error("Failed to update return status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "marked":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-4">
          <div className="font-medium text-gray-900">
            Return #{returnItem.ReturnId}
            <span className="ml-2 text-xs text-gray-500">
              ({formatDate(returnItem.ReturnDate)})
            </span>
          </div>

          {/* Status Dropdown */}
          <select
            value={returnItem.ReturnStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            disabled={isUpdatingStatus}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border-0 outline-none cursor-pointer ${getStatusColor(
              returnItem.ReturnStatus,
            )}`}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right">
          <div className="font-medium text-gray-900">
            AED {returnItem.ReturnAmount.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">{returnItem.PickupOption}</div>
        </div>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-4 py-4 space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-500">Customer:</span>{" "}
            {returnItem.UserName} (ID: {returnItem.UserId})
          </div>

          <div>
            <span className="font-medium text-gray-500">Product:</span>{" "}
            {returnItem.ProductName}
          </div>

          <div>
            <span className="font-medium text-gray-500">Reason:</span>{" "}
            {returnItem.Reason}
          </div>

          <div>
            <span className="font-medium text-gray-500">Sealed Status:</span>{" "}
            {returnItem.SealedStatus}
          </div>

          <div>
            <span className="font-medium text-gray-500">Created At:</span>{" "}
            {formatDate(returnItem.CreatedAt)}
          </div>

          {returnItem.UpdatedAt && (
            <div>
              <span className="font-medium text-gray-500">Updated At:</span>{" "}
              {formatDate(returnItem.UpdatedAt)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnCard;
