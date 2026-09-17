import React, { useEffect, useRef, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { MdOutlineNumbers } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { ChevronDown } from "lucide-react";
import { FiPackage } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { DATE_PRESET, STATUS_OPTIONS } from "../constant";

const status_options = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const ReturnsFilter = ({
  searchQuery,
  filters = {
    orderId: { value: "", setValue: () => {} },
    dateRange: {
      preset: "last30days",
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orderId");

  const [orderIdSearch, setOrderIdSearch] = useState(
    filters.orderId.value || "",
  );

  const [statusFilter, setStatusFilter] = useState(filters.status.value || "");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [datePreset, setDatePreset] = useState(
    filters.dateRange.preset || "last30days",
  );
  console.log(datePreset);

  const [fromDate, setFromDate] = useState(filters.dateRange.fromDate || "");
  const [toDate, setToDate] = useState(filters.dateRange.toDate || "");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const filterRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  const isFilterActive =
    filters.orderId.value ||
    filters.status.value ||
    filters.dateRange.preset !== "last30days" ||
    searchQuery?.length > 0;

  // --------------------------------
  // Date Calculation (Same logic as Orders)
  // --------------------------------
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
          0,
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
  const handleApplyFilters = () => {
    filters.orderId.setValue(orderIdSearch);
    filters.status.setValue(statusFilter);

    filters.dateRange.setPreset(datePreset);
    filters.dateRange.setFromDate(fromDate);
    filters.dateRange.setToDate(toDate);

    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    const { fromDate, toDate } = calculateDateRange("last30days");

    setOrderIdSearch("");
    setStatusFilter("");
    setDatePreset("last30days");
    setFromDate(fromDate);
    setToDate(toDate);
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={filterRef}>
      <button
        className={`flex items-center gap-2 ${
          isFilterActive ? "bg-black text-white" : "bg-gray-100 text-gray-700"
        } px-4 rounded-lg hover:bg-[#67807d] hover:text-white transition-colors py-2`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <FiFilter />
        <span>Filter {isFilterActive && "(Active)"}</span>
      </button>

      {isFilterOpen && (
        <div className="absolute min-w-xl h-96 bg-white shadow-md border rounded-lg z-[1000] right-0 mt-2 flex flex-col">
          <div className="flex-1 overflow-y-auto flex">
            <div className="min-w-[200px] bg-gray-50 border-r p-2 py-4 flex flex-col items-start gap-y-1">
              <button
                onClick={() => setActiveTab("orderId")}
                className="px-2 py-2 hover:bg-gray-200 rounded-lg"
              >
                <MdOutlineNumbers className="inline mr-2" />
                Return ID
              </button>

              <button
                onClick={() => setActiveTab("status")}
                className="px-2 py-2 hover:bg-gray-200 rounded-lg"
              >
                <FiPackage className="inline mr-2" />
                Return Status
              </button>

              <button
                onClick={() => setActiveTab("dateRange")}
                className="px-2 py-2 hover:bg-gray-200 rounded-lg"
              >
                <BsCalendarDate className="inline mr-2" />
                Date Range
              </button>
            </div>

            <div className="flex-1 p-4">
              {activeTab === "orderId" && (
                <input
                  type="text"
                  value={orderIdSearch}
                  onChange={(e) => setOrderIdSearch(e.target.value)}
                  className="w-full border bg-gray-50 p-2 rounded-lg"
                  placeholder="Search by Return ID"
                />
              )}

              {activeTab === "status" && (
                <div className="space-y-2">
                  {status_options.map((option) => (
                    <div
                      key={option.value}
                      className={`p-2 rounded-md cursor-pointer ${
                        statusFilter === option.value
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => setStatusFilter(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "dateRange" && (
                <div className="relative" ref={dateDropdownRef}>
                  <div
                    className="w-full flex justify-between items-center border bg-gray-50 p-2 rounded-lg cursor-pointer"
                    onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  >
                    <span>
                      {DATE_PRESET.find((p) => p.value === datePreset)?.label}
                    </span>
                    <ChevronDown size={16} />
                  </div>

                  {isDateDropdownOpen && (
                    <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg">
                      {DATE_PRESET.map((preset) => (
                        <div
                          key={preset.value}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleDatePresetChange(preset.value)}
                        >
                          {preset.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t flex justify-end gap-2 p-4">
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 bg-gray-100 rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-3 py-2 bg-black text-white rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsFilter;
