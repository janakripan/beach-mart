import React from "react";
import CategoryGrid from "./CategoryGrid";
import DynamicTable from "../shared/DynamicTable";
import { Trash2 } from "lucide-react";

const CategoryList = ({
  gridView,
  filteredCategories,
  handleEditCategory,
  handleDeleteSingle,
  handleToggleActive,
  selectedCategories,
  setSelectedCategories,
  onReorder,
}) => {
  const CATEGORY_TABLE_COLUMNS = [
    {
      key: "Id",
      header: "ID",
      className: "w-4",
    },
    {
      key: "ImageUrl",
      header: "Image",
      className: "w-10",
      render: (category) => (
        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
          {category.ImageUrl && category.ImageUrl !== "" ? (
            <img
              src={category.ImageUrl}
              alt={category.CategoryName}
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
      className: "w-20",
      header: "Name",
    },
    {
      key: "CategoryDescription",
      header: "Description",
      className: "w-full",
    },
    {
      key: "actions",
      header: "Actions",
      render: (category) => (
        <div className="flex space-x-4 items-center pl-4">
          <div
            title={category.IsActive ? "Deactivate" : "Activate"}
            onClick={(e) => {
              e.stopPropagation();
              if (handleToggleActive) handleToggleActive(category);
            }}
            className="relative cursor-pointer"
          >
            <input type="checkbox" className="sr-only" checked={category.IsActive} readOnly />
            <div className={`block w-10 h-5 rounded-full transition-colors ${category.IsActive ? "bg-primary" : "bg-gray-300"}`} />
            <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${category.IsActive ? "transform translate-x-5" : ""}`} />
          </div>

          <button
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSingle(category);
            }}
            className="text-black cursor-pointer hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (gridView) {
    return (
      <div className="w-full overflow-y-auto h-full bg-white shadow-sm rounded-lg">
        <CategoryGrid
          categories={filteredCategories}
          handleEditCategory={handleEditCategory}
          handleDeleteSingle={handleDeleteSingle}
          handleToggleActive={handleToggleActive}
          onReorder={onReorder}
          isLoading={false}
          isError={false}
        />
      </div>
    );
  }

  return (
    <DynamicTable
      isLoading={false}
      isError={false}
      selectedItems={selectedCategories}
      setSelectedItems={setSelectedCategories}
      columns={CATEGORY_TABLE_COLUMNS}
      idField="Id"
      data={filteredCategories}
      emptyMessage="No Category found"
      onRowClick={(category) => handleEditCategory(category)}
    />
  );
};

export default CategoryList;
