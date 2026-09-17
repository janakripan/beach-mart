import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { useGetSummeryChart } from "../../../../api/admin/hooks";

const SummaryChart = ({ dateRange }) => {
  const [tooltipActive, setTooltipActive] = useState(false);
  const { data: response, isLoading, isError } = useGetSummeryChart(dateRange);

  // Format the data for display
  const chartData = response
    ? response
        .map((item) => ({
          date: new Date(item.OrderDay).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          Orders: item.OrderCount * 1000, // Scale orders to be visible alongside revenue
          Revenue: item.Revenue,
          originalDate: item.OrderDay,
        }))
        .slice(-7) // Only show last 7 days
    : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-2 rounded shadow text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-teal-300">Orders: {payload[0].value / 1000}</p>
          <p className="text-green-300">
            Revenue: AED {payload[1].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const latestDataPoint =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;

  const LoadingShimmer = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  );

  const NoDataMessage = () => (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">No data available for the selected period</p>
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex items-center justify-center h-full">
      <p className="text-red-500">Failed to load chart data</p>
    </div>
  );

  return (
    <div className="md:col-span-3 bg-white rounded-lg p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Summary</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-teal-500"></div>
            <span className="text-sm">Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Revenue</span>
          </div>
        </div>
      </div>
      <div className="h-64 w-full">
        {isLoading ? (
          <LoadingShimmer />
        ) : isError ? (
          <ErrorMessage />
        ) : chartData.length === 0 ? (
          <NoDataMessage />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              onMouseMove={() => setTooltipActive(true)}
              onMouseLeave={() => setTooltipActive(false)}
            >
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickMargin={5} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${value / 1000}K`;
                  }
                  return value;
                }}
                tickMargin={5}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Orders"
                stroke="#14b8a6"
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              {latestDataPoint && latestDataPoint.Revenue > 0 && (
                <ReferenceDot
                  x={latestDataPoint.date}
                  y={latestDataPoint.Revenue}
                  r={4}
                  fill="#3b82f6"
                  stroke="none"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SummaryChart;
