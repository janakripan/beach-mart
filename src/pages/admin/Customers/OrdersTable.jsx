import React from 'react';

const OrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="px-6 py-4 text-sm text-gray-500 text-center bg-gray-50">
        No orders found for this customer
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-6 py-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Order History</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Order Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Payment Mode
              </th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  #{order.orderId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {order.transactionId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600">
                  ${order.orderAmount?.toFixed(2) || '0.00'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.orderStatus === 'ordered'
                        ? 'bg-blue-100 text-blue-800'
                        : order.orderStatus === 'shipped'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.isCancelled
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.isCancelled ? 'Cancelled' : order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      order.paymentMode === 'COD'
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {order.paymentMode}
                  </span>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
