import React from "react";
import ErrorDisplay from "./ErrorDisplay";
import TableSkeleton from "./TableSkeleton";

/**
 * A dynamic table component that can be reused across different pages
 * @param {Object} props
 * @param {boolean} props.isSelectable - Visiblity of select box
 * @param {boolean} props.isLoading
 * @param {boolean} props.isError
 * @param {Array} props.data - The data to display in the table
 * @param {Array} props.columns - Configuration for table columns
 * @param {Array} props.selectedItems - Array of selected item IDs
 * @param {Function} props.setSelectedItems - Function to update selected items
 * @param {string} props.idField - The field to use as the unique identifier
 * @param {string} props.emptyMessage - Message to display when no data is available
 */
const DynamicTable = ({
  isSelectable = true,
  data = [],
  columns = [],
  selectedItems = [],
  setSelectedItems = () => {},
  idField = "id",
  emptyMessage = "No items found",
  isLoading = false,
  isError = false,
}) => {
  // Handle checkbox selection for a single item
  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item[idField]));
    }
  };
  if (isLoading) {
    return <TableSkeleton />;
  }
  if (isError) {
    return (
      <ErrorDisplay
        className="h-full flex items-center justify-center"
        message="Failed to load categories" // Consider adding an error message
      />
    );
  }

  return (
    <div className="w-full overflow-y-auto h-full bg-white rounded-lg  border border-gray-200">
      <table className="min-w-full  divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-50">
          <tr>
            {/* Selection checkbox column */}
            {isSelectable && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-black cursor-pointer border-gray-300 rounded"
                  checked={
                    selectedItems.length === data.length && data.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
            )}

            {/* Dynamic columns based on configuration */}
            {columns.map((column, index) => (
              <th
                key={column?.key || index}
                className={` ${column?.className} px-6 py-3 text-left text-xs font-medium
                 text-gray-500 uppercase tracking-wider`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item[idField]}
                className="hover:bg-gray-50 border-b border-gray-200/85"
              >
                {isSelectable && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer text-black border-gray-300 rounded"
                      checked={selectedItems.includes(item[idField])}
                      onChange={() => handleSelectItem(item[idField])}
                    />
                  </td>
                )}

                {/* Dynamic cell rendering based on column configuration */}
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className="px-6 py-4  text-sm font-medium text-gray-800 whitespace-nowrap"
                  >
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
