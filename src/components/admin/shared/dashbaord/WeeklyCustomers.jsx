import { MoreHorizontal } from "lucide-react";
import { useGetTopCustomers } from "../../../../api/admin/hooks";

const WeeklyCustomers = ({ dateRange }) => {
  const { data: customers, isLoading } = useGetTopCustomers(dateRange);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="md:col-span-3 bg-white rounded-lg p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Weekly Top Customers</h3>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          customers?.map((customer) => (
            <div
              key={customer.UserId}
              className="flex items-center  justify-between px-3
               hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full overflow-hidden flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {customer.FullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {customer.FullName}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="text-xs font-medium
                      text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {customer.OrderCount} Orders
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(customer.TotalSpent)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WeeklyCustomers;
