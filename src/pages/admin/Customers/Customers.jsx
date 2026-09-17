import React, { useState, useMemo } from 'react';
import { useGetCustomers } from '../../../api/admin/hooks';
import CustomersHeader from './CustomersHeader';
import SearchBar from './SearchBar';
import CustomersTable from './CustomersTable';
import Pagination from './Pagination';

const Customers = () => {
  const { data: customers, isLoading, isError } = useGetCustomers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    
    if (!searchTerm) return customers;

    return customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.fullName?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.userId?.toString().includes(searchLower)
        
      );
    });
  }, [customers, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Customers</h3>
              <p className="text-sm text-red-600 mt-1">
                Something went wrong while fetching customer data. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6 font-poppins ">
      <div className="max-w-7xl mx-auto">
        <CustomersHeader
          totalCustomers={customers?.length || 0}
          filteredCustomers={filteredCustomers.length}
        />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>

          <CustomersTable
            customers={filteredCustomers}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />

          {filteredCustomers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
