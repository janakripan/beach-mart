import { X, SlidersHorizontal } from "lucide-react";
import { useLenis } from "lenis/react";
import { useMemo, useState, useEffect } from "react";
import FilterGroup from "./filters/FilterGroup";
import CheckboxItem from "./filters/CheckboxItem";
import RatingItem from "./filters/RatingItem";
// import { useGetFilters } from "../../../../api/user/hooks/useProduct";
import { categories } from "../../../../constants/data";
import SortComp from "./SortComp";

const MobileFilter = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenis();
  
  // --- COMMENTED OUT DILKA DYNAMIC FETCHING ---
  // const { data: filterData = [], isLoading: filtersLoading } = useGetFilters();
  // const CATEGORY_FILTERS = filterData?._category ?? [];
  // const BRANDS_LIST = filterData?._brand ?? [];

  // --- NEW STATIC DATA MAPPING ---
  const CATEGORY_FILTERS = categories.map(cat => ({ CategoryId: cat.title, CategoryName: cat.title, count: 0 }));
  const BRANDS_LIST = [];

  const RATING_FILTERS = [
    { rating: 5, count: 45 },
    { rating: 4, count: 32 },
    { rating: 3, count: 18 },
    { rating: 2, count: 7 },
    { rating: 1, count: 3 },
  ];

  /* ---------- HELPERS ---------- */

  const toggleValue = (list, value) =>
    list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];

  const activeFiltersCount = useMemo(() => {
    return (
      filters.categoryIDs.length +
      filters.brandIDs.length +
      (filters.rating ? 1 : 0)
    );
  }, [filters]);

  const clearAllFilters = () => {
    setFilters(f => ({
      ...f,
      categoryIDs: [],
      brandIDs: [],
      ratingFilter: null,
      pageNumber: 1,
    }));
  };

  // Disable background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      lenis?.start();
    };
  }, [isOpen, lenis]);

  return (
    <>
      {/* Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-between items-center z-40 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-4 pb-safe">
        <button
          onClick={() => setIsOpen(true)}
          className="h-[42px] px-[14px] py-[8px] gap-[8px] bg-[#F8FCF8] rounded-[12px] border border-[#E3F0E2] flex items-center justify-center hover:border-primary transition-colors shadow-sm flex-none mr-2"
        >
          <SlidersHorizontal className="w-[24px] h-[24px] text-primary" strokeWidth={1.5} />
          <span className="font-marcellus text-text-main text-[14px] font-normal leading-none text-center">
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <div className="flex-none ml-auto">
          <SortComp filters={filters} setFilters={setFilters} position="top" />
        </div>
      </div>

      {/* Slide-over Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Panel */}
      <div
        className={`fixed inset-y-0 left-0 top-0 bottom-0 z-50 w-full sm:w-[400px] bg-white transform transition-transform duration-300 ease-in-out font-arial flex flex-col overflow-y-auto ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {activeFiltersCount} filter{activeFiltersCount !== 1 && 's'} applied
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto overscroll-y-contain p-4 space-y-6 min-h-0" data-lenis-prevent="true">
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

            <FilterGroup title="RATING" defaultOpen={true}>
              {RATING_FILTERS.map((r) => (
                <RatingItem
                  key={r.rating}
                  rating={r.rating}
                  count={r.count}
                  checked={filters.ratingFilter === r.rating}
                  onChange={() =>
                    setFilters((f) => ({
                      ...f,
                      ratingFilter: f.ratingFilter === r.rating ? null : r.rating,
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

          {/* Footer Action */}
          <div className="p-4 border-t bg-white pb-safe">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Show Results
            </button>
          </div>
      </div>
    </>
  );
};

export default MobileFilter;