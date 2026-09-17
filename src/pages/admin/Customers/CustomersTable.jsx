import React, { useState } from 'react';
import OrdersTable from './OrdersTable';
import dirham from '../../../assets/dirham.svg'

const CustomersTable = ({ customers, currentPage, itemsPerPage }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  const toggleRow = (userId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(userId)) {
      newExpandedRows.delete(userId);
    } else {
      newExpandedRows.add(userId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total Orders
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total Spend
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
              {/* Arrow column */}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentCustomers.length > 0 ? (
            currentCustomers.map((customer) => (
              <React.Fragment key={customer.userId}>
                <tr  onClick={() => toggleRow(customer.userId)} className="hover:bg-gray-50 transition-colors cursor-pointer duration-150">
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.email}
                  </td>
                  
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{customer.totalOrders}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center ">
                    <img src={dirham} alt="dirham" className='h-4 w-4' />
                    <span className="font-semibold text-gray-900">
                      {customer.totalSpend?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                     
                      className="text-gray-500 hover:text-gray-700 transition-transform duration-200"
                    >
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${
                          expandedRows.has(customer.userId) ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
                {expandedRows.has(customer.userId) && (
                  <tr>
                    <td colSpan="8" className="p-0">
                      <OrdersTable orders={customer.orders} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="px-6 py-12 text-center text-sm text-gray-500"
              >
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
