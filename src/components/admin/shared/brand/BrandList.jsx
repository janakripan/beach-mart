import React from "react";
import { useGetBrand } from "../../../../api/admin/hooks";
import ErrorDisplay from "../shared/ErrorDisplay";
import BrandGrid from "./BrandGrid";
import DynamicTable from "../shared/DynamicTable";
import { Edit2 } from "lucide-react";
import TableSkeleton from "../shared/TableSkeleton";

const BrandList = ({
  gridView,
  filteredBrand,
  handleEditBrand,
  selectedBrand,
  setSelectedBrand,
}) => {
  const { isLoading, isError, refetch } = useGetBrand();

  const BRAND_TABLE_COLUMNS = [
    {
      key: "Id",
      header: "ID",
      className: "w-4",
    },
    {
      key: "ImageUrl",
      header: "Image",
      className: "w-10",
      render: (brand) => (
        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
          {brand.ImageUrl ? (
            <img
              src={brand.ImageUrl}
              alt={brand.BrandName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
      ),
    },
    {
      key: "Name",
      className: "w-full",
      header: "Name",
    },

    {
      key: "actions",
      header: "Actions",
      render: (brand) => (
        <div className="flex space-x-2 pl-4">
          <button
            onClick={() => handleEditBrand(brand)}
            className="text-black  cursor-pointer hover:text-gray-400"
          >
            <Edit2 size={18} />
          </button>
        </div>
      ),
    },
  ];
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

  if (gridView) {
    return (
      <div className="w-full overflow-y-auto h-full bg-white shadow-sm rounded-lg">
        <BrandGrid
          brands={filteredBrand}
          handleEditBrand={handleEditBrand}
          refetch={refetch}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    );
  }

  return (
    <DynamicTable
      isLoading={isLoading}
      isError={isError}
      selectedItems={selectedBrand}
      setSelectedItems={setSelectedBrand}
      columns={BRAND_TABLE_COLUMNS}
      idField="Id"
      data={filteredBrand}
      emptyMessage="No Brand found"
    />
  );
};

export default BrandList;
