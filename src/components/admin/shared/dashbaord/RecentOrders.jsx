import { useGetRecentOrders } from "../../../../api/admin/hooks";

const RecentOrders = ({ dateRange }) => {
  const { data: orders, isLoading } = useGetRecentOrders(dateRange);

  const LoadingShimmer = () => (
    <div className="animate-pulse">
      {[1, 2, 3].map((item) => (
        <div key={item} className="border-b border-gray-100">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 w-8 h-8 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ordered":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-green-100 text-green-600";
      case "delivered":
        return "bg-purple-100 text-purple-600";
      case "canceled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className="md:col-span-4 bg-white  max-h-[450px] h-full overflow-hidden
    flex flex-col rounded-lg p-4 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
      </div>
      <div className="h-full overflow-y-auto">
        {isLoading ? (
          <LoadingShimmer />
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-3 font-medium w-[55%]">Product</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.OrderId} className="border-b border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center  gap-2">
                      <div className="bg-gray-100 w-8 h-8 rounded flex items-center justify-center">
                        <div className="w-4 h-6 bg-amber-400 rounded"></div>
                      </div>
                      <span className="w-[80%] text-sm  font-medium whitespace-nowrap   text-gray-600">
                        {order.ProductName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-blue-500 w--=">
                      {order.CustomerName}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">#{order.OrderId}</td>
                  <td className="py-3 text-gray-500">
                    {formatDate(order.OrderDate)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`${getStatusColor(
                        order.OrderStatus
                      )} text-xs px-2 py-1 rounded-full`}
                    >
                      {order.OrderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
