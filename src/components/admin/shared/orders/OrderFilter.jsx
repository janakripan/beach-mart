import React, { useEffect, useRef, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { MdOutlineNumbers } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { ChevronDown } from "lucide-react";
import { FiPackage } from "react-icons/fi"; // Added for status icon
import { MdDeleteOutline } from "react-icons/md";
import { DATE_PRESET, STATUS_OPTIONS } from "../constant";

const OrderFilter = ({
  searchQuery,
  filters = {
    orderId: { value: "", setValue: () => {} },
    dateRange: {
      preset: "all",
      setPreset: () => {},
      fromDate: "",
      toDate: "",
      setFromDate: () => {},
      setToDate: () => {},
    },
    status: { value: "", setValue: () => {} },
    clearAll: () => {},
  },
}) => {
  // Filter visibility state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orderId");

  // Search states for order ID
  const [orderIdSearch, setOrderIdSearch] = useState(
    filters.orderId.value || ""
  );

  // Status filter state
  const [statusFilter, setStatusFilter] = useState(filters.status.value || "");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Date range states - maintain local state until "Apply" is clicked
  const [datePreset, setDatePreset] = useState(
    filters.dateRange.preset || "all"
  );
  const [fromDate, setFromDate] = useState(filters.dateRange.fromDate || "");
  const [toDate, setToDate] = useState(filters.dateRange.toDate || "");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Track if a filter is active
  const isFilterActive =
    filters.orderId.value ||
    filters.status.value || // Added status to filter active check
    filters.dateRange.preset !== "all" ||
    filters.dateRange.fromDate ||
    filters.dateRange.toDate ||
    searchQuery?.length > 0;

  // References for detecting clicks outside
  const filterRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Calculate date ranges based on preset selection
  const calculateDateRange = (preset) => {
    const today = new Date();
    let fromDate = "";
    let toDate = "";

    switch (preset) {
      case "last30days":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 30);
        toDate = today;
        break;

      case "thisMonth":
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "lastMonth":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case "thisQuarter":
        const currentQuarter = Math.floor(today.getMonth() / 3);
        fromDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
        toDate = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0);
        break;

      case "lastQuarter":
        const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
        const lastQuarterYear =
          lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
        const adjustedLastQuarter = lastQuarter < 0 ? 3 : lastQuarter;
        fromDate = new Date(lastQuarterYear, adjustedLastQuarter * 3, 1);
        toDate = new Date(lastQuarterYear, (adjustedLastQuarter + 1) * 3, 0);
        break;

      case "twoQuartersAgo":
        const twoQuartersAgo = Math.floor(today.getMonth() / 3) - 2;
        const twoQuartersAgoYear =
          twoQuartersAgo < 0 ? today.getFullYear() - 1 : today.getFullYear();
        const adjustedTwoQuartersAgo =
          twoQuartersAgo < 0 ? 4 + twoQuartersAgo : twoQuartersAgo;
        fromDate = new Date(twoQuartersAgoYear, adjustedTwoQuartersAgo * 3, 1);
        toDate = new Date(
          twoQuartersAgoYear,
          (adjustedTwoQuartersAgo + 1) * 3,
          0
        );
        break;

      case "thisYear":
        fromDate = new Date(today.getFullYear(), 0, 1);
        toDate = new Date(today.getFullYear(), 11, 31);
        break;

      case "lastYear":
        fromDate = new Date(today.getFullYear() - 1, 0, 1);
        toDate = new Date(today.getFullYear() - 1, 11, 31);
        break;

      case "all":
      default:
        fromDate = "";
        toDate = "";
        break;
    }

    // Format dates to YYYY-MM-DD string
    const formatDate = (date) => {
      if (!date) return "";
      return date.toISOString().split("T")[0];
    };

    return {
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
    };
  };

  // Handle date preset change - only update local state
  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    setIsDateDropdownOpen(false);

    if (preset === "custom") {
      // For custom range, don't automatically set dates
      return;
    }

    const { fromDate: calculatedFromDate, toDate: calculatedToDate } =
      calculateDateRange(preset);

    // Update only local state
    setFromDate(calculatedFromDate);
    setToDate(calculatedToDate);
  };

  // Handle status change
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setIsStatusDropdownOpen(false);
  };

  // Handle applying filters - this is where parent state is updated
  const handleApplyFilters = () => {
    // Update order ID filter
    if (filters.orderId.setValue) {
      filters.orderId.setValue(orderIdSearch);
    }

    // Update status filter
    if (filters.status.setValue) {
      filters.status.setValue(statusFilter);
    }

    // Update date range filters - only now update parent state
    if (filters.dateRange.setPreset) {
      filters.dateRange.setPreset(datePreset);
    }

    // Always update date values when applying filters
    if (filters.dateRange.setFromDate) {
      filters.dateRange.setFromDate(fromDate);
    }

    if (filters.dateRange.setToDate) {
      filters.dateRange.setToDate(toDate);
    }

    setIsFilterOpen(false);
  };

  // Handle resetting filters
  const handleResetFilters = () => {
    // Reset local state
    setOrderIdSearch("");
    setStatusFilter("");
    setDatePreset("all");
    setFromDate("");
    setToDate("");

    // Only call parent's clearAll when Apply is clicked
    // This prevents immediate data fetching on reset
    // But we keep this commented out as reference in case you want this behavior
    // filters.clearAll();
  };

  // Sync local state with props when filter opens (to handle external changes)
  useEffect(() => {
    if (isFilterOpen) {
      setOrderIdSearch(filters.orderId.value || "");
      setStatusFilter(filters.status.value || "");
      setDatePreset(filters.dateRange.preset || "all");
      setFromDate(filters.dateRange.fromDate || "");
      setToDate(filters.dateRange.toDate || "");
    }
  }, [
    isFilterOpen,
    filters.orderId.value,
    filters.status.value,
    filters.dateRange,
  ]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }

      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setIsDateDropdownOpen(false);
      }

      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status label from value
  const getStatusLabel = (value) => {
    const status = STATUS_OPTIONS.find((option) => option.value === value);
    return status ? status.label : "All Statuses";
  };

  // Get color class based on status
  const getStatusColorClass = (status) => {
    switch (status) {
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
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
    <div className="relative" ref={filterRef}>
      <button
        className={`flex items-center gap-2 ${
          isFilterActive ? "bg-black " : "bg-gray-100 text-gray-700"
        } ${isFilterActive ? "text-white" : ""} cursor-pointer px-4 
        rounded-lg hover:bg-[#67807d] hover:text-white transition-colors h-fit py-2`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <FiFilter />
        <span className="">Filter {isFilterActive && "(Active)"}</span>
      </button>

      {isFilterOpen && (
        <div
          className="absolute min-w-xl h-96 bg-white shadow-md border border-gray-200 rounded-lg
             overflow-hidden z-[1000] right-0 flex-col mt-2 flex"
        >
          <div className="w-full overflow-y-auto h-full flex">
            <div
              className="min-w-[200px] bg-gray-50 border-r
                 border-gray-200 h-full flex flex-col gap-y-1 p-2 py-4 text-gray-800 font-sans"
            >
              <button
                className={`flex items-center gap-x-2 px-2 py-2 rounded-lg
                  ${
                    activeTab === "orderId"
                      ? "bg-gray-200/70"
                      : "hover:bg-gray-200/70"
                  } 
                  cursor-pointer`}
                onClick={() => setActiveTab("orderId")}
              >
                <MdOutlineNumbers />
                <span className="text-[15px]">Order ID</span>
              </button>
              {/* Added Status Filter Tab */}
              <button
                className={`flex items-center gap-x-2 px-2 py-2 rounded-lg
                  ${
                    activeTab === "status"
                      ? "bg-gray-200/70"
                      : "hover:bg-gray-200/70"
                  } 
                  cursor-pointer`}
                onClick={() => setActiveTab("status")}
              >
                <FiPackage />
                <span className="text-[15px]">Order Status</span>
              </button>
              <button
                className={`flex items-center gap-x-2 px-2 py-2 rounded-lg
                  ${
                    activeTab === "dateRange"
                      ? "bg-gray-200/70"
                      : "hover:bg-gray-200/70"
                  } 
                  cursor-pointer`}
                onClick={() => setActiveTab("dateRange")}
              >
                <BsCalendarDate />
                <span className="text-[15px]">Date Range</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
              {/* Order ID Filter Content */}
              {activeTab === "orderId" && (
                <>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="w-full border border-gray-200 outline-none bg-gray-50 p-2 
                        text-sm pl-10 text-gray-700 rounded-lg"
                      placeholder="Search by order ID"
                      value={orderIdSearch}
                      onChange={(e) => setOrderIdSearch(e.target.value)}
                    />
                    <IoSearch className="absolute top-3 left-3 text-gray-500" />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Enter an order ID to filter orders
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      You can search for exact matches or partial order IDs
                    </div>

                    {orderIdSearch && (
                      <div className="p-2 border rounded-lg border-gray-200 bg-gray-50">
                        <div className="text-xs font-medium text-gray-700">
                          Active Filter:
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Order ID:{" "}
                            <span className="font-medium">{orderIdSearch}</span>
                          </div>
                          <button
                            className="text-sm text-ggray-500 cursor-pointer hover:text-red-700"
                            onClick={() => setOrderIdSearch("")}
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Status Filter Content */}
              {activeTab === "status" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <div className="relative" ref={statusDropdownRef}>
                      <div
                        className="w-full flex justify-between items-center border border-gray-200 bg-gray-50 p-2 
                          text-sm text-gray-700 rounded-lg cursor-pointer"
                        onClick={() =>
                          setIsStatusDropdownOpen(!isStatusDropdownOpen)
                        }
                      >
                        <span>{getStatusLabel(statusFilter)}</span>
                        <ChevronDown size={16} />
                      </div>

                      {isStatusDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                          {STATUS_OPTIONS.map((status) => (
                            <div
                              key={status.value}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                                statusFilter === status.value
                                  ? "bg-gray-100"
                                  : ""
                              }`}
                              onClick={() => handleStatusChange(status.value)}
                            >
                              {status.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {statusFilter && (
                      <div className="p-3 border rounded-lg border-gray-200 bg-gray-50">
                        <div className="text-xs font-medium text-gray-700 mb-2">
                          Active Status Filter:
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span
                              className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColorClass(
                                statusFilter
                              )}`}
                            >
                              {getStatusLabel(statusFilter)}
                            </span>
                          </div>
                          <button
                            className="text-sm text-ggray-500 cursor-pointer hover:text-red-700"
                            onClick={() => setStatusFilter("")}
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="text-sm text-gray-500 font-medium mb-2">
                        Select a status to filter orders
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        You can select one status at a time
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {STATUS_OPTIONS.slice(1).map((status) => (
                          <div
                            key={status.value}
                            className={`p-2 rounded-md cursor-pointer ${
                              statusFilter === status.value
                                ? `${getStatusColorClass(
                                    status.value
                                  )} border border-current/20`
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                            onClick={() => handleStatusChange(status.value)}
                          >
                            <div className="text-xs text-gray-600  font-medium">
                              {status.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Date Range Filter Content */}
              {activeTab === "dateRange" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="relative" ref={dateDropdownRef}>
                      <div
                        className="w-full flex justify-between items-center border border-gray-200 bg-gray-50 p-2 
                          text-sm text-gray-700 rounded-lg cursor-pointer"
                        onClick={() =>
                          setIsDateDropdownOpen(!isDateDropdownOpen)
                        }
                      >
                        <span>
                          {DATE_PRESET.find(
                            (preset) => preset.value === datePreset
                          )?.label || "All Time"}
                        </span>
                        <ChevronDown size={16} />
                      </div>

                      {isDateDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                          {DATE_PRESET.map((preset) => (
                            <div
                              key={preset.value}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                                datePreset === preset.value ? "bg-gray-100" : ""
                              }`}
                              onClick={() =>
                                handleDatePresetChange(preset.value)
                              }
                            >
                              {preset.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {datePreset === "custom" && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From Date
                        </label>
                        <input
                          type="date"
                          className="w-full border border-gray-200 outline-none bg-gray-50 p-2 
                            text-sm text-gray-700 rounded-lg"
                          value={fromDate}
                          onChange={(e) => {
                            // Only update local state
                            setFromDate(e.target.value);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To Date
                        </label>
                        <input
                          type="date"
                          className="w-full border border-gray-200 outline-none bg-gray-50 p-2 
                            text-sm text-gray-700 rounded-lg"
                          value={toDate}
                          onChange={(e) => {
                            // Only update local state
                            setToDate(e.target.value);
                          }}
                          min={fromDate}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto">
                    {datePreset !== "all" && (
                      <div className="p-3 border rounded-lg border-gray-200 bg-gray-50">
                        <div className="text-xs font-medium text-gray-700 mb-2">
                          Active Date Filter:
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">
                              {
                                DATE_PRESET.find(
                                  (preset) => preset.value === datePreset
                                )?.label
                              }
                            </span>

                            {datePreset === "custom" && fromDate && toDate && (
                              <div className="mt-1 text-xs">
                                {formatDateForDisplay(fromDate)} -{" "}
                                {formatDateForDisplay(toDate)}
                              </div>
                            )}
                          </div>
                          <button
                            className="text-sm text-gray-500 cursor-pointer hover:text-red-700"
                            onClick={() => {
                              // Only clear local state, not parent state
                              setDatePreset("all");
                              setFromDate("");
                              setToDate("");
                              gray;
                            }}
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      </div>
                    )}

                    {datePreset !== "custom" &&
                      datePreset !== "all" &&
                      fromDate &&
                      toDate && (
                        <div className="mt-4 p-3 border  bg-gray-50 rounded-lg border-gray-100">
                          <div className="text-xs text-gray-500 font-medium">
                            <span className="font-medium">Date Range:</span>{" "}
                            {formatDateForDisplay(fromDate)} -{" "}
                            {formatDateForDisplay(toDate)}
                          </div>
                        </div>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="min-h-[60px] border-t border-gray-200 flex items-center justify-end gap-x-2 px-4">
            <button
              className="text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer"
              onClick={handleResetFilters}
            >
              Reset All
            </button>
            <button
              className="text-sm px-3 py-2 bg-black  text-white rounded-lg cursor-pointer"
              onClick={handleApplyFilters}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilter;
