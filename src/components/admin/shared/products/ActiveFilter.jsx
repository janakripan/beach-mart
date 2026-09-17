import React from "react";

const ActiveFilter = ({
  category,
  categories,
  brand,
  brands,
  isActive,
  clearFilters,
}) => {
  if (!isActive) return null;
  return (
    <div className="flex absolute right-0 left-0 mx-auto w-fit items-center gap-2 text-sm text-gray-600 py-1">
      <span>Active filters:</span>
      {category.value && (
        <span className="bg-gray-100 px-2 py-1 rounded">
          Category:{" "}
          {categories?.find((c) => c.Id === category.value)?.Name ||
            category.value}
        </span>
      )}
      {brand.value && (
        <span className="bg-gray-100 px-2 py-1 rounded">
          Brand: {brands?.find((b) => b.Id == brand.value)?.Name || brand.value}
        </span>
      )}
      <button
        onClick={clearFilters}
        className="text-black hover:underline ml-2"
      >
        Clear all
      </button>
    </div>
  );
};

export default ActiveFilter;
