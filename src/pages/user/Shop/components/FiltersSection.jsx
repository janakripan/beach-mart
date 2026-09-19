import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FilterGroup from "./filters/FilterGroup";
import CheckboxItem from "./filters/CheckboxItem";
// import { useGetFilters } from "../../../../api/user/hooks/useProduct";
import { categories } from "../../../../constants/data";

const FiltersSection = ({ filters, setFilters }) => {

  // --- COMMENTED OUT DILKA DYNAMIC FETCHING ---
  // const { data:filterData = [] , isLoading : filtersLoading } = useGetFilters()
  // const CATEGORY_FILTERS = filterData?._category ?? [];
  // const BRANDS_LIST = filterData?._brand ?? [];

  // --- NEW STATIC DATA MAPPING ---
  const CATEGORY_FILTERS = categories.map(cat => ({ CategoryId: cat.title, CategoryName: cat.title, count: 0 }));
  const BRANDS_LIST = [];

  /* ---------- HELPERS ---------- */

  const toggleValue = (list, value) =>
    list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];

  const activeFiltersCount = useMemo(() => {
    return (
      filters.categoryIDs.length +
      filters.brandIDs.length
    );
  }, [filters]);

  const clearAllFilters = () => {
    setFilters(f => ({
      ...f,
      categoryIDs: [],
      brandIDs: [],
      pageNumber: 1,
    }));
  };

  /* ---------- RENDER ---------- */

  return (
    <div className="bg-white h-full w-full flex flex-col py-5 font-arial">
      {/* Header */}
      <div className="sticky top-0 bg-white px-2 z-10">
        <div className="flex justify-between items-center h-5">
          <div>
            <p className="text-xs text-gray-500">
              {activeFiltersCount} filter
              {activeFiltersCount > 1 || activeFiltersCount === 0 ? "s" : ""} applied
            </p>
          </div>
          <div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center text-sm text-primary"
              >
                <X size={14} className="mr-1" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-hidden hover:overflow-y-auto space-y-4 py-4 px-2 custom-scrollbar pr-1" data-lenis-prevent="true">
        <FilterGroup title="CATEGORY" defaultOpen={true}>
          {CATEGORY_FILTERS.map((cat) => (
            <CheckboxItem
              key={cat.CategoryId}
              label={cat.CategoryName}
              count={cat.count}
              checked={filters.categoryIDs.includes(cat.CategoryId)}
              onChange={() =>
                setFilters((f) => ({
                  ...f,
                  categoryIDs: toggleValue(f.categoryIDs, cat.CategoryId),
                }))
              }
            />
          ))}
        </FilterGroup>

        {BRANDS_LIST.length > 0 && (
          <FilterGroup title="BRANDS" defaultOpen={true}>
            {BRANDS_LIST.map((brand) => (
              <CheckboxItem
                key={brand.BrandId}
                label={brand.BrandName}
                count={brand.count}
                checked={filters.brandIDs.includes(brand.BrandId)}
                onChange={() =>
                  setFilters((f) => ({
                    ...f,
                    brandIDs: toggleValue(f.brandIDs, brand.BrandId),
                  }))
                }
              />
            ))}
          </FilterGroup>
        )}
      </div>
    </div>
  );
};

export default FiltersSection;