import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FilterGroup from "./filters/FilterGroup";
import CheckboxItem from "./filters/CheckboxItem";
// import { useGetFilters } from "../../../../api/user/hooks/useProduct";
import { useAppStore } from "../../../../store/appStore";
import { useAppLoading } from "../../../../context/AppLoadingContext";

const FiltersSection = ({ filters, setFilters }) => {
  const { isLoading: appLoading } = useAppLoading();

  const rawCategories = useAppStore(state => state.categories);
  const isLoading = appLoading || (!rawCategories || rawCategories.length === 0);

  const CATEGORY_FILTERS = (rawCategories || []).filter(c => c.IsActive).map(cat => ({ 
    CategoryId: cat.CategoryID, 
    CategoryName: cat.CategoryName, 
    count: 0 
  }));
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

  if (isLoading) {
    return (
      <div className="bg-white h-full w-full flex flex-col py-5 font-arial">
        <div className="sticky top-0 bg-white px-2 z-10">
          <div className="h-5 w-24 rounded shimmer" />
        </div>
        <div className="flex-1 overflow-y-hidden space-y-6 py-4 px-2">
          {/* Mock Filter Group 1 */}
          <div>
            <div className="h-6 w-32 rounded shimmer mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded shimmer" />
              <div className="h-4 w-5/6 rounded shimmer" />
              <div className="h-4 w-4/5 rounded shimmer" />
              <div className="h-4 w-11/12 rounded shimmer" />
            </div>
          </div>
          {/* Mock Filter Group 2 */}
          <div>
            <div className="h-6 w-24 rounded shimmer mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded shimmer" />
              <div className="h-4 w-3/4 rounded shimmer" />
              <div className="h-4 w-5/6 rounded shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              checked={filters.categoryIDs.includes(String(cat.CategoryId))}
              onChange={() =>
                setFilters((f) => ({
                  ...f,
                  categoryIDs: toggleValue(f.categoryIDs, String(cat.CategoryId)),
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