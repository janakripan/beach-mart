import { useState, useEffect } from "react";
import { ChevronDown, MoreHorizontal, ArrowDown, ArrowUp } from "lucide-react";
import MetricSection from "../../components/admin/shared/dashbaord/MetricSection";
import SellingProducts from "../../components/admin/shared/dashbaord/SellingProducts";
import RecentOrders from "../../components/admin/shared/dashbaord/RecentOrders";
import WeeklyCustomers from "../../components/admin/shared/dashbaord/WeeklyCustomers";
import SummeryChart from "../../components/admin/shared/dashbaord/SummeryChart";
import { DATE_OPTIONS } from "../../components/admin/shared/constant";
import { calculateDateRange } from "../../utils/calculateDateRange";

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState(() => {
    // Initialize from localStorage or default to "This Month"
    return localStorage.getItem("dashboardTimeframe") || "This Month";
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    setDateRange(calculateDateRange(timeframe));
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setIsDropdownOpen(false);
    // Save to localStorage
    localStorage.setItem("dashboardTimeframe", newTimeframe);
  };

  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome Back Beach Mart !</h1>
          <p className="text-gray-500 text-sm">
            Here's what happening with your store today
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-50"
          >
            {timeframe} <ChevronDown size={16} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {DATE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleTimeframeChange(option)}
                  className={`w-full text-left text-sm cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                    timeframe === option ? "bg-gray-50" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Section */}
      <MetricSection dateRange={dateRange} />

      {/* Summary Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <SummeryChart
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          dateRange={dateRange}
        />
        {/* Most Selling Products */}
        <SellingProducts dateRange={dateRange} />
      </div>

      {/* Recent Orders and Top Customers */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {/* Recent Orders */}
        <RecentOrders dateRange={dateRange} />
        {/* Weekly Top Customers */}
        <WeeklyCustomers dateRange={dateRange} />
      </div>
    </div>
  );
}
