import React from 'react';

const CustomersHeader = ({ totalCustomers, filteredCustomers }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-medium text-gray-900">Customers</h1>
        <div className="flex gap-4">
          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-400">
            <p className="text-xs text-black  font-medium uppercase tracking-wide">
              Total Customers
            </p>
            <p className="text-2xl font-bold text-black">{totalCustomers}</p>
          </div>
          {filteredCustomers !== totalCustomers && (
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
                Filtered Results
              </p>
              <p className="text-2xl font-bold text-green-700">{filteredCustomers}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersHeader;
